<template>
	<span v-if="dateOnly">
		{{ value.format(displayDateFormat) }}
	</span>
	<span v-else-if="timeOnly">
		{{ value.format(displayTimeFormat) }}
	</span>
	<span v-else>
		{{ value.format(displayDateTimeFormat) }}
	</span>
</template>
<script setup>
	import dayjs from "@/plugins/dayjs";
	import { displayDateFormat, displayDateTimeFormat, displayTimeFormat } from "@/utils/time";

	const props = defineProps({
		value: {
			type: dayjs,
			required: true,
		},
		dateOnly: {
			type: Boolean,
		},
		timeOnly: {
			type: Boolean,
		},
	});
</script>
