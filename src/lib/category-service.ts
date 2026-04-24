import "server-only";

import { db } from "@/lib/db";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

export async function ensureDefaultCategories(userId: string) {
  const existing = await db.category.count({
    where: { userId }
  });

  if (existing > 0) {
    return;
  }

  await db.category.createMany({
    data: DEFAULT_CATEGORIES.map((category) => ({
      userId,
      ...category
    }))
  });
}
