<template>
	<VCard variant="tonal" rounded="lg" class="fill-height">
		<VCardTitle class="d-flex align-center justify-space-between">
			<span class="title">Server Health</span>
		</VCardTitle>

		<VCardText>
			<VRow dense>
				<VCol cols="12" sm="4">
					<div class="d-flex align-center mb-1">
						<VIcon size="20" :color="defaultColors[0]" class="mr-2" icon="fas fa-microchip"></VIcon>
						<span class="text-body-2">CPU</span>
						<span class="ml-auto font-weight-medium">{{ cpu }}%</span>
					</div>
					<VProgressLinear :model-value="cpu" :color="defaultColors[0]" height="8" rounded />
				</VCol>

				<VCol cols="12" sm="4">
					<div class="d-flex align-center mb-1">
						<VIcon size="20" :color="defaultColors[1]" class="mr-2" icon="fas fa-memory"></VIcon>
						<span class="text-body-2">RAM</span>
						<span class="ml-auto font-weight-medium">{{ ram }}%</span>
					</div>
					<VProgressLinear :model-value="ram" :color="defaultColors[1]" height="8" rounded />
				</VCol>

				<VCol cols="12" sm="4">
					<div class="d-flex align-center mb-1">
						<VIcon size="20" :color="defaultColors[2]" class="mr-2" icon="fas fa-hdd"></VIcon>
						<span class="text-body-2">Disk</span>
						<span class="ml-auto font-weight-medium">{{ hdd }}%</span>
					</div>
					<VProgressLinear :model-value="hdd" :color="defaultColors[2]" height="8" rounded />
				</VCol>
			</VRow>

			<div class="mt-4 d-flex align-center">
				<VIcon size="20" :color="defaultColors[4]" class="mr-2" icon="fas fa-clock"></VIcon>
				<span class="text-body-2">Uptime:</span>
				<span class="ml-auto font-weight-medium">{{ formatUptime(uptime) }}</span>
			</div>
		</VCardText>
	</VCard>
</template>
<script setup>
	import { ref, onMounted, onUnmounted } from "vue";
	import { io } from "socket.io-client";
	import { defaultColors } from "@/utils/helpers";

	const cpu = ref(0);
	const ram = ref(0);
	const hdd = ref(0);
	const uptime = ref(0);

	let socket;

	function formatUptime(seconds) {
		const d = Math.floor(seconds / (3600 * 24));
		const h = Math.floor((seconds % (3600 * 24)) / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		return `${d}d ${h}h ${m}m`;
	}

	onMounted(() => {
		//TODO: do we need to create a geniric js  file like request?
		socket = io(import.meta.env.VITE_BACKEND_URL);
		socket.on("statusUpdate", (data) => {
			cpu.value = Number(data.cpu);
			ram.value = Number(data.ram);
			hdd.value = Number(data.hdd);
			uptime.value = data.uptime;
		});
	});

	onUnmounted(() => {
		if (socket) socket.disconnect();
	});
</script>
