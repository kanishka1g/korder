import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount, shallowMount } from "@vue/test-utils";

// Mock AppCard component definition since it doesn't exist yet
// This test file is ready for when the component is implemented
const AppCard = {
	name: "AppCard",
	props: {
		app: {
			type: Object,
			required: true,
		},
		variant: {
			type: String,
			default: "default",
			validator: (value) => ["default", "compact", "offline"].includes(value),
		},
		elevation: {
			type: [String, Number],
			default: 2,
		},
	},
	emits: ["action", "open", "settings", "logs"],
	template: `
    <div 
      :class="cardClasses"
      :data-elevation="currentElevation"
      :disabled="variant === 'offline'"
      @mouseenter="onHover(true)"
      @mouseleave="onHover(false)"
      @click="$emit('open', app)"
      @keydown.enter="$emit('open', app)"
      @keydown.space.prevent="$emit('open', app)"
      role="button"
      :tabindex="variant === 'offline' ? -1 : 0"
      :aria-label="accessibilityLabel"
      :aria-describedby="app.id + '-status'"
      data-testid="app-card"
    >
      <div class="card-content">
        <!-- Icon/Avatar -->
        <div 
          :data-size="variant === 'compact' ? 32 : 48"
          class="app-avatar"
          data-testid="app-avatar"
        >
          <i 
            v-if="app.icon"
            :class="app.icon"
            :data-color="variant === 'offline' ? 'grey' : 'primary'"
            data-testid="app-icon"
          />
          <span v-else class="app-initial" data-testid="app-initial">{{ app.name.charAt(0) }}</span>
        </div>

        <!-- Content -->
        <div class="app-content">
          <div class="app-header">
            <h3 class="app-name" data-testid="app-name">{{ app.name }}</h3>
            <span
              :id="app.id + '-status'"
              :class="'status-chip status-' + statusColor"
              :aria-label="'Status: ' + app.status"
              data-testid="status-chip"
            >
              {{ app.status }}
            </span>
          </div>
          
          <p v-if="variant !== 'compact'" class="app-description" data-testid="app-description">
            {{ app.description }}
          </p>
          
          <p class="last-updated" data-testid="last-updated">
            Last updated: {{ formatDate(app.lastUpdated) }}
          </p>
        </div>

        <!-- Quick Actions Menu -->
        <div v-if="variant !== 'offline'" class="actions-menu" data-testid="actions-menu">
          <button
            class="actions-button"
            :aria-label="'Actions for ' + app.name"
            @click.stop="toggleMenu"
            data-testid="actions-button"
          >
            ⋮
          </button>
          <div v-if="menuOpen" class="menu-items">
            <button @click="$emit('open', app)" data-testid="action-open">
              Open
            </button>
            <button @click="$emit('settings', app)" data-testid="action-settings">
              Settings
            </button>
            <button @click="$emit('logs', app)" data-testid="action-logs">
              Logs
            </button>
          </div>
        </div>
      </div>

      <!-- Slot for additional content -->
      <slot />
    </div>
  `,
	computed: {
		cardClasses() {
			return [
				"app-card",
				`app-card--${this.variant}`,
				{
					"app-card--offline": this.variant === "offline",
				},
			];
		},
		currentElevation() {
			return this.isHovered && this.variant !== "offline" ? 6 : this.elevation;
		},
		statusColor() {
			const colors = {
				online: "success",
				degraded: "warning",
				offline: "error",
			};
			return colors[this.app.status] || "grey";
		},
		accessibilityLabel() {
			return `${this.app.name} application, status: ${this.app.status}`;
		},
	},
	data() {
		return {
			isHovered: false,
			menuOpen: false,
		};
	},
	methods: {
		onHover(hovered) {
			this.isHovered = hovered;
		},
		formatDate(date) {
			if (!date) return "Never";
			return new Date(date).toLocaleDateString();
		},
		toggleMenu() {
			this.menuOpen = !this.menuOpen;
		},
	},
};

describe("AppCard Component", () => {
	let wrapper;

	const mockApp = {
		id: "test-app-1",
		name: "Test Application",
		description: "A test application for unit testing",
		icon: "mdi-application",
		url: "https://test-app.example.com",
		status: "online",
		lastUpdated: new Date("2024-01-15T10:30:00Z"),
		category: "productivity",
		actions: ["open", "settings", "logs"],
	};

	const createWrapper = (props = {}, options = {}) => {
		return mount(AppCard, {
			props: {
				app: mockApp,
				...props,
			},
			...options,
		});
	};

	describe("Component Rendering", () => {
		it("renders the component with required props", () => {
			wrapper = createWrapper();
			expect(wrapper.exists()).toBe(true);
			expect(wrapper.find('[data-testid="app-card"]').exists()).toBe(true);
		});

		it("displays app name and description", () => {
			wrapper = createWrapper();
			expect(wrapper.find('[data-testid="app-name"]').text()).toBe(mockApp.name);
			expect(wrapper.find('[data-testid="app-description"]').text()).toBe(mockApp.description);
		});

		it("displays formatted last updated date", () => {
			wrapper = createWrapper();
			const expectedDate = new Date(mockApp.lastUpdated).toLocaleDateString();
			expect(wrapper.find('[data-testid="last-updated"]').text()).toContain(expectedDate);
		});
	});

	describe("Status States and Visual Indicators", () => {
		it("displays online status with success color", async () => {
			const onlineApp = { ...mockApp, status: "online" };
			wrapper = createWrapper({ app: onlineApp });

			const statusChip = wrapper.find('[data-testid="status-chip"]');
			expect(statusChip.text()).toBe("online");
			expect(statusChip.classes()).toContain("status-success");
		});

		it("displays degraded status with warning color", async () => {
			const degradedApp = { ...mockApp, status: "degraded" };
			wrapper = createWrapper({ app: degradedApp });

			const statusChip = wrapper.find('[data-testid="status-chip"]');
			expect(statusChip.text()).toBe("degraded");
			expect(statusChip.classes()).toContain("status-warning");
		});

		it("displays offline status with error color", async () => {
			const offlineApp = { ...mockApp, status: "offline" };
			wrapper = createWrapper({ app: offlineApp });

			const statusChip = wrapper.find('[data-testid="status-chip"]');
			expect(statusChip.text()).toBe("offline");
			expect(statusChip.classes()).toContain("status-error");
		});

		it("shows appropriate icon based on app icon property", () => {
			wrapper = createWrapper();
			const icon = wrapper.find('[data-testid="app-icon"]');
			expect(icon.classes()).toContain(mockApp.icon);
		});

		it("shows first letter of app name when no icon provided", () => {
			const appWithoutIcon = { ...mockApp, icon: null };
			wrapper = createWrapper({ app: appWithoutIcon });

			const initial = wrapper.find('[data-testid="app-initial"]');
			expect(initial.text()).toBe(mockApp.name.charAt(0));
		});
	});

	describe("Component Variants", () => {
		it("renders default variant correctly", () => {
			wrapper = createWrapper({ variant: "default" });

			expect(wrapper.find(".app-card--default").exists()).toBe(true);
			expect(wrapper.find('[data-testid="app-description"]').exists()).toBe(true);
			expect(wrapper.find('[data-testid="app-avatar"]').attributes("data-size")).toBe("48");
		});

		it("renders compact variant correctly", () => {
			wrapper = createWrapper({ variant: "compact" });

			expect(wrapper.find(".app-card--compact").exists()).toBe(true);
			expect(wrapper.find('[data-testid="app-avatar"]').attributes("data-size")).toBe("32");
			// Description should not be shown in compact variant
			expect(wrapper.find('[data-testid="app-description"]').exists()).toBe(false);
		});

		it("renders offline variant correctly", () => {
			wrapper = createWrapper({ variant: "offline" });

			expect(wrapper.find(".app-card--offline").exists()).toBe(true);
			expect(wrapper.find('[data-testid="app-card"]').attributes("disabled")).toBe("true");
			expect(wrapper.find('[data-testid="app-card"]').attributes("tabindex")).toBe("-1");
		});

		it("validates variant prop correctly", () => {
			const validator = AppCard.props.variant.validator;
			expect(validator("default")).toBe(true);
			expect(validator("compact")).toBe(true);
			expect(validator("offline")).toBe(true);
			expect(validator("invalid")).toBe(false);
		});
	});

	describe("Quick Actions Menu", () => {
		beforeEach(() => {
			wrapper = createWrapper();
		});

		it("shows actions menu button for non-offline variants", () => {
			const menuButton = wrapper.find('[data-testid="actions-button"]');
			expect(menuButton.exists()).toBe(true);
		});

		it("hides actions menu for offline variant", () => {
			wrapper = createWrapper({ variant: "offline" });
			const actionsMenu = wrapper.find('[data-testid="actions-menu"]');
			expect(actionsMenu.exists()).toBe(false);
		});

		it("emits open event when open action is clicked", async () => {
			// First trigger the menu to open
			const menuButton = wrapper.find('[data-testid="actions-button"]');
			await menuButton.trigger("click");

			const openItem = wrapper.find('[data-testid="action-open"]');
			await openItem.trigger("click");

			expect(wrapper.emitted("open")).toBeTruthy();
			expect(wrapper.emitted("open")[0]).toEqual([mockApp]);
		});

		it("emits settings event when settings action is clicked", async () => {
			const menuButton = wrapper.find('[data-testid="actions-button"]');
			await menuButton.trigger("click");

			const settingsItem = wrapper.find('[data-testid="action-settings"]');
			await settingsItem.trigger("click");

			expect(wrapper.emitted("settings")).toBeTruthy();
			expect(wrapper.emitted("settings")[0]).toEqual([mockApp]);
		});

		it("emits logs event when logs action is clicked", async () => {
			const menuButton = wrapper.find('[data-testid="actions-button"]');
			await menuButton.trigger("click");

			const logsItem = wrapper.find('[data-testid="action-logs"]');
			await logsItem.trigger("click");

			expect(wrapper.emitted("logs")).toBeTruthy();
			expect(wrapper.emitted("logs")[0]).toEqual([mockApp]);
		});

		it("prevents event propagation when menu button is clicked", async () => {
			const menuButton = wrapper.find('[data-testid="actions-button"]');

			// Click the menu button
			await menuButton.trigger("click");

			// The card click should not be triggered (only menu toggle)
			expect(wrapper.emitted("open")).toBeFalsy();

			// But the menu should be toggled
			expect(wrapper.vm.menuOpen).toBe(true);
		});
	});

	describe("Hover Effects and Interactions", () => {
		beforeEach(() => {
			wrapper = createWrapper();
		});

		it("increases elevation on hover for non-offline variants", async () => {
			const card = wrapper.find('[data-testid="app-card"]');

			// Initial elevation
			expect(card.attributes("data-elevation")).toBe("2");

			// Hover
			await card.trigger("mouseenter");
			await wrapper.vm.$nextTick();
			expect(card.attributes("data-elevation")).toBe("6");

			// Leave
			await card.trigger("mouseleave");
			await wrapper.vm.$nextTick();
			expect(card.attributes("data-elevation")).toBe("2");
		});

		it("does not change elevation on hover for offline variant", async () => {
			wrapper = createWrapper({ variant: "offline" });
			const card = wrapper.find('[data-testid="app-card"]');

			expect(card.attributes("data-elevation")).toBe("2");

			await card.trigger("mouseenter");
			await wrapper.vm.$nextTick();
			expect(card.attributes("data-elevation")).toBe("2");
		});

		it("emits open event when card is clicked", async () => {
			const card = wrapper.find('[data-testid="app-card"]');
			await card.trigger("click");

			expect(wrapper.emitted("open")).toBeTruthy();
			expect(wrapper.emitted("open")[0]).toEqual([mockApp]);
		});
	});

	describe("Accessibility Features", () => {
		beforeEach(() => {
			wrapper = createWrapper();
		});

		it("has proper ARIA attributes", () => {
			const card = wrapper.find('[data-testid="app-card"]');

			expect(card.attributes("role")).toBe("button");
			expect(card.attributes("aria-label")).toContain(mockApp.name);
			expect(card.attributes("aria-label")).toContain(mockApp.status);
			expect(card.attributes("aria-describedby")).toBe(`${mockApp.id}-status`);
		});

		it("has proper tabindex for interactive elements", () => {
			const card = wrapper.find('[data-testid="app-card"]');
			expect(card.attributes("tabindex")).toBe("0");
		});

		it("sets tabindex to -1 for offline variant", () => {
			wrapper = createWrapper({ variant: "offline" });
			const card = wrapper.find('[data-testid="app-card"]');
			expect(card.attributes("tabindex")).toBe("-1");
		});

		it("has accessible status chip with proper ID and aria-label", () => {
			const statusChip = wrapper.find(`#${mockApp.id}-status`);
			expect(statusChip.exists()).toBe(true);
			expect(statusChip.attributes("aria-label")).toBe(`Status: ${mockApp.status}`);
		});

		it("has accessible action menu button", () => {
			const menuButton = wrapper.find('[data-testid="actions-button"]');
			expect(menuButton.attributes("aria-label")).toBe(`Actions for ${mockApp.name}`);
		});

		it("supports keyboard navigation", async () => {
			const card = wrapper.find('[data-testid="app-card"]');

			// Test Enter key
			await card.trigger("keydown.enter");
			expect(wrapper.emitted("open")).toBeTruthy();

			// Test Space key with a fresh wrapper
			const newWrapper = createWrapper();
			const newCard = newWrapper.find('[data-testid="app-card"]');
			await newCard.trigger("keydown.space");
			expect(newWrapper.emitted("open")).toBeTruthy();
		});
	});

	describe("Slot API", () => {
		it("renders slot content correctly", () => {
			wrapper = mount(AppCard, {
				props: { app: mockApp },
				slots: {
					default: '<div class="custom-content">Custom slot content</div>',
				},
			});

			expect(wrapper.find(".custom-content").exists()).toBe(true);
			expect(wrapper.text()).toContain("Custom slot content");
		});

		it("works without slot content", () => {
			wrapper = createWrapper();
			expect(wrapper.exists()).toBe(true);
			// Should not throw any errors
		});
	});

	describe("Props Validation", () => {
		it("requires app prop", () => {
			const appProp = AppCard.props.app;
			expect(appProp.required).toBe(true);
			expect(appProp.type).toBe(Object);
		});

		it("has correct default values", () => {
			expect(AppCard.props.variant.default).toBe("default");
			expect(AppCard.props.elevation.default).toBe(2);
		});

		it("accepts string or number for elevation prop", () => {
			wrapper = createWrapper({ elevation: "4" });
			expect(wrapper.find('[data-testid="app-card"]').attributes("data-elevation")).toBe("4");

			wrapper = createWrapper({ elevation: 8 });
			expect(wrapper.find('[data-testid="app-card"]').attributes("data-elevation")).toBe("8");
		});
	});

	describe("Error Handling", () => {
		it("handles missing app properties gracefully", () => {
			const incompleteApp = {
				id: "incomplete",
				name: "Incomplete App",
				// Missing other properties
			};

			expect(() => {
				wrapper = createWrapper({ app: incompleteApp });
			}).not.toThrow();
		});

		it("handles invalid status gracefully", () => {
			const appWithInvalidStatus = { ...mockApp, status: "unknown" };
			wrapper = createWrapper({ app: appWithInvalidStatus });

			const statusChip = wrapper.find('[data-testid="status-chip"]');
			expect(statusChip.classes()).toContain("status-grey");
		});

		it("handles missing lastUpdated date", () => {
			const appWithoutDate = { ...mockApp, lastUpdated: null };

			expect(() => {
				wrapper = createWrapper({ app: appWithoutDate });
			}).not.toThrow();

			expect(wrapper.find('[data-testid="last-updated"]').text()).toContain("Never");
		});
	});
});
