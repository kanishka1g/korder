<template>
	<v-card
		class="app-card"
		:class="cardClasses"
		:elevation="isHovered ? 6 : 2"
		@mouseenter="isHovered = true"
		@mouseleave="isHovered = false"
		@click="handleCardClick"
		@keydown="handleKeydown"
		:tabindex="props.app.status !== 'offline' ? 0 : -1"
		role="button"
		:aria-label="`${props.app.name} - ${statusText} - ${props.app.description}`"
		:aria-disabled="props.app.status === 'offline'"
	>
		<!-- App Icon and Status -->
		<v-card-text class="pa-4">
			<div class="d-flex align-center justify-space-between mb-3">
				<div class="d-flex align-center">
					<div class="app-icon-container" :class="statusColorClass">
						<v-icon :icon="app.icon" size="24" color="white" />
					</div>
					<div class="ml-3">
						<h3 class="text-subtitle-1 font-weight-bold mb-1">{{ app.name }}</h3>
						<p class="text-caption text-medium-emphasis mb-0">{{ app.description }}</p>
					</div>
				</div>

				<!-- Quick Actions Menu -->
				<v-menu location="bottom end">
					<template #activator="{ props: menuProps }">
						<v-btn
							icon="fas fa-ellipsis-vertical"
							variant="text"
							size="small"
							v-bind="menuProps"
							@click.stop
							:aria-label="`More actions for ${app.name}`"
							:aria-haspopup="true"
						/>
					</template>
					<v-list density="compact" role="menu" :aria-label="`Actions for ${app.name}`">
						<v-list-item
							prepend-icon="fas fa-external-link-alt"
							title="Open"
							@click="$emit('open', app)"
							role="menuitem"
						>
							<template #prepend>
								<v-icon icon="fas fa-external-link-alt" :aria-hidden="true" />
							</template>
							<v-list-item-title>Open</v-list-item-title>
						</v-list-item>
						<v-list-item
							prepend-icon="fas fa-cog"
							title="Settings"
							@click="$emit('settings', app)"
							role="menuitem"
						>
							<template #prepend>
								<v-icon icon="fas fa-cog" :aria-hidden="true" />
							</template>
							<v-list-item-title>Settings</v-list-item-title>
						</v-list-item>
						<v-list-item
							prepend-icon="fas fa-file-alt"
							title="View Logs"
							@click="$emit('logs', app)"
							role="menuitem"
						>
							<template #prepend>
								<v-icon icon="fas fa-file-alt" :aria-hidden="true" />
							</template>
							<v-list-item-title>View Logs</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
			</div>

			<!-- Status Indicator -->
			<div class="d-flex align-center justify-space-between">
				<div class="d-flex align-center">
					<v-chip
						:color="statusColor"
						size="small"
						variant="tonal"
						class="status-chip"
						:aria-label="`Status: ${statusText}`"
						role="status"
					>
						<v-icon :icon="statusIcon" size="12" class="mr-1" :aria-hidden="true" />
						{{ statusText }}
					</v-chip>
				</div>

				<!-- Last Updated -->
				<div class="text-caption text-medium-emphasis" :aria-label="`Last updated: ${formattedLastUpdated}`">
					{{ formattedLastUpdated }}
				</div>
			</div>

			<!-- Category Badge -->
			<div class="mt-3">
				<v-chip
					:color="categoryColor"
					size="x-small"
					variant="outlined"
					class="category-chip"
					:aria-label="`Category: ${app.category}`"
				>
					{{ app.category }}
				</v-chip>
			</div>
		</v-card-text>

		<!-- Hover Overlay for Quick Open -->
		<v-overlay
			v-model="showOverlay"
			contained
			class="d-flex align-center justify-center"
			opacity="0.8"
			:aria-hidden="true"
		>
			<v-btn
				color="white"
				variant="elevated"
				size="large"
				prepend-icon="fas fa-external-link-alt"
				@click.stop="$emit('open', app)"
				:aria-label="`Open ${app.name}`"
			>
				Open {{ app.name }}
			</v-btn>
		</v-overlay>
	</v-card>
</template>

<script setup>
	import { ref, computed } from "vue";
	import { useAccessibility } from "@/composables/useAccessibility";

	const props = defineProps({
		app: {
			type: Object,
			required: true,
			validator: (app) => {
				return (
					app &&
					typeof app.id === "string" &&
					typeof app.name === "string" &&
					typeof app.status === "string" &&
					["online", "degraded", "offline"].includes(app.status)
				);
			},
		},
		variant: {
			type: String,
			default: "default",
			validator: (value) => ["default", "compact", "offline"].includes(value),
		},
	});

	const emit = defineEmits(["open", "settings", "logs"]);

	// Composables
	const { announce } = useAccessibility();

	// Reactive state
	const isHovered = ref(false);
	const showOverlay = computed(() => isHovered.value && props.app.status !== "offline");

	// Computed properties
	const cardClasses = computed(() => ({
		"app-card--compact": props.variant === "compact",
		"app-card--offline": props.app.status === "offline" || props.variant === "offline",
		"app-card--clickable": props.app.status !== "offline",
	}));

	const statusColor = computed(() => {
		switch (props.app.status) {
			case "online":
				return "success";
			case "degraded":
				return "warning";
			case "offline":
				return "error";
			default:
				return "grey";
		}
	});

	const statusColorClass = computed(() => {
		switch (props.app.status) {
			case "online":
				return "bg-success";
			case "degraded":
				return "bg-warning";
			case "offline":
				return "bg-error";
			default:
				return "bg-grey";
		}
	});

	const statusIcon = computed(() => {
		switch (props.app.status) {
			case "online":
				return "fas fa-check-circle";
			case "degraded":
				return "fas fa-circle-exclamation";
			case "offline":
				return "fas fa-circle-xmark";
			default:
				return "fas fa-circle-info";
		}
	});

	const statusText = computed(() => {
		switch (props.app.status) {
			case "online":
				return "Online";
			case "degraded":
				return "Degraded";
			case "offline":
				return "Offline";
			default:
				return "Unknown";
		}
	});

	const categoryColor = computed(() => {
		switch (props.app.category) {
			case "internal":
				return "primary";
			case "external":
				return "accent";
			case "integration":
				return "secondary";
			default:
				return "grey";
		}
	});

	const formattedLastUpdated = computed(() => {
		if (!props.app.lastUpdated) return "Never";

		const now = new Date();
		const lastUpdated = new Date(props.app.lastUpdated);
		const diffInMinutes = Math.floor((now - lastUpdated) / (1000 * 60));

		if (diffInMinutes < 1) return "Just now";
		if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24) return `${diffInHours}h ago`;

		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays < 7) return `${diffInDays}d ago`;

		return lastUpdated.toLocaleDateString();
	});

	// Event handlers
	const handleCardClick = () => {
		if (props.app.status !== "offline") {
			emit("open", props.app);
			announce(`Opening ${props.app.name}`, "polite");
		} else {
			announce(`${props.app.name} is offline and cannot be opened`, "polite");
		}
	};

	const handleKeydown = (event) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleCardClick();
		}
	};
</script>

<style scoped lang="scss">
	.app-card {
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		height: 100%;
		position: relative;

		&:hover {
			transform: translateY(-2px);
		}

		&--offline {
			opacity: 0.6;
			cursor: not-allowed;

			&:hover {
				transform: none;
			}
		}

		&--compact {
			.v-card-text {
				padding: 12px !important;
			}
		}

		&--clickable:hover {
			.v-overlay {
				opacity: 1;
			}
		}
	}

	.app-icon-container {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.status-chip {
		font-weight: 500;

		.v-icon {
			margin-right: 4px;
		}
	}

	.category-chip {
		text-transform: capitalize;
		font-size: 0.7rem;
	}

	// Responsive adjustments
	@media (max-width: 600px) {
		.app-card {
			.app-icon-container {
				width: 40px;
				height: 40px;
			}

			.text-subtitle-1 {
				font-size: 0.9rem;
			}
		}
	}

	// Accessibility improvements
	.app-card:focus-visible {
		outline: 2px solid rgb(var(--v-theme-primary));
		outline-offset: 2px;
	}

	// Animation for status changes
	.status-chip {
		transition: all 0.3s ease-in-out;
	}

	// Hover overlay styling
	.v-overlay {
		border-radius: 12px;
		backdrop-filter: blur(4px);
	}
</style>
