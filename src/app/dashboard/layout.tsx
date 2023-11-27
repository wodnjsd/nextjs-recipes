import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <nav className="fixed z-40 bg-background h-18">
        <NavBar />
      </nav>
      <main className="flex relative top-20">
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
