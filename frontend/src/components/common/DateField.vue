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
	import { parseDate, displayDateFormat } from "@/utils/time";
	import dayjs from "@/plugins/dayjs";
	import { useNow } from "@/utils/now";

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
				return date.isAfter(now.value);
			};
		}

		if (props.pastOnly) {
			return function (date) {
				return date.isBefore(now.value);
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

		return rules;
	});

	function onChange() {
		if (!text.value) {
			innerValue.value = null;
			return;
		}
		const result = parseDate(text.value);
		if (result) {
			innerValue.value = result;
			return;
		}
		text.value = innerValue.value?.toString("date");
	}

	watch(text, function (value) {
		if (!value) {
			onChange();
		}
	});

	watch(
		innerValue,
		function (value) {
			if (!value) {
				text.value = null;
				return;
			}
			text.value = value.toString("date");
		},
		{ immediate: true },
	);
</script>
