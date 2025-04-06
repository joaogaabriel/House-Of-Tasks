import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { prisma } from "../../prisma/prisma.service";

const userService = new UserService(prisma);

export const createUser = async (req: Request, res: Response) => {
  const { id, name, email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "email e password são obrigatórios!" });
  }
  const newUser = await userService.createUser(req.body);
  res.status(201).json(newUser);
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await userService.getUserById(+id);

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(201).json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário por ID:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.params;

  const user = await userService.getUserByEmail(email);
  if (user) {
    res.json(user);
  }

  res.status(404).json({ message: "Usuário não encontrado" });
};
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "ID do usuario é obrigatório." });
    }
    const existingUser = await prisma.user.findUnique({
      where: { id: +id },
    });

    if (!existingUser) {
      res.status(404).json({ error: "Usuario não encontrada." });
    }
    await userService.deleteUser(+id);

    res.json({ message: "Usuario deletada com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar usuario:", err);
  }
};

export const editUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { user, ...data } = req.body;
    if (!id) {
      res.status(400).json({ error: "ID do usuario é obrigatório." });
    }
    const existingUser = await prisma.user.findUnique({
      where: { id: +id },
    });
    const updateUser = await userService.editUser(+id, data);

    res.json(updateUser);
  } catch (err) {
    console.error("Erro ao editar usuario:", err);
  }
};
