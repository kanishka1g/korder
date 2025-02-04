<template>
	<VContainer class="fill-height d-flex justify-center align-center">
	  <VCard class="w-100 pa-4" elevation="10" max-width="400" rounded="lg">
		<VCardTitle class="text-center text-h5 font-weight-bold">Login</VCardTitle>
		<VCardText>
		  <VForm @submit.prevent="handleLogin">
			<VRow>
			  <VCol>
				  <VTextField
				  v-model="email"
				  label="Email"
				  type="email"
				  variant="outlined"
				  required
				  prepend-inner-icon="fa-solid fa-envelope"
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
				  />
				</VCol>
			</VRow>
			<VRow>
				<VCol>
				  <VBtn
				  type="submit"
				  color="primary"
				  block
				  :loading="loading"
				  >
				  Login
				</VBtn>
			</VCol>
		</VRow>
		  </VForm>
		</VCardText>
	  </VCard>
	</VContainer>
  </template>

  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const email = ref(null);
  const password = ref(null);
  const loading = ref(false);
  const router = useRouter();

  const handleLogin = async () => {

	if (email.value !== 'test@test.com' || password.value !== 'test') {
	  return;
	}

	loading.value = true;
	setTimeout(() => {
	  loading.value = false;
	  router.push('/dashboard');
	}, 1500);
  };

  const goToRegister = () => {
	router.push('/register');
  };
  </script>

  <style scoped lang="scss">
  .login-card {
	width: 100%;
	max-width: 400px;
	padding: 24px;
	border-radius: 12px;
  }
  </style>
