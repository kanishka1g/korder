<template>
	<div class="error-boundary">
		<!-- Render children if no error -->
		<slot v-if="!hasError" />

		<!-- Render error state if error occurred -->
		<ErrorState
			v-else
			:title="errorTitle"
			:message="errorMessage"
			:details="errorDetails"
			icon="fas fa-bug"
			variant="error"
			:primary-action="primaryAction"
			:secondary-action="secondaryAction"
		/>
	</div>
</template>

<script setup>
	import { ref, computed, onErrorCaptured, onMounted } from "vue";
	import ErrorState from "./ErrorState.vue";

	const props = defineProps({
		// Custom error messages
		title: {
			type: String,
			default: "Component Error",
		},
		message: {
			type: String,
			default: "This component encountered an error and could not be displayed properly.",
		},

		// Fallback options
		showRetry: {
			type: Boolean,
			default: true,
		},
		showReload: {
			type: Boolean,
			default: false,
		},

		// Development options
		showDetails: {
			type: Boolean,
			default: process.env.NODE_ENV === "development",
		},
	});

	const emit = defineEmits(["error", "retry"]);

	const hasError = ref(false);
	const error = ref(null);
	const errorInfo = ref(null);

	// Computed error display values
	const errorTitle = computed(() => {
		return props.title;
	});

	const errorMessage = computed(() => {
		return props.message;
	});

	const errorDetails = computed(() => {
		if (!props.showDetails || !error.value) return null;

		let details = `Error: ${error.value.message || "Unknown error"}\n`;

		if (error.value.stack) {
			details += `\nStack trace:\n${error.value.stack}`;
		}

		if (errorInfo.value) {
			details += `\n\nComponent info:\n${errorInfo.value}`;
		}

		return details;
	});

	// Action configurations
	const primaryAction = computed(() => {
		if (!props.showRetry) return null;

		return {
			text: "Try Again",
			icon: "fas fa-redo",
			color: "primary",
			variant: "elevated",
			action: handleRetry,
		};
	});

	const secondaryAction = computed(() => {
		if (!props.showReload) return null;

		return {
			text: "Reload Page",
			icon: "fas fa-refresh",
			color: "secondary",
			variant: "outlined",
			action: handleReload,
		};
	});

	// Error handling
	onErrorCaptured((err, instance, info) => {
		console.error("ErrorBoundary caught an error:", err);
		console.error("Component info:", info);

		hasError.value = true;
		error.value = err;
		errorInfo.value = info;

		emit("error", { error: err, info });

		// Prevent the error from propagating further
		return false;
	});

	// Global error handler for unhandled promise rejections
	onMounted(() => {
		const handleUnhandledRejection = (event) => {
			console.error("Unhandled promise rejection:", event.reason);

			hasError.value = true;
			error.value = new Error(event.reason || "Unhandled promise rejection");
			errorInfo.value = "Promise rejection in component tree";

			emit("error", { error: error.value, info: errorInfo.value });
		};

		window.addEventListener("unhandledrejection", handleUnhandledRejection);

		// Cleanup
		return () => {
			window.removeEventListener("unhandledrejection", handleUnhandledRejection);
		};
	});

	// Action handlers
	const handleRetry = () => {
		hasError.value = false;
		error.value = null;
		errorInfo.value = null;
		emit("retry");
	};

	const handleReload = () => {
		window.location.reload();
	};
</script>

<style scoped>
	.error-boundary {
		width: 100%;
		height: 100%;
	}
</style>
