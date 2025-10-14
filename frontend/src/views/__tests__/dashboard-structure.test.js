import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import HabitsDashboard from "../habits/Dashboard.vue";
import HealthDashboard from "../health/Dashboard.vue";

// Mock dependencies
vi.mock("@/utils/now", () => ({
	useNow: () => ({ value: new Date("2024-01-15") }),
}));

vi.mock("@/utils/request", () => ({
	default: {
		get: vi.fn(() => Promise.resolve({ data: [] })),
		post: vi.fn(() => Promise.resolve({ data: { message: "Success" } })),
		put: vi.fn(() => Promise.resolve({ data: { message: "Success" } })),
		delete: vi.fn(() => Promise.resolve({ data: { message: "Success" } })),
	},
}));

vi.mock("@/utils/useLogger", () => ({
	useLogger: () => ({
		error: vi.fn(),
	}),
}));

vi.mock("@/utils/loading", () => ({
	useLoading: () => ({
		start: vi.fn(),
		end: vi.fn(),
	}),
}));

vi.mock("@/utils/generic_modals", () => ({
	snackbar: {
		success: vi.fn(),
		warning: vi.fn(),
	},
	confirmation: vi.fn(() => Promise.resolve(true)),
}));

// Mock Page component
vi.mock("@/components/global/Page.vue", () => ({
	default: {
		name: "Page",
		template: `
      <div class="page-component">
        <header class="page-header">
          <h1>{{ title }}</h1>
          <div class="page-actions">
            <slot name="actions"></slot>
          </div>
        </header>
        <main class="page-content">
          <slot></slot>
        </main>
      </div>
    `,
		props: ["title", "error"],
	},
}));

// Mock other components
const mockComponents = [
	"DateField",
	"SelectionTable",
	"DisplayDateTime",
	"DisplayWeekdays",
	"LineChart",
	"Modal",
].reduce((acc, name) => {
	acc[name] = {
		name,
		template: `<div class="mock-${name.toLowerCase()}"><slot></slot></div>`,
		props: { modelValue: null },
	};
	return acc;
}, {});

describe("Dashboard Page Component Integration", () => {
	let vuetify;

	beforeEach(() => {
		vuetify = createVuetify({
			components,
			directives,
		});
	});

	describe("Habits Dashboard", () => {
		it("should use Page component as root wrapper", async () => {
			const wrapper = mount(HabitsDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			expect(wrapper.find(".page-component").exists()).toBe(true);
			expect(wrapper.find(".page-header").exists()).toBe(true);
			expect(wrapper.find(".page-content").exists()).toBe(true);
		});

		it("should display correct title in Page component", async () => {
			const wrapper = mount(HabitsDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			expect(wrapper.find("h1").text()).toBe("Habits Dashboard");
		});

		it("should have Add Habit button in actions slot", async () => {
			const wrapper = mount(HabitsDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			const actionsSlot = wrapper.find(".page-actions");
			expect(actionsSlot.exists()).toBe(true);
			expect(actionsSlot.text()).toContain("Add Habit");
		});

		it("should display subtitle correctly", async () => {
			const wrapper = mount(HabitsDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			expect(wrapper.text()).toContain("Track your daily habits and build consistency");
		});

		it("should have habits-dashboard CSS class", async () => {
			const wrapper = mount(HabitsDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			expect(wrapper.classes()).toContain("habits-dashboard");
		});

		it("should render stat cards section", async () => {
			const wrapper = mount(HabitsDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			expect(wrapper.find(".modern-stat-card").exists()).toBe(true);
		});

		it("should render today's habits section", async () => {
			const wrapper = mount(HabitsDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			expect(wrapper.text()).toContain("Today's Habits");
		});

		it("should render active habits table section", async () => {
			const wrapper = mount(HabitsDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			expect(wrapper.text()).toContain("Active Habits");
			expect(wrapper.find(".mock-selectiontable").exists()).toBe(true);
		});
	});

	describe("Health Dashboard", () => {
		it("should use Page component as root wrapper", async () => {
			const wrapper = mount(HealthDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			expect(wrapper.find(".page-component").exists()).toBe(true);
			expect(wrapper.find(".page-header").exists()).toBe(true);
			expect(wrapper.find(".page-content").exists()).toBe(true);
		});

		it("should display correct title in Page component", async () => {
			const wrapper = mount(HealthDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			expect(wrapper.find("h1").text()).toBe("Health Dashboard");
		});

		it("should have Quick Add button in actions slot", async () => {
			const wrapper = mount(HealthDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			const actionsSlot = wrapper.find(".page-actions");
			expect(actionsSlot.exists()).toBe(true);
			expect(actionsSlot.text()).toContain("Quick Add");
		});

		it("should display subtitle correctly", async () => {
			const wrapper = mount(HealthDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			expect(wrapper.text()).toContain("Track your fitness journey and wellness goals");
		});

		it("should have health-dashboard CSS class", async () => {
			const wrapper = mount(HealthDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			expect(wrapper.classes()).toContain("health-dashboard");
		});

		it("should render health stats overview", async () => {
			const wrapper = mount(HealthDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			expect(wrapper.text()).toContain("Current Weight");
			expect(wrapper.text()).toContain("Avg Calories/Day");
			expect(wrapper.text()).toContain("Workouts This Week");
			expect(wrapper.text()).toContain("Meals Logged");
		});

		it("should render tab navigation", async () => {
			const wrapper = mount(HealthDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			expect(wrapper.text()).toContain("Weight Tracking");
			expect(wrapper.text()).toContain("Workouts");
			expect(wrapper.text()).toContain("Meals");
		});

		it("should render weight tracking content by default", async () => {
			const wrapper = mount(HealthDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			expect(wrapper.text()).toContain("Weight & Calories Trend");
			expect(wrapper.text()).toContain("Weight Log");
			expect(wrapper.find(".mock-linechart").exists()).toBe(true);
		});
	});

	describe("Cross-Dashboard Consistency", () => {
		it("should both use identical Page component structure", async () => {
			const habitsWrapper = mount(HabitsDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			const healthWrapper = mount(HealthDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			// Both should have Page component structure
			expect(habitsWrapper.find(".page-component").exists()).toBe(true);
			expect(healthWrapper.find(".page-component").exists()).toBe(true);

			// Both should have header and content sections
			expect(habitsWrapper.find(".page-header").exists()).toBe(true);
			expect(healthWrapper.find(".page-header").exists()).toBe(true);
			expect(habitsWrapper.find(".page-content").exists()).toBe(true);
			expect(healthWrapper.find(".page-content").exists()).toBe(true);
		});

		it("should both have action buttons in header", async () => {
			const habitsWrapper = mount(HabitsDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			const healthWrapper = mount(HealthDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			expect(habitsWrapper.find(".page-actions").exists()).toBe(true);
			expect(healthWrapper.find(".page-actions").exists()).toBe(true);
		});

		it("should both have dashboard subtitle sections", async () => {
			const habitsWrapper = mount(HabitsDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			const healthWrapper = mount(HealthDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			expect(habitsWrapper.find(".dashboard-subtitle").exists()).toBe(true);
			expect(healthWrapper.find(".dashboard-subtitle").exists()).toBe(true);
		});

		it("should both use modern card styling", async () => {
			const habitsWrapper = mount(HabitsDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			const healthWrapper = mount(HealthDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			expect(habitsWrapper.find(".modern-card").exists()).toBe(true);
			expect(healthWrapper.find(".modern-card").exists()).toBe(true);
			expect(habitsWrapper.find(".modern-stat-card").exists()).toBe(true);
			expect(healthWrapper.find(".modern-stat-card").exists()).toBe(true);
		});
	});

	describe("Error Handling", () => {
		it("should pass error prop to Page component in habits dashboard", async () => {
			const wrapper = mount(HabitsDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			// Check that Page component receives error prop
			const pageComponent = wrapper.findComponent({ name: "Page" });
			expect(pageComponent.exists()).toBe(true);
			expect(pageComponent.props()).toHaveProperty("error");
		});

		it("should pass error prop to Page component in health dashboard", async () => {
			const wrapper = mount(HealthDashboard, {
				global: {
					plugins: [vuetify],
					components: mockComponents,
				},
			});

			// Check that Page component receives error prop
			const pageComponent = wrapper.findComponent({ name: "Page" });
			expect(pageComponent.exists()).toBe(true);
			expect(pageComponent.props()).toHaveProperty("error");
		});
	});
});
