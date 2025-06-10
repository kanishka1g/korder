<template>
	<VCard class="welcome-card pb-3 fill-height" variant="tonal" elevation="4" rounded="lg" density="comfortable">
		<VCardTitle class="d-flex align-center mb-3 text-wrap">
			<VAvatar variant="outlined" size="48" class="me-3">
				<img src="https://i.pravatar.cc/48" />
			</VAvatar>
			<div class="d-flex flex-column">
				<div class="text-h6 font-weight-bold title">Welcome, Korder</div>
				<div class="text-body-1 subtitle">{{ quote }}</div>
			</div>
		</VCardTitle>

		<VCardText>
			<VRow dense>
				<VCol cols="auto">
					<VIcon icon="fas fa-clock" color="#fbc02d" size="small"></VIcon>
				</VCol>
				<VCol cols="auto">
					<span class="time-text">{{ now.format(displayTimeFormat) }}</span>
				</VCol>
			</VRow>
			<VRow dense>
				<VCol cols="auto">
					<VIcon icon="fas fa-calendar-day" color="#8bc34a" size="small"></VIcon>
				</VCol>
				<VCol cols="auto">
					<span>{{ formattedDate }}</span>
				</VCol>
			</VRow>
			<VRow v-if="temperature && city" dense>
				<VCol cols="auto">
					<VIcon icon="fa-solid fa-location-dot" color="#ffeb3b" size="small"></VIcon>
				</VCol>
				<VCol cols="auto">
					<span>{{ city }}</span>
				</VCol>
				<VDivider class="border-opacity-50 mx-2" vertical inset></VDivider>
				<VCol cols="auto">
					<VIcon icon="fa-solid fa-temperature-half" color="#e91e63" size="small"></VIcon>
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
	import { VCard, VCardTitle, VCardText } from "vuetify/components";
	import { useNow } from "@/utils/now";
	import { displayTimeFormat, displayLongDateTimeFormat } from "@/utils/time";

	const now = useNow();
	const temperature = ref();
	const city = ref();
	const quote = ref();

	const formattedDate = computed(() => {
		return now.value.format(displayLongDateTimeFormat);
	});

	async function fetchTemperatureAndCity(position) {
		const { latitude, longitude } = position.coords;
		console.log(Math.floor(Math.random() * 10) + 1);
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
			console.error(error); // TODO: snackbar error
			throw error;
		}
	}

	function reload() {
		if (!("geolocation" in navigator)) {
			console.warn("Geolocation is not supported.");
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => fetchTemperatureAndCity(position),
			(error) => {
				// TODO: snackbar
				console.warn("Location access denied.", error);
			},
		);
	}

	reload();
</script>

<style scoped lang="scss">
	@use "@/assets/styles/variables";
	.welcome-card {
		background: variables.$card-color;
	}

	.title {
		font-family: variables.$title-font;
	}

	.subtitle {
		font-family: variables.$subtitle-font;
	}
</style>
