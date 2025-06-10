<template>
	<VMenu v-model="open" :close-on-content-click="false">
		<template #activator="{ props: menuProps }">
			<VTextField
				v-model="text"
				:label="label"
				placeholder="DD/MM/YYYY"
				v-bind="menuProps"
				variant="outlined"
				prepend-inner-icon="fas fa-calendar"
			/>
		</template>
		<VCard>
			<VDatePicker v-model="innerValue" show-adjacent-months color="main">
				<template #actions>
					<VRow justify="space-around" no-gutters>
						<VCol class="flex-grow-0">
							<VBtn primary @click="innerValue = dayjs()">Today</VBtn>
						</VCol>
						<VCol class="flex-grow-0">
							<VBtn type="cancel" @click="open = false">Close</VBtn>
						</VCol>
					</VRow>
				</template>
			</VDatePicker>
		</VCard>
	</VMenu>
</template>

<script setup>
	import { ref, watch } from "vue";
	import { parseDate } from "@/utils/time";
	import dayjs from "@/plugins/dayjs";

	const props = defineProps({
		label: {
			type: String,
			default: "Date",
		},
	});
w
	const innerValue = defineModel({
		type: dayjs,
		default: null,
	});

	const text = ref(null);
	const open = ref(false);

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

		text.value = props.modelValue?.toString("date");
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
