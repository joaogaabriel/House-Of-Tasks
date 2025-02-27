import { PrismaClient, Task, Status } from "@prisma/client";

export class TaskService {
  constructor(private readonly prisma: PrismaClient) {}
  private tasks: Task[] = [];

  async createTask(data: Task): Promise<Task | undefined> {
    try {
      const task = await this.prisma.task.create({
        data: {
          title: data.title,
          description: data.description,
          status: data.status || "PENDING",
          user: {
            connect: { id: data.userId },
          },
        },
      });
      return task;
    } catch (err) {
      console.log(err);
    }
  }

  getTasksByUser(userId: number): Task[] {
    return this.tasks.filter((task) => task.userId === userId);
  }

  updateTaskStatus(id: number, status: Status): Task | undefined {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      task.status = status;
    }
    return task;
  }

  async editTask(
    id: number,
    data: Partial<Omit<Task, "id">>
  ): Promise<Task | undefined> {
    try {
      const existingTask = await this.prisma.task.findUnique({ where: { id } });

      if (!existingTask) {
        console.log("Tarefa não encontrada.");
        return undefined;
      }

      const updatedTask = await this.prisma.task.update({
        where: { id },
        data,
      });

      return updatedTask;
    } catch (err) {
      console.log("Erro ao editar tarefa:", err);
    }
  }

  async deleteTask(id: number): Promise<boolean> {
    try {
      const existingTask = await this.prisma.task.findUnique({ where: { id } });

      if (!existingTask) {
        console.log("Tarefa não encontrada.");
        return false;
      }

      await this.prisma.task.delete({ where: { id } });

      return true;
    } catch (err) {
      console.log("Erro ao deletar tarefa:", err);
      return false;
    }
  }
}
