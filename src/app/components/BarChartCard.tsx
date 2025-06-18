"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";

interface BarChartCardProps {
  title: string;
  data: { label: string; value: number }[];
  unit?: string;
  horizontal?: boolean;
}

// 🔷 Generate pastel gradasi biru
function generateThemeColors(count: number): string[] {
  const baseHue = 210;
  const saturation = 65;
  const minLight = 35;
  const maxLight = 75;

  return Array.from({ length: count }, (_, i) => {
    const lightness =
      minLight + ((maxLight - minLight) * i) / Math.max(1, count - 1);
    return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
  });
}

export default function BarChartCard({
  title,
  data,
  unit = "",
  horizontal = false,
}: BarChartCardProps) {
  const colors = generateThemeColors(data.length);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md w-full">
      <h3 className="text-md font-semibold mb-4 text-[#02437B] text-center">
        {title}
      </h3>

      <div className="relative">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={data}
            layout={horizontal ? "vertical" : "horizontal"}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {horizontal ? (
              <>
                <XAxis type="number" />
                <YAxis dataKey="label" type="category" />
              </>
            ) : (
              <>
                <XAxis dataKey="label" />
                <YAxis />
              </>
            )}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length > 0) {
                  const { payload: item, value } = payload[0];
                  return (
                    <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 shadow">
                      <strong>{item.label}</strong>: {value} {unit}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value">
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Legend di bawah chart */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 justify-items-start px-2">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index] }}
              />
              <span className="text-[#02437B] font-medium">{entry.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
