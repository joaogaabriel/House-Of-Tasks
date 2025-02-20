import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { prisma } from "../../prisma/prisma.service";

const userService = new UserService(prisma);

export const getUsers = (req: Request, res: Response) => {
  res.json(userService.getAllUsers());
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await userService.getUserById(id);

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(201).json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário por ID:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { id, name, email, password } = req.body;

  if (!id || !email || !password) {
    res.status(400).json({ message: "id, email e password são obrigatórios!" });
  }

  const newUser = await userService.createUser(req.body);
  res.status(201).json(newUser);
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!id || !email || !password) {
    return res.status(400).json({ message: "id, email e password são obrigatórios!" });
  }

  const newUser = await userService.updateUser({ id, name, email, password });
  res.status(200).json(newUser);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "id é obrigatório!" });
  }

  await userService.deleteUser(id);
  res.status(204);
};
