import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { prisma } from "../../prisma/prisma.service";

const userService = new UserService(prisma);

export const createUser = async (req: Request, res: Response) => {
  const { id, name, email, password } = req.body;

  if (!id || !email || !password) {
    res.status(400).json({ message: "id, email e password são obrigatórios!" });
  }
  const newUser = await userService.createUser(req.body);
  res.status(201).json(newUser);
};

export const getUsers = (req: Request, res: Response) => {
  res.json(userService.getAllUsers());
};

export const getUserById = async (req: Request, res: Response) => {
  //const userIdFromToken = req.body.user.id;
  const { id } = req.params;
  /*if (userIdFromToken !== id) {
    res.status(403).json({ message: "Acesso negado" });
  }*/
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
