<template>
	<VContainer>
		<VCard class="card fill-height mt-3" variant="tonal" elevation="4" rounded="lg" density="comfortable">
			<VCardTitle>
				<VRow justify="end">
					<VCol>
						<div class="d-flex align-center gap-2 text-wrap">
							<VIcon icon="fas fa-calendar-day" size="small" />
							<span class="title text-h5 font-weight-bold ml-5">Day Planner</span>
						</div>
					</VCol>
					<VCol cols="auto">
						<VBtn
							prepend-icon="fa-solid fa-pencil"
							color="primary"
							variant="outlined"
							@click="handleChangePlan"
						>
							Change Plan
						</VBtn>
					</VCol>
				</VRow>
			</VCardTitle>
			<VCardText>
				<div v-for="plan in plans" :key="plan.id">
					<div class="d-flex align-center">
						<VIcon icon="fas fa-calendar-day" size="small" />
						<span class="title text-h5 font-weight-bold ml-5">{{ plan.title }}</span>
					</div>
					<div class="d-flex align-center">
						<VIcon icon="fas fa-clock" size="small" />
						<span class="title text-h5 font-weight-bold ml-5"
							>{{ plan.startTime }} - {{ plan.endTime }}</span
						>
					</div>
				</div>
			</VCardText>
		</VCard>
	</VContainer>
</template>

<script setup>
	import { ref } from "vue";
	import dayjs from "@/plugins/dayjs";

	const plans = ref([
		{
			id: 1,
			title: "Plan 1",
			startTime: "08:00",
			endTime: "09:00",
		},
		{
			id: 2,
			title: "Plan 2",
			startTime: "09:00",
			endTime: "10:00",
		},
		{
			id: 3,
			title: "Plan 3",
			startTime: "10:00",
			endTime: "11:00",
		},
	]);
	function handleChangePlan() {}
</script>
