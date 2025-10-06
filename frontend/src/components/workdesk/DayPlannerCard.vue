<template>
	<VSkeletonLoader v-if="loading.isLoading.value" type="list-item-two-line"></VSkeletonLoader>
	<VCard v-else class="modern-card pa-4 rounded-xl fill-height" elevation="4">
		<VCardTitle class="text-h6 mb-4">
			<VRow align="end">
				<VCol cols="auto">
					<VIcon icon="fas fa-calendar" color="primary" size="20" />
				</VCol>
				<VCol cols="auto">
					<div class="text-h6 font-weight-bold">Day Plan</div>
				</VCol>
			</VRow>
		</VCardTitle>
		<VCardText>
			<VRow>
				<VCol v-for="item in computedItems" :key="item.date" cols="12" sm="4">
					{{ item }}
					<DisplayDateTime :value="item.date" date-only />
				</VCol>
			</VRow>
		</VCardText>
	</VCard>
</template>

<script setup>
	import { ref, computed, onMounted } from "vue";
	import { io } from "socket.io-client";
	import { useLoading } from "@/utils/loading";
	import { useLogger } from "@/utils/useLogger";

	import DisplayDateTime from "../common/DisplayDateTime.vue";

	const loading = useLoading();
	const logger = useLogger();

	const items = ref([]);

	const computedItems = computed(() => {
		const formattedData = [];

		for (let i = 0; i < items.value.length; i += 2) {
			formattedData.push({
				date: items.value[i],
				events: items.value[i + 1].events || [],
				tasks: items.value[i + 1].tasks || [],
			});
		}

		return formattedData;
	});

	let socket;
	onMounted(async () => {
		loading.start();
		try {
			socket = io(`${import.meta.env.VITE_BACKEND_URL}/day-plan`);

			socket.on("statusUpdate", (data) => {
				const formattedData = [];

				// for (let i = 0; i < data.dates.length; i += 2) {
				// 	formattedData.push({
				// 		date: data[i],
				// 		events: data[i + 1].events || [],
				// 		tasks: data[i + 1].tasks || [],
				// 	});
				// }

				for (const date in data.dates) {
					formattedData.push({
						date: date.date,
						items: date.items,
					});
				}

				items.value = formattedData;
				console.log(data);
				console.log(items.value);
			});
		} catch (err) {
			logger.error(err, "handleDailyCheck");
		} finally {
			loading.end();
		}
	});

	// onMounted(() => {
	// 	socket = io(`${import.meta.env.VITE_BACKEND_URL}/day-plan`);

	// 	socket.on("webhookUpdate", (data) => {
	// 		items.value = data;
	// 	});
	// });
</script>

<style scoped lang="scss">
	@use "@/assets/styles/cards";
</style>
