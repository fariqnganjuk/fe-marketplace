export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center bg-gradient min-h-screen p-2">
      {children}
    </div>
  );
}
