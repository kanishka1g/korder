import axios from "axios";
import dayjs from "dayjs";
import { useLogger } from "@/utils/useLogger";
import { useLoading } from "@/utils/loading";
import { snackbar } from "@/utils/generic_modals";
import { dataDateFormat } from "@/utils/time";

const logger = useLogger();
const loading = useLoading();

// Helper function to get auth store safely
const getAuthStore = async () => {
	try {
		const { useAuthStore } = await import("@/stores/auth_store");
		return useAuthStore();
	} catch (error) {
		console.warn("Auth store not available:", error);
		return null;
	}
};

const api = axios.create({
	baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
	timeout: 10000,
});

api.interceptors.request.use(
	async (config) => {
		loading.start();

		const authStore = await getAuthStore();
		const token = authStore?.token;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		if (config.data) {
			config.data = formatDatesForBackend(config.data);
		}

		if (config.params) {
			config.params = formatDatesForBackend(config.params);
		}

		return config;
	},
	(error) => {
		loading.end();
		logger.error(error, "Request setup");
		return Promise.reject(error);
	},
);

api.interceptors.response.use(
	(response) => {
		loading.end();

		response.data = convertDatesFromBackend(response.data);

		return response;
	},
	async (error) => {
		loading.end();

		// Handle authentication errors
		if (error.response?.status === 401) {
			const authStore = await getAuthStore();
			if (authStore) {
				// Request re-authentication instead of immediate logout
				authStore.requestReauth();
				// Still logout as fallback, but give opportunity for re-auth
				setTimeout(() => {
					if (authStore.needsReauth) {
						authStore.logOut();
					}
				}, 30000); // 30 second timeout for re-auth
			}
		}

		const log = logger.error(error, "API Response");

		const skipSnackbar =
			error.config?.skipErrorSnackbar || error.response?.status === 401 || error.response?.status === 403;

		if (!skipSnackbar) {
			snackbar.error(log);
		}
		return Promise.reject(error);
	},
);

function formatDatesForBackend(obj) {
	if (!obj || typeof obj !== "object") return obj;

	const copy = Array.isArray(obj) ? [...obj] : { ...obj };

	for (const key in copy) {
		if (!Object.hasOwnProperty.call(copy, key)) continue;

		const value = copy[key];

		if (value instanceof Date || dayjs.isDayjs(value)) {
			copy[key] = dayjs(value).format(dataDateFormat);
		} else if (typeof value === "object") {
			copy[key] = formatDatesForBackend(value);
		}
	}

	return copy;
}

function convertDatesFromBackend(obj) {
	if (!obj || typeof obj !== "object") return obj;

	if (Array.isArray(obj)) {
		return obj.map(convertDatesFromBackend);
	}

	const copy = { ...obj };

	for (const key in copy) {
		if (!Object.hasOwnProperty.call(copy, key)) continue;

		const value = copy[key];

		if (value instanceof Date) {
			copy[key] = dayjs(value);
		} else if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
			copy[key] = dayjs(value);
		} else if (typeof value === "object") {
			copy[key] = convertDatesFromBackend(value);
		}
	}

	return copy;
}

export default api;
