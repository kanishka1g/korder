<template>
	<div class="empty-state">
		<v-container class="text-center py-12">
			<v-row justify="center">
				<v-col cols="12" sm="8" md="6">
					<!-- Empty State Illustration/Icon -->
					<div class="mb-6">
						<v-img
							v-if="illustration"
							:src="illustration"
							:alt="illustrationAlt"
							max-width="200"
							class="mx-auto mb-4"
						/>
						<v-icon v-else :icon="icon" :color="iconColor" size="64" class="mb-4" />
					</div>

					<!-- Empty State Title -->
					<h2 class="text-h5 font-weight-bold mb-4" :class="titleColor">
						{{ title }}
					</h2>

					<!-- Empty State Description -->
					<p class="text-body-1 mb-6" :class="descriptionColor">
						{{ description }}
					</p>

					<!-- Helpful Tips (optional) -->
					<v-expand-transition>
						<div v-if="showTips && tips.length > 0" class="mb-6">
							<v-card variant="outlined" class="text-left pa-4" :color="tipsCardColor">
								<v-card-title class="text-subtitle-1 pb-2">
									<v-icon icon="fas fa-lightbulb" start size="small" />
									Helpful Tips
								</v-card-title>
								<v-card-text class="pt-0">
									<ul class="text-body-2">
										<li v-for="(tip, index) in tips" :key="index" class="mb-1">
											{{ tip }}
										</li>
									</ul>
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

						<!-- Show Tips Toggle -->
						<v-btn v-if="tips.length > 0" variant="text" @click="showTips = !showTips">
							<v-icon :icon="showTips ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" start />
							{{ showTips ? "Hide Tips" : "Show Tips" }}
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
		// Content
		title: {
			type: String,
			default: "Nothing here yet",
		},
		description: {
			type: String,
			default: "Get started by adding your first item.",
		},
		tips: {
			type: Array,
			default: () => [],
		},

		// Visual customization
		icon: {
			type: String,
			default: "fas fa-inbox",
		},
		illustration: {
			type: String,
			default: null,
		},
		illustrationAlt: {
			type: String,
			default: "Empty state illustration",
		},
		variant: {
			type: String,
			default: "default", // 'default', 'search', 'filter', 'error', 'loading'
			validator: (value) => ["default", "search", "filter", "error", "loading"].includes(value),
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
	const showTips = ref(false);

	// Computed styles based on variant and theme
	const iconColor = computed(() => {
		switch (props.variant) {
			case "search":
				return "info";
			case "filter":
				return "warning";
			case "error":
				return "error";
			case "loading":
				return "primary";
			default:
				return "secondary";
		}
	});

	const titleColor = computed(() => {
		return theme.current.value.dark ? "text-white" : "text-grey-darken-3";
	});

	const descriptionColor = computed(() => {
		return theme.current.value.dark ? "text-grey-lighten-1" : "text-grey-darken-1";
	});

	const tipsCardColor = computed(() => {
		return theme.current.value.dark ? "surface-variant" : "grey-lighten-5";
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
	.empty-state {
		min-height: 300px;
		display: flex;
		align-items: center;
	}

	.gap-3 {
		gap: 12px;
	}

	ul {
		padding-left: 20px;
	}

	li {
		margin-bottom: 4px;
	}
</style>
