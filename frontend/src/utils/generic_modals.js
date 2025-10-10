import { removeFromArray } from "@/utils/array";
import { ref } from "vue";

const acceptedColours = [null, "primary", "error", "warning", "success", "info"];

export function snackbar(message, colour, options = {}) {
	if (acceptedColours.indexOf(colour) === -1) {
		console.warn("Unknown colour", colour, "used for snackbar. Defaulting to null.");
		colour = null;
	}
	addSnackbar(message, colour, options);
}

// Enhanced snackbar methods with options support
snackbar.primary = function (message, options = {}) {
	snackbar(message, "primary", options);
};

snackbar.error = function (message, options = {}) {
	snackbar(message, "error", options);
};

snackbar.warning = function (message, options = {}) {
	snackbar(message, "warning", options);
};

snackbar.success = function (message, options = {}) {
	snackbar(message, "success", options);
};

snackbar.info = function (message, options = {}) {
	snackbar(message, "info", options);
};

snackbar.validate = function (message = "Please fix the highlighted fields.", options = {}) {
	snackbar(message, "warning", options);
};

// Advanced notification method with full options
export function notification(config) {
	if (typeof config === "string") {
		// Simple string message
		return addSnackbar(config, null, {});
	}

	const {
		message,
		type = "default",
		color,
		title,
		timeout = 5000,
		persistent = false,
		position = "top",
		icon,
		actions = [],
		onClose,
		hideClose = false,
		multiLine = false,
		vertical = false,
		variant = "flat",
		rounded = "md",
		elevation = 2,
		ariaLabel,
		...otherOptions
	} = config;

	return addSnackbar(message, color || type, {
		type,
		title,
		timeout,
		persistent,
		position,
		icon,
		actions,
		onClose,
		hideClose,
		multiLine,
		vertical,
		variant,
		rounded,
		elevation,
		ariaLabel,
		...otherOptions,
	});
}

export let snackbars = ref([]);
let id = 0;

function addSnackbar(message, colour, options = {}) {
	const {
		type = colour || "default",
		title,
		timeout = 5000,
		persistent = false,
		position = "top",
		icon,
		actions = [],
		onClose,
		hideClose = false,
		multiLine = false,
		vertical = false,
		variant = "flat",
		rounded = "md",
		elevation = 2,
		ariaLabel,
		queueBehavior = "stack", // 'stack', 'replace', 'ignore'
		...otherOptions
	} = options;

	// Handle queue behavior
	if (queueBehavior === "replace") {
		// Close all existing notifications
		for (let s of snackbars.value) {
			s.open = false;
		}
		// Clear the array after a delay to allow animations
		setTimeout(() => {
			snackbars.value = [];
		}, 300);
	} else if (queueBehavior === "ignore" && snackbars.value.some((s) => s.open)) {
		// Don't add if there are already open notifications
		return null;
	}

	const new_snackbar = {
		id: id++,
		message,
		colour: colour || type,
		color: colour || type,
		type,
		title,
		timeout: persistent ? -1 : timeout,
		persistent,
		position,
		icon,
		actions: actions.map((action) => ({
			id: action.id || `action-${id}`,
			text: action.text,
			color: action.color || "white",
			variant: action.variant || "text",
			icon: action.icon,
			handler: action.handler,
			closeOnClick: action.closeOnClick !== false,
			...action,
		})),
		onClose,
		hideClose,
		multiLine,
		vertical,
		variant,
		rounded,
		elevation,
		ariaLabel,
		open: ref(false),
		stackIndex: snackbars.value.filter((s) => s.open).length,
		createdAt: Date.now(),
		...otherOptions,
	};

	snackbars.value.push(new_snackbar);

	// Open the notification after a short delay
	setTimeout(() => {
		new_snackbar.open.value = true;
	}, 10);

	// Auto-close after timeout (if not persistent)
	if (!persistent && timeout > 0) {
		setTimeout(() => {
			if (new_snackbar.open.value) {
				new_snackbar.open.value = false;
				setTimeout(() => removeFromArray(new_snackbar, snackbars.value), 300);
			}
		}, timeout);
	}

	return new_snackbar;
}

export let modals = ref([]);

export function confirmation(
	action = "Proceed",
	message = "Are you sure you want to perform this action?",
	dangerous = false,
	title = null,
	type = null,
	options = {},
) {
	if (type === null) {
		type = dangerous ? "error" : "primary";
	}

	const typeIcon = {
		primary: "fas fa-question-circle",
		error: "fas fa-exclamation-triangle",
		warning: "fas fa-exclamation-triangle",
		success: "fas fa-check-circle",
		info: "fas fa-info-circle",
		danger: "fas fa-trash-can",
		delete: "fas fa-trash-can",
	};

	const { details, checkboxText, requireCheckbox = false, onResolve, icon, color, ...otherOptions } = options;

	return new Promise(function (resolve) {
		const modal = {
			id: id++,
			title: title || `Confirmation required: ${action}?`,
			message,
			action,
			dangerous,
			resolve,
			open: ref(false),
			type,
			color: color || (dangerous ? "error" : type),
			icon: icon || typeIcon[type] || typeIcon.primary,
			details,
			checkboxText,
			checkboxValue: ref(false),
			requireCheckbox,
			onResolve,
			createdAt: Date.now(),
			...otherOptions,
		};
		modals.value.push(modal);
		setTimeout(() => {
			modal.open.value = true;
		}, 0);
	});
}

// Enhanced confirmation methods
confirmation.danger = function (action, message, title, options = {}) {
	return confirmation(action, message, true, title, "danger", options);
};

confirmation.delete = function (itemName, message, options = {}) {
	const defaultMessage = message || `Are you sure you want to delete "${itemName}"? This action cannot be undone.`;
	const defaultTitle = `Delete ${itemName}?`;
	return confirmation("Delete", defaultMessage, true, defaultTitle, "delete", {
		checkboxText: `I understand that deleting "${itemName}" is permanent`,
		requireCheckbox: true,
		...options,
	});
};

confirmation.info = function (action, message, title, options = {}) {
	return confirmation(action, message, false, title, "info", options);
};

confirmation.warning = function (action, message, title, options = {}) {
	return confirmation(action, message, false, title, "warning", options);
};

confirmation.success = function (action, message, title, options = {}) {
	return confirmation(action, message, false, title, "success", options);
};
