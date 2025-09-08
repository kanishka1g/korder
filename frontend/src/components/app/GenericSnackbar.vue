<template>
	<div>
		<div v-for="s in snackbars" :key="s.id">
			<VSnackbar v-model="s.open" :color="s.colour" location="top">
				{{ s.message }}
				<template #actions>
					<VBtn @click="s.open = false">
						<VIcon>$close</VIcon>
					</VBtn>
				</template>
			</VSnackbar>
		</div>
	</div>
</template>

<script setup>
	import { snackbars } from "@/utils/generic_modals";
</script>
