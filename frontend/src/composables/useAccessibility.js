/**
 * Accessibility composable for managing ARIA attributes, focus management,
 * and screen reader announcements
 */
import { ref, nextTick, onMounted, onUnmounted } from "vue";

export function useAccessibility() {
	const announcements = ref([]);
	const focusHistory = ref([]);

	/**
	 * Announce text to screen readers
	 * @param {string} message - Message to announce
	 * @param {string} priority - 'polite' or 'assertive'
	 */
	const announce = (message, priority = "polite") => {
		const announcement = {
			id: Date.now(),
			message,
			priority,
			timestamp: new Date(),
		};

		announcements.value.push(announcement);

		// Create temporary live region for announcement
		const liveRegion = document.createElement("div");
		liveRegion.setAttribute("aria-live", priority);
		liveRegion.setAttribute("aria-atomic", "true");
		liveRegion.setAttribute("class", "sr-only");
		liveRegion.textContent = message;

		document.body.appendChild(liveRegion);

		// Remove after announcement
		setTimeout(() => {
			if (document.body.contains(liveRegion)) {
				document.body.removeChild(liveRegion);
			}
			announcements.value = announcements.value.filter((a) => a.id !== announcement.id);
		}, 1000);
	};

	/**
	 * Manage focus for modal dialogs and overlays
	 * @param {HTMLElement} container - Container element to trap focus within
	 */
	const trapFocus = (container) => {
		if (!container) return;

		const focusableElements = container.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
		);

		const firstFocusable = focusableElements[0];
		const lastFocusable = focusableElements[focusableElements.length - 1];

		const handleTabKey = (e) => {
			if (e.key !== "Tab") return;

			if (e.shiftKey) {
				if (document.activeElement === firstFocusable) {
					lastFocusable.focus();
					e.preventDefault();
				}
			} else {
				if (document.activeElement === lastFocusable) {
					firstFocusable.focus();
					e.preventDefault();
				}
			}
		};

		container.addEventListener("keydown", handleTabKey);

		// Focus first element
		if (firstFocusable) {
			firstFocusable.focus();
		}

		return () => {
			container.removeEventListener("keydown", handleTabKey);
		};
	};

	/**
	 * Save current focus and restore later
	 */
	const saveFocus = () => {
		const activeElement = document.activeElement;
		if (activeElement && activeElement !== document.body) {
			focusHistory.value.push(activeElement);
		}
	};

	/**
	 * Restore previously saved focus
	 */
	const restoreFocus = () => {
		const lastFocused = focusHistory.value.pop();
		if (lastFocused && typeof lastFocused.focus === "function") {
			nextTick(() => {
				lastFocused.focus();
			});
		}
	};

	/**
	 * Generate unique ID for ARIA relationships
	 * @param {string} prefix - Prefix for the ID
	 */
	const generateId = (prefix = "aria") => {
		return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	};

	/**
	 * Check if element is visible to screen readers
	 * @param {HTMLElement} element - Element to check
	 */
	const isAccessible = (element) => {
		if (!element) return false;

		const style = window.getComputedStyle(element);
		return !(
			style.display === "none" ||
			style.visibility === "hidden" ||
			element.hasAttribute("aria-hidden") ||
			element.hasAttribute("hidden")
		);
	};

	/**
	 * Get accessible name for an element
	 * @param {HTMLElement} element - Element to get name for
	 */
	const getAccessibleName = (element) => {
		if (!element) return "";

		// Check aria-label first
		if (element.hasAttribute("aria-label")) {
			return element.getAttribute("aria-label");
		}

		// Check aria-labelledby
		if (element.hasAttribute("aria-labelledby")) {
			const labelIds = element.getAttribute("aria-labelledby").split(" ");
			const labels = labelIds
				.map((id) => {
					const labelElement = document.getElementById(id);
					return labelElement ? labelElement.textContent.trim() : "";
				})
				.filter(Boolean);
			return labels.join(" ");
		}

		// Check associated label
		if (element.id) {
			const label = document.querySelector(`label[for="${element.id}"]`);
			if (label) {
				return label.textContent.trim();
			}
		}

		// Check placeholder
		if (element.hasAttribute("placeholder")) {
			return element.getAttribute("placeholder");
		}

		// Check title
		if (element.hasAttribute("title")) {
			return element.getAttribute("title");
		}

		// Fallback to text content
		return element.textContent?.trim() || "";
	};

	/**
	 * Handle keyboard navigation for lists and menus
	 * @param {Event} event - Keyboard event
	 * @param {Array} items - Array of focusable items
	 * @param {number} currentIndex - Current focused index
	 * @param {Function} onSelect - Callback when item is selected
	 */
	const handleKeyboardNavigation = (event, items, currentIndex, onSelect) => {
		let newIndex = currentIndex;

		switch (event.key) {
			case "ArrowDown":
				event.preventDefault();
				newIndex = (currentIndex + 1) % items.length;
				break;
			case "ArrowUp":
				event.preventDefault();
				newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
				break;
			case "Home":
				event.preventDefault();
				newIndex = 0;
				break;
			case "End":
				event.preventDefault();
				newIndex = items.length - 1;
				break;
			case "Enter":
			case " ":
				event.preventDefault();
				if (onSelect && items[currentIndex]) {
					onSelect(items[currentIndex], currentIndex);
				}
				return currentIndex;
			case "Escape":
				event.preventDefault();
				// Let parent handle escape
				return -1;
		}

		return newIndex;
	};

	/**
	 * Create ARIA attributes object for components
	 * @param {Object} options - Configuration options
	 */
	const createAriaAttributes = (options = {}) => {
		const {
			role,
			label,
			labelledby,
			describedby,
			expanded,
			selected,
			checked,
			disabled,
			required,
			invalid,
			live,
			atomic,
			relevant,
			busy,
			hidden,
			controls,
			owns,
			activedescendant,
			level,
			setsize,
			posinset,
		} = options;

		const attributes = {};

		if (role) attributes.role = role;
		if (label) attributes["aria-label"] = label;
		if (labelledby) attributes["aria-labelledby"] = labelledby;
		if (describedby) attributes["aria-describedby"] = describedby;
		if (expanded !== undefined) attributes["aria-expanded"] = expanded.toString();
		if (selected !== undefined) attributes["aria-selected"] = selected.toString();
		if (checked !== undefined) attributes["aria-checked"] = checked.toString();
		if (disabled !== undefined) attributes["aria-disabled"] = disabled.toString();
		if (required !== undefined) attributes["aria-required"] = required.toString();
		if (invalid !== undefined) attributes["aria-invalid"] = invalid.toString();
		if (live) attributes["aria-live"] = live;
		if (atomic !== undefined) attributes["aria-atomic"] = atomic.toString();
		if (relevant) attributes["aria-relevant"] = relevant;
		if (busy !== undefined) attributes["aria-busy"] = busy.toString();
		if (hidden !== undefined) attributes["aria-hidden"] = hidden.toString();
		if (controls) attributes["aria-controls"] = controls;
		if (owns) attributes["aria-owns"] = owns;
		if (activedescendant) attributes["aria-activedescendant"] = activedescendant;
		if (level) attributes["aria-level"] = level.toString();
		if (setsize) attributes["aria-setsize"] = setsize.toString();
		if (posinset) attributes["aria-posinset"] = posinset.toString();

		return attributes;
	};

	return {
		announce,
		trapFocus,
		saveFocus,
		restoreFocus,
		generateId,
		isAccessible,
		getAccessibleName,
		handleKeyboardNavigation,
		createAriaAttributes,
		announcements,
	};
}

/**
 * Color contrast utility functions
 */
export function useColorContrast() {
	/**
	 * Calculate relative luminance of a color
	 * @param {string} color - Hex color string
	 */
	const getLuminance = (color) => {
		const hex = color.replace("#", "");
		const r = parseInt(hex.substr(0, 2), 16) / 255;
		const g = parseInt(hex.substr(2, 2), 16) / 255;
		const b = parseInt(hex.substr(4, 2), 16) / 255;

		const sRGB = [r, g, b].map((c) => {
			return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
		});

		return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
	};

	/**
	 * Calculate contrast ratio between two colors
	 * @param {string} color1 - First color (hex)
	 * @param {string} color2 - Second color (hex)
	 */
	const getContrastRatio = (color1, color2) => {
		const lum1 = getLuminance(color1);
		const lum2 = getLuminance(color2);
		const brightest = Math.max(lum1, lum2);
		const darkest = Math.min(lum1, lum2);

		return (brightest + 0.05) / (darkest + 0.05);
	};

	/**
	 * Check if color combination meets WCAG AA standards
	 * @param {string} foreground - Foreground color (hex)
	 * @param {string} background - Background color (hex)
	 * @param {string} level - 'AA' or 'AAA'
	 * @param {string} size - 'normal' or 'large'
	 */
	const meetsWCAG = (foreground, background, level = "AA", size = "normal") => {
		const ratio = getContrastRatio(foreground, background);

		if (level === "AAA") {
			return size === "large" ? ratio >= 4.5 : ratio >= 7;
		}

		return size === "large" ? ratio >= 3 : ratio >= 4.5;
	};

	/**
	 * Get accessible text color for a background
	 * @param {string} backgroundColor - Background color (hex)
	 * @param {Object} options - Options for text colors
	 */
	const getAccessibleTextColor = (backgroundColor, options = {}) => {
		const { lightColor = "#ffffff", darkColor = "#000000", level = "AA" } = options;

		const lightRatio = getContrastRatio(lightColor, backgroundColor);
		const darkRatio = getContrastRatio(darkColor, backgroundColor);

		const minRatio = level === "AAA" ? 7 : 4.5;

		if (lightRatio >= minRatio && darkRatio >= minRatio) {
			return lightRatio > darkRatio ? lightColor : darkColor;
		}

		return lightRatio >= minRatio ? lightColor : darkColor;
	};

	return {
		getLuminance,
		getContrastRatio,
		meetsWCAG,
		getAccessibleTextColor,
	};
}
