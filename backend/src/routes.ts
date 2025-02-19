import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
} from "./controllers/userController";
import { createTask, getTasksByUser } from "./controllers/taskController";
import { login } from "./controllers/authController";

const router = Router();

router.post("/users", createUser);
router.get("/users/:id", getUserById);

router.get("/userss", getUsers);
router.post("/tasks", createTask);
router.get("/tasks/:userId", getTasksByUser);
router.post("/login", login);

export default router;
