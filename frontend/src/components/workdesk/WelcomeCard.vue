<template>
	<VCard class="modern-card pa-4 rounded-xl fill-height" elevation="4">
		<VCardText>
			<VRow align="center" class="mb-4">
				<VCol cols="auto">
					<VAvatar size="64" class="shadow-sm" variant="outlined">
						<VImg :src="userAvatar" alt="User Avatar" />
					</VAvatar>
				</VCol>
				<VCol>
					<div class="text-h6 font-weight-bold mb-1">Welcome back, {{ user.name || "Guest" }}</div>
					<div class="text-body-2 text-medium-emphasis">
						{{ user.role || "User" }}
					</div>
				</VCol>
			</VRow>

			<Transition name="fade">
				<div v-if="quoteObject" class="font-italic text-body-2 mb-4 font-weight-bold">
					<span> “{{ quoteObject.quote }}” </span>
					<div v-if="quoteObject.author" class="text-medium-emphasis">- {{ quoteObject.author }}</div>
				</div>
			</Transition>

			<VRow dense align="center" class="text-body-2">
				<VCol cols="12" sm="6" class="d-flex align-center mb-1">
					<VIcon icon="fa-regular fa-clock" color="primary" size="small" class="mr-2" />
					<DisplayDateTime :value="now" time-only />
				</VCol>

				<VCol cols="12" sm="6" class="d-flex align-center mb-1">
					<VIcon icon="fa-regular fa-calendar" color="primary" size="small" class="mr-2" />
					<DisplayDateTime :value="now" date-only long />
				</VCol>

				<VCol v-if="city && temperature" cols="12" class="d-flex align-center mt-2">
					<VIcon icon="fa-solid fa-location-dot" color="info" size="small" class="mr-2" />
					<span>{{ city }}</span>
					<VDivider class="mx-3" vertical />
					<VIcon icon="fa-solid fa-temperature-half" :color="temperatureColour" size="small" class="mr-2" />
					<span>{{ temperature }}</span>
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
			const [weather, reverse, quoteRes] = await Promise.all([
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
			() => (quoteObject.value = "Couldn’t get your location, but you’re doing great!"),
		);
	}

	reload();
</script>

<style scoped lang="scss">
	@use "@/assets/styles/cards";
</style>
