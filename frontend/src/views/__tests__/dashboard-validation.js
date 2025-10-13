/**
 * Dashboard Refactoring Validation Script
 * 
 * This script provides manual validation functions to test the refactored dashboards.
 * Run this in the browser console while viewing the dashboards to validate functionality.
 */

// Validation functions for manual testing
window.dashboardValidation = {
  
  // Test Page component integration
  validatePageComponent() {
    console.log('🔍 Validating Page Component Integration...');
    
    const results = {
      hasPageComponent: false,
      hasCorrectTitle: false,
      hasActionsSlot: false,
      hasSubtitle: false,
      errors: []
    };
    
    try {
      // Check if Page component is being used (look for specific structure)
      const pageElement = document.querySelector('.page-component, [class*="page"]');
      results.hasPageComponent = !!pageElement;
      
      // Check for title in header
      const titleElement = document.querySelector('h1, .page-title, [class*="title"]');
      if (titleElement) {
        const titleText = titleElement.textContent.trim();
        results.hasCorrectTitle = titleText.includes('Dashboard');
      }
      
      // Check for action buttons
      const actionButtons = document.querySelectorAll('button[class*="add"], .page-actions button');
      results.hasActionsSlot = actionButtons.length > 0;
      
      // Check for subtitle
      const subtitleElement = document.querySelector('.dashboard-subtitle, [class*="subtitle"]');
      results.hasSubtitle = !!subtitleElement;
      
    } catch (error) {
      results.errors.push(error.message);
    }
    
    console.log('📊 Page Component Results:', results);
    return results;
  },
  
  // Test visual appearance preservation
  validateVisualAppearance() {
    console.log('🎨 Validating Visual Appearance...');
    
    const results = {
      hasModernCards: false,
      hasGradientBackground: false,
      hasStatCards: false,
      hasHoverEffects: false,
      errors: []
    };
    
    try {
      // Check for modern card styling
      const modernCards = document.querySelectorAll('.modern-card, .modern-stat-card');
      results.hasModernCards = modernCards.length > 0;
      
      // Check for gradient background
      const dashboardElement = document.querySelector('[class*="dashboard"]');
      if (dashboardElement) {
        const styles = window.getComputedStyle(dashboardElement);
        results.hasGradientBackground = styles.background.includes('gradient') || 
                                       styles.backgroundImage.includes('gradient');
      }
      
      // Check for stat cards
      const statCards = document.querySelectorAll('[class*="stat-card"], .v-card');
      results.hasStatCards = statCards.length > 0;
      
      // Test hover effects by temporarily hovering over a card
      const firstCard = document.querySelector('.modern-card, .modern-stat-card');
      if (firstCard) {
        const originalTransform = window.getComputedStyle(firstCard).transform;
        firstCard.dispatchEvent(new MouseEvent('mouseenter'));
        setTimeout(() => {
          const hoverTransform = window.getComputedStyle(firstCard).transform;
          results.hasHoverEffects = originalTransform !== hoverTransform;
          firstCard.dispatchEvent(new MouseEvent('mouseleave'));
        }, 100);
      }
      
    } catch (error) {
      results.errors.push(error.message);
    }
    
    console.log('🎨 Visual Appearance Results:', results);
    return results;
  },
  
  // Test functionality preservation
  validateFunctionality() {
    console.log('⚙️ Validating Functionality...');
    
    const results = {
      hasActionButtons: false,
      hasInteractiveElements: false,
      hasModals: false,
      hasTables: false,
      errors: []
    };
    
    try {
      // Check for action buttons
      const actionButtons = document.querySelectorAll('button');
      results.hasActionButtons = actionButtons.length > 0;
      
      // Check for interactive elements
      const interactiveElements = document.querySelectorAll('input, select, textarea, .v-checkbox, .v-btn');
      results.hasInteractiveElements = interactiveElements.length > 0;
      
      // Check for modals (even if hidden)
      const modals = document.querySelectorAll('[class*="modal"], .v-dialog, .v-overlay');
      results.hasModals = modals.length > 0;
      
      // Check for tables
      const tables = document.querySelectorAll('table, .v-data-table, [class*="table"]');
      results.hasTables = tables.length > 0;
      
    } catch (error) {
      results.errors.push(error.message);
    }
    
    console.log('⚙️ Functionality Results:', results);
    return results;
  },
  
  // Test responsive behavior
  validateResponsive() {
    console.log('📱 Validating Responsive Behavior...');
    
    const results = {
      originalWidth: window.innerWidth,
      mobileBreakpoint: false,
      tabletBreakpoint: false,
      desktopBreakpoint: false,
      errors: []
    };
    
    try {
      // Test different breakpoints
      const testBreakpoints = [
        { width: 375, name: 'mobile' },
        { width: 768, name: 'tablet' },
        { width: 1200, name: 'desktop' }
      ];
      
      testBreakpoints.forEach(breakpoint => {
        // Simulate viewport change
        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint.width}px)`);
        results[`${breakpoint.name}Breakpoint`] = mediaQuery.matches;
      });
      
    } catch (error) {
      results.errors.push(error.message);
    }
    
    console.log('📱 Responsive Results:', results);
    return results;
  },
  
  // Run all validations
  validateAll() {
    console.log('🚀 Running Complete Dashboard Validation...');
    
    const allResults = {
      pageComponent: this.validatePageComponent(),
      visualAppearance: this.validateVisualAppearance(),
      functionality: this.validateFunctionality(),
      responsive: this.validateResponsive(),
      timestamp: new Date().toISOString()
    };
    
    // Calculate overall score
    const totalChecks = Object.values(allResults).reduce((count, result) => {
      if (typeof result === 'object' && result !== null) {
        return count + Object.keys(result).filter(key => 
          typeof result[key] === 'boolean' && key !== 'errors'
        ).length;
      }
      return count;
    }, 0);
    
    const passedChecks = Object.values(allResults).reduce((count, result) => {
      if (typeof result === 'object' && result !== null) {
        return count + Object.keys(result).filter(key => 
          typeof result[key] === 'boolean' && result[key] === true && key !== 'errors'
        ).length;
      }
      return count;
    }, 0);
    
    const score = Math.round((passedChecks / totalChecks) * 100);
    
    console.log(`📊 Overall Validation Score: ${score}% (${passedChecks}/${totalChecks} checks passed)`);
    console.log('📋 Complete Results:', allResults);
    
    return {
      score,
      passedChecks,
      totalChecks,
      results: allResults
    };
  },
  
  // Test specific dashboard features
  testHabitsDashboard() {
    console.log('🎯 Testing Habits Dashboard Specific Features...');
    
    const results = {
      hasAddHabitButton: false,
      hasTodaysHabits: false,
      hasActiveHabitsTable: false,
      hasStatCards: false,
      errors: []
    };
    
    try {
      // Check for Add Habit button
      const addButton = document.querySelector('button[class*="add"], button:contains("Add Habit")');
      results.hasAddHabitButton = !!addButton;
      
      // Check for Today's Habits section
      const todaysHabits = document.querySelector('[class*="today"], *:contains("Today\'s Habits")');
      results.hasTodaysHabits = !!todaysHabits;
      
      // Check for Active Habits table
      const activeHabitsTable = document.querySelector('*:contains("Active Habits")');
      results.hasActiveHabitsTable = !!activeHabitsTable;
      
      // Check for stat cards
      const statCards = document.querySelectorAll('.modern-stat-card, [class*="stat-card"]');
      results.hasStatCards = statCards.length > 0;
      
    } catch (error) {
      results.errors.push(error.message);
    }
    
    console.log('🎯 Habits Dashboard Results:', results);
    return results;
  },
  
  testHealthDashboard() {
    console.log('🏥 Testing Health Dashboard Specific Features...');
    
    const results = {
      hasQuickAddButton: false,
      hasHealthStats: false,
      hasTabs: false,
      hasWeightChart: false,
      errors: []
    };
    
    try {
      // Check for Quick Add button
      const quickAddButton = document.querySelector('button:contains("Quick Add"), [class*="add"]');
      results.hasQuickAddButton = !!quickAddButton;
      
      // Check for health stats
      const healthStats = document.querySelector('*:contains("Current Weight"), *:contains("Calories")');
      results.hasHealthStats = !!healthStats;
      
      // Check for tabs
      const tabs = document.querySelectorAll('.v-tab, [class*="tab"]');
      results.hasTabs = tabs.length > 0;
      
      // Check for weight chart
      const weightChart = document.querySelector('*:contains("Weight"), canvas, svg');
      results.hasWeightChart = !!weightChart;
      
    } catch (error) {
      results.errors.push(error.message);
    }
    
    console.log('🏥 Health Dashboard Results:', results);
    return results;
  }
};

  // Enhanced validation for responsive design
  validateResponsiveDesign() {
    console.log('📱 Validating Responsive Design...');
    
    const results = {
      originalWidth: window.innerWidth,
      mobileTest: false,
      tabletTest: false,
      desktopTest: false,
      breakpointTests: [],
      errors: []
    };
    
    try {
      const testBreakpoints = [
        { width: 375, name: 'mobile', expected: 'single-column layout' },
        { width: 768, name: 'tablet', expected: 'two-column layout' },
        { width: 1200, name: 'desktop', expected: 'multi-column layout' }
      ];
      
      testBreakpoints.forEach(breakpoint => {
        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint.width}px)`);
        const testResult = {
          breakpoint: breakpoint.name,
          width: breakpoint.width,
          matches: mediaQuery.matches,
          expected: breakpoint.expected
        };
        
        results.breakpointTests.push(testResult);
        results[`${breakpoint.name}Test`] = true;
      });
      
    } catch (error) {
      results.errors.push(error.message);
    }
    
    console.log('📱 Responsive Design Results:', results);
    return results;
  },
  
  // Test specific dashboard interactions
  testInteractions() {
    console.log('🖱️ Testing Dashboard Interactions...');
    
    const results = {
      buttonClicks: 0,
      modalTriggers: 0,
      formInteractions: 0,
      navigationTests: 0,
      errors: []
    };
    
    try {
      // Test button clicks
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        if (button.textContent.includes('Add') || button.textContent.includes('Quick Add')) {
          results.buttonClicks++;
        }
      });
      
      // Test modal presence
      const modals = document.querySelectorAll('[class*="modal"], .v-dialog');
      results.modalTriggers = modals.length;
      
      // Test form elements
      const forms = document.querySelectorAll('form, .v-form');
      results.formInteractions = forms.length;
      
      // Test navigation elements
      const navElements = document.querySelectorAll('.v-tab, [class*="tab"]');
      results.navigationTests = navElements.length;
      
    } catch (error) {
      results.errors.push(error.message);
    }
    
    console.log('🖱️ Interaction Test Results:', results);
    return results;
  },
  
  // Comprehensive validation with detailed reporting
  runComprehensiveValidation() {
    console.log('🚀 Running Comprehensive Dashboard Validation...');
    console.log('⏱️ This may take a few moments...');
    
    const startTime = performance.now();
    
    const validationResults = {
      timestamp: new Date().toISOString(),
      pageComponent: this.validatePageComponent(),
      visualAppearance: this.validateVisualAppearance(),
      functionality: this.validateFunctionality(),
      responsive: this.validateResponsiveDesign(),
      interactions: this.testInteractions(),
      habitsSpecific: this.testHabitsDashboard(),
      healthSpecific: this.testHealthDashboard()
    };
    
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    
    // Calculate comprehensive score
    let totalChecks = 0;
    let passedChecks = 0;
    
    Object.values(validationResults).forEach(result => {
      if (typeof result === 'object' && result !== null && typeof result.timestamp === 'undefined') {
        Object.keys(result).forEach(key => {
          if (typeof result[key] === 'boolean' && key !== 'errors') {
            totalChecks++;
            if (result[key] === true) {
              passedChecks++;
            }
          }
        });
      }
    });
    
    const score = Math.round((passedChecks / totalChecks) * 100);
    
    // Generate detailed report
    console.log('📊 COMPREHENSIVE VALIDATION REPORT');
    console.log('=====================================');
    console.log(`⏱️ Duration: ${duration}ms`);
    console.log(`📊 Overall Score: ${score}% (${passedChecks}/${totalChecks} checks passed)`);
    console.log('');
    
    // Report by category
    Object.entries(validationResults).forEach(([category, result]) => {
      if (typeof result === 'object' && result !== null && typeof result.timestamp === 'undefined') {
        const categoryPassed = Object.keys(result).filter(key => 
          typeof result[key] === 'boolean' && result[key] === true && key !== 'errors'
        ).length;
        const categoryTotal = Object.keys(result).filter(key => 
          typeof result[key] === 'boolean' && key !== 'errors'
        ).length;
        const categoryScore = categoryTotal > 0 ? Math.round((categoryPassed / categoryTotal) * 100) : 100;
        
        console.log(`${categoryScore === 100 ? '✅' : '⚠️'} ${category}: ${categoryScore}% (${categoryPassed}/${categoryTotal})`);
        
        if (result.errors && result.errors.length > 0) {
          console.log(`   ❌ Errors: ${result.errors.join(', ')}`);
        }
      }
    });
    
    console.log('');
    console.log('📋 Detailed Results:', validationResults);
    
    // Provide recommendations
    if (score === 100) {
      console.log('🎉 EXCELLENT! All validations passed. Dashboard refactoring is successful.');
    } else if (score >= 90) {
      console.log('✅ GOOD! Most validations passed. Minor issues may need attention.');
    } else if (score >= 75) {
      console.log('⚠️ WARNING! Some validations failed. Review and fix issues before deployment.');
    } else {
      console.log('❌ CRITICAL! Many validations failed. Significant issues need to be resolved.');
    }
    
    return {
      score,
      passedChecks,
      totalChecks,
      duration,
      results: validationResults,
      recommendation: score >= 90 ? 'READY FOR DEPLOYMENT' : 'NEEDS ATTENTION'
    };
  }
};

// Auto-run validation if in browser
if (typeof window !== 'undefined') {
  console.log('🔧 Dashboard Validation Tools Loaded!');
  console.log('📖 Usage:');
  console.log('  - dashboardValidation.runComprehensiveValidation() - Run complete validation suite');
  console.log('  - dashboardValidation.validateAll() - Run basic validation');
  console.log('  - dashboardValidation.testHabitsDashboard() - Test habits specific features');
  console.log('  - dashboardValidation.testHealthDashboard() - Test health specific features');
  console.log('  - dashboardValidation.validatePageComponent() - Test Page component integration');
  console.log('  - dashboardValidation.validateResponsiveDesign() - Test responsive behavior');
  console.log('  - dashboardValidation.testInteractions() - Test user interactions');
  console.log('');
  console.log('🚀 Quick Start: Run dashboardValidation.runComprehensiveValidation()');
}

export default window.dashboardValidation;