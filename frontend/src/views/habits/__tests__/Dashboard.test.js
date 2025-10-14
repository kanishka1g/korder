import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Dashboard from "../Dashboard.vue";

// Mock the request utility
vi.mock("@/utils/request", () => ({
	default: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn(),
	},
}));

// Mock other utilities
vi.mock("@/utils/now", () => ({
	useNow: () => ({ value: new Date("2024-01-15") }),
}));

vi.mock("@/utils/useLogger", () => ({
	useLogger: () => ({ error: vi.fn() }),
}));

vi.mock("@/utils/loading", () => ({
	useLoading: () => ({ start: vi.fn(), end: vi.fn() }),
}));

vi.mock("@/utils/generic_modals", () => ({
	snackbar: { success: vi.fn(), warning: vi.fn() },
	confirmation: vi.fn(() => Promise.resolve(true)),
}));

// Mock dayjs
vi.mock("@/plugins/dayjs", () => ({
	default: vi.fn(() => ({
		format: vi.fn(() => "Monday, 15-Jan 2024"),
		isSame: vi.fn(() => false),
		isBetween: vi.fn(() => true),
		isAfter: vi.fn(() => false),
		add: vi.fn(() => new Date("2024-01-22")),
		day: vi.fn(() => ({ format: vi.fn(() => "Monday") })),
		valueOf: vi.fn(() => 1705276800000),
	})),
}));

// Mock components
vi.mock("@/components/common/DateField.vue", () => ({
	default: { template: '<div data-testid="date-field"></div>' },
}));

vi.mock("@/components/common/SelectionTable.vue", () => ({
	default: { template: '<div data-testid="selection-table"></div>' },
}));

vi.mock("@/components/common/DisplayDateTime.vue", () => ({
	default: { template: '<div data-testid="display-datetime"></div>' },
}));

vi.mock("@/components/common/DisplayWeekdays.vue", () => ({
	default: { template: '<div data-testid="display-weekdays"></div>' },
}));

vi.mock("@/components/global/Page.vue", () => ({
	default: {
		template: `
      <div data-testid="page-component">
        <div data-testid="page-title">{{ title }}</div>
        <div data-testid="page-actions"><slot name="actions"></slot></div>
        <div data-testid="page-content"><slot></slot></div>
      </div>
    `,
		props: ["title", "error"],
	},
}));

describe("Habits Dashboard", () => {
	let wrapper;

	const createWrapper = (props = {}) => {
		return mount(Dashboard, {
			global: {
				stubs: {
					Modal: { template: '<div data-testid="modal"><slot></slot></div>' },
					VContainer: { template: "<div><slot></slot></div>" },
					VRow: { template: "<div><slot></slot></div>" },
					VCol: { template: "<div><slot></slot></div>" },
					VCard: { template: "<div><slot></slot></div>" },
					VCardText: { template: "<div><slot></slot></div>" },
					VCardTitle: { template: "<div><slot></slot></div>" },
					VBtn: { template: "<button><slot></slot></button>" },
					VIcon: { template: "<i></i>" },
					VCheckbox: { template: '<input type="checkbox" />' },
					VTextField: { template: '<input type="text" />' },
					VTextarea: { template: "<textarea></textarea>" },
					VSelect: { template: "<select></select>" },
					VForm: { template: "<form><slot></slot></form>" },
					VAlert: { template: "<div><slot></slot></div>" },
					VChip: { template: "<span><slot></slot></span>" },
					VTabs: { template: "<div><slot></slot></div>" },
					VTab: { template: "<div><slot></slot></div>" },
					VTabsWindow: { template: "<div><slot></slot></div>" },
					VTabsWindowItem: { template: "<div><slot></slot></div>" },
					VExpandTransition: { template: "<div><slot></slot></div>" },
					VScrollXTransition: { template: "<div><slot></slot></div>" },
					VDivider: { template: "<hr />" },
				},
			},
			props,
		});
	};

	it("renders with Page component", () => {
		wrapper = createWrapper();

		// Verify Page component is used
		expect(wrapper.find('[data-testid="page-component"]').exists()).toBe(true);
		expect(wrapper.find('[data-testid="page-title"]').text()).toBe("Habits Dashboard");
	});

	it("displays the correct title and subtitle", () => {
		wrapper = createWrapper();

		expect(wrapper.find('[data-testid="page-title"]').text()).toBe("Habits Dashboard");
		expect(wrapper.text()).toContain("Track your daily habits and build consistency");
	});

	it("renders action button in Page component actions slot", () => {
		wrapper = createWrapper();

		const actionsSlot = wrapper.find('[data-testid="page-actions"]');
		expect(actionsSlot.exists()).toBe(true);
		expect(actionsSlot.text()).toContain("Add Habit");
	});

	it("renders main dashboard sections", () => {
		wrapper = createWrapper();

		// Check for stats cards
		expect(wrapper.findAll(".modern-stat-card")).toHaveLength(4);

		// Check for main content sections
		expect(wrapper.text()).toContain("Today's Habits");
		expect(wrapper.text()).toContain("Active Habits");
	});

	it("applies correct CSS classes for modern styling", () => {
		wrapper = createWrapper();

		// Check for modern styling classes
		expect(wrapper.find(".habits-dashboard").exists()).toBe(true);
		expect(wrapper.findAll(".modern-stat-card").length).toBeGreaterThan(0);
		expect(wrapper.findAll(".modern-card").length).toBeGreaterThan(0);
	});

	it("renders habit modal with correct structure", () => {
		wrapper = createWrapper();

		// Check modal exists
		expect(wrapper.find('[data-testid="modal"]').exists()).toBe(true);
	});

	it("handles responsive design classes", () => {
		wrapper = createWrapper();

		// Check for responsive elements
		expect(wrapper.find(".dashboard-subtitle").exists()).toBe(true);
		expect(wrapper.find(".add-habit-btn").exists()).toBe(true);
	});

	it("maintains all interactive elements", () => {
		wrapper = createWrapper();

		// Check for interactive elements
		expect(wrapper.findAll("button").length).toBeGreaterThan(0);
		expect(wrapper.find('[data-testid="selection-table"]').exists()).toBe(true);
		expect(wrapper.find('[data-testid="date-field"]').exists()).toBe(true);
	});

	it("preserves gradient and backdrop styling", () => {
		wrapper = createWrapper();

		// Check for styling classes that provide visual effects
		expect(wrapper.find(".habits-dashboard").classes()).toContain("habits-dashboard");
		expect(wrapper.findAll(".modern-stat-card").length).toBeGreaterThan(0);
	});
});
