"use client";
import dynamic from "next/dynamic";

import { useState } from "react";
import LayoutShell from "@/app/components/LayoutShell";
import InfoCard from "@/app/components/InfoCard";
import DonutChart from "@/app/components/DonutChart";
import LineChartCard from "@/app/components/LineChartCard";
import Modal from "@/app/components/Modal";
import { useToast } from "@/app/components/ToastProvider";

const BarChartCard = dynamic(() => import("@/app/components/BarChartCard"), {
  ssr: false,
});
const TableWithPagination = dynamic(
  () => import("@/app/components/TableWithPagination"),
  { ssr: false }
);

// Dummy data
const data1 = [
  { name: "Programmer", value: 3 },
  { name: "Finance", value: 2 },
  { name: "Accounting", value: 5 },
  { name: "Legal", value: 5 },
];

const columns = ["No", "Product", "Category", "Total Sales"];

const data = Array.from({ length: 37 }, (_, i) => ({
  No: i + 1,
  Product: `Product ${i + 1}`,
  Category: i % 2 === 0 ? "Electronics" : "Furniture",
  "Total Sales": `Rp. ${(Math.random() * 1000000).toFixed(0)}`,
}));

const dummySales = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 120 },
  { month: "Mar", value: 90 },
  { month: "Apr", value: 200 },
  { month: "May", value: 250 },
];

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();

  return (
    <LayoutShell>
      {/* Info Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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

      {/* Chart Section */}
      <section className="p-4 flex flex-col gap-6 lg:grid lg:grid-cols-2">
        {/* Donut Chart */}
        <div className="bg-white p-4 rounded-xl shadow-md flex justify-center items-center">
          <DonutChart title="Employee" data={data1} />
        </div>

        {/* Line + Bar Chart */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-4 rounded-xl shadow-md w-full">
            <LineChartCard
              title="Penjualan Bulanan"
              data={dummySales}
              dataKeyX="month"
              dataKeyY="value"
              unit="unit"
            />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md w-full">
            <BarChartCard
              title="Penjualan per Kategori"
              data={[
                { label: "Elektronik", value: 450 },
                { label: "Pakaian", value: 320 },
                { label: "Makanan", value: 270 },
                { label: "Minuman", value: 210 },
              ]}
              unit="produk"
            />
          </div>
        </div>
      </section>

      {/* === MODAL & toast Notif SECTION === */}
      <section className="p-6">
        <button
          onClick={() => setIsOpen(true)}
          className="btn-erp-primary hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition"
        >
          Show Modal
        </button>

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Title Modal"
        >
          <p className="text-sm text-gray-700">Conten Modal</p>
          <div className="mt-4 text-right">
            <button
              onClick={() => setIsOpen(false)}
              className="btn-erp-secondary hover:bg-gray-300 text-sm px-3 py-1 rounded-lg"
            >
              Close
            </button>
          </div>
        </Modal>

        <button
          onClick={() => showToast("Success!", "success")}
          className="btn-erp-primary text-white px-4 py-2 rounded-lg"
        >
          Success
        </button>
        <button
          onClick={() => showToast("Error!", "error")}
          className="btn-erp-danger text-white px-4 py-2 rounded-lg ml-2"
        >
          Error
        </button>
        <button
          onClick={() => showToast("Warning!", "info")}
          className="btn-erp-warning text-white px-4 py-2 rounded-lg ml-2"
        >
          Info
        </button>
      </section>

      {/* Table Section */}
      <section>
        <div className="p-6 flex flex-col gap-8">
          <TableWithPagination title="Test" columns={columns} data={data} />
        </div>
      </section>
    </LayoutShell>
  );
}
