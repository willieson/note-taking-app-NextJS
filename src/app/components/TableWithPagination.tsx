"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface TableProps {
  columns: string[];
  data: any[];
  rowsPerPageOptions?: number[];
  title?: string;
}

type SortConfig = {
  key: string;
  direction: "asc" | "desc";
} | null;

export default function TableWithPagination({
  columns,
  data,
  rowsPerPageOptions = [5, 10, 20, 30, 40, 50],
  title,
}: TableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const isSortable = (key: string) => key.toLowerCase() !== "no";

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const { key, direction } = sortConfig;

    return [...filteredData].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      return direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  const requestSort = (key: string) => {
    if (!isSortable(key)) return;

    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow w-full overflow-auto">
      {/* Search */}

      {/* Title & Search */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        {title && (
          <h2 className="text-lg font-semibold text-[#02437B]">{title}</h2>
        )}

        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 px-3 py-2 rounded-lg w-full md:w-64 text-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table */}
      <table className="w-full table-auto text-left border border-gray-200">
        <thead>
          <tr className="bg-nav text-white">
            {columns.map((col) => (
              <th
                key={col}
                onClick={() => requestSort(col)}
                className={`px-4 py-3 font-semibold border-b border-gray-300 ${
                  isSortable(col) ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div className="flex items-center gap-1">
                  {col}
                  {isSortable(col) && sortConfig?.key === col && (
                    <>
                      {sortConfig.direction === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-blue-100 transition-all border-b border-gray-100"
            >
              {columns.map((col) => (
                <td key={col} className="px-4 py-2 text-sm text-gray-700">
                  {col.toLowerCase() === "no"
                    ? startIndex + rowIndex + 1
                    : row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
        <div className="text-sm">
          Show{" "}
          <select
            className="border px-2 py-1 rounded"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>{" "}
          entries
        </div>

        <div className="flex gap-2 items-center text-sm">
          <button
            className="px-3 py-1 rounded  text-white disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded text-white disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
