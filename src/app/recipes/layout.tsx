import NavBar from "./NavBar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavBar />
      <main className="p-4 max-w-7xl m-auto">{children}</main>
    </>
  );
};

export default layout;
