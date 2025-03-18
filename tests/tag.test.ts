import { expect } from "chai";
import { PrismaClient } from "@prisma/client";
import { TagService } from "../src/services/tagService";

describe("TagService", () => {
  const prisma = new PrismaClient();
  const tagService = new TagService(prisma);
  let tagId: number;
  let userId: number;

  before(async () => {
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test@example.com",
        password: "password",
      },
    });
    userId = user.id;
  });

  after(async () => {
    await prisma.user.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.$disconnect();
  });

  it("[CREATE] should create a new tag", async () => {
    const tag = await tagService.createTag({ name: "Urgent", id: userId });
    expect(tag).to.exist;
    expect(tag?.name).to.equal("Urgent");
    expect(tag?.userId).to.equal(userId);
    if (tag) tagId = tag.id;
  });

  it("[UPDATE] should update an existing tag", async () => {
    const updatedTag = await tagService.editTag(tagId, {
      name: "High Priority",
    });
    expect(updatedTag).to.exist;
    expect(updatedTag?.name).to.equal("High Priority");
  });

  it("[UPDATE] should return undefined when updating a non-existent tag", async () => {
    const updatedTag = await tagService.editTag(9999, { name: "Non-existent" });
    expect(updatedTag).to.be.undefined;
  });

  it("[DELETE] should delete a tag", async () => {
    const deleted = await tagService.deleteTag(tagId);
    expect(deleted).to.be.true;
  });

  it("[DELETE] should return false when deleting a non-existent tag", async () => {
    const deleted = await tagService.deleteTag(9999);
    expect(deleted).to.be.false;
  });
});
