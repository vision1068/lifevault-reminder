"use client";

import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip } from "recharts";

const chartColors = ["#0f766e", "#2563eb", "#dc2626", "#f59e0b", "#7c3aed", "#0ea5e9"];

export function CategorySummaryChart({
  data
}: {
  data: Array<{
    name: string;
    value: number;
  }>;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={90} paddingAngle={4}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
