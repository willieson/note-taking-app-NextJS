"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
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

//data table api real
const columns = ["No", "Product", "Category", "Stock"];

//data other table from api
const apidata = [
  { name: "Joko Kendi", position: "Staff", division: "Programmer" },
  { name: "Jaka Sembung", position: "Staff", division: "Programmer" },
  { name: "Kim il Sung", position: "Manager", division: "Programmer" },
  { name: "Virly Hutapea", position: "Staff", division: "Finance" },
  { name: "Germany ngana", position: "Manager", division: "Finance" },
  { name: "Alexander Borni", position: "Manager", division: "Accounting" },
  { name: "Bane Sirlini", position: "Staff", division: "Accounting" },
  { name: "Eun su hi", position: "Staff", division: "Accounting" },
  { name: "Babacang oek", position: "Staff", division: "Accounting" },
  { name: "Nissa baruna", position: "Staff", division: "Accounting" },
  { name: "Boris Fernandes", position: "Manager", division: "Legal" },
  { name: "Akamsi umami", position: "Staff", division: "Legal" },
  { name: "Sai ihbul", position: "Staff", division: "Legal" },
  { name: "Tongse pat", position: "Staff", division: "Legal" },
  { name: "Cu min he", position: "Staff", division: "Legal" },
];
const columns2 = ["No", "Name", "Position", "Division"];

const data2 = apidata
  .sort((a, b) => a.name.localeCompare(b.name)) // Mengurutkan berdasarkan name
  .map((item, index) => ({
    No: index + 1,
    Name: item.name,
    Position: item.position,
    Division: item.division,
  }));

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();

  //API LINE CHART - Harga Rata-rata per Kategori
  const [linechartData, setLinechartData] = useState<
    { month: string; value: number }[]
  >([]);

  useEffect(() => {
    async function loadData() {
      const res = await fetch("https://dummyjson.com/products");
      const data = await res.json();

      const grouped: Record<string, { total: number; count: number }> = {};

      data.products.forEach((product: any) => {
        const cat = product.category;
        if (!grouped[cat]) {
          grouped[cat] = { total: 0, count: 0 };
        }

        grouped[cat].total += product.price;
        grouped[cat].count += 1;
      });

      const result = Object.entries(grouped).map(
        ([category, { total, count }]) => ({
          month: category,
          value: parseFloat((total / count).toFixed(2)),
        })
      );

      setLinechartData(result);
    }

    loadData();
  }, []);

  //API to Bar CHART
  const [chartData, setChartData] = useState<
    { label: string; value: number }[]
  >([]);
  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((json) => {
        const products = json.products;

        const grouped: Record<string, { total: number; count: number }> = {};

        products.forEach((product: any) => {
          const { category, rating } = product;
          if (!grouped[category]) {
            grouped[category] = { total: 0, count: 0 };
          }
          grouped[category].total += rating;
          grouped[category].count += 1;
        });

        const averaged = Object.entries(grouped).map(([category, data]) => ({
          label: category,
          value: parseFloat((data.total / data.count).toFixed(2)), // rata-rata
        }));

        setChartData(averaged);
      });
  }, []);

  //ambil data dari API untuk Tabel
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((json) => {
        const mapped = json.products.map((product: any, index: number) => ({
          No: index + 1,
          Product: product.title,
          Category: product.category,
          Stock: product.stock,
        }));
        setData(mapped);
      });
  }, []);

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
              title="Average Price Category"
              data={linechartData}
              dataKeyX="month"
              dataKeyY="value"
              unit="USD"
            />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md w-full">
            <BarChartCard title="Rating Category" data={chartData} unit="⭐" />
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
          <TableWithPagination
            title="Product List"
            columns={columns}
            data={data}
          />
        </div>
      </section>
      <section>
        <div className="p-6 flex flex-col gap-8">
          <TableWithPagination
            title="Employee"
            columns={columns2}
            data={data2}
          />
        </div>
      </section>
    </LayoutShell>
  );
}
