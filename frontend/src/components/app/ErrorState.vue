<template>
	<div class="error-state">
		<v-container class="text-center py-12">
			<v-row justify="center">
				<v-col cols="12" sm="8" md="6">
					<!-- Error Icon -->
					<v-icon :icon="icon" :color="iconColor" size="64" class="mb-4" />

					<!-- Error Title -->
					<h2 class="text-h4 font-weight-bold mb-4" :class="titleColor">
						{{ title }}
					</h2>

					<!-- Error Message -->
					<p class="text-body-1 mb-6" :class="messageColor">
						{{ message }}
					</p>

					<!-- Error Details (optional) -->
					<v-expand-transition>
						<div v-if="showDetails && details" class="mb-6">
							<v-card variant="outlined" class="text-left pa-4" :color="detailsCardColor">
								<v-card-title class="text-subtitle-1 pb-2"> Error Details </v-card-title>
								<v-card-text class="pt-0">
									<pre class="text-caption">{{ details }}</pre>
								</v-card-text>
							</v-card>
						</div>
					</v-expand-transition>

					<!-- Action Buttons -->
					<div class="d-flex flex-column flex-sm-row gap-3 justify-center">
						<!-- Primary Action -->
						<v-btn
							v-if="primaryAction"
							:color="primaryAction.color || 'primary'"
							:variant="primaryAction.variant || 'elevated'"
							:loading="primaryAction.loading"
							@click="handlePrimaryAction"
						>
							<v-icon v-if="primaryAction.icon" :icon="primaryAction.icon" start />
							{{ primaryAction.text }}
						</v-btn>

						<!-- Secondary Action -->
						<v-btn
							v-if="secondaryAction"
							:color="secondaryAction.color || 'secondary'"
							:variant="secondaryAction.variant || 'outlined'"
							:loading="secondaryAction.loading"
							@click="handleSecondaryAction"
						>
							<v-icon v-if="secondaryAction.icon" :icon="secondaryAction.icon" start />
							{{ secondaryAction.text }}
						</v-btn>

						<!-- Show Details Toggle -->
						<v-btn v-if="details" variant="text" @click="showDetails = !showDetails">
							<v-icon :icon="showDetails ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" start />
							{{ showDetails ? "Hide Details" : "Show Details" }}
						</v-btn>
					</div>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script setup>
	import { ref, computed } from "vue";
	import { useTheme } from "vuetify";

	const props = defineProps({
		// Error content
		title: {
			type: String,
			default: "Something went wrong",
		},
		message: {
			type: String,
			default: "An unexpected error occurred. Please try again.",
		},
		details: {
			type: String,
			default: null,
		},

		// Visual customization
		icon: {
			type: String,
			default: "fas fa-exclamation-triangle",
		},
		variant: {
			type: String,
			default: "error", // 'error', 'warning', 'network', 'generic'
			validator: (value) => ["error", "warning", "network", "generic"].includes(value),
		},

		// Actions
		primaryAction: {
			type: Object,
			default: null,
			// Expected shape: { text: String, icon?: String, color?: String, variant?: String, loading?: Boolean, action: Function }
		},
		secondaryAction: {
			type: Object,
			default: null,
			// Expected shape: { text: String, icon?: String, color?: String, variant?: String, loading?: Boolean, action: Function }
		},
	});

	const emit = defineEmits(["primary-action", "secondary-action"]);

	const theme = useTheme();
	const showDetails = ref(false);

	// Computed styles based on variant and theme
	const iconColor = computed(() => {
		switch (props.variant) {
			case "error":
				return "error";
			case "warning":
				return "warning";
			case "network":
				return "info";
			default:
				return "secondary";
		}
	});

	const titleColor = computed(() => {
		return theme.current.value.dark ? "text-white" : "text-grey-darken-3";
	});

	const messageColor = computed(() => {
		return theme.current.value.dark ? "text-grey-lighten-1" : "text-grey-darken-1";
	});

	const detailsCardColor = computed(() => {
		return theme.current.value.dark ? "surface-variant" : "grey-lighten-4";
	});

	// Action handlers
	const handlePrimaryAction = () => {
		if (props.primaryAction?.action) {
			props.primaryAction.action();
		}
		emit("primary-action");
	};

	const handleSecondaryAction = () => {
		if (props.secondaryAction?.action) {
			props.secondaryAction.action();
		}
		emit("secondary-action");
	};
</script>

<style scoped>
	.error-state {
		min-height: 400px;
		display: flex;
		align-items: center;
	}

	pre {
		white-space: pre-wrap;
		word-break: break-word;
		font-family: "JetBrains Mono", "Consolas", "Monaco", monospace;
		background: transparent;
		margin: 0;
	}

	.gap-3 {
		gap: 12px;
	}
</style>
