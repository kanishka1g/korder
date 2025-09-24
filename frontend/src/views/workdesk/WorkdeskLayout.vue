<template>
	<VAppBar density="compact" elevation="1">
		<VAppBarNavIcon>
			<VAppBarNavIcon @click="drawer = !drawer" />
		</VAppBarNavIcon>
		<RouterLink to="/workdesk" class="title">
			<VAppBarTitle>Korder</VAppBarTitle>
		</RouterLink>
		<template #append>
			<VBtn icon="fas fa-sign-out" variant="text" @click="handleLogout"></VBtn>
		</template>
	</VAppBar>
	<VNavigationDrawer v-model="drawer" :permanent="mdAndUp" :temporary="!mdAndUp">
		<VList>
			<VListItem
				v-for="item in internalLinks"
				:key="item.title"
				slim
				:href="item.route"
				:prepend-icon="item.icon"
				:title="item.title"
				target="_self"
			/>
		</VList>
		<VDivider color="primary" />
		<VList>
			<VListItem
				v-for="item in externalLinks"
				:key="item.title"
				slim
				:href="item.route"
				:prepend-icon="item.icon"
				:title="item.title"
				target="_blank"
			/>
		</VList>
	</VNavigationDrawer>
	<VMain>
		<VAlert v-if="alertMessage" type="error" size="small">
			{{ alertMessage }}
		</VAlert>
		<RouterView />
	</VMain>
	<VOverlay v-model="loading.isLoading.value" class="align-center justify-center" persistent>
		<VProgressCircular color="success" :size="70" :width="7" indeterminate></VProgressCircular>
	</VOverlay>
</template>

<script setup>
	import { ref } from "vue";
	import { useAuthStore } from "@/stores/auth_store";
	import { internalLinks, externalLinks } from "@/utils/helpers";
	import { useDisplay } from "vuetify";
	import { useLoading } from "@/utils/loading";
	import request from "@/utils/request";
	import { updateUser } from "@/utils/user";

	const { mdAndUp } = useDisplay();
	const loading = useLoading();
	const authStore = useAuthStore();

	const drawer = ref(mdAndUp.value);
	const alertMessage = ref(false);

	async function reload() {
		try {
			const [responseMe, responseDb] = await Promise.all([request.get("users/me"), request.get("/meta/db-info")]);
			if (responseDb.data.env === "development" && responseDb.data.dbName === "korder_prod") {
				alertMessage.value = "You are in DEV but connected to the PRODUCTION database!";
			} else if (responseDb.data.env === "production" && responseDb.data.dbName === "korder_dev") {
				alertMessage.value = `You are in PROD but connected to the DEVELOPMENT database!`;
			} else {
				alertMessage.value = null;
			}

			updateUser(responseMe.data);
		} catch (error) {
			if (error.response?.status === 404) {
				authStore.logOut();
			}
		}
	}

	reload();

	async function handleLogout() {
		loading.start();
		setTimeout(() => {
			authStore.logOut();
			loading.end();
		}, 1000);
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
