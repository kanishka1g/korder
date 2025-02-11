<template>
	<VContainer>
		<VRow>
			<VCol cols="12" md="6">
				<Welcome />
			</VCol>
			<VCol cols="12" md="6">
				<AppLinks />
			</VCol>
		</VRow>
	</VContainer>
</template>

<script setup>
	import Welcome from "@/components/workdesk/Welcome.vue";
	import AppLinks from "@/components/workdesk/AppLinks.vue";
</script>
