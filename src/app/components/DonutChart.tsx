"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Label,
} from "recharts";
import { useState, useEffect, useRef } from "react";

type ChartData = {
  name: string;
  value: number;
};

interface DonutChartProps {
  title: string;
  data: ChartData[];
}

function generateThemeColors(count: number): string[] {
  const baseHue = 210;
  const saturation = 65;
  const minLight = 35;
  const maxLight = 75;

  const colors = [];
  for (let i = 0; i < count; i++) {
    const lightness =
      minLight + ((maxLight - minLight) * i) / Math.max(1, count - 1);
    colors.push(`hsl(${baseHue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
}

export default function DonutChart({ title, data }: DonutChartProps) {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const colors = generateThemeColors(data.length);

  const handleClick = (
    _: any,
    index: number,
    e: React.MouseEvent<SVGElement, MouseEvent>
  ) => {
    if (!isMobile || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    setActiveIndex(index);
    setTooltipPos({
      x: e.clientX - containerRect.left,
      y: e.clientY - containerRect.top,
    });
  };

  const renderTooltipContent = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: any[];
  }) => {
    if (active && payload && payload.length > 0) {
      const { name, value } = payload[0];
      const percent = ((value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-2 rounded shadow text-sm text-gray-700 border border-gray-300">
          <strong>{name}</strong>: {percent}%
        </div>
      );
    }
    return null;
  };

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-2xl p-4 shadow w-full md:w-[300px] relative"
    >
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
            onClick={handleClick}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
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
          {!isMobile && <Tooltip content={renderTooltipContent} />}
        </PieChart>
      </ResponsiveContainer>

      {isMobile && activeIndex !== null && tooltipPos && (
        <div
          className="absolute z-10 px-2 py-1 bg-white text-sm border border-gray-300 rounded shadow text-[#02437B] font-medium"
          style={{
            top: `${tooltipPos.y}px`,
            left: `${tooltipPos.x}px`,
            transform: "translate(-50%, -120%)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {data[activeIndex].name}:{" "}
          {((data[activeIndex].value / total) * 100).toFixed(1)}%
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 text-sm space-y-1">
        {data.map((entry, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-gray-700"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index] }}
              />
              <span className="text-[#02437B] font-medium">{entry.name}</span>
            </div>
            <span className="font-semibold">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
