import { removeFromArray } from "@/utils/array";
import { ref } from "vue";

const acceptedColours = [null, "primary", "error", "warning", "success", "info"];

export function snackbar(message, colour) {
	if (acceptedColours.indexOf(colour) === -1) {
		alert("Unknown colour", colour, "used for snackbar. Defaulting to null.");
		colour = null;
	}
	addSnackbar(message, colour);
}

snackbar.primary = function (message) {
	snackbar(message, "primary");
};

snackbar.error = function (message) {
	snackbar(message, "error");
};

snackbar.warning = function (message) {
	snackbar(message, "warning");
};

snackbar.success = function (message) {
	snackbar(message, "success");
};

snackbar.info = function (message) {
	snackbar(message, "info");
};

snackbar.validate = function (message = "Please fix the highlighted fields.") {
	// TODO: Message should be confirmation message
	snackbar(message, "warning");
};

export let snackbars = ref([]);
let id = 0;

function addSnackbar(message, colour) {
	setTimeout(function () {
		let new_snackbar = {
			id: id++,
			message,
			colour,
			open: ref(false),
		};

		for (let s of snackbars.value) {
			s.open = false;
			setTimeout(() => removeFromArray(s, snackbars.value), 1000);
		}
		snackbars.value.push(new_snackbar);
		setTimeout(() => {
			new_snackbar.open.value = true;
		}, 5);
	});
}

export let modals = ref([]);

export function confirmation(
	action = "Proceed",
	message = "Are you sure you want to perform this action?",
	dangerous = false,
	title = null,
	type = null,
) {
	if (type === null) {
		type = dangerous ? "error" : "success";
	}
	const typeIcon = {
		primary: "fas fa-floppy-disk",
		error: "fas fa-trash",
		warning: "fas fa-floppy-disk",
		success: "fas fa-floppy-disk",
		info: "fas fa-floppy-disk",
	};
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
			color: type,
			icon: typeIcon[type],
		};
		modals.value.push(modal);
		setTimeout(() => {
			modal.open.value = true;
		}, 0);
	});
}
