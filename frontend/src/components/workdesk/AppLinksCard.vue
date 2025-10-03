<template>
	<VCard variant="tonal" rounded="lg">
		<!-- TODO: rename it to QuickLinks ?? if yes file name change -->
		<VCardTitle class="title d-flex align-center"> App Links </VCardTitle>
		<VCardText>
			<VRow>
				<VCol v-for="(link, index) in internalLinks" :key="link.title" cols="12" md="6">
					<VCard
						:color="defaultColors[index]"
						variant="flat"
						rounded="lg"
						:href="link.route"
						:prepend-icon="link.icon"
					>
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
				<VCol v-for="(link, index) in externalLinks" :key="link.title" cols="12" md="6">
					<VCard
						variant="flat"
						rounded="lg"
						:href="link.route"
						target="_blank"
						:prepend-icon="link.icon"
						append-icon="fa-solid fa-arrow-up-right-from-square"
						:color="defaultColors[index + internalLinks.length]"
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
	import { internalLinks, externalLinks, defaultColors } from "@/utils/helpers";
</script>

<style scoped lang="scss">
	@use "@/assets/styles/variables";

	.title {
		font-family: variables.$title-font;
		font-size: 21px;
	}

	.subtitle {
		font-family: variables.$subtitle-font;
	}
</style>
