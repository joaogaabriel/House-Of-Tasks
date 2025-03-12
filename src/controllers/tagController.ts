import { Request, Response } from "express";
import { prisma } from "../../prisma/prisma.service";
import { Status } from "@prisma/client";
import { TagService } from "../services/tagService";

const tagService = new TagService(prisma);

export const createTag = async (req: Request, res: Response) => {
  try {
    const { name, id } = req.body;
    if (!name || !id) {
      res.status(400).json({ message: "Nome e Id são obrigatórios" });
      return;
    }
    const newTag = await tagService.createTag({
      name,
      id,
    });
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
