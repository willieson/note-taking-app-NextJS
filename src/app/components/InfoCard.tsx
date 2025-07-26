import { ReactNode } from "react";

interface InfoCardProps {
  title: string;
  value: string;
  subtitle: string;
  actions?: ReactNode;
}

export default function InfoCard({
  title,
  value,
  subtitle,
  actions,
}: InfoCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 md:p-5 w-full flex flex-col gap-1">
      <h4 className="text-md lg:text-xl font-medium text-gray-500">{title}</h4>
      <p className="text-xs lg:text-3xl font-bold text-[#02437B]">{value}</p>
      <span className="text-xs md:text-sm text-gray-400">{subtitle}</span>
      {actions && <div className="top-2 right-2 flex gap-2">{actions}</div>}
    </div>
  );
}
