import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ProfileMenu from "../ProfileMenu.vue";

// Mock the utilities
vi.mock("@/utils/user", () => ({
	useUser: () => ({
		name: "Test User",
		id: "123",
		role: "user",
	}),
}));

vi.mock("@/utils/loading", () => ({
	useLoading: () => ({
		start: vi.fn(),
		end: vi.fn(),
	}),
}));

vi.mock("@/utils/generic_modals", () => ({
	confirmation: vi.fn(() => Promise.resolve(true)),
}));

vi.mock("vue-router", () => ({
	useRouter: () => ({
		push: vi.fn(),
	}),
}));

vi.mock("vuetify", () => ({
	useTheme: () => ({
		global: {
			current: {
				value: { dark: false },
			},
			name: { value: "light" },
		},
	}),
}));

describe("ProfileMenu", () => {
	const createWrapper = (props = {}) => {
		return mount(ProfileMenu, {
			props,
			global: {
				stubs: {
					VMenu: { template: '<div><slot name="activator" :props="{}"></slot><slot></slot></div>' },
					VBtn: { template: "<button><slot></slot></button>" },
					VCard: { template: "<div><slot></slot></div>" },
					VCardText: { template: "<div><slot></slot></div>" },
					VAvatar: { template: "<div><slot></slot></div>" },
					VIcon: { template: "<i></i>" },
					VList: { template: "<div><slot></slot></div>" },
					VListItem: { template: "<div><slot></slot></div>" },
					VListItemTitle: { template: "<div><slot></slot></div>" },
					VListSubheader: { template: "<div><slot></slot></div>" },
					VDivider: { template: "<hr>" },
					VSwitch: { template: '<input type="checkbox">' },
					VChip: { template: "<span><slot></slot></span>" },
				},
			},
		});
	};

	it("renders correctly", () => {
		const wrapper = createWrapper();
		expect(wrapper.exists()).toBe(true);
	});

	it("shows custom avatar when provided", () => {
		const avatarUrl = "https://example.com/avatar.jpg";
		const wrapper = createWrapper({ avatarUrl });

		// The avatar URL should be used in the component
		expect(wrapper.vm.userAvatar).toBe(avatarUrl);
	});

	it("emits theme-toggled event when theme is toggled", async () => {
		const wrapper = createWrapper();

		await wrapper.vm.toggleTheme();

		expect(wrapper.emitted("theme-toggled")).toBeTruthy();
		expect(wrapper.emitted("theme-toggled")[0]).toEqual([true]);
	});

	it("emits profile-action event for various actions", async () => {
		const wrapper = createWrapper();

		await wrapper.vm.navigateToProfile();
		expect(wrapper.emitted("profile-action")).toBeTruthy();
		expect(wrapper.emitted("profile-action")[0]).toEqual(["edit-profile"]);
	});

	it("validates file upload constraints", async () => {
		const wrapper = createWrapper({ maxFileSize: 2 });

		// Mock a large file
		const largeFile = new File([""], "large.jpg", {
			type: "image/jpeg",
			size: 3 * 1024 * 1024, // 3MB
		});

		const event = {
			target: {
				files: [largeFile],
				value: "",
			},
		};

		// Spy on console.error to check validation
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		await wrapper.vm.handleFileUpload(event);

		expect(consoleSpy).toHaveBeenCalledWith("File size must be less than 2MB");

		consoleSpy.mockRestore();
	});

	it("validates file type for image uploads", async () => {
		const wrapper = createWrapper();

		// Mock a non-image file
		const textFile = new File([""], "document.txt", {
			type: "text/plain",
			size: 1024,
		});

		const event = {
			target: {
				files: [textFile],
				value: "",
			},
		};

		// Spy on console.error to check validation
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		await wrapper.vm.handleFileUpload(event);

		expect(consoleSpy).toHaveBeenCalledWith("Please select a valid image file");

		consoleSpy.mockRestore();
	});

	it("handles successful file upload", async () => {
		const wrapper = createWrapper();

		// Mock a valid image file
		const imageFile = new File([""], "avatar.jpg", {
			type: "image/jpeg",
			size: 1024,
		});

		const event = {
			target: {
				files: [imageFile],
				value: "",
			},
		};

		// Mock URL.createObjectURL
		global.URL.createObjectURL = vi.fn(() => "blob:mock-url");

		await wrapper.vm.handleFileUpload(event);

		expect(wrapper.emitted("profile-picture-uploaded")).toBeTruthy();
		expect(wrapper.emitted("profile-picture-uploaded")[0]).toEqual([imageFile]);
		expect(wrapper.vm.userAvatar).toBe("blob:mock-url");
	});

	it("computes user display name correctly", () => {
		const wrapper = createWrapper();
		expect(wrapper.vm.userDisplayName).toBe("Test User");
	});

	it("handles logout confirmation", async () => {
		const wrapper = createWrapper();

		await wrapper.vm.handleLogout();

		expect(wrapper.emitted("profile-action")).toBeTruthy();
		expect(wrapper.emitted("profile-action").some((event) => event[0] === "logout")).toBe(true);
	});
});
