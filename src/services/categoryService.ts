import { PrismaClient, Category } from "@prisma/client";
import { PageOptionsDto } from "../pagination/page-options.dto";

export class CategoryService {
  constructor(private readonly prisma: PrismaClient) {}
  private category: Category[] = [];

  async createCategory(
    name: string,
    description?: string
  ): Promise<Category | undefined> {
    try {
      const category = await this.prisma.category.create({
        data: {
          name,
          description,
        },
      });
      return category;
    } catch (err) {
      console.error("Erro ao criar a categoria:", err);
    }
  }

  async getCategories(pageOptionsDto: PageOptionsDto): Promise<{
    entities: any;
    itemCount: number;
  }> {
    try {
      const { take, skip } = pageOptionsDto;
      const entities = await this.prisma.category.findMany({
        orderBy: [{ id: "asc" }],
        skip: skip,
        take: take,
      });

      const itemCount = await this.prisma.category.count({});

      return { entities, itemCount };
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
      throw new Error("Erro ao buscar categorias");
    }
  }

  async updateCategory(
    id: number,
    name: string,
    description?: string
  ): Promise<Category | null> {
    try {
      const existingCategory = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        throw new Error(
          "Erro ao atualizar categoria: Categoria não encontrada."
        );
      }
      return await this.prisma.category.update({
        where: { id },
        data: { name, description },
      });
    } catch (err) {
      console.error(
        "Erro ao atualizar categoria: Categoria não encontrada.",
        err
      );
      throw new Error("Erro ao atualizar categoria: Categoria não encontrada.");
    }
  }

  async deleteCategory(id: number): Promise<Category | null> {
    try {
      const existingCategory = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        throw new Error("Erro ao excluir categoria: Categoria não encontrada.");
      }
      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (err) {
      console.error(
        "Erro ao excluir categoria: Categoria não encontrada.",
        err
      );
      throw new Error("Erro ao excluir categoria: Categoria não encontrada.");
    }
  }
}
