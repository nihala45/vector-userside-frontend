import Header from "./header";
import Footer from "./Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <Header />
      {children}
      <Footer />
    </>
  );
}
