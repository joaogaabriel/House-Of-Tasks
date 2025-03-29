import { PrismaClient, Tag, Status } from "@prisma/client";

export class TagService {
  constructor(private readonly prisma: PrismaClient) {}

  async createTag(userId: number, name: string): Promise<Tag | undefined> {
    try {
      const tag = await this.prisma.tag.create({
        data: {
          name: name,
          user: { connect: { id: userId } },
        },
      });
      return tag;
    } catch (err) {
      console.error("Erro ao criar a tag:", err);
    }
  }

  async deleteTag(id: number): Promise<boolean> {
    try {
      const existingTag = await this.prisma.tag.findUnique({ where: { id } });

      if (!existingTag) {
        console.log("Tag não encontrada.");
        return false;
      }
      await this.prisma.tag.delete({ where: { id } });
      return true;
    } catch (err) {
      console.log("Erro ao deletar tag:", err);
      return false;
    }
  }
  async editTag(
    id: number,
    data: { name?: string; userId?: number }
  ): Promise<Tag | undefined> {
    try {
      const existingTag = await this.prisma.tag.findUnique({ where: { id } });

      if (!existingTag) {
        console.log("Tag não encontrada.");
        return undefined;
      }

      const updatedTag = await this.prisma.tag.update({
        where: { id },
        data,
      });

      return updatedTag;
    } catch (err) {
      console.log("Erro ao editar tag:", err);
    }
  }
}
