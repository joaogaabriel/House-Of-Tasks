import { PrismaClient, Tag, Status } from "@prisma/client";

export class TagService {
  constructor(private readonly prisma: PrismaClient) {}
  private tags: Tag[] = [];
  async createTag(data: {
    name: string;
    id: number;
  }): Promise<Tag | undefined> {
    try {
      const tag = await this.prisma.tag.create({
        data: {
          name: data.name,
          id: data.id,
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
}
