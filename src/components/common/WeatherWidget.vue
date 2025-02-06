<template>
	<div
		ref="widgetContainer"
		class="tomorrow"
		data-location-id=""
		data-language="EN"
		data-unit-system="METRIC"
		data-skin="dark"
		data-widget-type="summary"
		style=""
	/>
</template>

<script setup>
	import { onMounted, ref } from "vue";

	onMounted(() => {
		if (!document.getElementById("tomorrow-sdk")) {
			const script = document.createElement("script");
			script.id = "tomorrow-sdk";
			script.src = "https://www.tomorrow.io/v1/widget/sdk/sdk.bundle.min.js";
			script.onload = () => {
				if (window.__TOMORROW__) {
					window.__TOMORROW__.renderWidget();
				}
			};
			document.body.appendChild(script);
		} else {
			if (window.__TOMORROW__) {
				window.__TOMORROW__.renderWidget();
			}
		}
	});
</script>

<style scoped>
	:deep(a) {
		border-radius: 0px !important;
	}
</style>
