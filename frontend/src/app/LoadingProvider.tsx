"use client";

import Lottie from "lottie-react";
import loadingLottie from "@/assets/loading.json";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const LoadingContext = createContext<{ loading: boolean }>({ loading: false });

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => setLoading(false), 1000); // Delay 1s để tránh nhấp nháy

    return () => clearTimeout(timeoutId);
  }, [pathname]); // Mỗi khi pathname thay đổi => Hiển thị loading

  return (
    <LoadingContext.Provider value={{ loading }}>
      {children}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/100 backdrop-blur-md z-50">
          <Lottie animationData={loadingLottie} loop={true} />
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
