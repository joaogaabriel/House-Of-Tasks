import { Task } from "../models/taskModel";

export class TaskService {
  private tasks: Task[] = [];

  createTask(task: Task): Task {
    this.tasks.push(task);
    return task;
  }

  getTasksByUser(userId: string): Task[] {
    return this.tasks.filter((task) => task.userId === userId);
  }

  updateTaskStatus(
    id: string,
    status: "pending" | "in-progress" | "completed"
  ): Task | undefined {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      task.status = status;
    }
    return task;
  }
}
