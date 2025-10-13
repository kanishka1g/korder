<template>
	<VContainer fluid class="selection-table-demo">
		<div class="demo-header mb-8">
			<h1 class="text-h3 font-weight-bold mb-2 gradient-text">Selection Table Demo</h1>
			<p class="text-h6 text-medium-emphasis">Modern, sleek, and mobile-friendly selection table</p>
		</div>

		<!-- Demo Controls -->
		<VCard class="demo-controls mb-6" elevation="0" variant="outlined">
			<VCardTitle>Demo Controls</VCardTitle>
			<VCardText>
				<VRow>
					<VCol cols="12" md="3">
						<VSwitch
							v-model="demoOptions.selectable"
							label="Enable Selection"
							color="primary"
							hide-details
						/>
					</VCol>
					<VCol cols="12" md="3">
						<VSwitch v-model="demoOptions.searchable" label="Enable Search" color="primary" hide-details />
					</VCol>
					<VCol cols="12" md="3">
						<VSwitch v-model="demoOptions.sortable" label="Enable Sorting" color="primary" hide-details />
					</VCol>
					<VCol cols="12" md="3">
						<VSwitch
							v-model="demoOptions.rowClickable"
							label="Row Clickable"
							color="primary"
							hide-details
						/>
					</VCol>
				</VRow>
			</VCardText>
		</VCard>

		<!-- Selection Table -->
		<SelectionTable
			v-model="selectedUsers"
			:items="users"
			:headers="headers"
			:selectable="demoOptions.selectable"
			:searchable="demoOptions.searchable"
			:sortable="demoOptions.sortable"
			:row-clickable="demoOptions.rowClickable"
			:header-icons="headerIcons"
			:field-icons="fieldIcons"
			no-items-text="No users found"
			empty-state-subtext="Try adding some users or adjusting your search"
			add-text="Add User"
			@add="handleAddUser"
			@bulk-delete="handleBulkDelete"
			@selection-change="handleSelectionChange"
			@sort="handleSort"
		>
			<template #top>
				<div class="d-flex align-center gap-3">
					<VChip color="info" variant="outlined">
						<VIcon icon="fas fa-users" class="mr-2" />
						{{ users.length }} Total Users
					</VChip>
					<VChip v-if="selectedUsers.length > 0" color="primary" variant="elevated">
						<VIcon icon="fas fa-check-circle" class="mr-2" />
						{{ selectedUsers.length }} Selected
					</VChip>
				</div>
			</template>

			<template #item.avatar="{ item }">
				<VAvatar :color="item.status === 'active' ? 'success' : 'error'" size="32">
					<VIcon :icon="item.status === 'active' ? 'fas fa-user' : 'fas fa-user-slash'" />
				</VAvatar>
			</template>

			<template #item.name="{ item }">
				<div class="d-flex align-center">
					<div>
						<div class="font-weight-bold">{{ item.name }}</div>
						<div class="text-caption text-medium-emphasis">{{ item.email }}</div>
					</div>
				</div>
			</template>

			<template #item.role="{ item }">
				<VChip :color="getRoleColor(item.role)" variant="tonal" size="small" class="font-weight-bold">
					{{ item.role }}
				</VChip>
			</template>

			<template #item.status="{ item }">
				<VChip :color="item.status === 'active' ? 'success' : 'error'" variant="dot" size="small">
					{{ item.status }}
				</VChip>
			</template>

			<template #item.lastLogin="{ item }">
				<div class="text-body-2">
					<div>{{ formatDate(item.lastLogin) }}</div>
					<div class="text-caption text-medium-emphasis">{{ formatTimeAgo(item.lastLogin) }}</div>
				</div>
			</template>

			<template #actions="{ item, selected }">
				<div class="d-flex gap-1">
					<VBtn icon="fas fa-eye" color="info" size="small" variant="text" @click="handleView(item)" />
					<VBtn icon="fas fa-pencil" color="primary" size="small" variant="text" @click="handleEdit(item)" />
					<VBtn icon="fas fa-trash" color="error" size="small" variant="text" @click="handleDelete(item)" />
				</div>
			</template>

			<!-- Mobile template -->
			<template #mobile="{ item, selected }">
				<VCardText class="pa-4">
					<div class="mobile-user-content">
						<!-- Selection Indicator -->
						<div class="mobile-selection-indicator">
							<VCheckbox
								:model-value="selected"
								@update:model-value="toggleUserSelection(item)"
								color="primary"
								hide-details
								class="mobile-selection-checkbox"
								@click.stop
							/>
						</div>

						<!-- User Header -->
						<div class="mobile-user-header mb-3">
							<div class="d-flex align-center gap-3">
								<VAvatar :color="item.status === 'active' ? 'success' : 'error'" size="40">
									<VIcon :icon="item.status === 'active' ? 'fas fa-user' : 'fas fa-user-slash'" />
								</VAvatar>
								<div class="flex-grow-1">
									<div class="text-h6 font-weight-bold">{{ item.name }}</div>
									<div class="text-body-2 text-medium-emphasis">{{ item.email }}</div>
								</div>
								<VChip
									:color="item.status === 'active' ? 'success' : 'error'"
									variant="dot"
									size="small"
								>
									{{ item.status }}
								</VChip>
							</div>
						</div>

						<!-- User Details -->
						<div class="mobile-user-details">
							<div class="mobile-field mb-2">
								<div class="field-label">
									<VIcon icon="fas fa-user-tag" size="small" class="mr-2 field-icon" />
									<span class="label-text">Role</span>
								</div>
								<div class="field-value">
									<VChip
										:color="getRoleColor(item.role)"
										variant="tonal"
										size="small"
										class="font-weight-bold"
									>
										{{ item.role }}
									</VChip>
								</div>
							</div>

							<div class="mobile-field mb-2">
								<div class="field-label">
									<VIcon icon="fas fa-building" size="small" class="mr-2 field-icon" />
									<span class="label-text">Department</span>
								</div>
								<div class="field-value">
									<span class="value-text">{{ item.department }}</span>
								</div>
							</div>

							<div class="mobile-field">
								<div class="field-label">
									<VIcon icon="fas fa-clock" size="small" class="mr-2 field-icon" />
									<span class="label-text">Last Login</span>
								</div>
								<div class="field-value">
									<div class="text-body-2">
										<div>{{ formatDate(item.lastLogin) }}</div>
										<div class="text-caption text-medium-emphasis">
											{{ formatTimeAgo(item.lastLogin) }}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</VCardText>

				<VDivider />

				<VCardActions class="mobile-actions">
					<VSpacer />
					<div class="actions-container">
						<VBtn
							color="info"
							variant="text"
							size="small"
							prepend-icon="fas fa-eye"
							@click="handleView(item)"
						>
							View
						</VBtn>
						<VBtn
							color="primary"
							variant="text"
							size="small"
							prepend-icon="fas fa-pencil"
							@click="handleEdit(item)"
						>
							Edit
						</VBtn>
						<VBtn
							color="error"
							variant="text"
							size="small"
							prepend-icon="fas fa-trash"
							@click="handleDelete(item)"
						>
							Delete
						</VBtn>
					</div>
				</VCardActions>
			</template>
		</SelectionTable>

		<!-- Selection Summary -->
		<VCard
			v-if="selectedUsers.length > 0"
			class="selection-summary-card mt-6"
			elevation="0"
			variant="tonal"
			color="primary"
		>
			<VCardText class="pa-4">
				<div class="d-flex align-center justify-space-between">
					<div>
						<h4 class="text-h6 font-weight-bold mb-1">Selection Summary</h4>
						<p class="text-body-2 mb-0">{{ selectedUsers.length }} users selected</p>
					</div>
					<div class="d-flex gap-2">
						<VBtn
							color="primary"
							variant="elevated"
							size="small"
							prepend-icon="fas fa-download"
							@click="handleExport"
						>
							Export
						</VBtn>
						<VBtn
							color="error"
							variant="outlined"
							size="small"
							prepend-icon="fas fa-trash"
							@click="handleBulkDelete"
						>
							Delete All
						</VBtn>
					</div>
				</div>
			</VCardText>
		</VCard>
	</VContainer>
</template>

<script setup>
	import { ref, computed } from "vue";
	import dayjs from "dayjs";
	import relativeTime from "dayjs/plugin/relativeTime";
	import SelectionTable from "@/components/common/SelectionTable.vue";
	import { snackbar, confirmation } from "@/utils/generic_modals";

	dayjs.extend(relativeTime);

	const selectedUsers = ref([]);
	const demoOptions = ref({
		selectable: true,
		searchable: true,
		sortable: true,
		rowClickable: false,
	});

	const headers = [
		{ title: "", key: "avatar", sortable: false, width: "60px" },
		{ title: "Name", key: "name" },
		{ title: "Role", key: "role" },
		{ title: "Department", key: "department" },
		{ title: "Status", key: "status" },
		{ title: "Last Login", key: "lastLogin" },
	];

	const headerIcons = {
		name: "fas fa-user",
		role: "fas fa-user-tag",
		department: "fas fa-building",
		status: "fas fa-circle-dot",
		lastLogin: "fas fa-clock",
	};

	const fieldIcons = {
		name: "fas fa-user",
		role: "fas fa-user-tag",
		department: "fas fa-building",
		status: "fas fa-circle-dot",
		lastLogin: "fas fa-clock",
	};

	// Sample data
	const users = ref([
		{
			id: 1,
			name: "John Doe",
			email: "john.doe@example.com",
			role: "Admin",
			department: "IT",
			status: "active",
			lastLogin: dayjs().subtract(2, "hours").toDate(),
		},
		{
			id: 2,
			name: "Jane Smith",
			email: "jane.smith@example.com",
			role: "Manager",
			department: "Sales",
			status: "active",
			lastLogin: dayjs().subtract(1, "day").toDate(),
		},
		{
			id: 3,
			name: "Bob Johnson",
			email: "bob.johnson@example.com",
			role: "User",
			department: "Marketing",
			status: "inactive",
			lastLogin: dayjs().subtract(1, "week").toDate(),
		},
		{
			id: 4,
			name: "Alice Brown",
			email: "alice.brown@example.com",
			role: "Manager",
			department: "HR",
			status: "active",
			lastLogin: dayjs().subtract(3, "hours").toDate(),
		},
		{
			id: 5,
			name: "Charlie Wilson",
			email: "charlie.wilson@example.com",
			role: "User",
			department: "Finance",
			status: "active",
			lastLogin: dayjs().subtract(2, "days").toDate(),
		},
	]);

	function getRoleColor(role) {
		const colors = {
			Admin: "error",
			Manager: "warning",
			User: "info",
		};
		return colors[role] || "grey";
	}

	function formatDate(date) {
		return dayjs(date).format("MMM DD, YYYY");
	}

	function formatTimeAgo(date) {
		return dayjs(date).fromNow();
	}

	function toggleUserSelection(user) {
		const index = selectedUsers.value.indexOf(user.id);
		if (index > -1) {
			selectedUsers.value.splice(index, 1);
		} else {
			selectedUsers.value.push(user.id);
		}
	}

	function handleAddUser() {
		snackbar.info("Add user functionality would be implemented here");
	}

	function handleView(user) {
		snackbar.info(`Viewing user: ${user.name}`);
	}

	function handleEdit(user) {
		snackbar.info(`Editing user: ${user.name}`);
	}

	async function handleDelete(user) {
		const confirmed = await confirmation("Delete User", `Are you sure you want to delete ${user.name}?`, true);

		if (confirmed) {
			const index = users.value.findIndex((u) => u.id === user.id);
			if (index > -1) {
				users.value.splice(index, 1);
				snackbar.success(`${user.name} has been deleted`);
			}
		}
	}

	async function handleBulkDelete() {
		const confirmed = await confirmation(
			"Delete Users",
			`Are you sure you want to delete ${selectedUsers.value.length} selected users?`,
			true,
		);

		if (confirmed) {
			users.value = users.value.filter((user) => !selectedUsers.value.includes(user.id));
			selectedUsers.value = [];
			snackbar.success("Selected users have been deleted");
		}
	}

	function handleSelectionChange(selection) {
		console.log("Selection changed:", selection);
	}

	function handleSort(sortInfo) {
		console.log("Sort changed:", sortInfo);
	}

	function handleExport() {
		const selectedUserData = users.value.filter((user) => selectedUsers.value.includes(user.id));
		console.log("Exporting users:", selectedUserData);
		snackbar.success(`Exported ${selectedUserData.length} users`);
	}
</script>

<style scoped lang="scss">
	.selection-table-demo {
		min-height: 100vh;
		background: linear-gradient(
			135deg,
			rgba(var(--v-theme-surface), 0.8) 0%,
			rgba(var(--v-theme-background), 0.9) 100%
		);

		.demo-header {
			.gradient-text {
				background: linear-gradient(
					45deg,
					rgb(var(--v-theme-primary)),
					rgb(var(--v-theme-secondary-lighten-1))
				);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				background-clip: text;
			}
		}

		.demo-controls {
			border-radius: 16px;
			background: rgba(var(--v-theme-surface), 0.8);
			backdrop-filter: blur(10px);
		}

		.selection-summary-card {
			border-radius: 16px;
			background: linear-gradient(
				135deg,
				rgba(var(--v-theme-primary), 0.1) 0%,
				rgba(var(--v-theme-primary), 0.05) 100%
			);
			backdrop-filter: blur(10px);
		}

		// Mobile specific styles
		.mobile-user-content {
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
				}
			}

			.mobile-user-header {
				padding-right: 40px; // Make room for selection checkbox
			}

			.mobile-user-details {
				.mobile-field {
					display: flex;
					justify-content: space-between;
					align-items: flex-start;
					padding: 8px 0;
					border-bottom: 1px solid rgba(var(--v-border-color), 0.06);

					&:last-child {
						border-bottom: none;
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
		}

		.mobile-actions {
			background: rgba(var(--v-theme-surface-variant), 0.05);

			.actions-container {
				display: flex;
				gap: 8px;
			}
		}
	}

	// Theme-specific styles
	.v-theme--dark {
		.selection-table-demo {
			background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);

			.demo-controls {
				background: rgba(30, 41, 59, 0.8);
			}

			.selection-summary-card {
				background: linear-gradient(
					135deg,
					rgba(var(--v-theme-primary), 0.15) 0%,
					rgba(var(--v-theme-primary), 0.08) 100%
				);
			}
		}
	}

	.v-theme--light {
		.selection-table-demo {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.9) 100%);

			.demo-controls {
				background: rgba(255, 255, 255, 0.8);
			}

			.selection-summary-card {
				background: linear-gradient(
					135deg,
					rgba(var(--v-theme-primary), 0.08) 0%,
					rgba(var(--v-theme-primary), 0.04) 100%
				);
			}
		}
	}

	// Responsive design
	@media (max-width: 768px) {
		.selection-table-demo {
			.mobile-user-content {
				.mobile-user-details {
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

			.mobile-actions {
				.actions-container {
					flex-direction: column;
					gap: 8px;
					width: 100%;

					.v-btn {
						width: 100%;
					}
				}
			}
		}
	}
</style>
