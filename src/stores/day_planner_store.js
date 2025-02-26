import { defineStore } from "pinia";
import axios from "axios";
import dayjs from "dayjs";

export const useTasksStore = defineStore("tasksStore", {
	state: () => ({
		tasks: [],
		selectedDate: dayjs().format("YYYY-MM-DD"), // or any date format you prefer
	}),
	actions: {
		async fetchTasks() {
			// const res = await axios.get("http://localhost:3000/api/tasks");
			// this.tasks = res.data;
			this.tasks = [
				{
					_id: "1",
					title: "Task 1",
					date: "2025-002-21",
					description: "Description 1",
					completed: false,
				},
				{
					_id: "2",
					title: "Task 2",
					date: "2025-002-22",
					description: "Description 2",
					completed: true,
				},
				{
					_id: "3",
					title: "Task 3",
					date: "2025-002-23",
					description: "Description 3",
					completed: false,
				},
			];
		},
		async addTask({ title, date }) {
			const res = await axios.post("http://localhost:3000/api/tasks", { title, date });
			this.tasks.push(res.data);
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
		setDate(dateString) {
			this.selectedDate = dateString;
		},
	},
	getters: {
		tasksForSelectedDate: (state) => {
			return state.tasks.filter((task) => {
				return dayjs(task.date).format("YYYY-MM-DD") === state.selectedDate;
			});
		},
	},
});
