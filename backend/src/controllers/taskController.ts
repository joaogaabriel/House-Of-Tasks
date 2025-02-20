import { Request, Response } from "express";
import { prisma } from "../../prisma/prisma.service";
import { Status } from "@prisma/client";
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, userId } = req.body;

    if (!title || !description) {
      res.status(400).json({ message: "Título e descrição são obrigatórios!" });
      return;
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status: "PENDING",
        userId,
      },
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
/* export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.id;

    if (!title || !description) {
      res.status(400).json({ message: "Título e descrição são obrigatórios!" });
    }

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado!" });
    }

    const newTask = await prisma.task.create(req.body);

    res.status(201).json(newTask);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    res
      .status(500)
      .json({ message: "Erro ao criar a tarefa", error: errorMessage });
  }
};
 */
