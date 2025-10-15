import { socket } from "@/stores/socket_store.js";
import { io } from "socket.io-client";

export function useNotification() {
	const init = () => {
		if (!socket.value) {
			socket.value = io(`${import.meta.env.VITE_BACKEND_URL}/notification`);

			socket.value.on("notification", (data) => {
				console.log("🔔 Notification received:", data);
				showNotification(data);
			});
		}
	};

	const showNotification = (n) => {
		if (Notification.permission === "granted") {
			new Notification(n.title, { body: n.body, icon: "/icon.png" });
		}
	};

	const requestPermission = async () => {
		if (Notification.permission !== "granted") {
			await Notification.requestPermission();
		}
	};

	const triggerNotification = (title, body) => {
		if (!socket.value) return console.error("Socket not initialized");
		socket.value.emit("trigger-notification", { title, body });
	};

	return { init, triggerNotification, requestPermission };
}
