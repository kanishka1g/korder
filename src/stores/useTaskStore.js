import { defineStore } from "pinia";
import { useNow } from "@/utils/now";
import axios from "axios";
import dayjs from "dayjs";

const now = useNow();

export const useTasksStore = defineStore("tasksStore", {
	state: () => ({
		tasks: [],
		selectedDate: now.value,
	}),
	actions: {
		async fetchTasks() {
			// const res = await axios.get("http://localhost:3000/api/tasks");
			// this.tasks = res.data;
			this.tasks = [
				{
					_id: "1",
					title: "Task 1",
					description: "Description 1",
					date: dayjs("2025-02-24T17:25:00.000Z"),
				},
				{
					_id: "2",
					title: "Task 2",
					description: "Description 2",
					date: dayjs("2025-02-24T01:00:00.000Z"),
				},
			];
		},
		async addTask({ title, date, description }) {
			// const res = await axios.post("http://localhost:3000/api/tasks", { title, date });
			// this.tasks.push(res.data);
			this.tasks.push({ _id: this.tasks.length + 1, title: title, description: description, date: date });
		},
		async updateTask(id, updates) {
			const res = await axios.put(`http://localhost:3000/api/tasks/${id}`, updates);
			// update local tasks array
			const idx = this.tasks.findIndex((t) => t._id === id);
			if (idx !== -1) this.tasks[idx] = res.data;
		},
		async deleteTask(id) {
			await axios.delete(`http://localhost:3000/api/tasks/${id}`);
			this.tasks = this.tasks.filter((t) => t._id !== id);
		},
		setDate(date) {
			this.selectedDate = date;
		},
	},
	getters: {
		tasksForSelectedDate: (state) => {
			return state.tasks;
			return state.tasks.filter((task) => task.date.isSame(state.selectedDate, "day"));
		},
	},
});
