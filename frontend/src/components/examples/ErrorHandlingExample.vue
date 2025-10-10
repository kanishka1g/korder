<template>
	<div class="error-handling-example">
		<v-container>
			<v-row>
				<v-col cols="12">
					<h2 class="text-h4 mb-6">Error Handling Components Demo</h2>
				</v-col>
			</v-row>

			<!-- Control Panel -->
			<v-row class="mb-6">
				<v-col cols="12">
					<v-card>
						<v-card-title>Demo Controls</v-card-title>
						<v-card-text>
							<v-row>
								<v-col cols="12" sm="6" md="3">
									<v-select
										v-model="selectedDemo"
										:items="demoOptions"
										label="Select Demo"
										variant="outlined"
										density="compact"
									/>
								</v-col>
								<v-col cols="12" sm="6" md="3">
									<v-btn color="primary" @click="triggerError"> Trigger Error </v-btn>
								</v-col>
								<v-col cols="12" sm="6" md="3">
									<v-btn color="secondary" variant="outlined" @click="clearDemo"> Clear Demo </v-btn>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>

			<!-- Demo Display Area -->
			<v-row>
				<v-col cols="12">
					<v-card min-height="400">
						<v-card-text>
							<!-- Error State Demo -->
							<ErrorState
								v-if="selectedDemo === 'error-state'"
								title="Demo Error State"
								message="This is a demonstration of the ErrorState component with various recovery options."
								icon="fas fa-exclamation-triangle"
								variant="error"
								:primary-action="errorPrimaryAction"
								:secondary-action="errorSecondaryAction"
								details="Error details: Demo error triggered by user\nTimestamp: 2024-01-01T12:00:00Z\nComponent: ErrorHandlingExample"
							/>

							<!-- Empty State Demo -->
							<EmptyState
								v-else-if="selectedDemo === 'empty-state'"
								title="No Items Found"
								description="This is a demonstration of the EmptyState component with helpful tips and actions."
								icon="fas fa-inbox"
								:tips="emptyStateTips"
								:primary-action="emptyPrimaryAction"
								:secondary-action="emptySecondaryAction"
							/>

							<!-- Network Error Demo -->
							<NetworkError
								v-else-if="selectedDemo === 'network-error'"
								type="timeout"
								:status-code="408"
								status-text="Request Timeout"
								url="/api/demo-endpoint"
								:retry-count="retryCount"
								:max-retries="3"
								@retry="handleRetry"
							/>

							<!-- Error Boundary Demo -->
							<div v-else-if="selectedDemo === 'error-boundary'">
								<ErrorBoundary
									title="Component Error Demo"
									message="This demonstrates how ErrorBoundary catches component errors."
									:show-reload="true"
									@error="handleBoundaryError"
									@retry="handleBoundaryRetry"
								>
									<BuggyComponent v-if="showBuggyComponent" />
									<div v-else class="text-center pa-8">
										<p class="text-body-1 mb-4">
											Click "Trigger Error" to see ErrorBoundary in action
										</p>
										<v-btn color="warning" @click="showBuggyComponent = true">
											Show Buggy Component
										</v-btn>
									</div>
								</ErrorBoundary>
							</div>

							<!-- Default State -->
							<div v-else class="text-center pa-8">
								<v-icon icon="fas fa-play-circle" size="64" color="primary" class="mb-4" />
								<h3 class="text-h5 mb-4">Error Handling Demo</h3>
								<p class="text-body-1 mb-4">
									Select a demo from the dropdown above to see different error handling components in
									action.
								</p>
								<v-list class="text-left mx-auto" max-width="400">
									<v-list-item
										v-for="option in demoOptions"
										:key="option.value"
										@click="selectedDemo = option.value"
									>
										<v-list-item-title>{{ option.title }}</v-list-item-title>
									</v-list-item>
								</v-list>
							</div>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>

			<!-- Status Display -->
			<v-row class="mt-4">
				<v-col cols="12">
					<v-card>
						<v-card-title>Demo Status</v-card-title>
						<v-card-text>
							<v-chip :color="selectedDemo ? 'success' : 'default'" class="mr-2">
								Demo: {{ selectedDemo || "None" }}
							</v-chip>
							<v-chip v-if="retryCount > 0" color="warning" class="mr-2">
								Retries: {{ retryCount }}
							</v-chip>
							<v-chip v-if="lastError" color="error"> Last Error: {{ lastError }} </v-chip>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script setup>
	import { ref, computed } from "vue";
	import ErrorState from "@/components/app/ErrorState.vue";
	import EmptyState from "@/components/app/EmptyState.vue";
	import NetworkError from "@/components/app/NetworkError.vue";
	import ErrorBoundary from "@/components/app/ErrorBoundary.vue";

	// Demo state
	const selectedDemo = ref("");
	const retryCount = ref(0);
	const lastError = ref("");
	const showBuggyComponent = ref(false);

	// Demo options
	const demoOptions = [
		{ title: "Error State Component", value: "error-state" },
		{ title: "Empty State Component", value: "empty-state" },
		{ title: "Network Error Component", value: "network-error" },
		{ title: "Error Boundary Component", value: "error-boundary" },
	];

	// Empty state tips
	const emptyStateTips = [
		"Try adjusting your search filters",
		"Check if you have the necessary permissions",
		"Contact support if the problem persists",
	];

	// Action configurations
	const errorPrimaryAction = {
		text: "Retry Action",
		icon: "fas fa-redo",
		color: "primary",
		action: () => {
			console.log("Error state retry clicked");
			lastError.value = "Retry attempted";
		},
	};

	const errorSecondaryAction = {
		text: "Go to Dashboard",
		icon: "fas fa-home",
		color: "secondary",
		variant: "outlined",
		action: () => {
			console.log("Navigate to dashboard");
			lastError.value = "Navigation requested";
		},
	};

	const emptyPrimaryAction = {
		text: "Add Item",
		icon: "fas fa-plus",
		color: "primary",
		action: () => {
			console.log("Add item clicked");
			lastError.value = "Add item requested";
		},
	};

	const emptySecondaryAction = {
		text: "Browse Templates",
		icon: "fas fa-search",
		color: "secondary",
		variant: "outlined",
		action: () => {
			console.log("Browse templates clicked");
			lastError.value = "Browse templates requested";
		},
	};

	// Event handlers
	const triggerError = () => {
		if (selectedDemo.value === "error-boundary") {
			showBuggyComponent.value = true;
		} else {
			lastError.value = `Demo error triggered for ${selectedDemo.value}`;
		}
	};

	const clearDemo = () => {
		selectedDemo.value = "";
		retryCount.value = 0;
		lastError.value = "";
		showBuggyComponent.value = false;
	};

	const handleRetry = () => {
		retryCount.value++;
		lastError.value = `Network retry attempt ${retryCount.value}`;
	};

	const handleBoundaryError = ({ error, info }) => {
		console.error("Boundary caught error:", error, info);
		lastError.value = `Component error: ${error.message}`;
	};

	const handleBoundaryRetry = () => {
		showBuggyComponent.value = false;
		lastError.value = "Error boundary retry";
	};

	// Buggy component for testing ErrorBoundary
	const BuggyComponent = {
		setup() {
			// This will throw an error when the component mounts
			throw new Error("This is a demo error from BuggyComponent");
		},
		template: "<div>This should not render</div>",
	};
</script>

<style scoped>
	.error-handling-example {
		padding: 20px 0;
	}
</style>
