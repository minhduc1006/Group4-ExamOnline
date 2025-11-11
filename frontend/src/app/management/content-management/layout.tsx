import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Management",
};

const Layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    return (
      <>
        {children}
      </>
    );
  };
  
  export default Layout;