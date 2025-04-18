import { Request, Response } from "express";
import { prisma } from "../../prisma/prisma.service";
import { Status } from "@prisma/client";
import { TaskService } from "../services/taskService";
import { PageOptionsDto } from "../pagination/page-options.dto";
import { PageMetaDto } from "../pagination/page-meta.dto";
import { PageDto } from "../pagination/page.dto";

const taskService = new TaskService(prisma);

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, userId, categoryId, tags } = req.body;

    if (!title || !description) {
      res.status(400).json({ message: "Título e descrição são obrigatórios!" });
      return;
    }
    const newTask = await taskService.createTask({
      title,
      description,
      status: (status as Status) || "PENDING",
      userId: +userId,
      categoryId: categoryId || undefined,
      tags: Array.isArray(tags) ? tags.map(Number) : undefined,
    });

    res.status(201).json(newTask);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    res
      .status(500)
      .json({ message: "Erro ao criar a tarefa", error: errorMessage });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pageOptions = new PageOptionsDto(req.query);

    const { entities, itemCount } = await taskService.getTasks(
      +id,
      pageOptions
    );

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptions,
      itemCount,
    });

    const page = new PageDto(entities, pageMetaDto);
    res.status(200).json(page);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res
      .status(500)
      .json({ message: "Erro ao buscar categorias", error: errorMessage });
  }
};

export const editTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { user, ...data } = req.body;
    if (!id) {
      res.status(400).json({ error: "ID da tarefa é obrigatório." });
    }
    const existingTask = await prisma.task.findUnique({
      where: { id: +id },
    });
    const updateTask = await taskService.editTask(+id, data);

    res.json(updateTask);
  } catch (err) {
    console.error("Erro ao editar tarefa:", err);
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "ID da tarefa é obrigatório." });
    }
    const existingTask = await prisma.task.findUnique({
      where: { id: +id },
    });

    if (!existingTask) {
      res.status(404).json({ error: "Tarefa não encontrada." });
    }
    await taskService.deleteTask(+id);
    /*await prisma.task.delete({
      where: { id: id },
    });*/
    res.json({ message: "Tarefa deletada com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar tarefa:", err);
  }
};

export const addTagToTask = async (req: Request, res: Response) => {
  const { taskId, tagId } = req.params;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: Number(taskId) },
      data: {
        tags: {
          connect: { id: Number(tagId) },
        },
      },
      include: { tags: true },
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Erro ao adicionar tag à tarefa:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const removeTagFromTask = async (req: Request, res: Response) => {
  const { taskId, tagId } = req.params;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: Number(taskId) },
      data: {
        tags: {
          disconnect: { id: Number(tagId) },
        },
      },
      include: { tags: true },
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Erro ao remover tag da tarefa:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};
export const addCategoryToTask = async (req: Request, res: Response) => {
  const { taskId, categoryId } = req.params;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: Number(taskId) },
      data: {
        category: {
          connect: { id: Number(categoryId) },
        },
      },
      include: { category: true },
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Erro ao adicionar categoria à tarefa:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};
export const removeCategoryFromTask = async (req: Request, res: Response) => {
  const { taskId, categoryId } = req.params;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: Number(taskId) },
      data: {
        category: {
          disconnect: { id: Number(categoryId) },
        },
      },
      include: { category: true },
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Erro ao remover categoria da tarefa:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};
