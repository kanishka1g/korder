<template>
	<VCard class="status-card pa-6 rounded-xl fill-height" elevation="8">
		<VCardTitle class="pa-0 mb-6">
			<div class="d-flex align-center">
				<VIcon icon="fas fa-server" color="primary" size="24" class="mr-3" />
				<h3 class="text-h5 font-weight-bold status-title">Server Health</h3>
			</div>
		</VCardTitle>

		<VCardText class="pa-0">
			<VRow dense class="mb-4">
				<VCol v-for="(stat, index) in stats" :key="index" cols="12" sm="4">
					<VCard variant="tonal" :color="stat.color" class="stat-card pa-4 rounded-lg" elevation="0">
						<div class="d-flex align-center justify-space-between mb-2">
							<VIcon :icon="stat.icon" :color="stat.color" size="20" />
							<VChip :color="stat.color" variant="elevated" size="small" class="font-weight-bold">
								{{ stat.value }}%
							</VChip>
						</div>
						<div class="text-body-2 font-weight-medium mb-1">{{ stat.label }}</div>
						<VProgressLinear
							:model-value="stat.value"
							:color="stat.color"
							height="6"
							rounded
							class="progress-bar"
						/>
					</VCard>
				</VCol>
			</VRow>
			<VRow dense>
				<VCol cols="12" sm="6">
					<div class="info-card d-flex align-center pa-4 rounded-lg fill-height">
						<VIcon icon="fas fa-clock" size="20" color="primary" class="mr-3" />
						<div class="flex-grow-1">
							<div class="text-caption text-medium-emphasis">System Uptime</div>
							<div class="text-body-1 font-weight-bold">{{ formatUptime(uptime) }}</div>
						</div>
					</div>
				</VCol>

				<VCol cols="12" sm="6">
					<div class="info-card d-flex align-center pa-4 rounded-lg fill-height">
						<VIcon icon="fas fa-desktop" size="20" color="primary" class="mr-3" />
						<div class="flex-grow-1">
							<div class="text-caption text-medium-emphasis">Operating System</div>
							<div class="text-body-1 font-weight-bold">{{ os || "Loading..." }}</div>
						</div>
					</div>
				</VCol>

				<VCol cols="12" sm="6">
					<div class="info-card d-flex align-center pa-4 rounded-lg">
						<VIcon icon="fas fa-upload" size="20" color="success" class="mr-3" />
						<div class="flex-grow-1">
							<div class="text-caption text-medium-emphasis">Network Upload</div>
							<div class="text-body-1 font-weight-bold">{{ network.upload }}</div>
						</div>
					</div>
				</VCol>

				<VCol cols="12" sm="6">
					<div class="info-card d-flex align-center pa-4 rounded-lg">
						<VIcon icon="fas fa-download" size="20" color="info" class="mr-3" />
						<div class="flex-grow-1">
							<div class="text-caption text-medium-emphasis">Network Download</div>
							<div class="text-body-1 font-weight-bold">{{ network.download }}</div>
						</div>
					</div>
				</VCol>
			</VRow>
		</VCardText>
	</VCard>
</template>

<script setup>
	import { ref, computed, onMounted, onUnmounted, watch } from "vue";
	import { io } from "socket.io-client";
	import { useAuthStore } from "@/stores/auth_store";

	const authStore = useAuthStore();

	const cpu = ref(0);
	const ram = ref(0);
	const hdd = ref(0);
	const uptime = ref(0);
	const network = ref({ upload: "0 MB", download: "0 MB" });
	const os = ref("");

	const stats = computed(() => [
		{ label: "CPU Usage", value: cpu.value, icon: "fas fa-microchip", color: "primary" },
		{ label: "Memory", value: ram.value, icon: "fas fa-memory", color: "success" },
		{ label: "Storage", value: hdd.value, icon: "fas fa-hdd", color: "warning" },
	]);

	function formatUptime(seconds) {
		const d = Math.floor(seconds / (3600 * 24));
		const h = Math.floor((seconds % (3600 * 24)) / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		return `${d}d ${h}h ${m}m`;
	}

	let socket;
	onMounted(() => {
		socket = io(`${import.meta.env.VITE_BACKEND_URL}/system`);

		socket.on("statusUpdate", (data) => {
			cpu.value = Number(data.cpu);
			ram.value = Number(data.ram);
			hdd.value = Number(data.hdd);
			uptime.value = data.uptime;
			network.value = data.network;
			os.value = data.os;
		});
	});

	// Cleanup function
	const cleanup = () => {
		if (socket) {
			socket.disconnect();
			socket = null;
		}
	};

	onUnmounted(cleanup);

	// Watch for logout and cleanup socket
	watch(
		() => authStore.isLoggedIn,
		(isLoggedIn) => {
			if (!isLoggedIn) {
				cleanup();
			}
		},
	);
</script>

<style scoped lang="scss">
	@use "@/assets/styles/cards";

	.status-card {
		background: linear-gradient(
			135deg,
			rgba(var(--v-theme-surface), 0.95) 0%,
			rgba(var(--v-theme-surface), 0.8) 100%
		);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(var(--v-border-color), 0.12);
		transition: all 0.3s ease;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
		}
	}

	.status-title {
		background: linear-gradient(45deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.stat-card {
		transition: all 0.3s ease;
		border: 1px solid rgba(var(--v-border-color), 0.08);

		&:hover {
			transform: translateY(-2px) scale(1.02);
			box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
		}
	}

	.progress-bar {
		border-radius: 3px;
		overflow: hidden;
	}

	.info-card {
		background: rgba(var(--v-theme-surface-variant), 0.3);
		border: 1px solid rgba(var(--v-border-color), 0.08);
		transition: all 0.3s ease;
		margin-bottom: 8px;

		&:hover {
			background: rgba(var(--v-theme-primary), 0.08);
			transform: translateY(-1px);
			border-color: rgba(var(--v-theme-primary), 0.2);
		}
	}

	// Theme-specific enhancements
	.v-theme--dark {
		.status-card {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%);
		}
	}

	.v-theme--light {
		.status-card {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
		}
	}

	// Animation for stat cards
	.stat-card {
		animation: slideInUp 0.6s ease-out;
	}

	@keyframes slideInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
