import { PrismaClient } from "@prisma/client";
import { CategoryService } from "../src/services/categoryService";
import { expect } from "chai";

const prisma = new PrismaClient();
const categoryService = new CategoryService(prisma);

describe("Category Service Test Suite", () => {
  let categoryId: number;
  const categoryData = {
    name: "Software Development",
    description: "Tasks related to software engineering",
  };

  before(async () => {
    const category = await categoryService.createCategory(
      categoryData.name,
      categoryData.description
    );
    if (category) categoryId = category.id;
  });

  after(async () => {
    await prisma.category.deleteMany();
    await prisma.$disconnect();
  });

  it("[GET ALL] Empty list of categories", async () => {
    await prisma.category.deleteMany();
    const categories = await categoryService.getCategories();
    expect(categories).to.be.an("array").that.is.empty;
  });

  it("[GET ALL] List of categories", async () => {
    await categoryService.createCategory("Test Category", "Test Description");
    const categories = await categoryService.getCategories();
    expect(categories).to.be.an("array").that.is.not.empty;
  });

  it("[CREATE] Category creation", async () => {
    const category = await categoryService.createCategory(
      "New Category",
      "New Description"
    );
    expect(category).to.not.be.undefined;
    expect(category?.name).to.equal("New Category");
  });
});
