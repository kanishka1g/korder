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
		<RouterView />
	</VMain>
	<VOverlay v-model="loading.isLoading.value" class="align-center justify-center" persistent>
		<VProgressCircular color="success" :size="70" :width="7" indeterminate></VProgressCircular>
	</VOverlay>
</template>

<script setup>
	import { ref } from "vue";
	import { useAuthStore } from "@/stores/auth_store";
	import { useRouter } from "vue-router";
	import { internalLinks, externalLinks } from "@/utils/helpers";
	import { useDisplay } from "vuetify";
	import { useLoading } from "@/utils/loading";
	import request from "@/utils/request";
	import { updateUser } from "@/utils/user";

	const { mdAndUp } = useDisplay();
	const loading = useLoading();
	const router = useRouter();
	const authStore = useAuthStore();

	const drawer = ref(mdAndUp.value);

	async function reload() {
		const response = await request.get("users/me");
		updateUser(response.data);
	}

	reload();

	async function handleLogout() {
		loading.start();
		setTimeout(() => {
			authStore.logOut();
			// router.push("/");
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
