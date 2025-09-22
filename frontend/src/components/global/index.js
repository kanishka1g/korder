import Modal from "./Modal.vue";
import Page from "./Page.vue";

export const globalComponents = Object.freeze({
	Modal,
	Page,
});

export default function registerGlobals(app) {
	for (const [name, component] of Object.entries(globalComponents)) {
		app.component(name, component);
	}
}
