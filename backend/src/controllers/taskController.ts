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
