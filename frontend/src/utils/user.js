import { ref } from "vue";

const unloadedUser = Object.freeze({
	id: null,
	name: null,
	role: null,
});

const deepFreeze = (obj) => {
	Object.freeze(obj);
	Object.getOwnPropertyNames(obj).forEach((prop) => {
		const value = obj[prop];
		if (value && typeof value === "object") {
			deepFreeze(value);
		}
	});
	return obj;
};

class User {
	constructor() {
		this._user = ref(unloadedUser);
	}

	get id() {
		return this._user.value.userId;
	}

	get name() {
		return this._user.value.name;
	}

	get role() {
		return this._user.value.role;
	}
}

const user = new User();

export function updateUser(information = null) {
	if (information === null) {
		information = unloadedUser;
		return;
	}
	user._user.value = Object.freeze(information);
}

export function useUser() {
	return user;
}
