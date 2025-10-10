# Unified Table System

We've merged `TableView` and `SelectionTable` into a single, powerful table component. Here's how to use it:

## Basic Usage

### Simple Table (No Selection)

```vue
<template>
	<TableView :items="users" :headers="headers" :field-icons="fieldIcons">
		<template #item.name="{ item }">
			<strong>{{ item.name }}</strong>
		</template>

		<template #actions="{ item }">
			<VBtn icon="fas fa-edit" @click="edit(item)" />
		</template>
	</TableView>
</template>
```

### Selection Table

```vue
<template>
	<SelectionTable
		v-model="selectedItems"
		:items="users"
		:headers="headers"
		selectable
		searchable
		sortable
		:field-icons="fieldIcons"
		@bulk-delete="handleBulkDelete"
	>
		<template #item.name="{ item }">
			<strong>{{ item.name }}</strong>
		</template>

		<template #actions="{ item }">
			<VBtn icon="fas fa-edit" @click="edit(item)" />
		</template>
	</SelectionTable>
</template>
```

## Props

### Core Props

- `items` (Array, required) - Data array
- `headers` (Array, required) - Column definitions
- `selectable` (Boolean, default: false) - Enable selection features
- `searchable` (Boolean, default: false) - Enable search
- `sortable` (Boolean, default: false) - Enable sorting
- `hoverable` (Boolean, default: true) - Row hover effects
- `rowClickable` (Boolean, default: false) - Click rows to select

### Selection Props (when selectable=true)

- `v-model` (Array) - Selected item IDs
- `itemValue` (String, default: "id") - Property to use as item ID
- `hideSelection` (Boolean) - Hide selection UI but keep functionality
- `showBulkActions` (Boolean, default: true) - Show bulk action buttons

### UI Props

- `noItemsText` (String) - Empty state title
- `emptyStateSubtext` (String) - Empty state subtitle
- `headerIcons` (Object) - Icons for headers
- `fieldIcons` (Object) - Icons for mobile fields

### Control Props

- `hideActiveToggle` (Boolean) - Hide active/inactive toggle
- `hideAdd` (Boolean) - Hide add button
- `addText` (String, default: "Add") - Add button text

## Events

- `@add` - Add button clicked
- `@bulk-delete` - Bulk delete requested (selection mode)
- `@selection-change` - Selection changed (selection mode)
- `@sort` - Sort changed

## Slots

### Content Slots

- `#top` - Above table controls
- `#item.{key}` - Custom cell content
- `#actions` - Row actions
- `#mobile` - Custom mobile card layout

### Slot Props

All item slots receive:

- `item` - Row data
- `index` - Row index
- `selected` - Selection state (if selectable)

## Examples

### Headers Definition

```javascript
const headers = [
	{ title: "Name", key: "name" },
	{ title: "Email", key: "email" },
	{ title: "Role", key: "role", align: "center" },
	{ title: "Status", key: "status", align: "end" },
];
```

### Icons Definition

```javascript
const headerIcons = {
	name: "fas fa-user",
	email: "fas fa-envelope",
	role: "fas fa-user-tag",
	status: "fas fa-circle-dot",
};
```

## Migration from Old TableView

The old `TableView` component now automatically uses the new system with `selectable=false`. No changes needed for existing code!

## Mobile Responsive

- Desktop: Full data table with selection checkboxes
- Mobile: Card-based layout with touch-friendly selection
- Automatic responsive breakpoints
- Custom mobile templates supported

## Styling

The component uses your existing design system:

- Glass-morphism effects
- Gradient backgrounds
- Smooth animations
- Dark/light theme support
- Consistent spacing and typography
