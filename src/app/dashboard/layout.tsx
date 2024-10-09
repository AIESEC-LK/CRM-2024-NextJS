import SideNav from "@/app/components/ui/sidenav";
import Header from "../components/ui/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-grow md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-36">
          <SideNav />
        </div>

        <div className="flex-grow p-0 md:overflow-y-auto md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
