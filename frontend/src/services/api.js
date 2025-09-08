import axios from "axios";
import { useLogger } from "@/utils/useLogger";
import { useLoading } from "@/utils/useLoading";
import { useAuthStore } from "@/stores/auth_store";

const logger = useLogger();
const loading = useLoading();
const authStore = useAuthStore();

const api = axios.create({
	baseURL: "http://localhost:5000",
	timeout: 10000,
});

api.interceptors.request.use(
	loading.start(),
	(config) => {
		const token = authStore.token;
		console.log(token);
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
	loading.end(),
	(response) => response,
	(error) => {
		loading.end();
		logger.error(error, "API Response");
		return Promise.reject(error);
	},
);

export default api;
