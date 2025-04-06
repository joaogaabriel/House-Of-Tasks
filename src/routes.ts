import { Router } from "express";
import {
  createUser,
  getUserByEmail,
  getUserById,
  deleteUser,
  editUser,
} from "./controllers/userController";
import {
  createTask,
  deleteTask,
  editTask,
  addTagToTask,
  removeTagFromTask,
  getTasks,
  addCategoryToTask,
  removeCategoryFromTask,
} from "./controllers/taskController";
import { login } from "./controllers/authController";
import { checkToken } from "./middlewares/authMiddleware";
import { createTag, deleteTag, editTag } from "./controllers/tagController";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "./controllers/categoryController";

const router = Router();

// Entidade User
router.post("/login", login); // realizar login
router.post("/users", createUser); // criar usuario
router.get("/users/:id", getUserById); // retornar usuario
router.delete("/user/:id", deleteUser); // deleta um usuario
router.put("user/:id", editUser);
router.get("/users/email/:email", getUserByEmail);

// Entidade Task
router.post("/tasks", checkToken, createTask); // criar Task
router.get("/tasks/user/:id", checkToken, getTasks); // recupera Tasks
router.put("/tasks/:id", checkToken, editTask); // modificar Task
router.delete("/tasks/:id", checkToken, deleteTask); // deletar Task
router.post("/tasks/:taskId/tags/:tagId", checkToken, addTagToTask); // adicionar Tag a Task
router.delete("/tasks/:taskId/tags/:tagId", checkToken, removeTagFromTask); // remover Tag da Task
router.post(
  "/tasks/:taskId/category/:categoryId",
  checkToken,
  addCategoryToTask
); // adicionar categoria a tarefa
router.delete(
  "/tasks/:taskId/category/:categoryId",
  checkToken,
  removeCategoryFromTask
); // remove categoria da tarefa

// Entidade Tag
router.post("/tags", checkToken, createTag); // criar Tag
router.put("/tags/:id", checkToken, editTag); // editar Tag
router.delete("/tags/:id", checkToken, deleteTag); // deletar Tag

// Entidade Category
router.post("/category", checkToken, createCategory); // cria categoria
router.get("/categories", checkToken, getCategories); // recupera categorias
router.put("/category/:id", checkToken, updateCategory); // edita categoria
router.delete("/category/:id", checkToken, deleteCategory); // deleta categoria

export default router;
