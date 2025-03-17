import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
} from "./controllers/userController";
import { getTasks, createTask, deleteTask, editTask } from "./controllers/taskController";
import { login } from "./controllers/authController";
import { checkToken } from "./middlewares/authMiddleware";

const router = Router();

router.post("/login", login);

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);

router.get("/tasks", checkToken, getTasks);
router.post("/tasks", checkToken, createTask);
router.put("/tasks/:id", checkToken, editTask);
router.delete("/tasks/:id", checkToken, deleteTask);

export default router;
