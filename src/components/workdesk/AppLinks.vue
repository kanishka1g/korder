<template>
	<VCard class="card fill-height" variant="tonal" elevation="4" rounded="lg" density="comfortable">
		<VCardTitle class="title"> App Links </VCardTitle>
		<VCardText>
			<VRow>
				<VCol v-for="item in appLinks" :key="item.title" cols="12" md="6">
					<VCard
						variant="outlined"
						elevation="4"
						rounded="lg"
						:href="item.route"
						:target="item.isExternalLink ? '_blank' : '_self'"
						:prepend-icon="item.icon"
					>
						<VCardText class="subtitle text-body-1">
							{{ item.title }}
						</VCardText>
					</VCard>
				</VCol>
			</VRow>
		</VCardText>
	</VCard>
</template>

<script setup>
	import { appLinks } from "@/utils/helpers";
</script>

<style scoped lang="scss">
	@use "@/assets/styles/variables";

	.card {
		background: variables.$card-color;
	}

	.title {
		font-family: variables.$title-font;
	}

	.subtitle {
		font-family: variables.$subtitle-font;
	}
</style>
