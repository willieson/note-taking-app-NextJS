interface InfoCardProps {
  title: string;
  value: string;
  subtitle: string;
}

export default function InfoCard({ title, value, subtitle }: InfoCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2 w-full">
      <h4 className="text-sm font-medium text-gray-600">{title}</h4>
      <p className="text-xl font-bold text-blue-800">{value}</p>
      <span className="text-xs text-gray-400">{subtitle}</span>
    </div>
  );
}
