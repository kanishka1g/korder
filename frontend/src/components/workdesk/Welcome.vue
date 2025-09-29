<template>
	<VCard variant="tonal" rounded="lg">
		<VCardTitle class="d-flex align-center mb-3 text-wrap">
			<VAvatar variant="outlined" size="48" class="me-3">
				<img src="https://i.pravatar.cc/48" />
			</VAvatar>
			<div class="d-flex flex-column">
				<div class="text-h6 font-weight-bold title">Welcome, {{ user.name }} ({{ user.role }})</div>
				<div class="text-body-1 subtitle">{{ quote }}</div>
			</div>
		</VCardTitle>

		<VCardText>
			<VRow dense>
				<VCol cols="auto">
					<VIcon icon="fas fa-clock" color="warning" size="small"></VIcon>
				</VCol>
				<VCol cols="auto">
					<span class="time-text">{{ now.format(displayTimeFormat) }}</span>
				</VCol>
			</VRow>
			<VRow dense>
				<VCol cols="auto">
					<VIcon icon="fas fa-calendar-day" color="success" size="small"></VIcon>
				</VCol>
				<VCol cols="auto">
					<span>{{ formattedDate }}</span>
				</VCol>
			</VRow>
			<VRow v-if="temperature && city" dense>
				<VCol cols="auto">
					<VIcon icon="fa-solid fa-location-dot" color="warning" size="small"></VIcon>
				</VCol>
				<VCol cols="auto">
					<span>{{ city }}</span>
				</VCol>
				<VDivider class="mx-2" vertical inset opacity="100"></VDivider>
				<VCol cols="auto">
					<VIcon icon="fa-solid fa-temperature-half" :color="temperatureColour" size="small"></VIcon>
				</VCol>
				<VCol cols="auto">
					<span>{{ temperature }}</span>
				</VCol>
			</VRow>
		</VCardText>
	</VCard>
</template>

<script setup>
	import { ref, computed } from "vue";
	import { useNow } from "@/utils/now";
	import { displayTimeFormat, displayLongDateTimeFormat } from "@/utils/time";
	import { useUser } from "@/utils/user";
	import { useLogger } from "@/utils/useLogger";
	import { snackbar } from "@/utils/generic_modals";
	import { useLoading } from "@/utils/loading";

	const now = useNow();
	const user = useUser();
	const logger = useLogger();
	const loading = useLoading();

	const temperature = ref();
	const city = ref();
	const quote = ref();

	const formattedDate = computed(() => {
		return now.value.format(displayLongDateTimeFormat);
	});

	const temperatureColour = computed(() => {
		const temp = parseInt(temperature.value);

		if (temp < 18) {
			return "info";
		} else if (temp < 30) {
			return "warning";
		} else {
			return "error";
		}
	});

	async function fetchTemperatureAndCity(position) {
		loading.start();
		const { latitude, longitude } = position.coords;
		try {
			const [weatherResponse, cityResponse, quoteResponse] = await Promise.all([
				fetch(
					`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
				),
				fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`),
				fetch("https://api.devexcus.es/"),
			]);
			const weatherData = await weatherResponse.json();
			temperature.value = `${Math.round(weatherData.current_weather.temperature)}°C`;

			const cityData = await cityResponse.json();
			city.value = cityData.address.suburb || cityData.address.city || "Unknown Location";
			const quoteData = await quoteResponse.json();
			quote.value = quoteData.text;
		} catch (error) {
			logger.error(error);
		} finally {
			loading.end();
		}
	}

	function reload() {
		if (!("geolocation" in navigator)) {
			snackbar.warning("Geolocation is not supported.");
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => fetchTemperatureAndCity(position),
			(error) => {
				logger.warning(error.message, error);
			},
		);
	}

	reload();
</script>

<style scoped lang="scss">
	@use "@/assets/styles/variables";

	.title {
		font-family: variables.$title-font;
		font-size: 21px;
	}

	.subtitle {
		font-family: variables.$subtitle-font;
	}
</style>
