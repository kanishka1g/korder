<template>
	<VDataTable v-if="$vuetify.display.mdAndUp" :headers="computedHeaders" :items="items" hide-default-footer>
		<template #item.actions="{ item }">
			<slot name="actions" :item="item"></slot>
		</template>
		<template v-for="slotName in itemSlots" #[slotName]="slotProps" :key="slotName">
			<slot :name="slotName" v-bind="slotProps"></slot>
		</template>
	</VDataTable>
	<VRow v-for="item in items" v-else :key="item.id" dense>
		<VCol>
			<VCard class="mb-2">
				<VCardText>
					<VRow v-for="header in headers" :key="header.value" dense>
						<VCol cols="4" class="text-medium-emphasis">
							{{ header.title }}
						</VCol>
						<VCol cols="8">
							<slot v-if="slots[`item.${header.key}`]" :name="`item.${header.key}`" :item="item" />
							<span v-else>
								{{ item[header.key] }}
							</span>
						</VCol>
					</VRow>
				</VCardText>
				<VCardActions>
					<VRow justify="end" dense>
						<VCol cols="auto">
							<slot name="actions" :item="item"></slot>
						</VCol>
					</VRow>
				</VCardActions>
			</VCard>
		</VCol>
	</VRow>
	<VRow v-if="!items.length">
		<VCol>
			<div class="text-medium-emphasis text-caption">{{ noItemsText }}</div>
		</VCol>
	</VRow>
</template>

<script setup>
	import { computed, useSlots } from "vue";
	const slots = useSlots();
	const props = defineProps({
		items: {
			type: Array,
			required: true,
		},
		headers: {
			type: Array,
			required: true,
		},
		noItemsText: {
			type: String,
			default: "No items found in table",
		},
	});

	const itemSlots = computed(() =>
		Object.keys(slots).filter((name) => name.startsWith("item.") && name !== "actions"),
	);

	const computedHeaders = computed(function () {
		const newHeaders = [...props.headers];
		if (slots.actions) {
			newHeaders.push({ title: "", key: "actions", align: "end", width: "150px" });
		}
		return newHeaders;
	});
</script>
