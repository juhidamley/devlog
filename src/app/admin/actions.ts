"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function assertAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Posts ────────────────────────────────────────────────────────────────────

type PostInput = {
  title: string;
  projectId: string;
  content: string;
  isPublished: boolean;
};

export async function createPost(input: PostInput) {
  await assertAdmin();

  await prisma.post.create({
    data: {
      title: input.title,
      slug: slugify(input.title),
      projectId: input.projectId,
      content: input.content,
      isPublished: input.isPublished,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function updatePost(id: string, input: PostInput) {
  await assertAdmin();

  await prisma.post.update({
    where: { id },
    data: {
      title: input.title,
      projectId: input.projectId,
      content: input.content,
      isPublished: input.isPublished,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

// ── Projects ─────────────────────────────────────────────────────────────────

type ProjectInput = {
  title: string;
  description: string;
};

export async function createProject(input: ProjectInput) {
  await assertAdmin();

  await prisma.project.create({
    data: {
      title: input.title,
      slug: slugify(input.title),
      description: input.description,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/projects");
}

export async function updateProject(id: string, input: ProjectInput) {
  await assertAdmin();

  await prisma.project.update({
    where: { id },
    data: {
      title: input.title,
      slug: slugify(input.title),
      description: input.description,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/projects");
  redirect("/admin");
}

export async function deleteProject(id: string) {
  await assertAdmin();
  // Remove posts first to satisfy FK constraint
  await prisma.post.deleteMany({ where: { projectId: id } });
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function deletePost(id: string) {
  await assertAdmin();
  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/");
}
