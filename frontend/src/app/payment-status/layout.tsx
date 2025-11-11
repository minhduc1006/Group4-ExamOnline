export default function MainLayout({
    children,
  }: Readonly<{ children: React.ReactNode }>) {
    return (
      <div className="w-screen bg-[url('/login/bglogin2.jpg')] bg-cover bg-left bg-no-repeat justify-items-center">
        <div className="flex flex-col h-screen w-min-[350px] md:w-[700px] pt-40 md:px-28 md:mx-20">{children}</div>
      </div>
    );
  }