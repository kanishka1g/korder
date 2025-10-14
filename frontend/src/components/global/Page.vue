<template>
	<div class="page-wrapper" :class="wrapperClasses">
		<VContainer fluid class="page-container">
			<VRow v-if="!hideHeader" justify="end" class="page-header">
				<VCol>
					<h1 class="page-title text-h4 font-weight-bold">{{ title }}</h1>
				</VCol>
				<VCol cols="auto" class="page-actions">
					<slot name="actions" />
				</VCol>
			</VRow>
			<VScrollXTransition mode="out-in">
				<div v-if="error" key="error">
					<VRow>
						<VCol>
							<VAlert type="error" icon="fas fa-triangle-exclamation">
								<p>Oops! Something went wrong.</p>
							</VAlert>
						</VCol>
					</VRow>
				</div>
				<div v-else key="content" class="page-content">
					<slot />
				</div>
			</VScrollXTransition>
		</VContainer>
	</div>
</template>

<script setup>
	import { computed } from "vue";

	const props = defineProps({
		title: {
			type: String,
			default: null,
		},
		error: {
			type: null,
			default: null,
		},
		hideHeader: {
			type: Boolean,
		},
		variant: {
			type: String,
			default: "default",
			validator: (value) => ["default", "dashboard"].includes(value),
		},
	});

	const wrapperClasses = computed(() => {
		const classes = ["page-wrapper"];

		if (props.variant === "dashboard") {
			classes.push("page-wrapper--dashboard");
		}

		return classes;
	});
</script>

<style scoped lang="scss">
	@use "@/assets/styles/variables";

	.page-wrapper {
		min-height: 100vh;

		.page-title {
			font-family: variables.$title-font;
			color: rgb(var(--v-theme-on-surface));
			margin-bottom: 0;
		}

		.page-actions {
			display: flex;
			align-items: center;
			gap: 1rem;
		}

		.page-content {
			width: 100%;
		}
	}

	// Dashboard variant with modern gradient backgrounds
	.page-wrapper--dashboard {
		background: linear-gradient(
			135deg,
			rgba(var(--v-theme-surface), 0.8) 0%,
			rgba(var(--v-theme-background), 0.9) 100%
		);

		.page-container {
			position: relative;
			z-index: 1;
		}

		.page-title {
			background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
			background-clip: text;
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
			font-weight: 700;
			letter-spacing: -0.025em;
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			cursor: default;

			// Fallback for browsers that don't support background-clip: text
			@supports not (background-clip: text) {
				color: rgb(var(--v-theme-primary));
				-webkit-text-fill-color: initial;
			}

			&:hover {
				transform: translateY(-1px);
				text-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
			}
		}

		.page-header {
			margin-bottom: 1.5rem;
			padding-bottom: 1rem;
			border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
		}
	}

	// Theme-specific dashboard styling
	.v-theme--dark {
		.page-wrapper--dashboard {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);

			.page-title {
				text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
			}

			.page-header {
				border-bottom-color: rgba(255, 255, 255, 0.1);
			}
		}
	}

	.v-theme--light {
		.page-wrapper--dashboard {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.9) 100%);

			.page-title {
				text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
			}

			.page-header {
				border-bottom-color: rgba(0, 0, 0, 0.08);
			}
		}
	}

	// Responsive design for dashboard pages
	@media (max-width: 600px) {
		.page-wrapper--dashboard {
			.page-container {
				padding: 1rem;
			}

			.page-header {
				.page-title {
					font-size: 1.5rem !important;
				}
			}
		}
	}

	// Legacy support for existing title/subtitle classes
	.title {
		font-family: variables.$title-font;
	}

	.subtitle {
		font-family: variables.$subtitle-font;
	}
</style>
