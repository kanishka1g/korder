import { ref, computed } from "vue";
import dayjs from "@/plugins/dayjs";
import { parseDateTime } from "@/utils/time";

const now = ref(dayjs().startOf("minute"));

// This is intentionally outside of the useNow scope, so that the callback can be run globally.
setInterval(function () {
	const expectedTime = window.nowOverride ? parseDateTime(window.nowOverride) : dayjs().startOf("minute");
	if (!expectedTime.isSame(now.value)) {
		now.value = expectedTime;
	}
}, 1000);

export function useNow() {
	return computed(function () {
		return now.value;
	});
}
