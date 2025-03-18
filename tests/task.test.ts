import { expect } from "chai";
import { PrismaClient, Status } from "@prisma/client";
import { TaskService } from "../src/services/TaskService";

const prisma = new PrismaClient();
const taskService = new TaskService(prisma);

describe("TaskService", () => {
  let userId: number;
  let taskId: number;

  before(async () => {
    const user = await prisma.user.create({
      data: {
        name: "Jungkook",
        email: "jung.kook@ccc.ufcg.edu.br",
        password: "gabszinholindo",
      },
    });
    userId = user.id;
  });

  after(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
  });

  it("[GET ALL] Empty list of tasks", async () => {
    const tasks = await prisma.task.findMany();
    expect(tasks).to.be.an("array").that.is.empty;
  });

  it("[CREATE] Task creation", async () => {
    const task = await taskService.createTask({
      title: "Nova Task",
      description: "Descrição da task",
      userId,
    });
    expect(task).to.include({
      title: "Nova Task",
      description: "Descrição da task",
    });
    if (task) taskId = task.id;
  });

  it("[GET ALL] List of tasks", async () => {
    const tasks = await prisma.task.findMany();
    expect(tasks).to.be.an("array").that.is.not.empty;
  });

  it("[GET ONE] Task by ID", async () => {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    expect(task).to.not.be.null;
    expect(task?.id).to.equal(taskId);
  });

  it("[UPDATE] Task update", async () => {
    const updatedTask = await taskService.editTask(taskId, {
      title: "Task Atualizada",
    });
    expect(updatedTask?.title).to.equal("Task Atualizada");
  });

  it("[UPDATE] Task update with non-existent ID", async () => {
    try {
      await taskService.editTask(99999, { title: "Inexistente" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        expect(err.message).to.include("TaskNotFoundError");
      }
    }
  });

  it("[DELETE] Task deletion", async () => {
    const deleted = await taskService.deleteTask(taskId);
    expect(deleted).to.be.true;
  });

  it("[DELETE] Task deletion with non-existent ID", async () => {
    const deleted = await taskService.deleteTask(99999);
    expect(deleted).to.be.false;
  });
});
