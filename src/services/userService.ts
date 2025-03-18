import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";

export class UserService {
  constructor(private readonly prisma: PrismaClient) { }
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

  async createUser(data: User): Promise<User | undefined> {
    try {
      const user = await this.prisma.user.create({ data });
      return user;
    } catch (err) {
      console.log(err);
    }
  }

  async updateUser(data: User): Promise<User | undefined> {
    try {
      const user = await this.prisma.user.update({
        where: { id: data.id },
        data,
      });
      return user;
    } catch (err) {
      console.log(err);
    }
  }

  async deleteUser(id: string): Promise<undefined> {
    try {
      await this.prisma.user.delete({where: { id }});
    } catch (err) {
      console.log(err);
    }
  }
}
