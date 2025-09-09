<template>
	<VContainer class="fill-height d-flex justify-center align-center">
		<VCard class="w-100 pa-4" elevation="10" max-width="400" rounded="lg">
			<VCardTitle class="text-center text-h5 font-weight-bold title">Login</VCardTitle>
			<VCardText>
				<VForm @submit.prevent="handleLogin">
					<VRow>
						<VCol>
							<VAlert v-if="error" type="error" variant="tonal" density="compact"> {{ error }} </VAlert>
						</VCol>
					</VRow>
					<VRow>
						<VCol>
							<VTextField
								v-model="username"
								label="Username"
								variant="outlined"
								required
								prepend-inner-icon="fa-solid fa-user"
								:rules="[(v) => !!v || 'Username is required']"
							/>
						</VCol>
					</VRow>
					<VRow>
						<VCol>
							<VTextField
								v-model="password"
								label="Password"
								type="password"
								variant="outlined"
								required
								prepend-inner-icon="fa-solid fa-lock"
								:rules="[(v) => !!v || 'Password is required']"
							/>
						</VCol>
					</VRow>
					<VRow>
						<VCol>
							<VBtn type="submit" color="primary" block :loading="loading.isLoading.value"> Login </VBtn>
						</VCol>
					</VRow>
				</VForm>
			</VCardText>
		</VCard>
	</VContainer>
</template>

<script setup>
	import { ref } from "vue";
	import { useRouter, useRoute } from "vue-router";
	import { useAuthStore } from "@/stores/auth_store";
	import api from "@/services/api";
	import { useLogger } from "@/utils/useLogger";
	import { useLoading } from "@/utils/useLoading";

	const authStore = useAuthStore();
	const router = useRouter();
	const route = useRoute();
	const loading = useLoading();

	const username = ref("kanishka1g");
	const password = ref("test");
	const error = ref(null);

	async function handleLogin() {
		if (!username.value || !password.value) {
			return;
		}

		loading.start();

		try {
			const res = await api.post("api/auth/login", {
				username: username.value,
				password: password.value,
			});

			if (res.data.token) {
				authStore.logIn(res.data.token);
				router.push(route.query.redirect || "/workdesk");
			}
		} finally {
			loading.end();
		}
	}
</script>

<style scoped lang="scss">
	@use "@/assets/styles/variables";

	.login-card {
		width: 100%;
		max-width: 400px;
		padding: 24px;
		border-radius: 12px;
	}

	.title {
		color: inherit;
		text-decoration: none;
		font-family: variables.$title-font;
	}
</style>
