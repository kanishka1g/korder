<template>
	<VDialog
		:model-value="modelValue"
		@update:model-value="$emit('update:modelValue', $event)"
		:max-width="maxWidth"
		:persistent="persistent"
		:fullscreen="fullscreen"
		:scrollable="scrollable"
		class="modern-modal"
		transition="dialog-bottom-transition"
	>
		<VCard
			class="modern-modal-card"
			:class="[`modal-${variant}`, { 'modal-fullscreen': fullscreen }]"
			:elevation="elevation"
		>
			<!-- Header Slot -->
			<template v-if="$slots.header || title">
				<VCardTitle class="modal-header" :class="headerClass">
					<slot name="header">
						<div class="d-flex align-center">
							<VIcon v-if="icon" :icon="icon" :color="iconColor" size="24" class="mr-3" />
							<h3 class="text-h5 font-weight-bold modal-title">{{ title }}</h3>
						</div>
					</slot>
				</VCardTitle>
				<VDivider v-if="showDividers" />
			</template>

			<!-- Content -->
			<VCardText
				class="modal-content"
				:class="contentClass"
				:style="{ maxHeight: maxHeight, overflowY: scrollable ? 'auto' : 'visible' }"
			>
				<slot />
			</VCardText>

			<!-- Actions Slot -->
			<template v-if="$slots.actions || showDefaultActions">
				<VDivider v-if="showDividers" />
				<VCardActions class="modal-actions" :class="actionsClass">
					<slot name="actions">
						<VSpacer />
						<VBtn
							v-if="showCancelButton"
							variant="text"
							@click="handleCancel"
							class="mr-3"
							:disabled="loading"
						>
							{{ cancelText }}
						</VBtn>
						<VBtn
							v-if="showConfirmButton"
							:color="confirmColor"
							variant="elevated"
							:prepend-icon="confirmIcon"
							@click="handleConfirm"
							:loading="loading"
							class="confirm-btn"
						>
							<template v-if="confirmIcon" #prepend>
								<VIcon :icon="confirmIcon" />
							</template>
							{{ confirmText }}
						</VBtn>
					</slot>
				</VCardActions>
			</template>
		</VCard>
	</VDialog>
</template>

<script setup>
	import { computed } from "vue";

	const props = defineProps({
		modelValue: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: "",
		},
		icon: {
			type: String,
			default: "",
		},
		iconColor: {
			type: String,
			default: "primary",
		},
		maxWidth: {
			type: [String, Number],
			default: 600,
		},
		maxHeight: {
			type: String,
			default: "80vh",
		},
		persistent: {
			type: Boolean,
			default: false,
		},
		fullscreen: {
			type: Boolean,
			default: false,
		},
		scrollable: {
			type: Boolean,
			default: true,
		},
		variant: {
			type: String,
			default: "default",
			validator: (value) => ["default", "success", "warning", "error", "info"].includes(value),
		},
		elevation: {
			type: Number,
			default: 24,
		},
		showDividers: {
			type: Boolean,
			default: true,
		},
		showDefaultActions: {
			type: Boolean,
			default: false,
		},
		showCancelButton: {
			type: Boolean,
			default: true,
		},
		showConfirmButton: {
			type: Boolean,
			default: true,
		},
		cancelText: {
			type: String,
			default: "Cancel",
		},
		confirmText: {
			type: String,
			default: "Confirm",
		},
		confirmColor: {
			type: String,
			default: "primary",
		},
		confirmIcon: {
			type: String,
			default: "",
		},
		loading: {
			type: Boolean,
			default: false,
		},
		headerClass: {
			type: String,
			default: "",
		},
		contentClass: {
			type: String,
			default: "",
		},
		actionsClass: {
			type: String,
			default: "",
		},
	});

	const emit = defineEmits(["update:modelValue", "confirm", "cancel"]);

	const handleConfirm = () => {
		emit("confirm");
	};

	const handleCancel = () => {
		emit("cancel");
		emit("update:modelValue", false);
	};
</script>

<style scoped lang="scss">
	.modern-modal {
		:deep(.v-overlay__content) {
			margin: 24px;
			width: calc(100% - 48px);
			max-width: none;
		}
	}

	.modern-modal-card {
		border-radius: 20px;
		background: linear-gradient(
			135deg,
			rgba(var(--v-theme-surface), 0.98) 0%,
			rgba(var(--v-theme-surface), 0.95) 100%
		);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(var(--v-border-color), 0.12);
		overflow: hidden;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

		&.modal-fullscreen {
			border-radius: 0;
			height: 100vh;
		}

		.modal-header {
			background: linear-gradient(
				135deg,
				rgba(var(--v-theme-primary), 0.08) 0%,
				rgba(var(--v-theme-primary), 0.04) 100%
			);
			border-radius: 20px 20px 0 0;
			padding: 24px;
			min-height: auto;

			.modal-title {
				font-family: "Libre Baskerville", serif;
				letter-spacing: -0.025em;
			}
		}

		.modal-content {
			padding: 24px;
			position: relative;

			// Custom scrollbar
			&::-webkit-scrollbar {
				width: 6px;
			}

			&::-webkit-scrollbar-track {
				background: rgba(var(--v-theme-surface-variant), 0.3);
				border-radius: 3px;
			}

			&::-webkit-scrollbar-thumb {
				background: rgba(var(--v-theme-primary), 0.4);
				border-radius: 3px;

				&:hover {
					background: rgba(var(--v-theme-primary), 0.6);
				}
			}
		}

		.modal-actions {
			padding: 24px;
			background: rgba(var(--v-theme-surface-variant), 0.05);

			.confirm-btn {
				border-radius: 12px;
				text-transform: none;
				font-weight: 600;
				box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
				transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

				&:hover {
					transform: translateY(-2px);
					box-shadow: 0 6px 20px rgba(var(--v-theme-primary), 0.4);
				}

				&:active {
					transform: translateY(0);
				}
			}
		}

		// Variant styles
		&.modal-success {
			.modal-header {
				background: linear-gradient(
					135deg,
					rgba(var(--v-theme-success), 0.08) 0%,
					rgba(var(--v-theme-success), 0.04) 100%
				);
			}
		}

		&.modal-warning {
			.modal-header {
				background: linear-gradient(
					135deg,
					rgba(var(--v-theme-warning), 0.08) 0%,
					rgba(var(--v-theme-warning), 0.04) 100%
				);
			}
		}

		&.modal-error {
			.modal-header {
				background: linear-gradient(
					135deg,
					rgba(var(--v-theme-error), 0.08) 0%,
					rgba(var(--v-theme-error), 0.04) 100%
				);
			}
		}

		&.modal-info {
			.modal-header {
				background: linear-gradient(
					135deg,
					rgba(var(--v-theme-info), 0.08) 0%,
					rgba(var(--v-theme-info), 0.04) 100%
				);
			}
		}
	}

	// Form elements styling within modal
	.modal-content {
		:deep(.v-text-field),
		:deep(.v-select),
		:deep(.v-textarea) {
			.v-field {
				border-radius: 12px;
				background: rgba(var(--v-theme-surface-variant), 0.3);
				transition: all 0.3s ease;

				&:hover {
					background: rgba(var(--v-theme-surface-variant), 0.4);
				}

				&.v-field--focused {
					background: rgba(var(--v-theme-primary), 0.05);
					box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.2);
				}
			}
		}

		:deep(.v-checkbox) {
			.v-selection-control__wrapper {
				.v-selection-control__input {
					.v-icon {
						font-size: 1.25rem;
						transition: all 0.3s ease;
					}
				}
			}

			&:hover .v-selection-control__input .v-icon {
				transform: scale(1.1);
			}
		}

		:deep(.v-card) {
			border-radius: 12px;
			background: rgba(var(--v-theme-surface-variant), 0.3);
			backdrop-filter: blur(10px);
			transition: all 0.3s ease;

			&:hover {
				transform: translateY(-1px);
				box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
			}
		}
	}

	// Theme-specific styles
	.v-theme--dark {
		.modern-modal-card {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%);
			box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
		}
	}

	.v-theme--light {
		.modern-modal-card {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%);
			box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
		}
	}

	// Responsive design
	@media (max-width: 768px) {
		.modern-modal {
			:deep(.v-overlay__content) {
				margin: 16px;
				width: calc(100% - 32px);
			}
		}

		.modern-modal-card {
			.modal-header,
			.modal-content,
			.modal-actions {
				padding: 16px;
			}

			.modal-title {
				font-size: 1.25rem !important;
			}
		}
	}

	@media (max-width: 480px) {
		.modern-modal {
			:deep(.v-overlay__content) {
				margin: 8px;
				width: calc(100% - 16px);
			}
		}

		.modern-modal-card {
			border-radius: 16px;

			.modal-header {
				border-radius: 16px 16px 0 0;
			}

			.modal-actions {
				.d-flex {
					flex-direction: column;
					gap: 12px;

					.v-btn {
						width: 100%;
					}
				}
			}
		}
	}

	// Animation enhancements
	.modern-modal-card {
		animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	@keyframes modalSlideIn {
		from {
			opacity: 0;
			transform: translateY(30px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	// Focus management
	.modern-modal-card {
		&:focus-within {
			.modal-header {
				background: linear-gradient(
					135deg,
					rgba(var(--v-theme-primary), 0.12) 0%,
					rgba(var(--v-theme-primary), 0.06) 100%
				);
			}
		}
	}

	// Loading state
	.modal-actions {
		.confirm-btn {
			&.v-btn--loading {
				.v-btn__overlay {
					background: rgba(var(--v-theme-primary), 0.1);
				}
			}
		}
	}
</style>
