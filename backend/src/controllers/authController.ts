import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../../prisma/prisma.service";

const SECRET_KEY = "seuSegredoSuperSeguro";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Email e senha são obrigatórios!" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: "Credenciais inválidas!" });
  }
  const token = jwt.sign(
    { id: req.body.id, email: req.body.email },
    SECRET_KEY,
    {
      expiresIn: "2h",
    }
  );

  res.json({ token });
};
