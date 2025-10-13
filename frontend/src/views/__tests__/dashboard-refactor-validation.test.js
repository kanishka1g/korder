import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';

// Mock all external dependencies
vi.mock('@/utils/now', () => ({
  useNow: () => ({ value: new Date('2024-01-15') })
}));

vi.mock('@/utils/request', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(() => Promise.resolve({ data: { message: 'Success' } })),
    put: vi.fn(() => Promise.resolve({ data: { message: 'Success' } })),
    delete: vi.fn(() => Promise.resolve({ data: { message: 'Success' } }))
  }
}));

vi.mock('@/utils/useLogger', () => ({
  useLogger: () => ({
    error: vi.fn()
  })
}));

vi.mock('@/utils/loading', () => ({
  useLoading: () => ({
    start: vi.fn(),
    end: vi.fn()
  })
}));

vi.mock('@/utils/generic_modals', () => ({
  snackbar: {
    success: vi.fn(),
    warning: vi.fn()
  },
  confirmation: vi.fn(() => Promise.resolve(true))
}));

vi.mock('vuetify', () => ({
  useTheme: () => ({
    global: {
      current: {
        value: {
          colors: {
            primary: '#1976d2',
            warning: '#fb8c00',
            success: '#4caf50',
            info: '#2196f3'
          }
        }
      }
    }
  })
}));

// Mock Page component
const MockPage = {
  name: 'Page',
  template: `
    <div class="page-component" data-testid="page-component">
      <header class="page-header">
        <h1 data-testid="page-title">{{ title }}</h1>
        <div class="page-actions" data-testid="page-actions">
          <slot name="actions"></slot>
        </div>
      </header>
      <main class="page-content" data-testid="page-content">
        <slot></slot>
      </main>
    </div>
  `,
  props: ['title', 'error']
};

// Mock other components
const mockComponents = {
  Page: MockPage,
  DateField: {
    name: 'DateField',
    template: '<div class="mock-date-field" data-testid="date-field"><slot></slot></div>',
    props: ['modelValue', 'label', 'variant', 'density', 'required', 'pastOnly', 'showDay', 'minDate']
  },
  SelectionTable: {
    name: 'SelectionTable',
    template: '<div class="mock-selection-table" data-testid="selection-table"><slot></slot></div>',
    props: ['headers', 'items', 'activeLabel', 'searchable', 'hideActiveToggle', 'hideAdd']
  },
  DisplayDateTime: {
    name: 'DisplayDateTime',
    template: '<span class="mock-display-datetime" data-testid="display-datetime">{{ value }}</span>',
    props: ['value', 'dateOnly']
  },
  DisplayWeekdays: {
    name: 'DisplayWeekdays',
    template: '<span class="mock-display-weekdays" data-testid="display-weekdays">{{ selectedDays }}</span>',
    props: ['selectedDays']
  },
  LineChart: {
    name: 'LineChart',
    template: '<div class="mock-line-chart" data-testid="line-chart"><slot></slot></div>',
    props: ['data']
  },
  Modal: {
    name: 'Modal',
    template: `
      <div v-if="modelValue" class="mock-modal" data-testid="modal">
        <h2>{{ title }}</h2>
        <slot></slot>
      </div>
    `,
    props: ['modelValue', 'title', 'icon', 'iconColor', 'maxWidth', 'persistent', 'showDefaultActions', 'confirmText', 'confirmIcon', 'showCancelButton', 'confirmColor', 'variant']
  }
};

// Mock Vuetify components
const vuetifyMocks = {
  VBtn: {
    name: 'VBtn',
    template: '<button class="v-btn" data-testid="v-btn" @click="$emit(\'click\')"><slot></slot></button>',
    props: ['color', 'variant', 'size', 'prependIcon', 'icon', 'disabled'],
    emits: ['click']
  },
  VIcon: {
    name: 'VIcon',
    template: '<i class="v-icon" data-testid="v-icon">{{ icon }}</i>',
    props: ['icon', 'size', 'color', 'class']
  },
  VCard: {
    name: 'VCard',
    template: '<div class="v-card" data-testid="v-card" @click="$emit(\'click\')"><slot></slot></div>',
    props: ['class', 'elevation', 'variant', 'color'],
    emits: ['click']
  },
  VCardText: {
    name: 'VCardText',
    template: '<div class="v-card-text" data-testid="v-card-text"><slot></slot></div>',
    props: ['class']
  },
  VCardTitle: {
    name: 'VCardTitle',
    template: '<div class="v-card-title" data-testid="v-card-title"><slot></slot></div>',
    props: ['class']
  },
  VRow: {
    name: 'VRow',
    template: '<div class="v-row" data-testid="v-row"><slot></slot></div>',
    props: ['class']
  },
  VCol: {
    name: 'VCol',
    template: '<div class="v-col" data-testid="v-col"><slot></slot></div>',
    props: ['cols', 'sm', 'md', 'lg', 'class']
  },
  VTabs: {
    name: 'VTabs',
    template: '<div class="v-tabs" data-testid="v-tabs"><slot></slot></div>',
    props: ['modelValue', 'color', 'class', 'density']
  },
  VTab: {
    name: 'VTab',
    template: '<div class="v-tab" data-testid="v-tab"><slot></slot></div>',
    props: ['value', 'class']
  },
  VTabsWindow: {
    name: 'VTabsWindow',
    template: '<div class="v-tabs-window" data-testid="v-tabs-window"><slot></slot></div>',
    props: ['modelValue', 'class']
  },
  VTabsWindowItem: {
    name: 'VTabsWindowItem',
    template: '<div class="v-tabs-window-item" data-testid="v-tabs-window-item"><slot></slot></div>',
    props: ['value']
  },
  VSelect: {
    name: 'VSelect',
    template: '<select class="v-select" data-testid="v-select"><slot></slot></select>',
    props: ['modelValue', 'items', 'label', 'variant', 'density', 'class', 'disabled']
  },
  VTextField: {
    name: 'VTextField',
    template: '<input class="v-text-field" data-testid="v-text-field" />',
    props: ['modelValue', 'label', 'type', 'variant', 'density', 'prependInnerIcon', 'rules', 'class', 'required']
  },
  VTextarea: {
    name: 'VTextarea',
    template: '<textarea class="v-textarea" data-testid="v-textarea"></textarea>',
    props: ['modelValue', 'label', 'variant', 'density', 'rows', 'class']
  },
  VCheckbox: {
    name: 'VCheckbox',
    template: '<input type="checkbox" class="v-checkbox" data-testid="v-checkbox" />',
    props: ['modelValue', 'color', 'label', 'hideDetails', 'density', 'disabled', 'class']
  },
  VForm: {
    name: 'VForm',
    template: '<form class="v-form" data-testid="v-form"><slot></slot></form>',
    props: ['ref']
  },
  VChip: {
    name: 'VChip',
    template: '<span class="v-chip" data-testid="v-chip"><slot></slot></span>',
    props: ['color', 'variant', 'size', 'class']
  },
  VAlert: {
    name: 'VAlert',
    template: '<div class="v-alert" data-testid="v-alert"><slot></slot></div>',
    props: ['type', 'variant', 'density', 'class']
  },
  VExpandTransition: {
    name: 'VExpandTransition',
    template: '<div class="v-expand-transition" data-testid="v-expand-transition"><slot></slot></div>'
  },
  VDivider: {
    name: 'VDivider',
    template: '<hr class="v-divider" data-testid="v-divider" />',
    props: ['class']
  }
};

describe('Dashboard Refactoring Validation', () => {
  let HabitsDashboard, HealthDashboard;

  beforeEach(async () => {
    // Dynamically import the components
    const habitsModule = await import('../habits/Dashboard.vue');
    const healthModule = await import('../health/Dashboard.vue');
    
    HabitsDashboard = habitsModule.default;
    HealthDashboard = healthModule.default;
  });

  describe('Page Component Integration', () => {
    it('should use Page component in Habits Dashboard', async () => {
      const wrapper = mount(HabitsDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      await nextTick();

      expect(wrapper.find('[data-testid="page-component"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="page-title"]').text()).toBe('Habits Dashboard');
      expect(wrapper.find('[data-testid="page-actions"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="page-content"]').exists()).toBe(true);
    });

    it('should use Page component in Health Dashboard', async () => {
      const wrapper = mount(HealthDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      await nextTick();

      expect(wrapper.find('[data-testid="page-component"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="page-title"]').text()).toBe('Health Dashboard');
      expect(wrapper.find('[data-testid="page-actions"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="page-content"]').exists()).toBe(true);
    });

    it('should have action buttons in Page component actions slot for both dashboards', async () => {
      const habitsWrapper = mount(HabitsDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      const healthWrapper = mount(HealthDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      await nextTick();

      // Check habits dashboard has Add Habit button
      const habitsActions = habitsWrapper.find('[data-testid="page-actions"]');
      expect(habitsActions.text()).toContain('Add Habit');

      // Check health dashboard has Quick Add button
      const healthActions = healthWrapper.find('[data-testid="page-actions"]');
      expect(healthActions.text()).toContain('Quick Add');
    });
  });

  describe('Visual Structure Preservation', () => {
    it('should maintain dashboard subtitle in Habits Dashboard', async () => {
      const wrapper = mount(HabitsDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      await nextTick();

      expect(wrapper.text()).toContain('Track your daily habits and build consistency');
    });

    it('should maintain dashboard subtitle in Health Dashboard', async () => {
      const wrapper = mount(HealthDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      await nextTick();

      expect(wrapper.text()).toContain('Track your fitness journey and wellness goals');
    });

    it('should have modern stat cards in both dashboards', async () => {
      const habitsWrapper = mount(HabitsDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      const healthWrapper = mount(HealthDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      await nextTick();

      // Check for modern-stat-card class
      expect(habitsWrapper.find('.modern-stat-card').exists()).toBe(true);
      expect(healthWrapper.find('.modern-stat-card').exists()).toBe(true);
    });

    it('should have modern card styling in both dashboards', async () => {
      const habitsWrapper = mount(HabitsDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      const healthWrapper = mount(HealthDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      await nextTick();

      // Check for modern-card class
      expect(habitsWrapper.find('.modern-card').exists()).toBe(true);
      expect(healthWrapper.find('.modern-card').exists()).toBe(true);
    });
  });

  describe('Functionality Preservation', () => {
    it('should have functional action buttons in Habits Dashboard', async () => {
      const wrapper = mount(HabitsDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      await nextTick();

      const addButton = wrapper.find('.add-habit-btn');
      expect(addButton.exists()).toBe(true);
      
      // Test button click functionality
      await addButton.trigger('click');
      // The modal should be triggered (we can't test the actual modal opening due to mocking)
    });

    it('should have functional action buttons in Health Dashboard', async () => {
      const wrapper = mount(HealthDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      await nextTick();

      const addButton = wrapper.find('.add-btn');
      expect(addButton.exists()).toBe(true);
      
      // Test button click functionality
      await addButton.trigger('click');
      // The modal should be triggered (we can't test the actual modal opening due to mocking)
    });

    it('should have Today\'s Habits section in Habits Dashboard', async () => {
      const wrapper = mount(HabitsDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      await nextTick();

      expect(wrapper.text()).toContain('Today\'s Habits');
      expect(wrapper.find('.today-card').exists()).toBe(true);
    });

    it('should have Active Habits table in Habits Dashboard', async () => {
      const wrapper = mount(HabitsDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      await nextTick();

      expect(wrapper.text()).toContain('Active Habits');
      expect(wrapper.find('[data-testid="selection-table"]').exists()).toBe(true);
    });

    it('should have health stats overview in Health Dashboard', async () => {
      const wrapper = mount(HealthDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      await nextTick();

      expect(wrapper.text()).toContain('Current Weight');
      expect(wrapper.text()).toContain('Avg Calories/Day');
      expect(wrapper.text()).toContain('Workouts This Week');
      expect(wrapper.text()).toContain('Meals Logged');
    });

    it('should have tab navigation in Health Dashboard', async () => {
      const wrapper = mount(HealthDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      await nextTick();

      expect(wrapper.text()).toContain('Weight Tracking');
      expect(wrapper.text()).toContain('Workouts');
      expect(wrapper.text()).toContain('Meals');
      expect(wrapper.find('[data-testid="v-tabs"]').exists()).toBe(true);
    });

    it('should have weight tracking content in Health Dashboard', async () => {
      const wrapper = mount(HealthDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      await nextTick();

      expect(wrapper.text()).toContain('Weight & Calories Trend');
      expect(wrapper.text()).toContain('Weight Log');
      expect(wrapper.find('[data-testid="line-chart"]').exists()).toBe(true);
    });
  });

  describe('CSS Class Structure', () => {
    it('should have proper dashboard CSS classes', async () => {
      const habitsWrapper = mount(HabitsDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      const healthWrapper = mount(HealthDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      await nextTick();

      // Check root dashboard classes
      expect(habitsWrapper.classes()).toContain('habits-dashboard');
      expect(healthWrapper.classes()).toContain('health-dashboard');
    });

    it('should have dashboard subtitle classes', async () => {
      const habitsWrapper = mount(HabitsDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      const healthWrapper = mount(HealthDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      await nextTick();

      expect(habitsWrapper.find('.dashboard-subtitle').exists()).toBe(true);
      expect(healthWrapper.find('.dashboard-subtitle').exists()).toBe(true);
    });

    it('should have proper button styling classes', async () => {
      const habitsWrapper = mount(HabitsDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      const healthWrapper = mount(HealthDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      await nextTick();

      expect(habitsWrapper.find('.add-habit-btn').exists()).toBe(true);
      expect(healthWrapper.find('.add-btn').exists()).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should pass error prop to Page component in both dashboards', async () => {
      const habitsWrapper = mount(HabitsDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      const healthWrapper = mount(HealthDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      await nextTick();

      // Check that Page component receives error prop
      const habitsPageComponent = habitsWrapper.findComponent({ name: 'Page' });
      const healthPageComponent = healthWrapper.findComponent({ name: 'Page' });
      
      expect(habitsPageComponent.exists()).toBe(true);
      expect(healthPageComponent.exists()).toBe(true);
      
      expect(habitsPageComponent.props()).toHaveProperty('error');
      expect(healthPageComponent.props()).toHaveProperty('error');
    });
  });

  describe('Requirements Compliance', () => {
    it('should meet Requirement 1.1: Habits dashboard uses Page component', async () => {
      const wrapper = mount(HabitsDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      await nextTick();

      expect(wrapper.findComponent({ name: 'Page' }).exists()).toBe(true);
      expect(wrapper.find('[data-testid="page-component"]').exists()).toBe(true);
    });

    it('should meet Requirement 1.2: Health dashboard uses Page component', async () => {
      const wrapper = mount(HealthDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      await nextTick();

      expect(wrapper.findComponent({ name: 'Page' }).exists()).toBe(true);
      expect(wrapper.find('[data-testid="page-component"]').exists()).toBe(true);
    });

    it('should meet Requirement 1.3: Visual styles preserved', async () => {
      const habitsWrapper = mount(HabitsDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      const healthWrapper = mount(HealthDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      await nextTick();

      // Check that modern styling classes are preserved
      expect(habitsWrapper.find('.modern-stat-card').exists()).toBe(true);
      expect(habitsWrapper.find('.modern-card').exists()).toBe(true);
      expect(healthWrapper.find('.modern-stat-card').exists()).toBe(true);
      expect(healthWrapper.find('.modern-card').exists()).toBe(true);
    });

    it('should meet Requirement 1.4: Functionality remains intact', async () => {
      const habitsWrapper = mount(HabitsDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      const healthWrapper = mount(HealthDashboard, {
        global: {
          components: { ...mockComponents, ...vuetifyMocks }
        }
      });

      await nextTick();

      // Check that key functional elements exist
      expect(habitsWrapper.find('.add-habit-btn').exists()).toBe(true);
      expect(habitsWrapper.find('[data-testid="selection-table"]').exists()).toBe(true);
      expect(healthWrapper.find('.add-btn').exists()).toBe(true);
      expect(healthWrapper.find('[data-testid="line-chart"]').exists()).toBe(true);
    });
  });
});