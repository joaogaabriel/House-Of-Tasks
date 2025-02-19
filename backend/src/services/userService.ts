import { PrismaClient, User } from "@prisma/client";

export class UserService {
  constructor(private readonly prisma: PrismaClient) {}
  private users: User[] = [];

  async createUser(data: User): Promise<User | undefined> {
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

  async getUserById(id: string): Promise<User | null> {
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
}
