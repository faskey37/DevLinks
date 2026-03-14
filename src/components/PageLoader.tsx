"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader } from "@/components/loader";

export function PageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;
  return <Loader text="Loading..." />;
}