"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Label,
} from "recharts";

type ChartData = {
  name: string;
  value: number;
};

const COLORS = ["#02437B", "#4E9FD1", "#D8E9F0"];

interface DonutChartProps {
  title: string;
  data: ChartData[];
}

export default function DonutChart({ title, data }: DonutChartProps) {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="bg-white rounded-2xl p-4 shadow w-full md:w-[300px]">
      <h3 className="text-md font-semibold mb-4 text-center text-[#02437B]">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}

            {/* ✅ Tambah label di tengah */}
            <Label
              value={`Total\n${total}`}
              position="center"
              style={{
                fill: "#02437B",
                fontSize: 14,
                fontWeight: "bold",
                whiteSpace: "pre-line",
              }}
            />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
