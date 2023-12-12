import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <nav className="px-8 py-4 shadow w-full flex justify-center h-18 fixed z-40 bg-background">
        <NavBar />
      </nav>
      <main className="relative top-12 flex">
        {/* <aside className="fixed top-0 z-10 hidden h-full lg:block">
          <Sidebar />
        </aside> */}
        <section className="px-6 lg:px-28 flex w-full flex-col items-center p-8">
          <div className="w-full max-w-screen-2xl">
          {children}
          </div>
      
        </section>
      </main>
    </>
  );
};

export default layout;
