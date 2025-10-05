<template>
	<VCard class="modern-card pa-2 rounded-xl fill-height" elevation="4">
		<VCardTitle class="text-h6 mb-4">
			<VRow align="end">
				<VCol cols="auto">
					<VIcon icon="fas fa-server" color="primary" size="20" />
				</VCol>
				<VCol cols="auto">
					<div class="text-h6 font-weight-bold">Server Health</div>
				</VCol>
			</VRow>
		</VCardTitle>
		<VCardText>
			<VRow>
				<VCol cols="12" sm="4" v-for="(stat, index) in stats" :key="index">
					<div class="d-flex align-center mb-1">
						<VIcon :icon="stat.icon" :color="stat.color" size="20" class="mr-2" />
						<span class="text-body-2">{{ stat.label }}</span>
						<span class="ml-auto font-weight-medium">{{ stat.value }}%</span>
					</div>
					<VProgressLinear :model-value="stat.value" :color="stat.color" height="8" rounded />
				</VCol>
			</VRow>
			<VRow dense class="mt-2">
				<VCol class="d-flex align-center justify-space-between">
					<VIcon icon="fas fa-clock" size="20" color="primary" class="mr-2" />
					<span class="text-body-2">Uptime:</span>
					<span class="ml-auto font-weight-medium">{{ formatUptime(uptime) }}</span>
				</VCol>
			</VRow>
			<VRow dense class="mt-2">
				<VCol class="d-flex align-center justify-space-between">
					<VIcon icon="fas fa-upload" size="20" color="info" class="mr-2" />
					<span class="text-body-2">Upload:</span>
					<span class="ml-auto font-weight-medium">{{ network.upload }}</span>
				</VCol>
			</VRow>
			<VRow dense class="mt-2">
				<VCol class="d-flex align-center justify-space-between">
					<VIcon icon="fas fa-download" size="20" color="success" class="mr-2" />
					<span class="text-body-2">Download:</span>
					<span class="ml-auto font-weight-medium">{{ network.download }}</span>
				</VCol>
			</VRow>
			<VRow dense class="mt-2">
				<VCol class="d-flex align-center justify-space-between">
					<VIcon icon="fas fa-desktop" size="20" color="primary" class="mr-2" />
					<span class="text-body-2">OS:</span>
					<span class="ml-auto font-weight-medium">{{ os }}</span>
				</VCol>
			</VRow>
		</VCardText>
	</VCard>
</template>

<script setup>
	import { ref, computed, onMounted } from "vue";
	import { io } from "socket.io-client";
	import { defaultColors } from "@/utils/helpers";

	const cpu = ref(0);
	const ram = ref(0);
	const hdd = ref(0);
	const uptime = ref(0);
	const network = ref({ upload: "0 MB", download: "0 MB" });
	const os = ref("");

	const stats = computed(() => [
		{ label: "CPU", value: cpu.value, icon: "fas fa-microchip", color: defaultColors[0] },
		{ label: "RAM", value: ram.value, icon: "fas fa-memory", color: defaultColors[1] },
		{ label: "Disk", value: hdd.value, icon: "fas fa-hdd", color: defaultColors[2] },
	]);

	function formatUptime(seconds) {
		const d = Math.floor(seconds / (3600 * 24));
		const h = Math.floor((seconds % (3600 * 24)) / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		return `${d}d ${h}h ${m}m`;
	}

	let socket;
	onMounted(() => {
		socket = io(import.meta.env.VITE_BACKEND_URL);
		socket.on("statusUpdate", (data) => {
			cpu.value = Number(data.cpu);
			ram.value = Number(data.ram);
			hdd.value = Number(data.hdd);
			uptime.value = data.uptime;
			network.value = data.network;
			os.value = data.os;
		});
	});
</script>

<style scoped lang="scss">
	@use "@/assets/styles/cards";
</style>
