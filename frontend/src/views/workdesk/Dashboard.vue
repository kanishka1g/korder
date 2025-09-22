<template>
	<Page hide-header :error="error">
		<VRow>
			<VCol cols="12" md="6">
				<Welcome />
			</VCol>
			<VCol cols="12" md="6">
				<AppLinks />
			</VCol>
		</VRow>
	</Page>
</template>

<script setup>
	import { ref } from "vue";
	import { useNow } from "@/utils/now";

	import Welcome from "@/components/workdesk/Welcome.vue";
	import AppLinks from "@/components/workdesk/AppLinks.vue";

	const now = useNow();

	const error = ref();
</script>
