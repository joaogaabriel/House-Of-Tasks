import { Request, Response } from "express";
import { prisma } from "../../prisma/prisma.service";
import { Status } from "@prisma/client";
import { TaskService } from "../services/taskService";

const taskService = new TaskService(prisma);
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, userId } = req.body;

    if (!title || !description) {
      res.status(400).json({ message: "Título e descrição são obrigatórios!" });
      return;
    }
    const newTask = await taskService.createTask(req.body);

    res.status(201).json(newTask);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    res
      .status(500)
      .json({ message: "Erro ao criar a tarefa", error: errorMessage });
  }
};
export const editTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    if (!id) {
      res.status(400).json({ error: "ID da tarefa é obrigatório." });
    }
    const existingTask = await prisma.task.findUnique({
      where: { id: id },
    });
    const updateTask = await taskService.editTask(id, req.body);
    /*const updatedTask = await prisma.task.update({
      where: { id: id },
      data: { title, description },
    });*/

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
      where: { id: id },
    });

    if (!existingTask) {
      res.status(404).json({ error: "Tarefa não encontrada." });
    }
    await taskService.deleteTask(id);
    /*await prisma.task.delete({
      where: { id: id },
    });*/
    res.json({ message: "Tarefa deletada com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar tarefa:", err);
  }
};
