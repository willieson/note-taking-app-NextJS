"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface LineChartProps {
  title: string;
  data: { [key: string]: any }[];
  dataKeyX: string;
  dataKeyY: string;
  unit?: string;
  color?: string;
}

export default function LineChartCard({
  title,
  data,
  dataKeyX,
  dataKeyY,
  unit = "",
  color = "#02437B",
}: LineChartProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow w-full">
      <h3 className="text-md font-semibold mb-4 text-center text-[#02437B]">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={dataKeyX} />
          <YAxis />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", borderColor: "#ccc" }}
            formatter={(value: number) => [`${value} ${unit}`, ""]} // Tooltip hanya tampilkan angka + satuan
            labelFormatter={(label) => `${label}`}
          />
          <Line
            type="monotone"
            dataKey={dataKeyY}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
