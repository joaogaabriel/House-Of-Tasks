import { Request, Response } from "express";
import { TaskService } from "../services/taskService";

const taskService = new TaskService();

export const createTask = (req: Request, res: Response) => {
  const task = taskService.createTask(req.body);
  res.status(201).json(task);
};

export const getTasksByUser = (req: Request, res: Response) => {
  const { userId } = req.params;
  res.json(taskService.getTasksByUser(userId));
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ message: "id e status são obrigatórios!" });
  }

  const updatedTask = taskService.updateTaskStatus(id, status);
  if (!updatedTask) {
    return res.status(404).json({ message: "Tarefa não encontrada" });
  }

  res.status(200).json(updatedTask);
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "id é obrigatório!" });
  }

  await taskService.deleteTask(id);

  res.status(204).send();
};
