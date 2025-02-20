import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from "./controllers/userController";
import { 
  createTask, 
  getTasksByUser, 
  updateTaskStatus, 
  deleteTask
} from "./controllers/taskController";
import { login } from "./controllers/authController";

const router = Router();

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.post("/tasks", createTask);
router.get("/tasks/:userId", getTasksByUser);
router.patch("/tasks/:id", updateTaskStatus);
router.delete("/tasks/:id", deleteTask);

router.post("/login", login);

export default router;
