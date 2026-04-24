function SkeletonCard() {
  return <div className="h-28 animate-pulse rounded-[28px] border bg-[var(--card)]/70" />;
}

export default function AppLoading() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="h-[420px] animate-pulse rounded-[28px] border bg-[var(--card)]/70" />
        <div className="space-y-6">
          <div className="h-[280px] animate-pulse rounded-[28px] border bg-[var(--card)]/70" />
          <div className="h-[220px] animate-pulse rounded-[28px] border bg-[var(--card)]/70" />
        </div>
      </div>
    </div>
  );
}
