import Modal from "./Modal.vue";

export const globalComponents = Object.freeze({
	Modal,
});

export default function registerGlobals(app) {
	for (const [name, component] of Object.entries(globalComponents)) {
		app.component(name, component);
	}
}
