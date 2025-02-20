import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = "seuSegredoSuperSeguro";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]; // Pega o token do header

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido!" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as {
      id: string;
      email: string;
    };
    req.user = decoded; // Adiciona os dados do usuário à requisição
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido!" });
  }
};
