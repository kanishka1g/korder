import { ref, computed } from "vue";

/**
 * Composable for handling errors and network issues
 * Provides consistent error handling patterns across components
 */
export function useErrorHandling() {
	const error = ref(null);
	const isLoading = ref(false);
	const retryCount = ref(0);
	const maxRetries = ref(3);

	// Computed properties
	const hasError = computed(() => error.value !== null);
	const canRetry = computed(() => retryCount.value < maxRetries.value);
	const isNetworkError = computed(() => {
		if (!error.value) return false;
		return (
			error.value.name === "NetworkError" ||
			error.value.code === "NETWORK_ERROR" ||
			error.value.message?.includes("fetch")
		);
	});
	const isTimeoutError = computed(() => {
		if (!error.value) return false;
		return (
			error.value.name === "TimeoutError" ||
			error.value.code === "TIMEOUT" ||
			error.value.message?.includes("timeout")
		);
	});

	// Error classification
	const getErrorType = (err) => {
		if (!err) return "generic";

		// Network-related errors
		if (err.name === "NetworkError" || err.message?.includes("fetch")) {
			return "network";
		}

		// Timeout errors
		if (err.name === "TimeoutError" || err.message?.includes("timeout")) {
			return "timeout";
		}

		// HTTP status-based errors
		if (err.status || err.response?.status) {
			const status = err.status || err.response.status;
			if (status === 401) return "unauthorized";
			if (status === 403) return "forbidden";
			if (status === 404) return "notFound";
			if (status >= 500) return "server";
		}

		// Offline detection
		if (!navigator.onLine) {
			return "offline";
		}

		return "generic";
	};

	// Error handling methods
	const setError = (err, context = null) => {
		console.error("Error occurred:", err, context);
		error.value = {
			...err,
			type: getErrorType(err),
			context,
			timestamp: new Date().toISOString(),
		};
	};

	const clearError = () => {
		error.value = null;
		retryCount.value = 0;
	};

	const incrementRetry = () => {
		retryCount.value++;
	};

	const resetRetry = () => {
		retryCount.value = 0;
	};

	// Async operation wrapper with error handling
	const withErrorHandling = async (operation, context = null) => {
		try {
			isLoading.value = true;
			clearError();

			const result = await operation();
			resetRetry();
			return result;
		} catch (err) {
			setError(err, context);
			throw err;
		} finally {
			isLoading.value = false;
		}
	};

	// Retry wrapper
	const withRetry = async (operation, context = null) => {
		let lastError = null;

		for (let attempt = 0; attempt <= maxRetries.value; attempt++) {
			try {
				if (attempt > 0) {
					retryCount.value = attempt;
					// Exponential backoff
					await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
				}

				const result = await withErrorHandling(operation, context);
				return result;
			} catch (err) {
				lastError = err;
				if (attempt === maxRetries.value) {
					throw err;
				}
			}
		}

		throw lastError;
	};

	// Network-specific error handling
	const handleNetworkError = (err, url = null) => {
		const networkError = {
			...err,
			type: "network",
			url,
			isOnline: navigator.onLine,
			timestamp: new Date().toISOString(),
		};

		setError(networkError, "network_request");
	};

	// HTTP error handling
	const handleHttpError = (response, url = null) => {
		const httpError = {
			name: "HttpError",
			message: `HTTP ${response.status}: ${response.statusText}`,
			status: response.status,
			statusText: response.statusText,
			url,
			type: getErrorType({ status: response.status }),
			timestamp: new Date().toISOString(),
		};

		setError(httpError, "http_request");
	};

	// Graceful degradation helper
	const withFallback = async (primaryOperation, fallbackOperation, context = null) => {
		try {
			return await withErrorHandling(primaryOperation, context);
		} catch (primaryError) {
			console.warn("Primary operation failed, trying fallback:", primaryError);

			try {
				return await withErrorHandling(fallbackOperation, `${context}_fallback`);
			} catch (fallbackError) {
				console.error("Fallback also failed:", fallbackError);
				throw primaryError; // Throw the original error
			}
		}
	};

	return {
		// State
		error: readonly(error),
		isLoading: readonly(isLoading),
		retryCount: readonly(retryCount),
		maxRetries,

		// Computed
		hasError,
		canRetry,
		isNetworkError,
		isTimeoutError,

		// Methods
		setError,
		clearError,
		incrementRetry,
		resetRetry,
		getErrorType,

		// Wrappers
		withErrorHandling,
		withRetry,
		withFallback,

		// Specific handlers
		handleNetworkError,
		handleHttpError,
	};
}

/**
 * Global error handler setup
 * Call this in your main.js or app setup
 */
export function setupGlobalErrorHandling() {
	// Handle unhandled promise rejections
	window.addEventListener("unhandledrejection", (event) => {
		console.error("Unhandled promise rejection:", event.reason);

		// You can integrate with your notification system here
		// For example: useNotifications().error('An unexpected error occurred')

		// Prevent the default browser behavior
		event.preventDefault();
	});

	// Handle general JavaScript errors
	window.addEventListener("error", (event) => {
		console.error("Global error:", event.error);

		// You can integrate with your notification system here
		// For example: useNotifications().error('An unexpected error occurred')
	});

	// Handle network status changes
	window.addEventListener("online", () => {
		console.log("Network connection restored");
		// You can trigger retry logic here
	});

	window.addEventListener("offline", () => {
		console.log("Network connection lost");
		// You can show offline notification here
	});
}
