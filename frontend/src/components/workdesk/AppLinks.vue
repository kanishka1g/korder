<template>
	<VCard color="primary" class="fill-height" variant="tonal" elevation="4" rounded="lg" density="comfortable">
		<VCardTitle class="title"> App Links </VCardTitle>
		<VCardText>
			<VRow>
				<VCol v-for="link in internalLinks" :key="link.title" cols="12" md="4">
					<VCard variant="outlined" elevation="4" rounded="lg" :href="link.route" :prepend-icon="link.icon">
						<VCardText class="subtitle text-body-1">
							<VRow>
								<VCol>
									{{ link.title }}
								</VCol>
							</VRow>
						</VCardText>
					</VCard>
				</VCol>
			</VRow>
			<VRow>
				<VCol v-for="link in externalLinks" :key="link.title" cols="12" md="6">
					<VCard
						variant="outlined"
						elevation="4"
						rounded="lg"
						:href="link.route"
						target="_blank"
						:prepend-icon="link.icon"
					>
						<VCardText class="subtitle text-body-1">
							{{ link.title }}
						</VCardText>
					</VCard>
				</VCol>
			</VRow>
		</VCardText>
	</VCard>
</template>

<script setup>
	import { internalLinks, externalLinks } from "@/utils/helpers";
</script>

<style scoped lang="scss">
	@use "@/assets/styles/variables";

	.title {
		font-family: variables.$title-font;
	}

	.subtitle {
		font-family: variables.$subtitle-font;
	}
</style>
