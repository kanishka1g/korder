<template>
	<VMenu offset="8" :close-on-content-click="false" location="bottom end" @update:model-value="handleMenuToggle">
		<template #activator="{ props: menuProps }">
			<VBtn
				v-bind="menuProps"
				variant="text"
				class="profile-menu-btn"
				:class="{ 'profile-menu-btn--active': menuOpen }"
				@click="menuOpen = !menuOpen"
				:aria-label="`User menu for ${userDisplayName}`"
				:aria-expanded="menuOpen.toString()"
				aria-haspopup="true"
				:aria-controls="menuOpen ? 'profile-menu-content' : undefined"
			>
				<VAvatar
					:size="32"
					:image="userAvatar"
					:color="userAvatar ? undefined : 'primary'"
					class="profile-avatar"
				>
					<VIcon v-if="!userAvatar" icon="fas fa-user" size="small" />
				</VAvatar>
			</VBtn>
		</template>

		<VCard
			min-width="280"
			max-width="320"
			class="profile-menu-card"
			id="profile-menu-content"
			role="menu"
			:aria-label="`Profile menu for ${userDisplayName}`"
		>
			<!-- User Profile Header -->
			<VCardText class="pb-2" role="presentation">
				<div class="d-flex align-center gap-3">
					<VAvatar
						:size="48"
						:image="userAvatar"
						:color="userAvatar ? undefined : 'primary'"
						class="profile-avatar-large"
						:aria-label="`Profile picture for ${userDisplayName}`"
					>
						<VIcon v-if="!userAvatar" icon="fas fa-user" :aria-hidden="true" />
					</VAvatar>
					<div class="flex-grow-1 min-width-0">
						<div
							class="text-subtitle-1 font-weight-medium text-truncate"
							:aria-label="`Signed in as ${userDisplayName}`"
						>
							{{ userDisplayName }}
						</div>
						<div
							class="text-caption text-medium-emphasis text-truncate"
							:aria-label="`Email: ${userEmail}`"
						>
							{{ userEmail }}
						</div>
					</div>
				</div>
			</VCardText>

			<VDivider />

			<!-- Profile Actions -->
			<VList density="compact" class="py-2" role="none">
				<VListItem @click="navigateToUserSettings" class="profile-action-item">
					<template #prepend>
						<VIcon icon="fas fa-cog" size="small" />
					</template>
					<VListItemTitle>User Settings</VListItemTitle>
				</VListItem>
				<VListItem
					@click="triggerFileUpload"
					class="profile-action-item"
					role="menuitem"
					:aria-label="'Change profile picture'"
				>
					<template #prepend>
						<VIcon icon="fas fa-camera" size="small" :aria-hidden="true" />
					</template>
					<!-- TODO: this can go in user settings -->
					<VListItemTitle>Change Profile Picture</VListItemTitle>
				</VListItem>
				<VListItem
					@click="navigateToProfile"
					class="profile-action-item"
					role="menuitem"
					:aria-label="'Edit your profile information'"
				>
					<template #prepend>
						<VIcon icon="fas fa-user-edit" size="small" :aria-hidden="true" />
					</template>
					<VListItemTitle>Edit Profile</VListItemTitle>
				</VListItem>

				<!-- Notifications Settings -->
				<VListItem @click="navigateToNotificationSettings" class="profile-action-item">
					<template #prepend>
						<VIcon icon="fas fa-bell" size="small" />
					</template>
					<VListItemTitle>Notifications</VListItemTitle>
					<template #append>
						<VChip
							v-if="unreadNotifications > 0"
							:text="unreadNotifications.toString()"
							size="x-small"
							color="error"
							variant="elevated"
						/>
					</template>
				</VListItem>

				<VDivider class="my-2" />

				<VListItem
					@click="handleLogout"
					class="profile-action-item logout-item"
					role="menuitem"
					:aria-label="'Sign out of your account'"
				>
					<template #prepend>
						<VIcon icon="fas fa-sign-out-alt" size="small" color="error" :aria-hidden="true" />
					</template>
					<VListItemTitle class="text-error">Logout</VListItemTitle>
				</VListItem>
			</VList>
		</VCard>

		<!-- Hidden File Input for Profile Picture Upload -->
		<input
			ref="fileInput"
			type="file"
			accept="image/*"
			style="display: none"
			@change="handleFileUpload"
			aria-label="Select profile picture file"
		/>
	</VMenu>
</template>

<script setup>
	import { ref, computed, onMounted } from "vue";
	import { useRouter } from "vue-router";
	import { useTheme } from "vuetify";
	import { useUser } from "@/utils/user";
	import { confirmation } from "@/utils/generic_modals";
	import { useLoading } from "@/utils/loading";
	import { useAccessibility } from "@/composables/useAccessibility";

	// Composables
	const router = useRouter();
	const theme = useTheme();
	const user = useUser();
	const loading = useLoading();
	const { announce } = useAccessibility();

	// Component props
	const props = defineProps({
		/**
		 * Custom avatar URL to override user's profile picture
		 */
		avatarUrl: {
			type: String,
			default: null,
		},
		/**
		 * Show notification badge count
		 */
		showNotificationBadge: {
			type: Boolean,
			default: true,
		},
		/**
		 * Maximum file size for profile picture upload (in MB)
		 */
		maxFileSize: {
			type: Number,
			default: 5,
		},
	});

	// Component emits
	const emit = defineEmits([
		/**
		 * Emitted when user uploads a new profile picture
		 * @param {File} file - The uploaded file
		 */
		"profile-picture-uploaded",
		/**
		 * Emitted when user clicks on profile-related actions
		 * @param {string} action - The action name
		 */
		"profile-action",
	]);

	// Reactive state
	const menuOpen = ref(false);
	const fileInput = ref(null);
	const userAvatar = ref(null);
	const unreadNotifications = ref(0);

	const userDisplayName = computed(() => {
		return user.name || "User";
	});

	const userEmail = computed(() => {
		// Since the user utility doesn't have email, we'll use a placeholder
		// This should be updated when the user store includes email
		return "user@example.com";
	});

	const handleMenuToggle = (isOpen) => {
		menuOpen.value = isOpen;
		if (isOpen) {
			announce("Profile menu opened", "polite");
		} else {
			announce("Profile menu closed", "polite");
		}
	};

	const triggerFileUpload = () => {
		fileInput.value?.click();
		emit("profile-action", "upload-picture");
	};

	const handleFileUpload = (event) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			// TODO: Show error notification
			console.error("Please select a valid image file");
			return;
		}

		// Validate file size
		const fileSizeMB = file.size / (1024 * 1024);
		if (fileSizeMB > props.maxFileSize) {
			// TODO: Show error notification
			console.error(`File size must be less than ${props.maxFileSize}MB`);
			return;
		}

		// Create preview URL
		const previewUrl = URL.createObjectURL(file);
		userAvatar.value = previewUrl;

		// Emit the file for parent component to handle upload
		emit("profile-picture-uploaded", file);

		// Reset file input
		event.target.value = "";
	};

	const navigateToProfile = () => {
		router.push("/profile");
		emit("profile-action", "edit-profile");
		announce("Navigating to profile page", "polite");
	};

	const navigateToAccountSettings = () => {
		router.push("/settings/account");
		emit("profile-action", "account-settings");
		announce("Navigating to account settings", "polite");
	};

	const navigateToNotificationSettings = () => {
		router.push("/settings/notifications");
		emit("profile-action", "notification-settings");
		announce("Navigating to notification settings", "polite");
	};

	/*************  ✨ Windsurf Command ⭐  *************/
	/**
	 * Navigate to user settings page
	 * @returns {void}
	 */
	/*******  95aeb0cd-a4d3-4d88-8730-4b81d0f1585b  *******/

	const navigateToUserSettings = () => {
		router.push("/settings");
		emit("profile-action", "user-settings");
		announce("Navigating to user settings", "polite");
	};

	const handleLogout = async () => {
		const confirmed = await confirmation("Logout", "Are you sure you want to logout?");

		if (confirmed) {
			loading.start();
			setTimeout(async () => {
				try {
					// Dynamically import and use auth store
					const { useAuthStore } = await import("@/stores/auth_store");
					const authStore = useAuthStore();
					authStore.logOut();
				} catch (error) {
					console.warn("Failed to access auth store, using fallback logout:", error);
					// Fallback: clear localStorage and redirect
					localStorage.clear();
					router.push("/");
				}
				loading.end();
			}, 1000);
		}
		emit("profile-action", "logout");
	};

	// Initialize component
	onMounted(() => {
		// Set initial avatar from props or user data
		if (props.avatarUrl) {
			userAvatar.value = props.avatarUrl;
		}

		// TODO: Load unread notifications count
		// This should be implemented when notification system is available
		unreadNotifications.value = 0;
	});
</script>

<style scoped lang="scss">
	.profile-menu-btn {
		transition: all 0.2s ease;
		border-radius: 50%;

		&:hover {
			transform: scale(1.05);
		}

		&--active {
			background-color: rgba(var(--v-theme-primary), 0.1);
		}
	}

	.profile-avatar {
		transition: all 0.2s ease;
		border: 2px solid rgba(var(--v-theme-surface), 0.8);

		&:hover {
			border-color: rgba(var(--v-theme-primary), 0.5);
		}
	}

	.profile-avatar-large {
		border: 2px solid rgba(var(--v-theme-primary), 0.2);
	}

	.profile-menu-card {
		backdrop-filter: blur(8px);
		border: 1px solid rgba(var(--v-border-color), 0.12);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
	}

	.profile-action-item {
		transition: all 0.15s ease;
		border-radius: 8px;
		margin: 0 8px;

		&:hover {
			background-color: rgba(var(--v-theme-primary), 0.08);
			transform: translateX(2px);
		}

		&.logout-item:hover {
			background-color: rgba(var(--v-theme-error), 0.08);
		}
	}

	// Theme-specific styles
	.v-theme--light {
		.profile-menu-card {
			background-color: rgba(255, 255, 255, 0.95);
		}
	}

	.v-theme--dark {
		.profile-menu-card {
			background-color: rgba(30, 41, 59, 0.95);
		}
	}

	// Responsive adjustments
	@media (max-width: 600px) {
		.profile-menu-card {
			min-width: 260px;
			max-width: 280px;
		}
	}

	// Accessibility improvements
	.profile-action-item {
		&:focus-visible {
			outline: 2px solid rgba(var(--v-theme-primary), 0.5);
			outline-offset: 2px;
		}
	}

	// Animation for menu items
	.profile-action-item {
		animation: slideInFromRight 0.2s ease-out;
	}

	@keyframes slideInFromRight {
		from {
			opacity: 0;
			transform: translateX(10px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
</style>
