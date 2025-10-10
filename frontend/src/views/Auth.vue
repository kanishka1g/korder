<template>
	<div class="auth-container">
		<!-- Background Elements -->
		<div class="auth-background">
			<div class="bg-shape shape-1"></div>
			<div class="bg-shape shape-2"></div>
			<div class="bg-shape shape-3"></div>
		</div>

		<!-- Main Content -->
		<VContainer class="auth-content fill-height d-flex justify-center align-center">
			<div class="auth-wrapper">
				<!-- Brand Section -->
				<div class="brand-section text-center mb-8">
					<div class="brand-logo mb-4">
						<VIcon icon="fas fa-cube" size="48" color="primary" />
					</div>
					<h1 class="brand-title text-h3 font-weight-bold mb-2">Korder</h1>
					<p class="brand-subtitle text-h6 text-medium-emphasis">Welcome back! Please sign in to continue</p>
				</div>

				<!-- Login Card -->
				<VCard class="auth-card" elevation="0">
					<VCardText class="pa-8">
						<VForm ref="loginForm" @submit.prevent="handleLogin">
							<!-- Error Alert -->
							<VExpandTransition>
								<VAlert
									v-if="error"
									type="error"
									variant="tonal"
									density="comfortable"
									class="mb-6"
									closable
									@click:close="error = null"
								>
									<template #prepend>
										<VIcon icon="fas fa-exclamation-triangle" />
									</template>
									{{ error }}
								</VAlert>
							</VExpandTransition>

							<!-- Username Field -->
							<div class="form-field mb-6">
								<VTextField
									v-model="username"
									label="Username"
									variant="outlined"
									density="comfortable"
									prepend-inner-icon="fas fa-user"
									:rules="usernameRules"
									:error-messages="usernameErrors"
									class="modern-input"
									@keydown.enter="handleLogin"
								/>
							</div>

							<!-- Password Field -->
							<div class="form-field mb-8">
								<VTextField
									v-model="password"
									:type="showPassword ? 'text' : 'password'"
									label="Password"
									variant="outlined"
									density="comfortable"
									prepend-inner-icon="fas fa-lock"
									:append-inner-icon="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
									:rules="passwordRules"
									:error-messages="passwordErrors"
									class="modern-input"
									@click:append-inner="showPassword = !showPassword"
									@keydown.enter="handleLogin"
								/>
							</div>

							<!-- Login Button -->
							<VBtn
								type="submit"
								color="primary"
								variant="flat"
								size="large"
								block
								:loading="loading.isLoading.value"
								:disabled="!isFormValid"
								class="login-btn mb-4"
							>
								<template #prepend>
									<VIcon icon="fas fa-sign-in-alt" />
								</template>
								Sign In
							</VBtn>

							<!-- Additional Options -->
							<!-- <div class="auth-options text-center">
								<VBtn variant="text" size="small" color="primary" @click="showForgotPassword = true">
									Forgot Password?
								</VBtn>
							</div> -->
						</VForm>
					</VCardText>
				</VCard>

				<!-- Footer -->
				<div class="auth-footer text-center mt-6">
					<p class="text-caption text-medium-emphasis">
						© {{ new Date().getFullYear() }} Korder. All rights reserved.
					</p>
				</div>
			</div>
		</VContainer>

		<!-- Forgot Password Dialog -->
		<!-- <VDialog v-model="showForgotPassword" max-width="400">
			<VCard class="modern-modal-card" elevation="24">
				<VCardTitle class="modal-header pa-6">
					<div class="d-flex align-center">
						<VIcon icon="fas fa-key" color="primary" size="24" class="mr-3" />
						<h3 class="text-h5 font-weight-bold">Reset Password</h3>
					</div>
				</VCardTitle>

				<VDivider />

				<VCardText class="pa-6">
					<p class="text-body-1 mb-4">Enter your username and we'll help you reset your password.</p>
					<VTextField
						v-model="resetUsername"
						label="Username"
						variant="outlined"
						density="comfortable"
						prepend-inner-icon="fas fa-user"
						class="modern-input"
					/>
				</VCardText>

				<VDivider />

				<VCardActions class="pa-6">
					<VSpacer />
					<VBtn variant="text" @click="showForgotPassword = false" class="mr-3"> Cancel </VBtn>
					<VBtn color="primary" variant="flat" @click="handlePasswordReset" :loading="resetLoading">
						Send Reset Link
					</VBtn>
				</VCardActions>
			</VCard>
		</VDialog> -->
	</div>
</template>

<script setup>
	import { ref, computed } from "vue";
	import { useRouter, useRoute } from "vue-router";
	import { useAuthStore } from "@/stores/auth_store";
	import request from "@/utils/request";
	import { useLoading } from "@/utils/loading";
	import { snackbar } from "@/utils/generic_modals";

	const authStore = useAuthStore();
	const router = useRouter();
	const route = useRoute();
	const loading = useLoading();

	// Form refs and state
	const loginForm = ref(null);
	const username = ref("");
	const password = ref("");
	const error = ref(null);
	const showPassword = ref(false);
	const showForgotPassword = ref(false);
	const resetUsername = ref("");
	const resetLoading = ref(false);

	// Form validation
	const usernameRules = [
		(v) => !!v || "Username is required",
		(v) => (v && v.length >= 3) || "Username must be at least 3 characters",
	];

	const passwordRules = [
		(v) => !!v || "Password is required",
		(v) => (v && v.length >= 6) || "Password must be at least 6 characters",
	];

	const usernameErrors = computed(() => {
		if (!username.value) return [];
		return usernameRules.map((rule) => rule(username.value)).filter((result) => result !== true);
	});

	const passwordErrors = computed(() => {
		if (!password.value) return [];
		return passwordRules.map((rule) => rule(password.value)).filter((result) => result !== true);
	});

	const isFormValid = computed(() => {
		return (
			username.value && password.value && usernameErrors.value.length === 0 && passwordErrors.value.length === 0
		);
	});

	async function handleLogin() {
		if (!isFormValid.value) {
			error.value = "Please fill in all required fields correctly";
			return;
		}

		loading.start();
		error.value = null;

		try {
			const res = await request.post(
				"auth/login",
				{
					username: username.value,
					password: password.value,
				},
				{
					skipErrorSnackbar: true, // We handle errors manually in this component
				},
			);

			if (res.data) {
				authStore.logIn(res.data);
				setTimeout(() => {
					router.push(route.query.redirect || "/workdesk");
				}, 500);
			}
		} catch (err) {
			const errorMessage = err.response?.data?.message || "Invalid username or password";
			error.value = errorMessage;
		} finally {
			loading.end();
		}
	}

	async function handlePasswordReset() {
		if (!resetUsername.value) {
			snackbar.warning("Please enter your username");
			return;
		}

		resetLoading.value = true;

		try {
			await request.post("auth/forgot-password", {
				username: resetUsername.value,
			});

			snackbar.success("Password reset link sent to your email");
			showForgotPassword.value = false;
			resetUsername.value = "";
		} catch (err) {
			snackbar.error(err.response?.data?.message || "Failed to send reset link");
		} finally {
			resetLoading.value = false;
		}
	}
</script>

<style scoped lang="scss">
	.auth-container {
		min-height: 100vh;
		position: relative;
		overflow: hidden;
		background: linear-gradient(
			135deg,
			rgba(var(--v-theme-primary), 0.1) 0%,
			rgba(var(--v-theme-secondary), 0.05) 100%
		);
	}

	.auth-background {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 0;

		.bg-shape {
			position: absolute;
			border-radius: 50%;
			background: linear-gradient(
				135deg,
				rgba(var(--v-theme-primary), 0.1) 0%,
				rgba(var(--v-theme-secondary), 0.05) 100%
			);
			filter: blur(40px);
			animation: float 6s ease-in-out infinite;

			&.shape-1 {
				width: 300px;
				height: 300px;
				top: -150px;
				left: -150px;
				animation-delay: 0s;
			}

			&.shape-2 {
				width: 200px;
				height: 200px;
				top: 50%;
				right: -100px;
				animation-delay: 2s;
			}

			&.shape-3 {
				width: 250px;
				height: 250px;
				bottom: -125px;
				left: 50%;
				transform: translateX(-50%);
				animation-delay: 4s;
			}
		}
	}

	.auth-content {
		position: relative;
		z-index: 1;
	}

	.auth-wrapper {
		width: 100%;
		max-width: 420px;
	}

	.brand-section {
		.brand-logo {
			animation: pulse 2s ease-in-out infinite;
		}

		.brand-title {
			background: linear-gradient(45deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
			font-family: "Noto Serif Variable", serif;
		}

		.brand-subtitle {
			opacity: 0.8;
		}
	}

	.auth-card {
		border-radius: 24px;
		background: linear-gradient(
			135deg,
			rgba(var(--v-theme-surface), 0.95) 0%,
			rgba(var(--v-theme-surface), 0.8) 100%
		);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(var(--v-border-color), 0.12);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
		}
	}

	.form-field {
		.modern-input {
			:deep(.v-field) {
				border-radius: 16px;
				background: rgba(var(--v-theme-surface), 0.6);
				backdrop-filter: blur(10px);
				transition: all 0.3s ease;

				&:hover {
					background: rgba(var(--v-theme-surface), 0.8);
					transform: translateY(-1px);
				}

				&.v-field--focused {
					background: rgba(var(--v-theme-surface), 1);
					box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.2);
				}
			}

			:deep(.v-field__prepend-inner) {
				.v-icon {
					opacity: 0.7;
					transition: all 0.3s ease;
				}
			}

			:deep(.v-field--focused .v-field__prepend-inner .v-icon) {
				opacity: 1;
				color: rgb(var(--v-theme-primary));
			}

			:deep(.v-field__append-inner) {
				.v-icon {
					opacity: 0.6;
					cursor: pointer;
					transition: all 0.3s ease;

					&:hover {
						opacity: 1;
						color: rgb(var(--v-theme-primary));
					}
				}
			}
		}
	}

	.login-btn {
		border-radius: 16px;
		text-transform: none;
		font-weight: 600;
		font-size: 1rem;
		height: 56px;
		box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.3);
		transition: all 0.3s ease;

		&:hover:not(:disabled) {
			transform: translateY(-2px);
			box-shadow: 0 12px 32px rgba(var(--v-theme-primary), 0.4);
		}

		&:disabled {
			opacity: 0.6;
			transform: none;
			box-shadow: none;
		}

		:deep(.v-btn__prepend) {
			margin-right: 8px;
		}
	}

	.auth-options {
		:deep(.v-btn) {
			text-transform: none;
			font-weight: 500;
			border-radius: 12px;

			&:hover {
				background: rgba(var(--v-theme-primary), 0.08);
			}
		}
	}

	.auth-footer {
		opacity: 0.7;
		transition: opacity 0.3s ease;

		&:hover {
			opacity: 1;
		}
	}

	// Modern Modal Styles
	.modern-modal-card {
		border-radius: 20px;
		background: linear-gradient(
			135deg,
			rgba(var(--v-theme-surface), 0.98) 0%,
			rgba(var(--v-theme-surface), 0.95) 100%
		);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(var(--v-border-color), 0.12);

		.modal-header {
			background: linear-gradient(
				135deg,
				rgba(var(--v-theme-primary), 0.08) 0%,
				rgba(var(--v-theme-primary), 0.04) 100%
			);
			border-radius: 20px 20px 0 0;
		}

		.modern-input {
			:deep(.v-field) {
				border-radius: 12px;
			}
		}
	}

	// Theme-specific styling
	.v-theme--dark {
		.auth-container {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
		}

		.auth-card {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.8) 100%);
		}

		.bg-shape {
			background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
		}

		.modern-modal-card {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%);
		}
	}

	.v-theme--light {
		.auth-container {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.9) 100%);
		}

		.auth-card {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.8) 100%);
		}

		.bg-shape {
			background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%);
		}

		.modern-modal-card {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%);
		}
	}

	// Animations
	@keyframes float {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-20px);
		}
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
	}

	// Responsive design
	@media (max-width: 768px) {
		.auth-wrapper {
			max-width: 100%;
			padding: 0 1rem;
		}

		.auth-card {
			border-radius: 20px;
			margin: 0 0.5rem;

			.pa-8 {
				padding: 2rem !important;
			}
		}

		.brand-section {
			margin-bottom: 2rem !important;

			.brand-title {
				font-size: 2rem !important;
			}

			.brand-subtitle {
				font-size: 1rem !important;
			}
		}

		.bg-shape {
			&.shape-1 {
				width: 200px;
				height: 200px;
			}

			&.shape-2 {
				width: 150px;
				height: 150px;
			}

			&.shape-3 {
				width: 180px;
				height: 180px;
			}
		}
	}

	@media (max-width: 480px) {
		.auth-card .pa-8 {
			padding: 1.5rem !important;
		}

		.form-field {
			margin-bottom: 1.5rem !important;
		}

		.login-btn {
			height: 48px;
			font-size: 0.9rem;
		}
	}

	// Loading state animation
	.v-btn--loading {
		:deep(.v-btn__loader) {
			.v-progress-circular {
				color: white;
			}
		}
	}

	// Focus states for accessibility
	.modern-input:focus-within {
		:deep(.v-field) {
			outline: 2px solid rgba(var(--v-theme-primary), 0.5);
			outline-offset: 2px;
		}
	}

	.login-btn:focus-visible {
		outline: 2px solid rgba(var(--v-theme-primary), 0.5);
		outline-offset: 2px;
	}
</style>
