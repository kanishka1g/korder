/**
 * Centralized logger for debugging and monitoring
 * Note: This logger only logs to console. UI notifications are handled by request interceptors.
 */
export function useLogger() {
	function error(error, context = "") {
		let userMessage = "Something went wrong. Please try again.";

		if (error.response) {
			const { status, data } = error.response;
			const backendMessage = data?.message || data?.error || data?.details || null;

			console.error(`[API ERROR] ${context}`, { status, data, error });

			switch (status) {
				case 400:
					userMessage = backendMessage || "Invalid request.";
					break;
				case 401:
					userMessage = backendMessage || "Authentication required.";
					break;
				case 403:
					userMessage = backendMessage || "Access denied.";
					break;
				case 404:
					userMessage = backendMessage || "Resource not found.";
					break;
				case 500:
					userMessage = backendMessage || "Internal server error.";
					break;
				default:
					userMessage = backendMessage || "Unexpected error occurred.";
			}
		} else if (error.request) {
			console.error(`[NETWORK ERROR] ${context}`, error.request);
			userMessage = "Unable to connect to server. Please check your network.";
		} else {
			console.error(`[CLIENT ERROR] ${context}`, error.message);
			userMessage = error.message || "Unexpected client error occurred.";
		}

		return userMessage; // Return message for manual UI handling if needed
	}

	function info(message, meta = {}) {
		console.info(`[INFO] ${message}`, meta);
	}

	function warning(message, meta = {}) {
		console.warn(`[WARNING] ${message}`, meta);
	}

	function success(message, meta = {}) {
		console.log(`[SUCCESS] ${message}`, meta);
	}

	function debug(message, meta = {}) {
		console.debug(`[DEBUG] ${message}`, meta);
	}

	return {
		error,
		info,
		warning,
		success,
		debug,
	};
}
