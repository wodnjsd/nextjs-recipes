import NavBar from "./NavBar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavBar />
      <main className="w-screen p-4 max-w-screen-2xl flex justify-center">{children}</main>
    </>
  );
};

export default layout;
