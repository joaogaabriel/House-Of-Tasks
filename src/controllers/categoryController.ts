import { Request, Response } from "express";
import { prisma } from "../../prisma/prisma.service";
import { CategoryService } from "../services/categoryService";
import { PageOptionsDto } from "../pagination/page-options.dto";
import { PageMetaDto } from "../pagination/page-meta.dto";
import { PageDto } from "../pagination/page.dto";

const categoryService = new CategoryService(prisma);

export const createCategory = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(403).json({ message: "Usuário não autenticado" });
      return;
    }

    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ message: "Nome da categoria é obrigatório!" });
      return;
    }

    const newCategory = await categoryService.createCategory(
      user.id,
      name,
      description
    );

    res.status(201).json(newCategory);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    res
      .status(500)
      .json({ message: "Erro ao criar categoria", error: errorMessage });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const pageOptions = new PageOptionsDto(req.query);

    const { entities, itemCount } = await categoryService.getCategories(
      pageOptions
    );

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptions,
      itemCount,
    });

    const page = new PageDto(entities, pageMetaDto);
    res.status(200).json(page);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res
      .status(500)
      .json({ message: "Erro ao buscar categorias", error: errorMessage });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id || !name) {
      res
        .status(400)
        .json({ message: "ID e nome da categoria são obrigatórios!" });
    }

    const updatedCategory = await categoryService.updateCategory(
      +id,
      name,
      description
    );

    if (!updatedCategory) {
      res.status(404).json({ message: "Categoria não encontrada" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res
      .status(500)
      .json({ message: "Erro ao atualizar categoria", error: errorMessage });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "ID da categoria é obrigatório!" });
    }

    const deletedCategory = await categoryService.deleteCategory(Number(id));

    if (!deletedCategory) {
      res.status(404).json({ message: "Categoria não encontrada" });
    }

    res.status(200).json({ message: "Categoria excluída com sucesso" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res
      .status(500)
      .json({ message: "Erro ao excluir categoria", error: errorMessage });
  }
};
