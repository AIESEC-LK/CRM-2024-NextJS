import SideNav from "@/app/components/ui/sidenav";
import Header from "../components/ui/header";
import { ConfirmationProvider } from "@/app/context/ConfirmationContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ConfirmationProvider>
      <div className="flex h-screen flex-col">
        <Header />
        <div className="flex flex-grow md:flex-row md:overflow-hidden">
          <div className="w-full flex-none md:w-36">
            <SideNav />
          </div>
          <div className="flex-grow p-6 md:overflow-y-auto md:p-6">
            {children}
          </div>
        </div>
      </div>
    </ConfirmationProvider>
  );
}
