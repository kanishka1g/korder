<template>
	<div class="modern-table-container">
		<!-- Table Header Controls -->
		<div class="table-controls mb-4">
			<div class="d-flex align-center justify-space-between flex-wrap gap-3">
				<div class="table-controls-left">
					<slot name="top" />
					<!-- Selection Summary -->
					<div v-if="selectable && !hideSelection && selectedItems.length > 0" class="selection-summary">
						<VChip
							color="primary"
							variant="elevated"
							size="default"
							prepend-icon="fas fa-check-circle"
							class="selection-chip"
						>
							<template #prepend>
								<VIcon icon="fas fa-check-circle" />
							</template>
							{{ selectedItems.length }} selected
						</VChip>
						<VBtn
							v-if="showBulkActions"
							color="error"
							variant="text"
							size="small"
							prepend-icon="fas fa-trash"
							@click="handleBulkDelete"
							class="ml-2"
						>
							Delete Selected
						</VBtn>
					</div>
				</div>

				<VRow justify="end">
					<!-- Active Toggle -->
					<VCol cols="auto">
						<VSwitch
							v-if="!hideActiveToggle"
							v-model="showActiveToggle"
							:label="activeLabel"
							color="warning"
							density="compact"
							hide-details
							class="modern-switch px-3"
						/>
					</VCol>
					<VCol cols="auto">
						<!-- Add Button -->
						<VBtn
							v-if="!hideAdd && (addHref || onAdd)"
							:href="addHref"
							color="primary"
							variant="elevated"
							prepend-icon="fas fa-plus"
							@click="emit('add')"
							class="add-btn"
							size="default"
						>
							<template #prepend>
								<VIcon icon="fas fa-plus" />
							</template>
							{{ addText }}
						</VBtn>
					</VCol>
					<VCol cols="12">
						<!-- Search -->
						<VTextField
							v-if="searchable"
							v-model="searchQuery"
							variant="outlined"
							density="compact"
							placeholder="Search..."
							prepend-inner-icon="fas fa-search"
							hide-details
							class="search-field"
							clearable
						/>
					</VCol>
				</VRow>
			</div>
		</div>

		<!-- Desktop Table View -->
		<VCard v-if="$vuetify.display.mdAndUp" class="modern-table-card" elevation="0" variant="outlined">
			<VDataTable
				:headers="computedHeaders"
				:items="filteredItems"
				hide-default-footer
				class="modern-data-table"
				:class="{ 'table-empty': !filteredItems.length }"
				:show-select="selectable && !hideSelection"
				v-model="selectedItems"
				:item-value="itemValue"
			>
				<template #headers="{ columns, allSelected, selectAll, someSelected }">
					<tr class="table-header-row">
						<th v-if="selectable && !hideSelection" class="table-header-cell selection-header">
							<VCheckbox
								:model-value="allSelected"
								:indeterminate="someSelected && !allSelected"
								@update:model-value="selectAll"
								color="primary"
								hide-details
								class="selection-checkbox"
							/>
						</th>
						<th
							v-for="column in columns.filter((col) => col.key !== 'data-table-select')"
							:key="column.key"
							class="table-header-cell"
							:class="{ 'text-end': column.align === 'end' }"
						>
							<div class="header-content">
								<VIcon
									v-if="getHeaderIcon(column.key)"
									:icon="getHeaderIcon(column.key)"
									size="small"
									class="mr-2 header-icon"
								/>
								<span class="header-text">{{ column.title }}</span>
								<VIcon
									v-if="sortable && column.sortable !== false"
									icon="fas fa-sort"
									size="x-small"
									class="ml-2 sort-icon"
									:class="{ 'sort-active': sortBy === column.key }"
									@click="handleSort(column.key)"
								/>
							</div>
						</th>
					</tr>
				</template>

				<template #item="{ item, index, isSelected, toggleSelect }">
					<tr
						class="table-row"
						:class="{
							'row-even': index % 2 === 0,
							'row-selected': selectable && !hideSelection && isSelected,
							'row-hover': hoverable,
						}"
						@click="rowClickable && selectable && !hideSelection ? toggleSelect() : null"
					>
						<td v-if="selectable && !hideSelection" class="table-cell selection-cell">
							<VCheckbox
								:model-value="isSelected"
								@update:model-value="toggleSelect"
								color="primary"
								hide-details
								class="selection-checkbox"
								@click.stop
							/>
						</td>
						<td
							v-for="header in headers"
							:key="header.key"
							class="table-cell"
							:class="{ 'text-end': header.align === 'end' }"
						>
							<div class="cell-content">
								<slot
									v-if="slots[`item.${header.key}`]"
									:name="`item.${header.key}`"
									:item="item"
									:index="index"
									:selected="selectable ? isSelected : false"
								/>
								<span v-else class="cell-text">
									{{ getNestedValue(item, header.key) }}
								</span>
							</div>
						</td>
						<td v-if="slots.actions" class="table-cell actions-cell">
							<div class="actions-container">
								<slot
									name="actions"
									:item="item"
									:index="index"
									:selected="selectable ? isSelected : false"
								/>
							</div>
						</td>
					</tr>
				</template>

				<template #no-data>
					<div class="empty-state pa-8">
						<VIcon icon="fas fa-inbox" size="64" color="grey-lighten-1" class="mb-4" />
						<div class="text-h6 text-medium-emphasis mb-2">{{ noItemsText }}</div>
						<div class="text-body-2 text-medium-emphasis">
							{{ emptyStateSubtext }}
						</div>
					</div>
				</template>
			</VDataTable>
		</VCard>

		<!-- Mobile Card View -->
		<div v-else class="mobile-table-view">
			<!-- Mobile Selection Controls -->
			<div v-if="selectable && !hideSelection && filteredItems.length > 0" class="mobile-selection-controls mb-4">
				<VCard class="selection-controls-card" variant="outlined" elevation="0">
					<VCardText class="pa-4">
						<div class="d-flex align-center justify-space-between">
							<div class="d-flex align-center gap-3">
								<VCheckbox
									:model-value="allSelected"
									:indeterminate="someSelected && !allSelected"
									@update:model-value="handleSelectAll"
									color="primary"
									hide-details
									class="select-all-checkbox"
								/>
								<span class="text-body-1 font-weight-medium">
									{{ selectedItems.length > 0 ? `${selectedItems.length} selected` : "Select all" }}
								</span>
							</div>
							<VBtn
								v-if="selectedItems.length > 0 && showBulkActions"
								color="error"
								variant="text"
								size="small"
								icon="fas fa-trash"
								@click="handleBulkDelete"
							/>
						</div>
					</VCardText>
				</VCard>
			</div>

			<TransitionGroup name="mobile-card" tag="div">
				<VCard
					v-for="(item, index) in filteredItems"
					:key="getItemKey(item, index)"
					class="mobile-item-card mb-3"
					:class="{ 'card-selected': selectable && isItemSelected(item) }"
					elevation="0"
					variant="outlined"
					@click="selectable && !hideSelection ? handleMobileItemClick(item) : null"
				>
					<slot
						name="mobile"
						:item="item"
						:index="index"
						:selected="selectable ? isItemSelected(item) : false"
					>
						<VCardText class="pa-4">
							<div class="mobile-item-content">
								<!-- Selection Indicator -->
								<div v-if="selectable && !hideSelection" class="mobile-selection-indicator">
									<VCheckbox
										:model-value="isItemSelected(item)"
										@update:model-value="toggleItemSelection(item)"
										color="primary"
										hide-details
										class="mobile-selection-checkbox"
										@click.stop
									/>
								</div>

								<!-- Item Fields -->
								<div
									v-for="header in visibleHeaders"
									:key="header.key"
									class="mobile-field mb-3"
									:class="{
										'mobile-field-last': header === visibleHeaders[visibleHeaders.length - 1],
									}"
								>
									<div class="field-label">
										<VIcon
											v-if="getFieldIcon(header.key)"
											:icon="getFieldIcon(header.key)"
											size="small"
											class="mr-2 field-icon"
										/>
										<span class="label-text">{{ header.title }}</span>
									</div>
									<div class="field-value">
										<slot
											v-if="slots[`item.${header.key}`]"
											:name="`item.${header.key}`"
											:item="item"
											:index="index"
											:selected="selectable ? isItemSelected(item) : false"
										/>
										<span v-else class="value-text">
											{{ getNestedValue(item, header.key) }}
										</span>
									</div>
								</div>
							</div>
						</VCardText>

						<VDivider v-if="slots.actions" />

						<VCardActions v-if="slots.actions" class="mobile-actions">
							<VSpacer />
							<div class="actions-container">
								<slot
									name="actions"
									:item="item"
									:index="index"
									:selected="selectable ? isItemSelected(item) : false"
								/>
							</div>
						</VCardActions>
					</slot>
				</VCard>
			</TransitionGroup>

			<!-- Mobile Empty State -->
			<VCard v-if="!filteredItems.length" class="mobile-empty-state" variant="tonal" color="surface">
				<VCardText class="pa-8 text-center">
					<VIcon icon="fas fa-inbox" size="64" color="grey-lighten-1" class="mb-4" />
					<div class="text-h6 text-medium-emphasis mb-2">{{ noItemsText }}</div>
					<div class="text-body-2 text-medium-emphasis">
						{{ emptyStateSubtext }}
					</div>
					<VBtn
						v-if="!hideAdd && (addHref || onAdd)"
						:href="addHref"
						color="primary"
						variant="elevated"
						prepend-icon="fas fa-plus"
						@click="emit('add')"
						class="mt-4"
					>
						{{ addText }}
					</VBtn>
				</VCardText>
			</VCard>
		</div>
	</div>
</template>

<script setup>
	import { computed, ref, useSlots, watch } from "vue";

	const slots = useSlots();

	const emit = defineEmits(["add", "bulk-delete", "selection-change", "sort"]);

	const props = defineProps({
		items: {
			type: Array,
			required: true,
		},
		headers: {
			type: Array,
			required: true,
		},
		modelValue: {
			type: Array,
			default: () => [],
		},
		itemValue: {
			type: String,
			default: "id",
		},
		noItemsText: {
			type: String,
			default: "No items found in table",
		},
		emptyStateSubtext: {
			type: String,
			default: "Try adjusting your search or filters",
		},
		activeLabel: {
			type: String,
			default: "Show inactive",
		},
		hideActiveToggle: {
			type: Boolean,
		},
		hideAdd: {
			type: Boolean,
		},
		addText: {
			type: String,
			default: "Add",
		},
		addHref: {
			type: String,
			default: null,
		},
		onAdd: {
			type: Function,
			default: null,
		},
		searchable: {
			type: Boolean,
			default: false,
		},
		sortable: {
			type: Boolean,
			default: false,
		},
		hoverable: {
			type: Boolean,
			default: true,
		},
		rowClickable: {
			type: Boolean,
			default: false,
		},
		showBulkActions: {
			type: Boolean,
			default: true,
		},
		headerIcons: {
			type: Object,
			default: () => ({}),
		},
		fieldIcons: {
			type: Object,
			default: () => ({}),
		},
		// New props for unified functionality
		selectable: {
			type: Boolean,
			default: false,
		},
		hideSelection: {
			type: Boolean,
			default: false,
		},
	});

	const selectedItems = ref(props.selectable ? [...props.modelValue] : []);
	const showActiveToggle = defineModel("active", false);
	const searchQuery = ref("");
	const sortBy = ref("");
	const sortDesc = ref(false);

	// Watch for external changes to modelValue (only if selectable)
	watch(
		() => props.modelValue,
		(newVal) => {
			if (props.selectable) {
				selectedItems.value = [...newVal];
			}
		},
	);

	// Emit selection changes (only if selectable)
	watch(
		selectedItems,
		(newVal) => {
			if (props.selectable) {
				emit("selection-change", newVal);
			}
		},
		{ deep: true },
	);

	const filteredItems = computed(() => {
		let filtered = [...props.items];

		// Apply search filter
		if (searchQuery.value) {
			const query = searchQuery.value.toLowerCase();
			filtered = filtered.filter((item) => {
				return props.headers.some((header) => {
					const value = getNestedValue(item, header.key);
					return String(value).toLowerCase().includes(query);
				});
			});
		}

		// Apply sorting
		if (sortBy.value) {
			filtered.sort((a, b) => {
				const aVal = getNestedValue(a, sortBy.value);
				const bVal = getNestedValue(b, sortBy.value);

				if (aVal < bVal) return sortDesc.value ? 1 : -1;
				if (aVal > bVal) return sortDesc.value ? -1 : 1;
				return 0;
			});
		}

		return filtered;
	});

	const computedHeaders = computed(() => {
		const newHeaders = [...props.headers];
		if (slots.actions) {
			newHeaders.push({ title: "", key: "actions", align: "end", width: "150px" });
		}
		return newHeaders;
	});

	const visibleHeaders = computed(() => {
		return props.headers.filter((header) => !header.hidden);
	});

	const allSelected = computed(() => {
		if (!props.selectable) return false;
		return (
			filteredItems.value.length > 0 &&
			filteredItems.value.every((item) => selectedItems.value.includes(getNestedValue(item, props.itemValue)))
		);
	});

	const someSelected = computed(() => {
		if (!props.selectable) return false;
		return selectedItems.value.length > 0 && !allSelected.value;
	});

	function getNestedValue(obj, path) {
		return path.split(".").reduce((current, key) => current?.[key], obj);
	}

	function getItemKey(item, index) {
		return getNestedValue(item, props.itemValue) || index;
	}

	function isItemSelected(item) {
		if (!props.selectable) return false;
		return selectedItems.value.includes(getNestedValue(item, props.itemValue));
	}

	function toggleItemSelection(item) {
		if (!props.selectable) return;
		const itemId = getNestedValue(item, props.itemValue);
		const index = selectedItems.value.indexOf(itemId);

		if (index > -1) {
			selectedItems.value.splice(index, 1);
		} else {
			selectedItems.value.push(itemId);
		}
	}

	function handleSelectAll(value) {
		if (!props.selectable) return;
		if (value) {
			selectedItems.value = filteredItems.value.map((item) => getNestedValue(item, props.itemValue));
		} else {
			selectedItems.value = [];
		}
	}

	function handleMobileItemClick(item) {
		if (props.rowClickable && props.selectable) {
			toggleItemSelection(item);
		}
	}

	function handleBulkDelete() {
		emit("bulk-delete", selectedItems.value);
	}

	function handleSort(key) {
		if (sortBy.value === key) {
			sortDesc.value = !sortDesc.value;
		} else {
			sortBy.value = key;
			sortDesc.value = false;
		}
		emit("sort", { key, desc: sortDesc.value });
	}

	function getHeaderIcon(key) {
		return props.headerIcons[key];
	}

	function getFieldIcon(key) {
		return props.fieldIcons[key] || props.headerIcons[key];
	}
</script>
<style scoped lang="scss">
	.modern-table-container {
		.table-controls {
			.table-controls-left {
				.selection-summary {
					display: flex;
					align-items: center;
					margin-top: 12px;

					.selection-chip {
						border-radius: 20px;
						font-weight: 600;
						box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.3);
						animation: slideInLeft 0.3s ease-out;
					}
				}
			}

			.table-controls-right {
				.search-field {
					min-width: 250px;

					:deep(.v-field) {
						border-radius: 20px;
						background: rgba(var(--v-theme-surface-variant), 0.3);
						transition: all 0.3s ease;

						&:hover {
							background: rgba(var(--v-theme-surface-variant), 0.4);
						}

						&.v-field--focused {
							background: rgba(var(--v-theme-primary), 0.05);
							box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.2);
						}
					}
				}

				.toggle-card {
					border-radius: 12px;
					background: rgba(var(--v-theme-surface-variant), 0.3);
					backdrop-filter: blur(10px);
					transition: all 0.3s ease;

					&:hover {
						background: rgba(var(--v-theme-surface-variant), 0.4);
						transform: translateY(-1px);
					}

					.modern-switch {
						:deep(.v-switch__track) {
							border-radius: 12px;
						}

						:deep(.v-switch__thumb) {
							box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
						}
					}
				}

				.add-btn {
					border-radius: 12px;
					text-transform: none;
					font-weight: 600;
					box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
					transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

					&:hover {
						transform: translateY(-2px);
						box-shadow: 0 6px 20px rgba(var(--v-theme-primary), 0.4);
					}
				}
			}
		}

		.modern-table-card {
			border-radius: 16px;
			background: linear-gradient(
				135deg,
				rgba(var(--v-theme-surface), 0.95) 0%,
				rgba(var(--v-theme-surface), 0.8) 100%
			);
			backdrop-filter: blur(20px);
			border: 1px solid rgba(var(--v-border-color), 0.12);
			overflow: hidden;
			transition: all 0.3s ease;

			&:hover {
				transform: translateY(-2px);
				box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
			}

			.modern-data-table {
				:deep(.v-data-table__wrapper) {
					border-radius: 16px;
					overflow: hidden;
				}

				.table-header-row {
					background: linear-gradient(
						135deg,
						rgba(var(--v-theme-primary), 0.08) 0%,
						rgba(var(--v-theme-primary), 0.04) 100%
					);
					border-bottom: 2px solid rgba(var(--v-theme-primary), 0.1);

					.table-header-cell {
						padding: 16px 12px;
						font-weight: 700;
						font-size: 0.875rem;
						text-transform: uppercase;
						letter-spacing: 0.5px;
						color: rgba(var(--v-theme-on-surface), 0.87);
						border-bottom: none;

						&.selection-header {
							width: 60px;
							text-align: center;

							.selection-checkbox {
								:deep(.v-selection-control__wrapper) {
									justify-content: center;
								}
							}
						}

						.header-content {
							display: flex;
							align-items: center;
							gap: 8px;

							.header-icon {
								color: rgba(var(--v-theme-primary), 0.7);
							}

							.sort-icon {
								opacity: 0.5;
								cursor: pointer;
								transition: all 0.3s ease;

								&:hover {
									opacity: 0.8;
									transform: scale(1.1);
								}

								&.sort-active {
									opacity: 1;
									color: rgb(var(--v-theme-primary));
								}
							}
						}
					}
				}

				.table-row {
					transition: all 0.3s ease;
					border-bottom: 1px solid rgba(var(--v-border-color), 0.08);

					&.row-hover:hover {
						background: rgba(var(--v-theme-primary), 0.04);
						transform: translateX(4px);
						box-shadow: 4px 0 12px rgba(var(--v-theme-primary), 0.1);
					}

					&.row-selected {
						background: linear-gradient(
							135deg,
							rgba(var(--v-theme-primary), 0.08) 0%,
							rgba(var(--v-theme-primary), 0.04) 100%
						);
						border-left: 4px solid rgb(var(--v-theme-primary));
					}

					&.row-even {
						background: rgba(var(--v-theme-surface-variant), 0.02);
					}

					.table-cell {
						padding: 16px 12px;
						border-bottom: none;

						&.selection-cell {
							width: 60px;
							text-align: center;

							.selection-checkbox {
								:deep(.v-selection-control__wrapper) {
									justify-content: center;
								}

								:deep(.v-selection-control__input) {
									.v-icon {
										transition: all 0.3s ease;
									}
								}

								&:hover :deep(.v-selection-control__input) .v-icon {
									transform: scale(1.1);
								}
							}
						}

						.cell-content {
							display: flex;
							align-items: center;
							min-height: 24px;

							.cell-text {
								font-size: 0.875rem;
								color: rgba(var(--v-theme-on-surface), 0.87);
							}
						}

						&.actions-cell {
							.actions-container {
								display: flex;
								gap: 4px;
								justify-content: flex-end;
							}
						}
					}
				}

				.empty-state {
					text-align: center;
					color: rgba(var(--v-theme-on-surface), 0.6);

					.v-icon {
						opacity: 0.5;
						margin-bottom: 16px;
					}
				}
			}
		}

		.mobile-table-view {
			.mobile-selection-controls {
				.selection-controls-card {
					border-radius: 12px;
					background: rgba(var(--v-theme-surface-variant), 0.3);
					backdrop-filter: blur(10px);
					transition: all 0.3s ease;

					&:hover {
						background: rgba(var(--v-theme-surface-variant), 0.4);
					}

					.select-all-checkbox {
						:deep(.v-selection-control__input) {
							.v-icon {
								transition: all 0.3s ease;
							}
						}

						&:hover :deep(.v-selection-control__input) .v-icon {
							transform: scale(1.1);
						}
					}
				}
			}

			.mobile-item-card {
				border-radius: 12px;
				background: rgba(var(--v-theme-surface), 0.8);
				backdrop-filter: blur(10px);
				border: 1px solid rgba(var(--v-border-color), 0.12);
				transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				cursor: pointer;
				position: relative;
				overflow: hidden;

				&:hover {
					transform: translateY(-2px);
					box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
					border-color: rgba(var(--v-theme-primary), 0.2);
				}

				&.card-selected {
					background: linear-gradient(
						135deg,
						rgba(var(--v-theme-primary), 0.08) 0%,
						rgba(var(--v-theme-primary), 0.04) 100%
					);
					border-color: rgb(var(--v-theme-primary));
					box-shadow: 0 4px 16px rgba(var(--v-theme-primary), 0.2);

					&::before {
						content: "";
						position: absolute;
						top: 0;
						left: 0;
						width: 4px;
						height: 100%;
						background: rgb(var(--v-theme-primary));
					}
				}

				.mobile-item-content {
					position: relative;

					.mobile-selection-indicator {
						position: absolute;
						top: -8px;
						right: -8px;
						z-index: 2;

						.mobile-selection-checkbox {
							:deep(.v-selection-control__wrapper) {
								background: rgba(var(--v-theme-surface), 0.9);
								border-radius: 50%;
								padding: 4px;
								box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
							}

							:deep(.v-selection-control__input) {
								.v-icon {
									transition: all 0.3s ease;
								}
							}

							&:hover :deep(.v-selection-control__input) .v-icon {
								transform: scale(1.1);
							}
						}
					}

					.mobile-field {
						display: flex;
						justify-content: space-between;
						align-items: flex-start;
						padding: 8px 0;
						border-bottom: 1px solid rgba(var(--v-border-color), 0.06);

						&.mobile-field-last {
							border-bottom: none;
							margin-bottom: 0;
						}

						.field-label {
							display: flex;
							align-items: center;
							min-width: 120px;
							flex-shrink: 0;

							.field-icon {
								color: rgba(var(--v-theme-primary), 0.7);
							}

							.label-text {
								font-size: 0.75rem;
								font-weight: 600;
								text-transform: uppercase;
								letter-spacing: 0.5px;
								color: rgba(var(--v-theme-on-surface), 0.6);
							}
						}

						.field-value {
							flex: 1;
							text-align: right;
							padding-left: 16px;

							.value-text {
								font-size: 0.875rem;
								font-weight: 500;
								color: rgba(var(--v-theme-on-surface), 0.87);
							}
						}
					}
				}

				.mobile-actions {
					background: rgba(var(--v-theme-surface-variant), 0.05);
					border-radius: 0 0 12px 12px;

					.actions-container {
						display: flex;
						gap: 8px;
					}
				}
			}

			.mobile-empty-state {
				border-radius: 16px;
				background: linear-gradient(
					135deg,
					rgba(var(--v-theme-surface-variant), 0.3) 0%,
					rgba(var(--v-theme-surface-variant), 0.1) 100%
				);
				backdrop-filter: blur(10px);
			}
		}
	}

	// Mobile card animations
	.mobile-card-enter-active,
	.mobile-card-leave-active {
		transition: all 0.3s ease;
	}

	.mobile-card-enter-from {
		opacity: 0;
		transform: translateY(20px);
	}

	.mobile-card-leave-to {
		opacity: 0;
		transform: translateX(-100%);
	}

	.mobile-card-move {
		transition: transform 0.3s ease;
	}

	// Selection animations
	@keyframes slideInLeft {
		from {
			opacity: 0;
			transform: translateX(-20px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	// Theme-specific styles
	.v-theme--dark {
		.modern-table-container {
			.modern-table-card {
				background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.8) 100%);
			}

			.mobile-table-view {
				.selection-controls-card {
					background: rgba(30, 41, 59, 0.6);
				}

				.mobile-item-card {
					background: rgba(30, 41, 59, 0.8);
				}

				.mobile-empty-state {
					background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.3) 100%);
				}
			}
		}
	}

	.v-theme--light {
		.modern-table-container {
			.modern-table-card {
				background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.8) 100%);
			}

			.mobile-table-view {
				.selection-controls-card {
					background: rgba(248, 250, 252, 0.6);
				}

				.mobile-item-card {
					background: rgba(255, 255, 255, 0.8);
				}

				.mobile-empty-state {
					background: linear-gradient(135deg, rgba(248, 250, 252, 0.6) 0%, rgba(255, 255, 255, 0.3) 100%);
				}
			}
		}
	}

	// Responsive design
	@media (max-width: 768px) {
		.modern-table-container {
			.table-controls {
				.table-controls-right {
					.search-field {
						min-width: 200px;
					}
				}
			}

			.mobile-table-view {
				.mobile-item-card {
					.mobile-item-content {
						.mobile-field {
							flex-direction: column;
							align-items: flex-start;
							gap: 4px;

							.field-label {
								min-width: auto;
							}

							.field-value {
								text-align: left;
								padding-left: 0;
								width: 100%;
							}
						}
					}
				}
			}
		}
	}

	@media (max-width: 480px) {
		.modern-table-container {
			.table-controls {
				.d-flex {
					flex-direction: column;
					align-items: stretch;
					gap: 12px;
				}

				.table-controls-right {
					.search-field {
						min-width: 100%;
					}

					.d-flex {
						flex-direction: column;
						gap: 12px;
					}
				}
			}

			.mobile-table-view {
				.mobile-selection-controls {
					.selection-controls-card {
						.d-flex {
							flex-direction: column;
							align-items: flex-start;
							gap: 12px;
						}
					}
				}

				.mobile-item-card {
					.mobile-item-content {
						.mobile-selection-indicator {
							position: static;
							display: flex;
							justify-content: flex-end;
							margin-bottom: 12px;
						}
					}

					.mobile-actions {
						.actions-container {
							flex-direction: column;
							gap: 8px;

							.v-btn {
								width: 100%;
							}
						}
					}
				}
			}
		}
	}

	// Accessibility improvements
	.modern-table-container {
		.selection-checkbox,
		.mobile-selection-checkbox,
		.select-all-checkbox {
			:deep(.v-selection-control__wrapper) {
				&:focus-within {
					outline: 2px solid rgb(var(--v-theme-primary));
					outline-offset: 2px;
					border-radius: 4px;
				}
			}
		}

		.table-row {
			&:focus-within {
				outline: 2px solid rgb(var(--v-theme-primary));
				outline-offset: -2px;
			}
		}

		.mobile-item-card {
			&:focus-within {
				outline: 2px solid rgb(var(--v-theme-primary));
				outline-offset: 2px;
			}
		}
	}
</style>
