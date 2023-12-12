import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <nav className="h-18 fixed z-20 flex w-full items-center justify-center border-b bg-background px-8 shadow">
        <NavBar />
      </nav>
      <main className="relative top-20 flex ">
        {/* <aside className="fixed top-0 z-10 hidden h-full lg:block">
          <Sidebar />
        </aside> */}
        <section className="z-10 flex h-full w-full flex-col items-center p-8 ml-4 lg:ml-12 lg:px-28 ">
          <div className="flex w-full max-w-screen-2xl justify-center">
            {children}
          </div>
        </section>
      </main>
    </>
  );
};

export default layout;
