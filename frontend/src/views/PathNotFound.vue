<template>
	<VApp>
		<VMain class="error-page text-center container">
			<h1 class="font-weight-bold mt-4 text-error">404</h1>
			<p class="mb-4 text-subtitle-1">Oops! The page you're looking for doesn't exist.</p>
			<VBtn color="primary" href="/workdesk" variant="outlined"> Go to workdesk </VBtn>
		</VMain>
	</VApp>
</template>

<style scoped>
	.error-page {
		background-color: #f9f9f9;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.text-error {
		color: #e74c3c;
		font-size: 5rem;
	}

	.text-subtitle-1 {
		color: #7f8c8d;
		font-size: 1.5rem;
	}

	.error-icon {
		font-size: 3rem;
		color: #e74c3c;
		margin-top: 20px;
	}
</style>
