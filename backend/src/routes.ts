import { Router } from "express";
import { createUser, getUsers } from "./controllers/userController";
import { createTask, getTasksByUser } from "./controllers/taskController";
import { login } from "./controllers/authController";

const router = Router();

router.post("/users", createUser);
router.get("/users", getUsers);
router.post("/tasks", createTask);
router.get("/tasks/:userId", getTasksByUser);
router.post("/login", login);

export default router;
