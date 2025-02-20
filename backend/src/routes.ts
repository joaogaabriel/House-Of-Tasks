import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
} from "./controllers/userController";
import { createTask } from "./controllers/taskController";
import { login } from "./controllers/authController";

const router = Router();

router.post("/login", login);

router.post("/users", createUser);
router.get("/users/:id", getUserById);

router.get("/userss", getUsers);

router.post("/tasks", createTask);

export default router;
