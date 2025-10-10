<template>
	<ErrorState
		:title="errorTitle"
		:message="errorMessage"
		:icon="errorIcon"
		variant="network"
		:primary-action="primaryAction"
		:secondary-action="secondaryAction"
		:details="errorDetails"
	/>
</template>

<script setup>
	import { computed } from "vue";
	import ErrorState from "./ErrorState.vue";

	const props = defineProps({
		// Error type
		type: {
			type: String,
			default: "generic", // 'generic', 'timeout', 'offline', 'server', 'forbidden', 'notFound'
			validator: (value) => ["generic", "timeout", "offline", "server", "forbidden", "notFound"].includes(value),
		},

		// Custom error details
		statusCode: {
			type: Number,
			default: null,
		},
		statusText: {
			type: String,
			default: null,
		},
		url: {
			type: String,
			default: null,
		},

		// Retry functionality
		showRetry: {
			type: Boolean,
			default: true,
		},
		retryCount: {
			type: Number,
			default: 0,
		},
		maxRetries: {
			type: Number,
			default: 3,
		},

		// Custom actions
		customAction: {
			type: Object,
			default: null,
		},
	});

	const emit = defineEmits(["retry", "custom-action"]);

	// Computed error content based on type
	const errorTitle = computed(() => {
		switch (props.type) {
			case "timeout":
				return "Request Timeout";
			case "offline":
				return "No Internet Connection";
			case "server":
				return "Server Error";
			case "forbidden":
				return "Access Denied";
			case "notFound":
				return "Resource Not Found";
			default:
				return "Network Error";
		}
	});

	const errorMessage = computed(() => {
		switch (props.type) {
			case "timeout":
				return "The request took too long to complete. Please check your connection and try again.";
			case "offline":
				return "Please check your internet connection and try again.";
			case "server":
				return "The server encountered an error. Please try again later.";
			case "forbidden":
				return "You don't have permission to access this resource.";
			case "notFound":
				return "The requested resource could not be found.";
			default:
				return "A network error occurred. Please check your connection and try again.";
		}
	});

	const errorIcon = computed(() => {
		switch (props.type) {
			case "timeout":
				return "fas fa-clock";
			case "offline":
				return "fas fa-wifi-slash";
			case "server":
				return "fas fa-server";
			case "forbidden":
				return "fas fa-lock";
			case "notFound":
				return "fas fa-search";
			default:
				return "fas fa-exclamation-triangle";
		}
	});

	const errorDetails = computed(() => {
		if (!props.statusCode && !props.url) return null;

		let details = "";

		if (props.statusCode) {
			details += `Status: ${props.statusCode}`;
			if (props.statusText) {
				details += ` ${props.statusText}`;
			}
			details += "\n";
		}

		if (props.url) {
			details += `URL: ${props.url}\n`;
		}

		if (props.retryCount > 0) {
			details += `Retry attempts: ${props.retryCount}/${props.maxRetries}`;
		}

		return details.trim() || null;
	});

	// Action configurations
	const primaryAction = computed(() => {
		if (!props.showRetry || props.retryCount >= props.maxRetries) return null;

		return {
			text: props.retryCount > 0 ? `Retry (${props.retryCount}/${props.maxRetries})` : "Retry",
			icon: "fas fa-redo",
			color: "primary",
			variant: "elevated",
			action: handleRetry,
		};
	});

	const secondaryAction = computed(() => {
		if (props.customAction) {
			return {
				text: props.customAction.text || "Custom Action",
				icon: props.customAction.icon || "fas fa-cog",
				color: props.customAction.color || "secondary",
				variant: props.customAction.variant || "outlined",
				action: handleCustomAction,
			};
		}

		// Default secondary action based on error type
		switch (props.type) {
			case "offline":
				return {
					text: "Check Connection",
					icon: "fas fa-wifi",
					color: "info",
					variant: "outlined",
					action: checkConnection,
				};
			case "forbidden":
				return {
					text: "Go to Login",
					icon: "fas fa-sign-in-alt",
					color: "secondary",
					variant: "outlined",
					action: goToLogin,
				};
			default:
				return null;
		}
	});

	// Action handlers
	const handleRetry = () => {
		emit("retry");
	};

	const handleCustomAction = () => {
		if (props.customAction?.action) {
			props.customAction.action();
		}
		emit("custom-action");
	};

	const checkConnection = () => {
		// Simple connection check
		if (navigator.onLine) {
			// Try to fetch a small resource to verify connectivity
			fetch("/favicon.ico", { method: "HEAD", cache: "no-cache" })
				.then(() => {
					// Connection seems to be working, suggest retry
					handleRetry();
				})
				.catch(() => {
					// Still having issues
					console.log("Connection check failed");
				});
		}
	};

	const goToLogin = () => {
		// Navigate to login page
		window.location.href = "/";
	};
</script>
