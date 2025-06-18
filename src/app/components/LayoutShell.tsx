import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import BottomNav from "./BottomNav";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="md:ml-64 flex flex-col w-full min-h-screen">
        <Topbar />
        <main className="flex-1 p-6 bg-box">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
