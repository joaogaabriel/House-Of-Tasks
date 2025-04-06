import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";

export class AuthService {
  constructor(private readonly prisma: PrismaClient) {}

  async loginUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        console.log("Usuário não encontrado!");
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        console.log("Senha incorreta!");
        return null;
      }

      return user;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
