import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ranking",
};

const RankingLayout = ({
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
  
  export default RankingLayout;
  