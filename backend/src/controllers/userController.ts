import { Request, Response } from "express";
import { UserService } from "../services/userService";

const userService = new UserService();

export const createUser = (req: Request, res: Response) => {
  const user = userService.createUser(req.body);
  res.status(201).json(user);
};

export const getUsers = (req: Request, res: Response) => {
  res.json(userService.getAllUsers);
};
