import { Request, Response } from "express";
import { prisma } from "../../prisma/prisma.service";
import { Status } from "@prisma/client";
import { TagService } from "../services/tagService";

const tagService = new TagService(prisma);

export const createTag = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(403).json({ message: "Usuário não autenticado" });
      return;
    }

    const { title } = req.body;

    if (!title) {
      res.status(400).json({ message: "Title é obrigatório" });
      return;
    }

    const newTag = await tagService.createTag(user.id, title);

    res.status(200).json(newTag);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    res
      .status(500)
      .json({ message: "Erro ao criar a tag", error: errorMessage });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) {
      res.status(400).json({ error: "ID da tag é obrigatório." });
    }
    const existingTag = await prisma.tag.findUnique({ where: { id: +id } });
    if (!existingTag) {
      res.status(400).json({ error: "Tag não encontrada" });
    }
    await tagService.deleteTag(id);
    res.json({ message: "Tag deletada com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar tag", err);
  }
};

export const editTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { user, ...data } = req.body;
    if (!id) {
      res.status(400).json({ error: "ID da tag é obrigatório." });
    }
    const existingTag = await prisma.tag.findUnique({
      where: { id: +id },
    });
    const updateTask = await tagService.editTag(+id, data);

    res.json(updateTask);
  } catch (err) {
    console.error("Erro ao editar tag:", err);
  }
};

export const getTagsByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado" });
    }

    const tags = await prisma.tag.findMany({
      where: { userId },
    });

    res.status(200).json(tags);
  } catch (error) {
    console.error("Erro ao buscar tags do usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const getTagById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tag = await prisma.tag.findUnique({
      where: { id: Number(id) },
    });

    if (!tag) {
      return res.status(404).json({ message: "Tag não encontrada" });
    }

    res.status(200).json(tag);
  } catch (error) {
    console.error("Erro ao buscar tag:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};
