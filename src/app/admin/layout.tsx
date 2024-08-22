import AdminHeader from './components/Header';

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AdminHeader />
      {children}
    </>
  );
}