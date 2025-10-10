<template>
	<div class="profile-menu-example">
		<VContainer>
			<VRow>
				<VCol cols="12">
					<h2 class="text-h4 mb-6">ProfileMenu Component Examples</h2>
				</VCol>
			</VRow>

			<!-- Basic Usage Example -->
			<VRow>
				<VCol cols="12" md="6">
					<VCard class="mb-6">
						<VCardTitle>Basic Usage</VCardTitle>
						<VCardText>
							<p class="mb-4">Basic ProfileMenu component with default settings:</p>
							<div class="d-flex justify-center pa-4 bg-surface-variant rounded">
								<ProfileMenu @profile-action="handleProfileAction" @theme-toggled="handleThemeToggle" />
							</div>
						</VCardText>
					</VCard>
				</VCol>

				<VCol cols="12" md="6">
					<VCard class="mb-6">
						<VCardTitle>With Custom Avatar</VCardTitle>
						<VCardText>
							<p class="mb-4">ProfileMenu with custom avatar URL:</p>
							<div class="d-flex justify-center pa-4 bg-surface-variant rounded">
								<ProfileMenu
									:avatar-url="customAvatarUrl"
									@profile-picture-uploaded="handleProfilePictureUpload"
									@profile-action="handleProfileAction"
									@theme-toggled="handleThemeToggle"
								/>
							</div>
						</VCardText>
					</VCard>
				</VCol>
			</VRow>

			<!-- Integration Example -->
			<VRow>
				<VCol cols="12">
					<VCard class="mb-6">
						<VCardTitle>AppBar Integration Example</VCardTitle>
						<VCardText>
							<p class="mb-4">ProfileMenu integrated within an app bar context:</p>
							<VAppBar color="primary" density="comfortable" class="rounded">
								<VAppBarTitle>Korder Dashboard</VAppBarTitle>
								<VSpacer />
								<VBtn icon="fas fa-search" variant="text" />
								<VBtn icon="fas fa-bell" variant="text">
									<VIcon icon="fas fa-bell" />
									<VBadge
										v-if="notificationCount > 0"
										:content="notificationCount"
										color="error"
										floating
									/>
								</VBtn>
								<ProfileMenu
									:show-notification-badge="true"
									@profile-picture-uploaded="handleProfilePictureUpload"
									@profile-action="handleProfileAction"
									@theme-toggled="handleThemeToggle"
								/>
							</VAppBar>
						</VCardText>
					</VCard>
				</VCol>
			</VRow>

			<!-- Event Log -->
			<VRow>
				<VCol cols="12">
					<VCard>
						<VCardTitle>Event Log</VCardTitle>
						<VCardText>
							<p class="mb-4">Recent events from ProfileMenu interactions:</p>
							<VList v-if="eventLog.length > 0" density="compact">
								<VListItem
									v-for="(event, index) in eventLog.slice(-10)"
									:key="index"
									class="event-log-item"
								>
									<template #prepend>
										<VIcon
											:icon="getEventIcon(event.type)"
											:color="getEventColor(event.type)"
											size="small"
										/>
									</template>
									<VListItemTitle>{{ event.message }}</VListItemTitle>
									<VListItemSubtitle>{{ formatTime(event.timestamp) }}</VListItemSubtitle>
								</VListItem>
							</VList>
							<div v-else class="text-center text-medium-emphasis py-4">
								No events yet. Interact with the ProfileMenu components above.
							</div>
							<div v-if="eventLog.length > 0" class="mt-4">
								<VBtn
									@click="clearEventLog"
									variant="outlined"
									size="small"
									prepend-icon="fas fa-trash"
								>
									Clear Log
								</VBtn>
							</div>
						</VCardText>
					</VCard>
				</VCol>
			</VRow>

			<!-- Configuration Panel -->
			<VRow>
				<VCol cols="12">
					<VCard>
						<VCardTitle>Configuration</VCardTitle>
						<VCardText>
							<VRow>
								<VCol cols="12" md="6">
									<VTextField
										v-model="customAvatarUrl"
										label="Custom Avatar URL"
										placeholder="https://example.com/avatar.jpg"
										clearable
										prepend-icon="fas fa-image"
									/>
								</VCol>
								<VCol cols="12" md="6">
									<VSlider
										v-model="notificationCount"
										label="Notification Count"
										:min="0"
										:max="99"
										:step="1"
										thumb-label
										prepend-icon="fas fa-bell"
									/>
								</VCol>
							</VRow>
						</VCardText>
					</VCard>
				</VCol>
			</VRow>
		</VContainer>
	</div>
</template>

<script setup>
	import { ref, computed } from "vue";
	import ProfileMenu from "@/components/app/ProfileMenu.vue";

	// Reactive state
	const customAvatarUrl = ref("https://via.placeholder.com/150/4A90E2/FFFFFF?text=User");
	const notificationCount = ref(3);
	const eventLog = ref([]);

	// Methods
	const handleProfileAction = (action) => {
		addEvent("profile-action", `Profile action: ${action}`);
	};

	const handleThemeToggle = (isDark) => {
		addEvent("theme-toggle", `Theme toggled to: ${isDark ? "dark" : "light"} mode`);
	};

	const handleProfilePictureUpload = (file) => {
		addEvent("file-upload", `Profile picture uploaded: ${file.name} (${formatFileSize(file.size)})`);

		// Simulate file upload and update avatar
		setTimeout(() => {
			const previewUrl = URL.createObjectURL(file);
			customAvatarUrl.value = previewUrl;
			addEvent("file-upload", "Profile picture updated successfully");
		}, 1000);
	};

	const addEvent = (type, message) => {
		eventLog.value.push({
			type,
			message,
			timestamp: new Date(),
		});
	};

	const clearEventLog = () => {
		eventLog.value = [];
	};

	const getEventIcon = (type) => {
		const icons = {
			"profile-action": "fas fa-user",
			"theme-toggle": "fas fa-palette",
			"file-upload": "fas fa-upload",
		};
		return icons[type] || "fas fa-info-circle";
	};

	const getEventColor = (type) => {
		const colors = {
			"profile-action": "primary",
			"theme-toggle": "secondary",
			"file-upload": "success",
		};
		return colors[type] || "info";
	};

	const formatTime = (timestamp) => {
		return timestamp.toLocaleTimeString();
	};

	const formatFileSize = (bytes) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};
</script>

<style scoped lang="scss">
	.profile-menu-example {
		padding: 24px 0;
	}

	.event-log-item {
		border-left: 3px solid rgba(var(--v-theme-primary), 0.3);
		margin-bottom: 4px;
		border-radius: 0 4px 4px 0;
		background-color: rgba(var(--v-theme-surface), 0.5);
	}

	// Custom app bar styling for example
	.v-app-bar {
		margin-bottom: 16px;
	}
</style>
