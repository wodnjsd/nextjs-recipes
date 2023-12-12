import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";

const layout = ({ children }: { children: React.ReactNode }) => {



  return (
    <>
      <nav className="h-18 w-full fixed z-20 flex  justify-center items-center bg-background px-8 shadow border-b">
        <NavBar />
      </nav>
      <main className="relative top-20 flex">
        {/* <aside className="fixed top-0 z-10 hidden h-full lg:block">
          <Sidebar />
        </aside> */}
        <section className="flex h-full w-full z-10 flex-col items-center p-8 px-6 lg:px-28 ">
          <div className="w-full flex justify-center max-w-screen-2xl">{children}</div>
        </section>
      </main>
    </>
  );
};

export default layout;
