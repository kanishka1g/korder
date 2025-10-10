<template>
	<v-container class="design-system-example">
		<v-row>
			<v-col cols="12">
				<h1 class="text-h4 font-weight-bold text-primary mb-6">Design System Example</h1>
				<p class="text-body-1 text-medium-emphasis mb-8">
					This component demonstrates the new design token system and Vuetify theme integration.
				</p>
			</v-col>
		</v-row>

		<!-- Color Palette -->
		<v-row class="mb-8">
			<v-col cols="12">
				<h2 class="text-h5 font-weight-semibold mb-4">Color Palette</h2>
				<v-row>
					<v-col cols="12" sm="6" md="4" lg="3" v-for="colorDemo in colorDemos" :key="colorDemo.name">
						<v-card :color="colorDemo.color" class="pa-4 mb-2" elevation="2">
							<div class="text-on-surface">
								<div class="text-subtitle-1 font-weight-medium">{{ colorDemo.name }}</div>
								<div class="text-caption">{{ colorDemo.description }}</div>
							</div>
						</v-card>
					</v-col>
				</v-row>
			</v-col>
		</v-row>

		<!-- Typography -->
		<v-row class="mb-8">
			<v-col cols="12">
				<h2 class="text-h5 font-weight-semibold mb-4">Typography</h2>
				<div class="typography-examples">
					<h1 class="text-h1 font-weight-bold mb-2">Heading 1</h1>
					<h2 class="text-h2 font-weight-bold mb-2">Heading 2</h2>
					<h3 class="text-h3 font-weight-semibold mb-2">Heading 3</h3>
					<h4 class="text-h4 font-weight-semibold mb-2">Heading 4</h4>
					<h5 class="text-h5 font-weight-medium mb-2">Heading 5</h5>
					<h6 class="text-h6 font-weight-medium mb-4">Heading 6</h6>
					<p class="text-body-1 mb-2">
						Body 1: This is regular body text using the design system typography.
					</p>
					<p class="text-body-2 mb-2">Body 2: This is smaller body text for secondary content.</p>
					<p class="text-caption text-medium-emphasis">
						Caption: This is caption text for labels and metadata.
					</p>
				</div>
			</v-col>
		</v-row>

		<!-- Buttons -->
		<v-row class="mb-8">
			<v-col cols="12">
				<h2 class="text-h5 font-weight-semibold mb-4">Buttons</h2>
				<div class="d-flex flex-wrap gap-3">
					<v-btn color="primary" variant="elevated">Primary</v-btn>
					<v-btn color="secondary" variant="elevated">Secondary</v-btn>
					<v-btn color="accent" variant="elevated">Accent</v-btn>
					<v-btn color="success" variant="outlined">Success</v-btn>
					<v-btn color="warning" variant="outlined">Warning</v-btn>
					<v-btn color="error" variant="outlined">Error</v-btn>
					<v-btn color="info" variant="text">Info</v-btn>
				</div>
			</v-col>
		</v-row>

		<!-- Cards -->
		<v-row class="mb-8">
			<v-col cols="12">
				<h2 class="text-h5 font-weight-semibold mb-4">Cards</h2>
				<v-row>
					<v-col cols="12" sm="6" md="4" v-for="cardExample in cardExamples" :key="cardExample.title">
						<v-card
							:elevation="cardExample.elevation"
							:variant="cardExample.variant"
							class="card-example"
							:class="{ 'card-hover': cardExample.hover }"
						>
							<v-card-title class="text-h6 font-weight-semibold">
								{{ cardExample.title }}
							</v-card-title>
							<v-card-text>
								<p class="text-body-2 text-medium-emphasis">
									{{ cardExample.description }}
								</p>
							</v-card-text>
							<v-card-actions v-if="cardExample.actions">
								<v-btn color="primary" variant="text" size="small">Action</v-btn>
								<v-btn color="accent" variant="outlined" size="small">Learn More</v-btn>
							</v-card-actions>
						</v-card>
					</v-col>
				</v-row>
			</v-col>
		</v-row>

		<!-- Theme Toggle -->
		<v-row>
			<v-col cols="12">
				<h2 class="text-h5 font-weight-semibold mb-4">Theme Toggle</h2>
				<v-card class="pa-4" variant="outlined">
					<div class="d-flex align-center justify-space-between">
						<div>
							<div class="text-subtitle-1 font-weight-medium">Current Theme</div>
							<div class="text-body-2 text-medium-emphasis">
								{{ theme.global.current.value.dark ? "Dark" : "Light" }} mode is active
							</div>
						</div>
						<v-btn
							:color="theme.global.current.value.dark ? 'warning' : 'info'"
							variant="elevated"
							@click="toggleTheme"
							:prepend-icon="theme.global.current.value.dark ? 'fas fa-sun' : 'fas fa-moon'"
						>
							Switch to {{ theme.global.current.value.dark ? "Light" : "Dark" }}
						</v-btn>
					</div>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup>
	import { ref, computed } from "vue";
	import { useTheme } from "vuetify";

	const theme = useTheme();

	const colorDemos = ref([
		{ name: "Primary", color: "primary", description: "Main brand color" },
		{ name: "Secondary", color: "secondary", description: "Supporting color" },
		{ name: "Accent", color: "accent", description: "Highlight color" },
		{ name: "Success", color: "success", description: "Success states" },
		{ name: "Warning", color: "warning", description: "Warning states" },
		{ name: "Error", color: "error", description: "Error states" },
		{ name: "Info", color: "info", description: "Information states" },
		{ name: "Surface", color: "surface", description: "Surface background" },
	]);

	const cardExamples = ref([
		{
			title: "Elevated Card",
			description: "This card uses elevation to create depth and hierarchy.",
			elevation: 4,
			variant: "elevated",
			hover: true,
			actions: true,
		},
		{
			title: "Outlined Card",
			description: "This card uses a border instead of elevation for a cleaner look.",
			elevation: 0,
			variant: "outlined",
			hover: false,
			actions: true,
		},
		{
			title: "Flat Card",
			description: "This card has no elevation or border for a minimal appearance.",
			elevation: 0,
			variant: "flat",
			hover: false,
			actions: false,
		},
	]);

	const toggleTheme = () => {
		theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
	};
</script>

<style scoped>
	.design-system-example {
		max-width: 1200px;
		margin: 0 auto;
	}

	.card-example {
		transition: all 0.3s ease;
	}

	.card-hover:hover {
		transform: translateY(-2px);
	}

	.typography-examples {
		border-left: 4px solid rgb(var(--v-theme-primary));
		padding-left: 1rem;
	}

	.gap-3 {
		gap: 0.75rem;
	}
</style>
