<template>
	<span v-if="dateOnly">
		<span v-if="long">
			{{ value.format(displayLongDateTimeFormat) }}
		</span>
		<span v-else>
			{{ value.format(displayDateFormat) }}
		</span>
	</span>
	<span v-else-if="timeOnly">
		{{ value.format(displayTimeFormat) }}
	</span>
	<span v-else>
		<span v-if="long">
			{{ value.format(displayLongDateTimeFormat) }}
		</span>
		<span v-else>
			{{ value.format(displayDateTimeFormat) }}
		</span>
	</span>
</template>
<script setup>
	import dayjs from "@/plugins/dayjs";
	import {
		displayDateFormat,
		displayDateTimeFormat,
		displayTimeFormat,
		displayLongDateTimeFormat,
	} from "@/utils/time";

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
		long: {
			type: Boolean,
		},
	});
</script>
