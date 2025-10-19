import PageHeader from "@/components/page/profile/page-header";
import React from "react";

const CheckoutLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient">
      <PageHeader title="Checkout" description="Checkout Pesanan" />

      <div className="container mx-auto px-4 py-8 max-w-5xl">{children}</div>
    </div>
  );
};

export default CheckoutLayout;
