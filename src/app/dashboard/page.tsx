import LayoutShell from "@/app/components/LayoutShell";
import { type Metadata } from "next";
import InfoCard from "@/app/components/InfoCard";
import DonutChart from "@/app/components/DonutChart";
import TableWithPagination from "@/app/components/TableWithPagination";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ERP System - Dashboard", // bisa juga ambil dari params jika dynamic route
  };
}

//Data Chart
const data1 = [
  { name: "Programmer", value: 3 },
  { name: "Finance", value: 2 },
  { name: "Accounting", value: 5 },
  { name: "Legal", value: 5 },
];

//table with pagination
const columns = ["No", "Product", "Category", "Total Sales"];

const data = Array.from({ length: 37 }, (_, i) => ({
  No: i + 1,
  Product: `Product ${i + 1}`,
  Category: i % 2 === 0 ? "Electronics" : "Furniture",
  "Total Sales": `Rp. ${(Math.random() * 1000000).toFixed(0)}`,
}));

export default function DashboardPage() {
  return (
    <LayoutShell>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <InfoCard
          title="Total Earnings"
          value="Rp. 25.000.000"
          subtitle="1 month"
        />
        <InfoCard
          title="Total Products Sold"
          value="1.200"
          subtitle="1 month"
        />
        <InfoCard
          title="Best Selling Category"
          value="Rp. 10.000.000"
          subtitle="1 month"
        />
        <InfoCard
          title="Best Selling Product"
          value="Rp. 4.000.000"
          subtitle="1 month"
        />
      </section>

      <section className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex justify-center bg-white p-4 rounded-xl shadow-md">
          <DonutChart title="Employee" data={data1} />
        </div>
      </section>

      <section>
        <div className="p-6 flex flex-col gap-8">
          {/* Section 1 - Cards */}
          {/* Section 2 - DonutChart */}
          {/* Section 3 - Table */}
          <TableWithPagination title="Test" columns={columns} data={data} />
        </div>
      </section>
    </LayoutShell>
  );
}
