<template>
	<VMenu v-model="open" :close-on-content-click="false">
		<template #activator="{ props: menuProps }">
			<VTextField
				v-model="text"
				:label="label"
				:placeholder="displayDateFormat"
				v-bind="menuProps"
				variant="outlined"
				:rules="computedRules"
			>
				<template #append-inner>
					<VIcon icon="fas fa-calendar" size="x-small" />
				</template>
				<template v-if="showDay" #prepend-inner>
					{{ innerValue.format(displayDayNameFormat) }}
				</template>
			</VTextField>
		</template>
		<VDatePicker
			v-model="innerValue"
			show-adjacent-months
			color="primary"
			:allowed-dates="allowedDates"
			:first-day-of-week="1"
		>
			<template #actions>
				<VRow justify="space-around" no-gutters>
					<VCol class="flex-grow-0">
						<VBtn color="primary" @click="innerValue = now">Today</VBtn>
					</VCol>
					<VCol class="flex-grow-0">
						<VBtn type="cancel" @click="open = false">Close</VBtn>
					</VCol>
				</VRow>
			</template>
		</VDatePicker>
	</VMenu>
</template>

<script setup>
	import { computed, ref, watch } from "vue";
	import { parseDate, displayDateFormat, displayDayNameFormat } from "@/utils/time";
	import dayjs from "@/plugins/dayjs";
	import { useNow } from "@/utils/now";
	// import { displayDateFormat, displayLongFullDateFormat } from "@/utils/time";

	const now = useNow();

	const props = defineProps({
		label: {
			type: String,
			default: "Date",
		},
		required: {
			type: Boolean,
		},
		futureOnly: {
			type: Boolean,
		},
		pastOnly: {
			type: Boolean,
		},
		minDate: {
			type: String,
			default: null,
		},
		maxDate: {
			type: String,
			default: null,
		},
		rules: {
			type: Array,
			default: () => [],
		},
		showDay: {
			type: Boolean,
		},
	});

	const innerValue = defineModel({
		type: dayjs,
		default: null,
	});

	const text = ref(null);
	const open = ref(false);

	const allowedDates = computed(function () {
		if (props.futureOnly) {
			return function (date) {
				return date.isSameOrAfter(now.value, "day");
			};
		}

		if (props.pastOnly) {
			return function (date) {
				return date.isSameOrBefore(now.value, "day");
			};
		}

		if (props.minDate) {
			return function (date) {
				return date.isSameOrAfter(parseDate(props.minDate), "day");
			};
		}

		if (props.maxDate) {
			return function (date) {
				return date.isSameOrBefore(parseDate(props.maxDate), "day");
			};
		}

		return null;
	});

	const computedRules = computed(() => {
		const rules = [];

		if (props.required) {
			rules.push((v) => !!v || "Date is required");
		}

		rules.push((v) => {
			if (!v) {
				return true;
			}
			return parseDate(v) !== null || "Invalid date format";
		});

		if (props.futureOnly) {
			rules.push((v) => {
				if (!v) {
					return true;
				}
				const parsed = parseDate(v);
				return (parsed && parsed.isSameOrAfter(now.value, "day")) || "Date must be in the future";
			});
		}

		if (props.pastOnly) {
			rules.push((v) => {
				if (!v) {
					return true;
				}
				const parsed = parseDate(v);
				return (parsed && parsed.isSameOrBefore(now.value, "day")) || "Date must be in the past";
			});
		}

		if (props.minDate) {
			rules.push((v) => {
				if (!v) {
					return true;
				}
				const parsed = parseDate(v);
				return (
					(parsed && parsed.isSameOrAfter(parseDate(props.minDate), "day")) ||
					"Date must be after " + props.minDate
				);
			});
		}

		if (props.maxDate) {
			rules.push((v) => {
				if (!v) {
					return true;
				}
				const parsed = parseDate(v);
				return (
					(parsed && parsed.isSameOrBefore(parseDate(props.maxDate), "day")) ||
					"Date must be before " + props.maxDate
				);
			});
		}

		return [...rules, ...props.rules];
	});

	watch(text, function (value) {
		if (!text.value) {
			innerValue.value = null;
			return;
		}

		const result = parseDate(text.value);
		if (result) {
			innerValue.value = result;
			return;
		}
		text.value = innerValue.value?.format(displayDateFormat);
	});

	watch(
		innerValue,
		function (value) {
			if (!value) {
				text.value = null;
				return;
			}
			text.value = value.format(displayDateFormat);
		},
		{ immediate: true },
	);
</script>
