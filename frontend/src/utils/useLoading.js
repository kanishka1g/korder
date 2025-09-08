import { ref } from "vue";

const loadingCounter = ref(0);

export function useLoading() {
	const isLoading = ref(false);

	function start() {
		console.log("Loading started");
		loadingCounter.value++;
		isLoading.value = true;
	}

	function end() {
		console.log("Loading ended");
		loadingCounter.value = Math.max(loadingCounter.value - 1, 0);
		if (loadingCounter.value === 0) {
			isLoading.value = false;
		}
	}

	return { isLoading, start, end };
}
