import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { AuthService } from "../src/services/authService";
import { expect } from "chai";

const prisma = new PrismaClient();
const authService = new AuthService(prisma);

describe("Authentication Service Test Suite", () => {
  let userId: number;
  const userData = {
    name: "Jon Snow",
    email: "jon.snow@got.com",
    password: "winteriscoming",
  };

  before(async () => {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(userData.password, salt);
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: passwordHash,
      },
    });
    userId = user.id;
  });

  after(async () => {
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  it("[POST LOGIN] User login", async () => {
    const user = await authService.loginUser(userData.email, userData.password);
    expect(user).to.not.be.null;
    expect(user?.email).to.equal(userData.email);
  });

  it("[POST LOGIN] User login with incorrect password", async () => {
    const user = await authService.loginUser(userData.email, "wrongpassword");
    expect(user).to.be.null;
  });

  it("[POST LOGIN] User login with non-existent email", async () => {
    const user = await authService.loginUser(
      "nonexistent@email.com",
      "password"
    );
    expect(user).to.be.null;
  });
});
