import LayoutWrapper from "../components/common/layout/layout-wrapper";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}