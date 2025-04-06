import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";

export class UserService {
  constructor(private readonly prisma: PrismaClient) {}
  private users: User[] = [];

  async createUser(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<User | undefined> {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(data.password, salt);
    data.password = passwordHash;
    try {
      const user = await this.prisma.user.create({ data });
      return user;
    } catch (err) {
      console.log(err);
    }
  }
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      return user;
    } catch (err) {
      console.error("Erro ao buscar usuário por email:", err);
      return null;
    }
  }

  getAllUsers(): User[] {
    return this.users;
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      return user;
    } catch (err) {
      console.error("Error fetching user by ID:", err);
      return null;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!existingUser) {
        console.log("Tarefa não encontrada.");
      }
      await this.prisma.user.delete({ where: { id } });
      return true;
    } catch (err) {
      console.error("Error fetching user by ID:", err);
      return false;
    }
  }

  async editUser(
    id: number,
    data: Partial<Omit<User, "id">>
  ): Promise<User | undefined> {
    try {
      const existingUser = await this.prisma.user.findUnique({ where: { id } });

      if (!existingUser) {
        console.log("Usuario não encontrado.");
        return undefined;
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data,
      });

      return updatedUser;
    } catch (err) {
      console.log("Erro ao editar usuario:", err);
    }
  }
}
