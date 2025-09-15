import { ref, computed } from "vue";

const loadingCounter = ref(0);

export function useLoading() {
	const isLoading = computed({
		get() {
			return loadingCounter.value > 0;
		},
		set(value) {
			if (!value) {
				loadingCounter.value = 0;
			}
		},
	});

	function start() {
		loadingCounter.value++;
		isLoading.value = true;
	}

	function end() {
		loadingCounter.value = Math.max(loadingCounter.value - 1, 0);
		if (loadingCounter.value === 0) {
			isLoading.value = false;
		}
	}

	return { isLoading, start, end };
}
