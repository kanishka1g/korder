<template>
	<VApp>
		<VMain class="pa-4" style="background-color: #1e1e1e; min-height: 100vh">
			<RouterView />
			<GenericSnackbar />
			<GenericConfirmation />
		</VMain>
	</VApp>
</template>

<script setup>
	import { RouterView } from "vue-router";

	import GenericSnackbar from "./components/app/GenericSnackbar.vue";
	import GenericConfirmation from "./components/app/GenericConfirmation.vue";
</script>
