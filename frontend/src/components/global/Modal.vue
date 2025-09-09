<template>
	<VDialog
		v-model="innerValue"
		:max-width="fullscreen ? 'calc(100% - 6px)' : computedMaxWidth"
		:persistent="persistent || loading"
		:eager="eager"
		:fullscreen="fullscreen"
	>
		<VCard :loading="loading">
			<slot name="header">
				<VToolbar :color="color" :title="title" :class="{ 'v-toolbar-inactive': inactive }">
					<VSpacer />
					<VBtn
						v-if="!props.persistent"
						icon="$close"
						variant="text"
						color="white"
						class="my-n2"
						@click="cancel"
					/>
				</VToolbar>
			</slot>
			<VCardText
				class="px-2 pt-0 overflow-y-auto"
				:style="{ 'max-height': contentHeight ? `${contentHeight}px` : null }"
				:class="{
					'pb-5': hideFooter,
					'pb-0': !hideFooter,
				}"
			>
				<VContainer>
					<slot name="icon" />
					<slot />
				</VContainer>
			</VCardText>
			<VCardActions v-if="!hideFooter" class="px-5 py-5">
				<VSpacer v-if="hideConfirm" />
				<VBtn
					class="px-4"
					variant="outlined"
					color="var(--v-btn-default-color)"
					:disabled="loading"
					@click="cancel"
				>
					<VIcon icon="fas fa-xmark" class="mr-1" size="small" />
					{{ cancelText }}
				</VBtn>
				<slot name="actions.extra" />
				<VSpacer />
				<VBtn
					v-if="!hideConfirm && (props.onConfirm || props.confirmHref)"
					class="px-6"
					variant="flat"
					:color="valid ? color : 'secondary'"
					:href="confirmHref"
					:loading="loading"
					@click="confirm"
				>
					<VIcon v-if="confirmIcon" class="mr-1" :icon="confirmIcon" />
					{{ confirmText }}
				</VBtn>
			</VCardActions>
		</VCard>
	</VDialog>
</template>

<script>
	import { ref, computed, watch, onUnmounted } from "vue";
	let modalLayers = ref(0);
</script>

<script setup>
	import { useDisplay } from "vuetify";

	const { xs } = useDisplay();

	const emit = defineEmits(["confirm", "cancel", "update:modelValue"]);
	const props = defineProps({
		modelValue: {
			type: null,
			default: false,
		},
		/** The text to display above the main content */
		title: {
			type: String,
			required: true,
		},
		/** The color to use for the modal */
		color: {
			type: String,
			default: "success",
		},
		/** Show a loading spinner, prevent clicks */
		loading: {
			type: Boolean,
		},
		/** Limit the width of the modal. Handy for small amounts of content or quick messages */
		small: {
			type: Boolean,
		},
		/**
		 * Load the contents of the modal immediately, rather than when the modal is first displayed.
		 * Although there are valid reasons to do this, try to avoid it so initial page load is faster.
		 * */
		eager: {
			type: Boolean,
		},
		/**
		 * Make the modal take up the full screen. If null, mobile devices will do this by default.
		 */
		fullscreen: {
			type: [Boolean, null],
			default: null,
		},
		/**
		 * Limit the width of the modal. Where reasonable, try to use `small` instead.
		 */
		maxWidth: {
			type: Number,
			default: null,
		},
		/**
		 * Prevent closure of modal when clicking outside. Useful for modals with editable content that could be lost.
		 * Note: If you're putting a form in a modal, consider modal-form instead.
		 *
		 * Large forms generally should be on their own page instead of in a modal.
		 */
		persistent: {
			type: Boolean,
		},
		/**
		 * Set the confirmation button to primary when true.
		 */
		valid: {
			type: [Boolean],
			default: true,
		},
		/**
		 * Hide the confirmation button.
		 */
		hideConfirm: {
			type: Boolean,
		},
		/**
		 * Hide the footer section.
		 */
		hideFooter: {
			type: Boolean,
		},
		/**
		 * Text to show on the confirmation button.
		 */
		confirmText: {
			type: String,
			default: "Confirm",
		},
		/**
		 * Icon to show on the confirmation button.
		 */
		confirmIcon: {
			type: String,
			default: "far fa-floppy-disk",
		},
		/**
		 * Make the confirmation button 'error' instead of 'primary', to signify a destructive action.
		 * Red buttons should be used exclusively for the final click before a destructive action occurs, so don't use this
		 * if it's proceeded by another confirmation.
		 */
		confirmDangerous: {
			type: Boolean,
		},
		/**
		 * Text on the cancel button.
		 * Defaults to Close, or Cancel if there is a confirm button.
		 */
		cancelText: {
			type: String,
			default: null,
		},
		/**
		 * Confirm event. use `@confirm`.
		 * When present, will show a confirm button and change the default cancel text from 'close' to 'cancel'.
		 */
		onConfirm: {
			type: Function,
			default: null,
		},
		confirmHref: {
			type: String,
			default: null,
		},
		/**
		 * Cancel event.
		 * Use `@cancel`.
		 * If not overridden, will close the modal.
		 */
		onCancel: {
			type: Function,
			default: null,
		},
		size: {
			type: String,
			default: "default",
			validator(sizeValue) {
				const sizes = ["default", "small", "medium", "large"];
				return sizes.includes(sizeValue);
			},
		},
	});

	const innerValue = computed({
		get() {
			return props.modelValue;
		},
		set(value) {
			emit(`update:modelValue`, value);
		},
	});

	const persistent = computed(function () {
		return props.persistent || props.loading;
	});

	const cancelText = computed(function () {
		if (props.cancelText) {
			return props.cancelText;
		}
		if (props.persistent) {
			return "Cancel";
		}
		return "Close";
	});

	const computedMaxWidth = computed(function () {
		const sizes = {
			default: 912,
			small: 390,
			medium: 510,
			large: 1200,
		};

		if (props.small) {
			return 510;
		}

		if (props.maxWidth) {
			return props.maxWidth;
		}

		return sizes[props.size];
	});

	function cancel() {
		if (props.onCancel) {
			emit("cancel");
		} else {
			emit("update:modelValue", false);
		}
	}

	const fullscreen = computed(function () {
		return props.fullscreen === null ? xs.value && !props.small : props.fullscreen;
	});

	function calculateContentHeight() {
		const total =
			55 + // top
			45; // actions
		let modalHeight = window.innerHeight;
		const multiplier = fullscreen.value ? 1 : 0.85;
		return Math.floor((modalHeight - total) * multiplier);
	}
	const contentHeight = ref(calculateContentHeight());

	function confirm() {
		/** Emitted when the 'confirm' button has been pressed.
		 */
		emit("confirm");
	}

	// Active/inactive modals
	// This code assumes a FILO stack, based on when the modal was opened.
	const modalLayer = ref(null);
	const inactive = computed(function () {
		return modalLayers.value !== modalLayer.value;
	});
	if (props.modelValue) {
		// Handle modal being open on instantiation
		modalLayer.value = ++modalLayers.value;
	}
	watch(
		() => props.modelValue,
		function (value) {
			// Handle updates to modal being visible
			if (value) {
				modalLayer.value = ++modalLayers.value;
			} else {
				modalLayers.value--;
				modalLayer.value = null;
			}
		},
	);
	onUnmounted(function () {
		// Handle when the component gets destroyed before it has a chance to close
		if (props.modelValue) {
			modalLayers.value--;
		}
	});
</script>

<style lang="scss" scoped>
	:deep(.v-toolbar__content) {
		min-height: 39px;
		height: 39px !important;
		.v-toolbar-title__placeholder {
			overflow: unset !important;
			text-overflow: unset !important;
			font-size: var(--s-font-size) !important;
			font-weight: 500 !important;
			color: #fff;
			line-height: 20px;
		}
	}
	.v-toolbar-inactive {
		background: rgb(var(--v-theme-background)) !important;
		color: rgb(var(--v-theme-heading)) !important;
	}
	:deep(.v-toolbar-title) {
		margin-inline-start: 20px;
	}
	.overflow-y-auto {
		overflow-y: auto !important;
	}
</style>
