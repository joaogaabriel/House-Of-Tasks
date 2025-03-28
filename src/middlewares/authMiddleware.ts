import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = "batatinhafrita123";

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Token não fornecido" });
  } else {
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      res.status(401).json({ message: "Token mal formatado" });
    } else {
      const token = parts[1];

      try {
        const decoded = jwt.verify(token, SECRET_KEY) as {
          id: number;
          email: string;
        };

        req.user = { id: decoded.id, email: decoded.email };
        next();
      } catch (error) {
        res.status(401).json({ message: "Token inválido ou expirado" });
      }
    }
  }
};
