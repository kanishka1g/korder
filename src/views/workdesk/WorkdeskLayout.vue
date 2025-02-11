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
	<VNavigationDrawer v-model="drawer" :permanent="mdAndUp">
		<VList>
			<template v-for="item in appLinks" :key="item.title">
				<VListItem
					slim
					:href="item.route"
					:prepend-icon="item.icon"
					:title="item.title"
					:target="item.isExternalLink ? '_blank' : '_self'"
				/>
			</template>
		</VList>
	</VNavigationDrawer>
	<VMain>
		<RouterView />
		<!-- Loads internal pages here -->
	</VMain>
	<VOverlay v-model="loading" class="align-center justify-center" persistent>
		<VProgressCircular color="success" :size="70" :width="7" indeterminate></VProgressCircular>
	</VOverlay>
</template>

<script setup>
	import { ref } from "vue";
	import { useAuthStore } from "@/stores/authStore";
	import { useRouter, useRoute } from "vue-router";
	import { domain, appLinks } from "@/utils/helpers";
	import { useDisplay } from "vuetify";

	const { mdAndUp } = useDisplay();

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

<style scoped lang="scss">
	@use "@/assets/styles/variables";

	.title {
		color: inherit;
		text-decoration: none;
		font-family: variables.$subtitle-font;
	}
</style>
