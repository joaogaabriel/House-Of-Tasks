import { PrismaClient, Task, Status } from "@prisma/client";
import { PageOptionsDto } from "../pagination/page-options.dto";

export class TaskService {
  constructor(private readonly prisma: PrismaClient) {}
  private tasks: Task[] = [];

  async createTask(data: {
    title: string;
    description: string;
    status?: Status;
    userId: number;
    categoryId?: number;
    tags?: number[];
  }): Promise<Task | undefined> {
    try {
      const task = await this.prisma.task.create({
        data: {
          title: data.title,
          description: data.description,
          status: data.status || "PENDING",
          user: {
            connect: { id: data.userId },
          },
          category: data.categoryId
            ? { connect: { id: data.categoryId } }
            : undefined,
          tags: data.tags?.length
            ? { connect: data.tags.map((tagId) => ({ id: tagId })) }
            : undefined,
        },
      });
      return task;
    } catch (err) {
      console.error("Erro ao criar a task:", err);
    }
  }

  async getTasks(
    userId: number,
    pageOptionsDto: PageOptionsDto
  ): Promise<{
    entities: any;
    itemCount: number;
  }> {
    try {
      const { take, skip } = pageOptionsDto;

      const entities = await this.prisma.task.findMany({
        where: { userId: userId },
        orderBy: [{ id: "asc" }],
        skip: skip,
        take: take,
      });

      const itemCount = await this.prisma.task.count({});

      return { entities, itemCount };
    } catch (err) {
      console.error("Erro ao buscar tasks:", err);
      throw new Error("Erro ao buscar tasks");
    }
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
  async addTagToTask(taskId: number, tagId: number): Promise<Task | undefined> {
    try {
      const existingTask = await this.prisma.task.findUnique({
        where: { id: taskId },
        include: { tags: true },
      });

      if (!existingTask) {
        console.log("Tarefa não encontrada.");
        return undefined;
      }

      const updatedTask = await this.prisma.task.update({
        where: { id: taskId },
        data: {
          tags: {
            connect: { id: tagId },
          },
        },
        include: { tags: true },
      });

      return updatedTask;
    } catch (err) {
      console.error("Erro ao adicionar tag à tarefa:", err);
    }
  }
  async removeTagFromTask(
    taskId: number,
    tagId: number
  ): Promise<Task | undefined> {
    try {
      const existingTask = await this.prisma.task.findUnique({
        where: { id: taskId },
        include: { tags: true },
      });

      if (!existingTask) {
        console.log("Tarefa não encontrada.");
        return undefined;
      }

      const updatedTask = await this.prisma.task.update({
        where: { id: taskId },
        data: {
          tags: {
            disconnect: { id: tagId },
          },
        },
        include: { tags: true },
      });

      return updatedTask;
    } catch (err) {
      console.error("Erro ao remover tag da tarefa:", err);
    }
  }
  async addCategoryToTask(
    taskId: number,
    categoryId: number
  ): Promise<Task | undefined> {
    try {
      const existingTask = await this.prisma.task.findUnique({
        where: { id: taskId },
        include: { category: true },
      });

      if (!existingTask) {
        console.log("Tarefa não encontrada.");
        return undefined;
      }

      const updatedTask = await this.prisma.task.update({
        where: { id: categoryId },
        data: {
          category: {
            connect: { id: categoryId },
          },
        },
        include: { category: true },
      });

      return updatedTask;
    } catch (err) {
      console.error("Erro ao adicionar categoria à tarefa:", err);
    }
  }
  async removeCategoryFromTask(
    taskId: number,
    categoryId: number
  ): Promise<Task | undefined> {
    try {
      const existingTask = await this.prisma.task.findUnique({
        where: { id: taskId },
        include: { category: true },
      });

      if (!existingTask) {
        console.log("Tarefa não encontrada.");
        return undefined;
      }

      const updatedTask = await this.prisma.task.update({
        where: { id: taskId },
        data: {
          category: {
            disconnect: { id: categoryId },
          },
        },
        include: { category: true },
      });

      return updatedTask;
    } catch (err) {
      console.error("Erro ao remover categoria da tarefa:", err);
    }
  }
}
