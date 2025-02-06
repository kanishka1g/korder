<template>
	<VContainer>
		<VRow>
			<VCol cols="12" md="6">
				<WeatherWidget />
			</VCol>
			<VCol cols="12" md="6">
				<ClockWidget />
			</VCol>
		</VRow>
	</VContainer>
</template>

<script setup>
	import WeatherWidget from "@/components/common/WeatherWidget.vue";
    import ClockWidget from "@/components/common/ClockWidget.vue";
</script>
