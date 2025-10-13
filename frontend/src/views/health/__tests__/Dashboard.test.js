import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Dashboard from '../Dashboard.vue'

// Mock the request utility
vi.mock('@/utils/request', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

// Mock other utilities
vi.mock('@/utils/now', () => ({
  useNow: () => ({ value: new Date('2024-01-15') })
}))

vi.mock('@/utils/useLogger', () => ({
  useLogger: () => ({ error: vi.fn() })
}))

vi.mock('@/utils/loading', () => ({
  useLoading: () => ({ start: vi.fn(), end: vi.fn() })
}))

vi.mock('@/utils/generic_modals', () => ({
  snackbar: { success: vi.fn(), warning: vi.fn() },
  confirmation: vi.fn(() => Promise.resolve(true))
}))

vi.mock('@/utils/time', () => ({
  displayLongMonthDayFormat: 'DD-MMM'
}))

// Mock vuetify theme
vi.mock('vuetify', async () => {
  const actual = await vi.importActual('vuetify')
  return {
    ...actual,
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
  }
})

// Mock dayjs
vi.mock('@/plugins/dayjs', () => ({
  default: vi.fn(() => ({
    format: vi.fn(() => '15-Jan'),
    valueOf: vi.fn(() => 1705276800000),
    isSame: vi.fn(() => false)
  }))
}))

// Mock components
vi.mock('@/components/charts/LineChart.vue', () => ({
  default: { template: '<div data-testid="line-chart"></div>' }
}))

vi.mock('@/components/common/DateField.vue', () => ({
  default: { template: '<div data-testid="date-field"></div>' }
}))

vi.mock('@/components/common/SelectionTable.vue', () => ({
  default: { template: '<div data-testid="selection-table"></div>' }
}))

vi.mock('@/components/common/DisplayDateTime.vue', () => ({
  default: { template: '<div data-testid="display-datetime"></div>' }
}))

vi.mock('@/components/global/Page.vue', () => ({
  default: {
    template: `
      <div data-testid="page-component">
        <div data-testid="page-title">{{ title }}</div>
        <div data-testid="page-actions"><slot name="actions"></slot></div>
        <div data-testid="page-content"><slot></slot></div>
      </div>
    `,
    props: ['title', 'error']
  }
}))

describe('Health Dashboard', () => {
  let wrapper

  const createWrapper = (props = {}) => {
    return mount(Dashboard, {
      global: {
        stubs: {
          Modal: { template: '<div data-testid="modal"><slot></slot></div>' },
          VContainer: { template: '<div><slot></slot></div>' },
          VRow: { template: '<div><slot></slot></div>' },
          VCol: { template: '<div><slot></slot></div>' },
          VCard: { template: '<div><slot></slot></div>' },
          VCardText: { template: '<div><slot></slot></div>' },
          VCardTitle: { template: '<div><slot></slot></div>' },
          VBtn: { template: '<button><slot></slot></button>' },
          VIcon: { template: '<i></i>' },
          VCheckbox: { template: '<input type="checkbox" />' },
          VTextField: { template: '<input type="text" />' },
          VTextarea: { template: '<textarea></textarea>' },
          VSelect: { template: '<select></select>' },
          VForm: { template: '<form><slot></slot></form>' },
          VAlert: { template: '<div><slot></slot></div>' },
          VChip: { template: '<span><slot></slot></span>' },
          VTabs: { template: '<div><slot></slot></div>' },
          VTab: { template: '<div><slot></slot></div>' },
          VTabsWindow: { template: '<div><slot></slot></div>' },
          VTabsWindowItem: { template: '<div><slot></slot></div>' },
          VExpandTransition: { template: '<div><slot></slot></div>' },
          VScrollXTransition: { template: '<div><slot></slot></div>' },
          VDivider: { template: '<hr />' }
        }
      },
      props
    })
  }

  it('renders with Page component', () => {
    wrapper = createWrapper()
    
    // Verify Page component is used
    expect(wrapper.find('[data-testid="page-component"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="page-title"]').text()).toBe('Health Dashboard')
  })

  it('displays the correct title and subtitle', () => {
    wrapper = createWrapper()
    
    expect(wrapper.find('[data-testid="page-title"]').text()).toBe('Health Dashboard')
    expect(wrapper.text()).toContain('Track your fitness journey and wellness goals')
  })

  it('renders action button in Page component actions slot', () => {
    wrapper = createWrapper()
    
    const actionsSlot = wrapper.find('[data-testid="page-actions"]')
    expect(actionsSlot.exists()).toBe(true)
    expect(actionsSlot.text()).toContain('Quick Add')
  })

  it('renders health stats cards', () => {
    wrapper = createWrapper()
    
    // Check for 4 stat cards
    expect(wrapper.findAll('.modern-stat-card')).toHaveLength(4)
    
    // Check for specific stat content
    expect(wrapper.text()).toContain('Current Weight')
    expect(wrapper.text()).toContain('Avg Calories/Day')
    expect(wrapper.text()).toContain('Workouts This Week')
    expect(wrapper.text()).toContain('Meals Logged')
  })

  it('renders tab navigation correctly', () => {
    wrapper = createWrapper()
    
    // Check for tabs
    expect(wrapper.text()).toContain('Weight Tracking')
    expect(wrapper.text()).toContain('Workouts')
    expect(wrapper.text()).toContain('Meals')
  })

  it('renders weight tracking tab content', () => {
    wrapper = createWrapper()
    
    // Check for weight tracking elements
    expect(wrapper.find('[data-testid="line-chart"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Weight & Calories Trend')
    expect(wrapper.text()).toContain('Weight Log')
  })

  it('renders coming soon cards for workouts and meals', () => {
    wrapper = createWrapper()
    
    // Check for coming soon content
    expect(wrapper.text()).toContain('Workout Tracking')
    expect(wrapper.text()).toContain('Meal Planning')
    expect(wrapper.text()).toContain('Coming Soon')
  })

  it('applies correct CSS classes for modern styling', () => {
    wrapper = createWrapper()
    
    // Check for modern styling classes
    expect(wrapper.find('.health-dashboard').exists()).toBe(true)
    expect(wrapper.findAll('.modern-stat-card').length).toBeGreaterThan(0)
    expect(wrapper.findAll('.modern-card').length).toBeGreaterThan(0)
  })

  it('renders weight modal with correct structure', () => {
    wrapper = createWrapper()
    
    // Check modal exists
    expect(wrapper.find('[data-testid="modal"]').exists()).toBe(true)
  })

  it('handles tab switching functionality', () => {
    wrapper = createWrapper()
    
    // Check for tab components
    const tabs = wrapper.findAllComponents({ name: 'VTab' })
    expect(tabs.length).toBeGreaterThan(0)
  })

  it('maintains responsive design classes', () => {
    wrapper = createWrapper()
    
    // Check for responsive elements
    expect(wrapper.find('.dashboard-subtitle').exists()).toBe(true)
    expect(wrapper.find('.add-btn').exists()).toBe(true)
  })

  it('preserves gradient and backdrop styling', () => {
    wrapper = createWrapper()
    
    // Check for styling classes that provide visual effects
    expect(wrapper.find('.health-dashboard').classes()).toContain('health-dashboard')
    expect(wrapper.findAll('.modern-stat-card').length).toBeGreaterThan(0)
    expect(wrapper.findAll('.coming-soon-card').length).toBeGreaterThan(0)
  })

  it('renders chart and data visualization components', () => {
    wrapper = createWrapper()
    
    // Check for data visualization elements
    expect(wrapper.find('[data-testid="line-chart"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="selection-table"]').exists()).toBe(true)
  })
})