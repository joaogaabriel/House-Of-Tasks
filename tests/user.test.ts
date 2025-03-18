import { expect } from "chai";
import { PrismaClient } from "@prisma/client";
import { UserService } from "../src/services/userService";
import bcrypt from "bcrypt";

describe("User Service", () => {
  let prisma: PrismaClient;
  let userService: UserService;
  let userId: number;

  before(async () => {
    prisma = new PrismaClient();
    userService = new UserService(prisma);
  });

  after(async () => {
    await prisma.$disconnect();
  });

  it("[GET ALL] Empty list of users", async () => {
    const users = userService.getAllUsers();
    expect(users).to.be.an("array").that.is.empty;
  });

  it("[CREATE] User creation", async () => {
    const userData = {
      name: "Pennywise",
      email: "ilovederry@wise.com",
      password: "anitta",
    };

    const user = await userService.createUser(userData);
    expect(user).to.have.property("id");
    expect(user?.name).to.equal(userData.name);
    expect(user?.email).to.equal(userData.email);
    userId = user!.id;
  });

  it("[GET ONE] User by ID", async () => {
    const user = await userService.getUserById(userId);
    expect(user).to.not.be.null;
    expect(user?.id).to.equal(userId);
  });
});
