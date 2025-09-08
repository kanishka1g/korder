<template>
	<VApp theme="dark">
		<VMain class="pa-4" style="background-color: #1e1e1e; min-height: 100vh">
			<RouterView />
			<GenericSnackbar />
		</VMain>
	</VApp>
</template>

<script setup>
	import { RouterView } from "vue-router";

	import GenericSnackbar from "./components/app/GenericSnackbar.vue";
</script>
