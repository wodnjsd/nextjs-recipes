import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <nav className="h-18 fixed z-40 bg-background">
        <NavBar />
      </nav>
      {/* <main className="flex justify-center w-screen max-w-screen-2xl pt-8 px-4">
        {children}
      </main> */}
      <main className="relative top-20 flex">
        <aside className="fixed top-0 z-10 hidden h-full lg:block">
          <Sidebar />
        </aside>
        <section className="flex w-full max-w-screen-2xl flex-col items-center p-8">
          {children}
        </section>
      </main>
    </>
  );
};

export default layout;
