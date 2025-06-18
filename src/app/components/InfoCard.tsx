interface InfoCardProps {
  title: string;
  value: string;
  subtitle: string;
}

export default function InfoCard({ title, value, subtitle }: InfoCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 md:p-5 w-full flex flex-col gap-1">
      <h4 className="text-sm md:text-base font-medium text-gray-500">
        {title}
      </h4>
      <p className="text-2xl md:text-3xl font-bold text-[#02437B]">{value}</p>
      <span className="text-xs md:text-sm text-gray-400">{subtitle}</span>
    </div>
  );
}
