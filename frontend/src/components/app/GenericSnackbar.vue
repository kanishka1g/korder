<template>
	<div>
		<div v-for="s in snackbars" :key="s.id">
			<VSnackbar
				v-model="s.open"
				:color="s.colour"
				:location="s.position || 'top'"
				:timeout="s.timeout || 5000"
				:variant="s.variant || 'flat'"
				:elevation="s.elevation || 2"
				:multi-line="s.multiLine || false"
				:vertical="s.vertical || false"
				:rounded="s.rounded || 'md'"
				:class="[
					'notification-snackbar',
					`notification-${s.type || 'default'}`,
					{ 'notification-persistent': s.persistent },
				]"
				:style="{
					'--notification-index': s.stackIndex || 0,
					'margin-top': s.stackOffset ? `${s.stackOffset}px` : '0px',
				}"
				role="alert"
				:aria-live="s.type === 'error' ? 'assertive' : 'polite'"
				:aria-label="s.ariaLabel || `${s.type || 'notification'}: ${s.message}`"
			>
				<div class="d-flex align-center">
					<VIcon
						v-if="s.icon || getTypeIcon(s.type)"
						:icon="s.icon || getTypeIcon(s.type)"
						:color="getIconColor(s.type)"
						class="mr-3"
						size="small"
						:aria-hidden="true"
					/>
					<div class="notification-content flex-grow-1">
						<div v-if="s.title" class="notification-title font-weight-medium mb-1">
							{{ s.title }}
						</div>
						<div class="notification-message">
							{{ s.message }}
						</div>
						<div v-if="s.actions && s.actions.length" class="notification-actions mt-2">
							<VBtn
								v-for="action in s.actions"
								:key="action.id"
								:color="action.color || 'white'"
								:variant="action.variant || 'text'"
								size="small"
								class="mr-2"
								@click="handleAction(s, action)"
							>
								<VIcon v-if="action.icon" :icon="action.icon" size="x-small" class="mr-1" />
								{{ action.text }}
							</VBtn>
						</div>
					</div>
				</div>

				<template #actions>
					<VBtn
						v-if="!s.hideClose"
						icon
						size="small"
						variant="text"
						:color="getCloseButtonColor(s.type)"
						:aria-label="`Close ${s.type || 'notification'}`"
						@click="closeNotification(s)"
					>
						<VIcon size="small">$close</VIcon>
					</VBtn>
				</template>
			</VSnackbar>
		</div>
	</div>
</template>

<script setup>
	import { snackbars } from "@/utils/generic_modals";

	// Icon mapping for different notification types
	const typeIcons = {
		success: "fas fa-check-circle",
		error: "fas fa-exclamation-circle",
		warning: "fas fa-exclamation-triangle",
		info: "fas fa-info-circle",
		primary: "fas fa-bell",
		default: "fas fa-bell",
	};

	// Get icon for notification type
	function getTypeIcon(type) {
		return typeIcons[type] || typeIcons.default;
	}

	// Get icon color based on type
	function getIconColor(type) {
		const colorMap = {
			success: "white",
			error: "white",
			warning: "white",
			info: "white",
			primary: "white",
			default: "white",
		};
		return colorMap[type] || "white";
	}

	// Get close button color based on type
	function getCloseButtonColor(type) {
		return "white";
	}

	// Handle notification action clicks
	function handleAction(notification, action) {
		if (action.handler && typeof action.handler === "function") {
			action.handler(notification);
		}

		// Close notification if action specifies it
		if (action.closeOnClick !== false) {
			closeNotification(notification);
		}
	}

	// Close notification with proper cleanup
	function closeNotification(notification) {
		notification.open = false;

		// Emit close event if handler exists
		if (notification.onClose && typeof notification.onClose === "function") {
			notification.onClose(notification);
		}
	}
</script>

<style scoped>
	.notification-snackbar {
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.notification-snackbar :deep(.v-snackbar__wrapper) {
		border-radius: 8px;
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
	}

	.notification-content {
		min-width: 0; /* Allows text to wrap properly */
	}

	.notification-title {
		font-size: 0.875rem;
		line-height: 1.25;
	}

	.notification-message {
		font-size: 0.875rem;
		line-height: 1.375;
		word-wrap: break-word;
	}

	.notification-actions {
		margin-left: -8px; /* Align with message text */
	}

	.notification-persistent :deep(.v-snackbar__wrapper) {
		border-left: 4px solid currentColor;
	}

	/* Type-specific styling */
	.notification-success :deep(.v-snackbar__wrapper) {
		background-color: rgb(var(--v-theme-success));
	}

	.notification-error :deep(.v-snackbar__wrapper) {
		background-color: rgb(var(--v-theme-error));
	}

	.notification-warning :deep(.v-snackbar__wrapper) {
		background-color: rgb(var(--v-theme-warning));
	}

	.notification-info :deep(.v-snackbar__wrapper) {
		background-color: rgb(var(--v-theme-info));
	}

	.notification-primary :deep(.v-snackbar__wrapper) {
		background-color: rgb(var(--v-theme-primary));
	}

	/* Stacking support */
	.notification-snackbar[style*="--notification-index"] {
		z-index: calc(2000 + var(--notification-index));
	}

	/* Responsive adjustments */
	@media (max-width: 600px) {
		.notification-snackbar :deep(.v-snackbar__wrapper) {
			margin: 8px;
			max-width: calc(100vw - 16px);
		}
	}

	/* Focus styles for accessibility */
	.notification-snackbar :deep(.v-btn:focus-visible) {
		outline: 2px solid rgba(255, 255, 255, 0.5);
		outline-offset: 2px;
	}

	/* High contrast mode support */
	@media (prefers-contrast: high) {
		.notification-snackbar :deep(.v-snackbar__wrapper) {
			border: 2px solid currentColor;
		}
	}

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.notification-snackbar {
			transition: none;
		}
	}
</style>
