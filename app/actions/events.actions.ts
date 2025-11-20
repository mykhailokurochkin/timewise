'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const getUserId = async () => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
};

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startTime: z.string().transform((str) => new Date(str)),
  endTime: z.string().transform((str) => new Date(str)),
  priority: z.enum(["NORMAL", "IMPORTANT", "CRITICAL"]),
});

const parseEventData = (formData: FormData) => {
  return eventSchema.parse({
    title: formData.get("title"),
    description: formData.get("description"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    priority: formData.get("priority"),
  });
};

export const createEvent = async (formData: FormData) => {
  const userId = await getUserId();

  await prisma.event.create({
    data: { ...parseEventData(formData), userId },
  });

  revalidatePath("/dashboard");
};

export const getEvents = async () => {
  const userId = await getUserId();

  return prisma.event.findMany({
    where: { userId },
    orderBy: { startTime: "asc" },
  });
};

export const updateEvent = async (id: string, formData: FormData) => {
  const userId = await getUserId();
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event || event.userId !== userId) {
    throw new Error("Unauthorized or event not found");
  }

  await prisma.event.update({
    where: { id },
    data: parseEventData(formData),
  });

  revalidatePath("/dashboard");
};

export const deleteEvent = async (id: string) => {
  const userId = await getUserId();
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event || event.userId !== userId) {
    throw new Error("Unauthorized or event not found");
  }

  await prisma.event.delete({ where: { id } });
  revalidatePath("/dashboard");
};