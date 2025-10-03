<template>
	<VAppBar density="compact" elevation="2" color="secondary">
		<VAppBarNavIcon>
			<VAppBarNavIcon @click="drawer = !drawer" />
		</VAppBarNavIcon>
		<RouterLink to="/workdesk" class="title">
			<VAppBarTitle>Korder</VAppBarTitle>
		</RouterLink>
		<template #append>
			<!-- TODO: find out a proper way to do this -->
			<VBtn v-if="isProd" icon="fas fa-download" variant="text" class="mr-2" @click="handleUpdate"></VBtn>
			<VBtn icon="fas fa-sign-out" variant="text" @click="handleLogout"></VBtn>
		</template>
	</VAppBar>
	<VNavigationDrawer v-model="drawer" :permanent="mdAndUp" :temporary="!mdAndUp" color="secondary">
		<VList density="compact" class="mb-4">
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
		<VDivider color="warning" opacity="100" />
		<VList density="compact">
			<VListItem
				v-for="item in externalLinks"
				:key="item.title"
				slim
				:href="item.route"
				:prepend-icon="item.icon"
				:title="item.title"
				target="_blank"
			>
				<template #append>
					<VIcon icon="fas fa-arrow-up-right-from-square" size="x-small"></VIcon>
				</template>
			</VListItem>
		</VList>
	</VNavigationDrawer>
	<VMain>
		<VAlert v-if="connectedDB" type="warning" size="small">
			you are connected to the
			<span class="font-weight-black"> {{ connectedDB }} </span>
			database
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
	import { confirmation } from "@/utils/generic_modals";

	const { mdAndUp } = useDisplay();
	const loading = useLoading();
	const authStore = useAuthStore();

	const isProd = import.meta.env.MODE === "production";

	const drawer = ref(mdAndUp.value);
	const connectedDB = ref();

	async function reload() {
		try {
			const [responseMe, responseConnectedDB] = await Promise.all([
				request.get("users/me"),
				request.get("/meta/verify"),
			]);

			connectedDB.value = responseConnectedDB.data;
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

	async function handleUpdate() {
		const confirmed = await confirmation("Confirm", "Are you sure you want to start an update?");

		if (!confirmed) {
			return;
		}

		await request.post("/meta/deploy");
		handleLogout();
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
