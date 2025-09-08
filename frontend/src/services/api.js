// frontend/src/services/api.js
import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:5000", // your backend URL
});

// api.interceptors.request.use(
// 	(config) => {
// 		return config;
// 	},
// 	(error) => {
// 		return Promise.reject(error);
// 	},
// );

// // Response interceptor for error handling
// api.interceptors.response.use(
// 	(response) => {
// 		return response;
// 	},
// 	(error) => {
// 		// Handle different types of errors
// 		if (error.response) {
// 			// Server responded with error status
// 			const { status, data } = error.response;

// 			switch (status) {
// 				case 400:
// 					console.log("Bad Request:", data.message || "Invalid request");
// 					break;
// 				case 401:
// 					console.log("Unauthorized:", data.message || "Authentication required");
// 					// Optionally redirect to login
// 					break;
// 				case 403:
// 					console.log("Forbidden:", data.message || "Access denied");
// 					break;
// 				case 404:
// 					console.log("Not Found:", data.message || "Resource not found");
// 					break;
// 				case 500:
// 					console.log("Server Error:", data.message || "Internal server error");
// 					break;
// 				default:
// 					console.log("Error:", data.message || "An error occurred");
// 			}
// 		} else if (error.request) {
// 			console.log("Network Error:", "Unable to connect to server");
// 		} else {
// 			console.log("Error:", error.message);
// 		}

// 		return Promise.reject(error);
// 	},
// );

export default api;
