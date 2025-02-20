import { PrismaClient, Task, Status } from "@prisma/client";

export class TaskService {
  constructor(private readonly prisma: PrismaClient) {}
  private tasks: Task[] = [];

  async createTask(data: Task): Promise<Task | undefined> {
    try {
      const task = await this.prisma.task.create({ data });
      return task;
    } catch (err) {
      console.log(err);
    }
  }

  getTasksByUser(userId: string): Task[] {
    return this.tasks.filter((task) => task.userId === userId);
  }

  updateTaskStatus(id: string, status: Status): Task | undefined {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      task.status = status;
    }
    return task;
  }
}
