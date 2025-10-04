<template>
	<VCard class="modern-card pa-2 rounded-xl" elevation="4">
		<VCardTitle class="text-h6 mb-4">
			<VRow align="end">
				<VCol cols="auto">
					<VIcon icon="fas fa-link" color="primary" size="20" />
				</VCol>
				<VCol cols="auto">
					<div class="text-h6 font-weight-bold">Quick Links</div>
				</VCol>
			</VRow>
		</VCardTitle>
		<VCardText>
			<VRow dense class="mb-3">
				<VCol v-for="(link, index) in internalLinks" :key="link.title" cols="12" md="6">
					<VCard
						:color="defaultColors[index]"
						variant="tonal"
						rounded="lg"
						class="hover-card pa-3"
						:href="link.route"
					>
						<div class="d-flex align-center">
							<VIcon :icon="link.icon" class="mr-3" color="white" />
							<span class="text-body-2 font-weight-medium text-white">{{ link.title }}</span>
						</div>
					</VCard>
				</VCol>
			</VRow>
			<VRow dense>
				<VCol v-for="(link, index) in externalLinks" :key="link.title" cols="12" md="6">
					<VCard
						:color="defaultColors[index + internalLinks.length]"
						variant="tonal"
						rounded="lg"
						class="hover-card pa-3 text-decoration-none"
						:href="link.route"
						target="_blank"
					>
						<div class="d-flex align-center justify-space-between">
							<div class="d-flex align-center">
								<VIcon :icon="link.icon" class="mr-3" color="white" />
								<span class="text-body-2 font-weight-medium text-white">{{ link.title }}</span>
							</div>
							<VIcon icon="fa-solid fa-arrow-up-right-from-square" size="16" />
						</div>
					</VCard>
				</VCol>
			</VRow>
		</VCardText>
	</VCard>
</template>

<script setup>
	import { internalLinks, externalLinks, defaultColors } from "@/utils/helpers";
</script>

<style scoped lang="scss">
	@use "@/assets/styles/cards";
</style>
