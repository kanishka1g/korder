<template>
	<VCard class="modern-card pa-4 rounded-xl fill-height" elevation="4">
		<VCardTitle class="text-h6 mb-4">
			<VRow align="end">
				<VCol cols="auto">
					<VIcon icon="fas fa-calendar" color="primary" size="20" />
				</VCol>
				<VCol cols="auto" class="text-h6 font-weight-bold"> Day Plan </VCol>
				<VCol cols="auto" class="ml-auto">
					<VBtn
						color="primary"
						variant="text"
						size="small"
						prepend-icon="fas fa-refresh"
						@click="handleRefreshDayPlan"
					>
						Refresh
					</VBtn>
				</VCol>
			</VRow>
		</VCardTitle>
		<VCardText>
			<VRow class="g-6 pa-4">
				<VCol v-for="(item, index) in items" :key="item.date" cols="12" md="6">
					<VCard
						class="modern-card transition-all duration-300 hover:scale-[1.02] hover:shadow-lg fill-height"
						:color="defaultColors[index]"
						variant="tonal"
						rounded="xl"
						elevation="6"
					>
						<VCardTitle class="text-h6 text-white font-weight-bold mb-1">
							<DisplayDateTime :value="parseDate(item.date)" date-only />
						</VCardTitle>

						<VCardText class="pt-1">
							<TransitionGroup name="fade" tag="div">
								<VRow
									v-for="(task, i) in limitedTasks(item)"
									:key="task.title + i"
									dense
									class="align-center mb-1"
								>
									<!-- TODO: Add icon regards of task or event -->
									<VCol cols="9" class="text-white text-body-2">
										<VIcon
											:icon="task.source === 'TASK' ? 'fas fa-list-check' : 'fas fa-calendar'"
											color="white"
											size="small"
											class="mr-2"
										/>

										{{ task.title }}
									</VCol>
									<VCol cols="3" class="text-white text-right text-caption">
										{{ task.time }}
									</VCol>
									<VDivider
										v-if="i !== limitedTasks(item).length - 1"
										class="my-2"
										color="white"
										opacity="30"
									/>
								</VRow>
							</TransitionGroup>

							<VRow class="mt-2" v-if="item.items.length > 5">
								<VCol class="text-center">
									<VBtn
										@click="item.showAll = !item.showAll"
										variant="text"
										class="text-white text-caption font-weight-medium hover:bg-white/10"
										append-icon="fas fa-chevron-down"
										:class="{ 'rotate-180': item.showAll }"
									>
										{{ item?.showAll ? "Show Less" : "Show All" }}
									</VBtn>
								</VCol>
							</VRow>
						</VCardText>
					</VCard>
				</VCol>
			</VRow>
		</VCardText>
	</VCard>
</template>

<script setup>
	import { ref } from "vue";
	import { parseDate } from "@/utils/time";
	import { defaultColors } from "@/utils/helpers";
	import request from "@/utils/request";
	import { snackbar } from "@/utils/generic_modals";

	import DisplayDateTime from "../common/DisplayDateTime.vue";

	const items = ref([]);

	async function reload() {
		const response = await request.get("workdesk/day-plan", { timeout: 60000 });
		items.value = response.data;
	}

	reload();

	async function handleRefreshDayPlan() {
		const response = await request.request({
			url: "workdesk/day-plan/refresh",
			method: "post",
			timeout: 60000,
		});
		items.value = response.data.plan;
		snackbar.success(response.data.message);
	}

	function limitedTasks(item) {
		return item?.showAll ? item.items : item.items.slice(0, 5);
	}
</script>

<style scoped lang="scss">
	@use "@/assets/styles/cards";

	.modern-card {
		backdrop-filter: blur(10px);
		background: linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.05));
		border: 1px solid rgba(255, 255, 255, 0.1);
		transition: all 0.3s ease;
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.3s;
	}
	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}
</style>
