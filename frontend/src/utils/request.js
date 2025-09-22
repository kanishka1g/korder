import axios from "axios";
import { useLogger } from "@/utils/useLogger";
import { useLoading } from "@/utils/loading";
import { useAuthStore } from "@/stores/auth_store";

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
		return response;
	},
	(error) => {
		if (error.response.status === 401) {
			authStore.logOut();
		}

		loading.end();
		logger.error(error, "API Response");
		return Promise.reject(error);
	},
);

export default api;
