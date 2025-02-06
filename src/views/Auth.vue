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
							<VBtn type="submit" color="primary" block :loading="loading"> Login </VBtn>
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
	import { useAuthStore } from "@/stores/authStore";

	const authStore = useAuthStore();
	const router = useRouter();
	const route = useRoute();

	const username = ref(null);
	const password = ref(null);
	const loading = ref(false);
	const error = ref(null);

	async function handleLogin() {
		if (!username.value || !password.value) {
			return;
		}
		if (username.value.toLowerCase() !== "Kanishka1g".toLowerCase() || password.value !== "test") {
			error.value = "Username or password is incorrect";
			return;
		}

		loading.value = true;
		setTimeout(() => {
			loading.value = false;
			authStore.logIn();
			router.push(route.query.redirect || "/workdesk");
		}, 1500);
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
