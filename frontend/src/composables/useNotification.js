import { ref, onMounted } from "vue";
import request from "@/utils/request";

export function useNotification() {
	const permissionGranted = ref(false);
	const notifications = ref([]);

	// Request permission & start polling
	const init = async () => {
		if (!("Notification" in window)) {
			console.warn("This browser does not support notifications.");
			return;
		}

		const permission = await Notification.requestPermission();
		permissionGranted.value = permission === "granted";

		if (permissionGranted.value) {
			console.log(permissionGranted.value);
			pollNotifications();
		}
	};

	// Poll backend every minute (or adjust interval)
	const pollNotifications = async () => {
		setInterval(async () => {
			try {
				const res = await request.get("meta/notifications");
				const data = await res.json();
				console.log(data);
				data.forEach((n) => {
					if (!notifications.value.find((x) => x.createdAt === n.createdAt)) {
						showNotification(n);
						notifications.value.push(n);
					}
				});
			} catch (err) {
				console.error("Failed to fetch notifications:", err);
			}
		}, 60 * 1000);
	};

	const showNotification = (n) => {
		if (!permissionGranted.value) return;

		new Notification(n.title, {
			body: n.body,
			icon: "/icon.png", // optional
		});
	};

	return {
		init,
		permissionGranted,
		notifications,
		showNotification,
	};
}
