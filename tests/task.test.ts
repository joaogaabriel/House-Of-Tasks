import { expect } from "chai";
import sinon from "sinon";
import { TaskService } from "../src/services/taskService";
import { prisma } from "../prisma/prisma.service";
import { PrismaClient, Task, Status } from "@prisma/client";

describe("Task", () => {
  let taskService: TaskService;
  let prismaMock: any;
  beforeEach(() => {
    prismaMock = {
      task: {
        create: sinon.stub(),
        findUnique: sinon.stub(),
        update: sinon.stub(),
        delete: sinon.stub(),
      },
    };

    // Inicializando o serviço com o mock do Prisma
    taskService = new TaskService(prismaMock as PrismaClient);
  });

  afterEach(() => {
    sinon.restore(); // Restaura os stubs após cada teste
  });

  it("should create a task correctly", async () => {
    const mockTask: Task = {
      id: 1,
      title: "Complete the project",
      description: "Finish the TypeScript API",
      status: Status.PENDING,
      userId: 1,
      categoryId: null,
    };

    prismaMock.task.create.resolves(mockTask);

    const result = await taskService.createTask({
      title: "Complete the project",
      description: "Finish the TypeScript API",
      userId: 1,
    });

    expect(result).to.deep.equal(mockTask);
    expect(prismaMock.task.create.calledOnce).to.be.true;
  });

  it("should return null when task is not found", async () => {
    prismaMock.task.findUnique.resolves(null);

    const result = await taskService.editTask(999, { title: "Updated Task" });

    expect(result).to.be.undefined;
    expect(prismaMock.task.findUnique.calledOnce).to.be.true;
  });

  it("should edit a task correctly", async () => {
    const existingTask: Task = {
      id: 1,
      title: "Old Title",
      description: "Old Description",
      status: Status.PENDING,
      userId: 1,
      categoryId: null,
    };

    const updatedTask: Task = {
      ...existingTask,
      title: "Updated Title",
      description: "Updated Description",
    };

    prismaMock.task.findUnique.resolves(existingTask);
    prismaMock.task.update.resolves(updatedTask);

    const result = await taskService.editTask(1, {
      title: "Updated Title",
      description: "Updated Description",
    });

    expect(result).to.deep.equal(updatedTask);
    expect(prismaMock.task.update.calledOnce).to.be.true;
  });

  it("should delete a task successfully", async () => {
    const mockTask: Task = {
      id: 1,
      title: "Task to be deleted",
      description: "This task will be removed",
      status: Status.PENDING,
      userId: 1,
      categoryId: null,
    };

    prismaMock.task.findUnique.resolves(mockTask);
    prismaMock.task.delete.resolves(mockTask);

    const result = await taskService.deleteTask(1);

    expect(result).to.be.true;
    expect(prismaMock.task.delete.calledOnce).to.be.true;
  });

  it("should return false when trying to delete a non-existing task", async () => {
    prismaMock.task.findUnique.resolves(null);

    const result = await taskService.deleteTask(999);

    expect(result).to.be.false;
    expect(prismaMock.task.delete.called).to.be.false;
  });
});
