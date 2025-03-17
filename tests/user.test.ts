import { expect } from "chai";
import { UserService } from "../src/services/userService";
import { prisma } from "../prisma/prisma.service";
import { PrismaClient, User } from "@prisma/client";

describe("User", () => {
  let user: UserService;
  beforeEach(() => {
    user = new UserService(prisma);
  });
  it("should create user correctly", async () => {
    const mockUser: User = {
      id: 1,
      name: "Jon Snow",
      email: "jon@snow.com",
      password: "hashedpassword",
    };
    const result = await user.createUser(mockUser);
    expect(result).to.equal(mockUser);
  });

  it("should return a user when found", async () => {
    const mockUser: User = {
      id: 1,
      name: "Arya Stark",
      email: "arya@stark.com",
      password: "somehash",
    };
    const result = await user.getUserById(1);
    expect(result).to.equal(mockUser);
  });
});
