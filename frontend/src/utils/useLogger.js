import { snackbar } from "@/utils/generic_modals";

/**
 * Centralized logger with optional contextual/local logging
 */
export function useLogger() {
	function error(error, context = "") {
		let userMessage = "Something went wrong. Please try again.";

		if (error.response) {
			const { status, data } = error.response;
			const backendMessage = data?.message || data?.error || data?.details || null;

			console.error(`[API ERROR] ${context}`, { status, data });

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
			snackbar.error(userMessage);
		} else if (error.request) {
			console.log(`[NETWORK ERROR] ${context}`, error.request);
			userMessage = "Unable to connect to server. Please check your network.";
			snackbar.error(userMessage);
		} else {
			console.log(`[CLIENT ERROR] ${context}`, error.message);
			userMessage = error.message || "Unexpected client error occurred.";
			snackbar.error(userMessage);
		}

		return userMessage; // optional: can be used for local UI messages
	}

	function info(message, meta = {}) {
		console.info(`[INFO] ${message}`, meta);
		snackbar.info(message);
	}

	function warning(message, meta = {}) {
		console.warn(`[WARNING] ${message}`, meta);
		snackbar.warning(message);
	}

	function success(message, meta = {}) {
		console.log(`[SUCCESS] ${message}`, meta);
		snackbar.success(message);
	}

	return {
		error,
		info,
		warning,
		success,
	};
}
