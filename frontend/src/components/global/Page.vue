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
}

// Theme-specific dashboard styling
.v-theme--dark {
	.page-wrapper--dashboard {
		background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
	}
}

.v-theme--light {
	.page-wrapper--dashboard {
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.9) 100%);
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
