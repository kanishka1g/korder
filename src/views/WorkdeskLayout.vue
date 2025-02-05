<template>
	<VAppBar density="compact" elevation="1">
		<VAppBarNavIcon>
			<VAppBarNavIcon @click="drawer = !drawer" />
		</VAppBarNavIcon>
		<RouterLink to="/" class="title">
			<VAppBarTitle>Korder</VAppBarTitle>
		</RouterLink>
		<template #append>
			<VBtn icon="fas fa-sign-out" variant="text" @click="handleLogout"></VBtn>
		</template>
	</VAppBar>
</template>

<script setup>
	import {  ref } from "vue";
	import { useAuthStore } from "@/stores/authStore";
	import { useRouter, useRoute } from "vue-router";

	const router = useRouter();
	const route = useRoute();

	const authStore = useAuthStore();

	const drawer = ref(false);
	const loading = ref(false);

	async function handleLogout() {
		loading.value = true;
		setTimeout(() => {
			loading.value = false;
			authStore.logOut();
			router.push("/");
		}, 1500);
	}
</script>

<style scoped>
	.title {
		color: inherit;
		text-decoration: none;
		font-family: "Noto Serif", serif;
	}
</style>
