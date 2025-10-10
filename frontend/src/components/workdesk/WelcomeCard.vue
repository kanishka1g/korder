<template>
	<VCard class="welcome-card pa-6 rounded-xl fill-height" elevation="8">
		<VCardText class="pa-0">
			<!-- Header Section -->
			<div class="d-flex align-center mb-6">
				<VAvatar size="72" class="welcome-avatar mr-4" variant="outlined">
					<VImg :src="userAvatar" alt="User Avatar" />
				</VAvatar>
				<div class="flex-grow-1">
					<h2 class="text-h5 font-weight-bold mb-1 welcome-title">
						Welcome back, {{ user.name || "Guest" }}
					</h2>
					<div class="text-body-1 text-medium-emphasis">
						{{ user.role || "User" }}
					</div>
				</div>
			</div>

			<Transition name="fade">
				<VCard v-if="quoteObject" variant="tonal" color="primary" class="quote-card mb-6" rounded="lg">
					<VCardText>
						<div class="text-medium-emphasis text-body-1 mb-2">"{{ quoteObject.quote }}"</div>
						<div v-if="quoteObject.author" class="text-body-2 text-medium-emphasis text-right">
							— {{ quoteObject.author }}
						</div>
					</VCardText>
				</VCard>
			</Transition>

			<VRow dense class="info-grid">
				<VCol cols="12" sm="6">
					<div class="info-item d-flex align-center pa-3 rounded-lg fill-height">
						<VIcon icon="fas fa-clock" color="primary" size="20" class="mr-3" />
						<div>
							<div class="text-caption text-medium-emphasis">Current Time</div>
							<div class="text-body-1 font-weight-medium">
								<DisplayDateTime :value="now" time-only />
							</div>
						</div>
					</div>
				</VCol>

				<VCol cols="12" sm="6">
					<div class="info-item d-flex align-center pa-3 rounded-lg fill-height">
						<VIcon icon="fas fa-calendar" color="primary" size="20" class="mr-3" />
						<div>
							<div class="text-caption text-medium-emphasis">Today</div>
							<div class="text-body-1 font-weight-medium">
								<DisplayDateTime :value="now" date-only long />
							</div>
						</div>
					</div>
				</VCol>

				<VCol v-if="city && temperature" cols="12">
					<div class="info-item d-flex align-center pa-3 rounded-lg">
						<VIcon icon="fas fa-map-marker-alt" color="info" size="20" class="mr-3" />
						<div class="flex-grow-1">
							<div class="text-caption text-medium-emphasis">Location & Weather</div>
							<div class="d-flex align-center">
								<span class="text-body-1 font-weight-medium mr-3">{{ city }}</span>
								<VChip
									:color="temperatureColour"
									variant="tonal"
									size="small"
									prepend-icon="fas fa-thermometer-half"
								>
									{{ temperature }}
								</VChip>
							</div>
						</div>
					</div>
				</VCol>
			</VRow>
		</VCardText>
	</VCard>
</template>

<script setup>
	import { ref, computed } from "vue";
	import DisplayDateTime from "../common/DisplayDateTime.vue";
	import { useNow } from "@/utils/now";
	import { useUser } from "@/utils/user";

	const now = useNow();
	const user = useUser();
	const userAvatar = `https://robohash.org/random-${Math.random()}.png?size=460x460`;

	const temperature = ref();
	const city = ref();
	const quoteObject = ref();

	const temperatureColour = computed(() => {
		const temp = parseInt(temperature.value);
		if (temp < 18) return "info";
		if (temp < 30) return "warning";
		return "error";
	});

	async function fetchInfo(lat, lon) {
		try {
			const [weather, reverse, quoteRes, n8n] = await Promise.all([
				fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`),
				fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`),
				fetch(`https://motivational-spark-api.vercel.app/api/quotes/random`),
			]);

			const weatherData = await weather.json();
			const reverseData = await reverse.json();

			temperature.value = `${Math.round(weatherData.current_weather.temperature)}°C`;
			city.value = reverseData.address.suburb || reverseData.address.city || "Unknown";
			quoteObject.value = await quoteRes.json();
		} catch {
			quoteObject.value = { quote: "Keep pushing forward, one line at a time.", author: "Unknown" };
		}
	}

	function reload() {
		if (!("geolocation" in navigator)) return;
		navigator.geolocation.getCurrentPosition(
			(pos) => fetchInfo(pos.coords.latitude, pos.coords.longitude),
			() => (quoteObject.value = "Couldn't get your location, but you're doing great!"),
		);
	}

	reload();
</script>

<style scoped lang="scss">
	@use "@/assets/styles/cards";

	.welcome-card {
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

	.welcome-avatar {
		border: 3px solid rgba(var(--v-theme-primary), 0.2);
		transition: all 0.3s ease;

		&:hover {
			border-color: rgba(var(--v-theme-primary), 0.5);
			transform: scale(1.05);
		}
	}

	.welcome-title {
		background: linear-gradient(45deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.quote-card {
		border-left: 4px solid rgb(var(--v-theme-primary));
		transition: all 0.3s ease;

		&:hover {
			transform: translateX(4px);
		}
	}

	.info-item {
		background: rgba(var(--v-theme-surface-variant), 0.3);
		border: 1px solid rgba(var(--v-border-color), 0.08);
		transition: all 0.3s ease;

		&:hover {
			background: rgba(var(--v-theme-primary), 0.08);
			transform: translateY(-1px);
		}
	}

	.info-grid {
		.v-col {
			margin-bottom: 8px;
		}
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: all 0.5s ease;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
		transform: translateY(10px);
	}

	// Theme-specific enhancements
	.v-theme--dark {
		.welcome-card {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%);
		}
	}

	.v-theme--light {
		.welcome-card {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
		}
	}
</style>
