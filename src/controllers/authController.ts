import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { AuthService } from "../services/authService";

const SECRET_KEY = "batatinhafrita123";

const prisma = new PrismaClient();
const authService = new AuthService(prisma);

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email e senha são obrigatórios!" });
  }

  const user = await authService.loginUser(email, password);

  if (!user) {
    res.status(401).json({ message: "Credenciais inválidas!" });
  } else {
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "2h",
    });

    res.status(201).json({ token });
  }
};
