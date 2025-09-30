// src/utils/request.js
import axios from "axios";
import dayjs from "dayjs";
import { useLogger } from "@/utils/useLogger";
import { useLoading } from "@/utils/loading";
import { useAuthStore } from "@/stores/auth_store";
import { dataDateFormat } from "@/utils/time";

const logger = useLogger();
const loading = useLoading();
const authStore = useAuthStore();

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	timeout: 10000,
});

api.interceptors.request.use(
	(config) => {
		loading.start();

		const token = authStore.token;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		if (config.data) {
			config.data = formatDatesForBackend(config.data);
			console.log(config.data);
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
	(error) => {
		loading.end();

		if (error.response?.status === 401) {
			authStore.logOut();
		}

		logger.error(error, "API Response");
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
