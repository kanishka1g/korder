/**
 * Logs an event - usually an error.
 * @param module - A string that should easily identify what component is throwing the error.
 * @param name - The action that module was attempting to perform
 * @param data - Any information that will help diagnose the error - such as the exception.
 * @param showSnackbar - When true, an error snackbar will be shown.
 */
export default function (module, name, data, showSnackbar) {
	// At some point, this will send the log back to the server to be collected.
	console?.groupCollapsed(module, name);
	console.info(data);
	let message = "An error has occurred while performing this action.";
	if (data && data.stack && data.message) {
		// It's probably an exception.
		message = data.message;
	}
	if (data && data.response) {
		// It's probably an axios exception. Try and pluck out the message in the exception.
		console.info(data.response.status, data.response.statusText);
		if (data.response.data) {
			console.info(data.response.data.Message);
			message = data.response.data.Message || message;
			console.info(data.response.data.StackTrace);
		}
	}
	console.info(new Error().stack);
	console?.groupEnd();
	if (showSnackbar) {
		console.error(message);
	}
}
