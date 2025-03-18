import { PrismaClient, Category } from "@prisma/client";

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
  async getCategories(): Promise<Category[]> {
    try {
      return await this.prisma.category.findMany();
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
      return await this.prisma.category.update({
        where: { id },
        data: { name, description },
      });
    } catch (err) {
      console.error("Erro ao atualizar categoria:", err);
      throw new Error("Erro ao atualizar categoria");
    }
  }

  async deleteCategory(id: number): Promise<Category | null> {
    try {
      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (err) {
      console.error("Erro ao excluir categoria:", err);
      throw new Error("Erro ao excluir categoria");
    }
  }
}
