import { ArchiveRestore } from "lucide-react";

import { toggleCategoryAction } from "@/app/actions";
import { CategoryFormDialog } from "@/components/category-form-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIconByName } from "@/lib/icons";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function CategoriesPage() {
  const user = await requireUser();
  const categories = await db.category.findMany({
    where: { userId: user.id },
    orderBy: [{ isActive: "desc" }, { name: "asc" }]
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Create, edit, and archive reminder categories as your setup evolves.</p>
        </div>
        <CategoryFormDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const Icon = getIconByName(category.iconName);

          return (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl p-3" style={{ backgroundColor: `${category.color}22`, color: category.color }}>
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <p className="text-sm text-[var(--muted-foreground)]">{category.isActive ? "Active" : "Archived"}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-[var(--muted-foreground)]">{category.description || "No description yet."}</p>
                <div className="flex flex-wrap gap-2">
                  <CategoryFormDialog category={category} />
                  <form action={toggleCategoryAction.bind(null, category.id, !category.isActive)}>
                    <Button variant="outline">
                      <ArchiveRestore className="size-4" />
                      {category.isActive ? "Deactivate" : "Reactivate"}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
