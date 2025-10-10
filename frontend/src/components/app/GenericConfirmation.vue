<template>
	<div>
		<Modal
			v-for="m in modals"
			:key="m.id"
			:model-value="m.open"
			:title="m.title"
			:color="getModalColor(m)"
			:confirm-icon="m.icon"
			persistent
			:fullscreen="false"
			size="small"
			:confirm-text="m.action"
			:confirm-dangerous="m.dangerous"
			:class="['confirmation-modal', `confirmation-${m.type}`, { 'confirmation-dangerous': m.dangerous }]"
			:aria-labelledby="`modal-title-${m.id}`"
			:aria-describedby="`modal-description-${m.id}`"
			role="alertdialog"
			@cancel="resolve(m, false)"
			@confirm="resolve(m, true)"
		>
			<template #icon>
				<div
					v-if="getTypeIcon(m.type)"
					class="confirmation-icon-container text-center mb-4"
					:class="`icon-${m.type}`"
				>
					<div class="confirmation-icon-wrapper" :class="{ 'dangerous-icon': m.dangerous }">
						<VIcon
							:color="getIconColor(m.type, m.dangerous)"
							:icon="getTypeIcon(m.type)"
							size="48"
							:aria-hidden="true"
						/>
					</div>
				</div>
			</template>

			<div class="confirmation-content">
				<p
					:id="`modal-description-${m.id}`"
					class="confirmation-message text-center pre-line"
					:class="getMessageClass(m.type)"
				>
					{{ m.message }}
				</p>

				<div v-if="m.details" class="confirmation-details mt-3">
					<VExpansionPanels variant="accordion" class="elevation-0">
						<VExpansionPanel>
							<VExpansionPanelTitle class="text-caption">
								<VIcon icon="fas fa-info-circle" size="small" class="mr-2" />
								Show Details
							</VExpansionPanelTitle>
							<VExpansionPanelText>
								<div class="text-caption pre-line">{{ m.details }}</div>
							</VExpansionPanelText>
						</VExpansionPanel>
					</VExpansionPanels>
				</div>

				<div v-if="m.checkboxText" class="confirmation-checkbox mt-4">
					<VCheckbox
						v-model="m.checkboxValue"
						:label="m.checkboxText"
						:color="getModalColor(m)"
						density="compact"
						hide-details
					/>
				</div>
			</div>
		</Modal>
	</div>
</template>

<script setup>
	import { modals } from "@/utils/generic_modals";
	import { removeFromArray } from "@/utils/array";

	// Icon mapping for different modal types
	const typeIcons = {
		success: "fas fa-check-circle",
		error: "fas fa-exclamation-triangle",
		warning: "fas fa-exclamation-triangle",
		info: "fas fa-info-circle",
		primary: "fas fa-question-circle",
		danger: "fas fa-trash-can",
		delete: "fas fa-trash-can",
	};

	// Get icon for modal type
	function getTypeIcon(type) {
		return typeIcons[type] || typeIcons.primary;
	}

	// Get icon color based on type and danger status
	function getIconColor(type, dangerous = false) {
		if (dangerous) return "error";

		const colorMap = {
			success: "success",
			error: "error",
			warning: "warning",
			info: "info",
			primary: "primary",
			danger: "error",
			delete: "error",
		};
		return colorMap[type] || "primary";
	}

	// Get modal color based on type and danger status
	function getModalColor(modal) {
		if (modal.dangerous) return "error";
		return modal.color || modal.type || "primary";
	}

	// Get message styling class based on type
	function getMessageClass(type) {
		const classMap = {
			success: "text-success",
			error: "text-error",
			warning: "text-warning",
			info: "text-info",
		};
		return classMap[type] || "";
	}

	function resolve(modal, value) {
		// Check if checkbox validation is required
		if (modal.requireCheckbox && !modal.checkboxValue && value === true) {
			// Don't resolve if checkbox is required but not checked
			return;
		}

		modal.open = false;
		modal.resolve(value);

		// Clean up modal after animation completes
		setTimeout(() => removeFromArray(modal, modals.value), 300);

		// Call onResolve callback if provided
		if (modal.onResolve && typeof modal.onResolve === "function") {
			modal.onResolve(value, modal);
		}
	}
</script>

<style scoped>
	.pre-line {
		white-space: pre-line;
	}

	.confirmation-modal {
		--modal-border-radius: 12px;
	}

	.confirmation-icon-container {
		margin-bottom: 16px;
	}

	.confirmation-icon-wrapper {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background-color: rgba(var(--v-theme-surface-variant), 0.1);
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.dangerous-icon {
		background-color: rgba(var(--v-theme-error), 0.1);
		animation: pulse-danger 2s infinite;
	}

	.confirmation-content {
		padding: 0 8px;
	}

	.confirmation-message {
		font-size: 1rem;
		line-height: 1.5;
		color: rgb(var(--v-theme-on-surface));
		margin-bottom: 0;
	}

	.confirmation-details {
		border-top: 1px solid rgba(var(--v-theme-outline), 0.12);
		padding-top: 16px;
	}

	.confirmation-checkbox {
		border-top: 1px solid rgba(var(--v-theme-outline), 0.12);
		padding-top: 16px;
	}

	/* Type-specific icon styling */
	.icon-success .confirmation-icon-wrapper {
		background-color: rgba(var(--v-theme-success), 0.1);
	}

	.icon-error .confirmation-icon-wrapper,
	.icon-danger .confirmation-icon-wrapper,
	.icon-delete .confirmation-icon-wrapper {
		background-color: rgba(var(--v-theme-error), 0.1);
	}

	.icon-warning .confirmation-icon-wrapper {
		background-color: rgba(var(--v-theme-warning), 0.1);
	}

	.icon-info .confirmation-icon-wrapper {
		background-color: rgba(var(--v-theme-info), 0.1);
	}

	.icon-primary .confirmation-icon-wrapper {
		background-color: rgba(var(--v-theme-primary), 0.1);
	}

	/* Animations */
	@keyframes pulse-danger {
		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.05);
			opacity: 0.8;
		}
	}

	/* Focus management for accessibility */
	.confirmation-modal :deep(.v-dialog) {
		outline: none;
	}

	.confirmation-modal :deep(.v-card) {
		border-radius: var(--modal-border-radius);
	}

	/* High contrast mode support */
	@media (prefers-contrast: high) {
		.confirmation-icon-wrapper {
			border: 2px solid currentColor;
		}

		.confirmation-details,
		.confirmation-checkbox {
			border-top-color: currentColor;
		}
	}

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.confirmation-icon-wrapper {
			transition: none;
		}

		.dangerous-icon {
			animation: none;
		}
	}

	/* Dark theme adjustments */
	.v-theme--dark .confirmation-message {
		color: rgb(var(--v-theme-on-surface));
	}

	.v-theme--dark .confirmation-icon-wrapper {
		background-color: rgba(var(--v-theme-surface-bright), 0.08);
	}
</style>
