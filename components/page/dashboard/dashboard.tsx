"use client";

import useChangeUrl from "@/hooks/useChangeUrl";
import useOrder from "@/hooks/useOrder";
import useProfile from "@/hooks/useProfile";
import useSeller from "@/hooks/useSeller";
import { TProductResponse } from "@/types/product";
import { rupiahFormat } from "@/utils/rupiahFormat";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Skeleton,
} from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  FiAlertCircle,
  FiBox,
  FiCheck,
  FiClock,
  FiCreditCard,
  FiShoppingCart,
  FiTruck,
  FiX,
} from "react-icons/fi";
import { MdAttachMoney } from "react-icons/md";

const Dashboard = () => {
  const { dataUser } = useProfile();
  const { dataSeller, isLoadingSeller } = useSeller();
  const { dataOrderSeller, isLoadingDataOrderSeller } = useOrder();
  const { setUrl } = useChangeUrl();

  const router = useRouter();
  const isSellerVerified =
    dataUser?.Seller[0]?.verified && dataUser?.Seller?.length;

  useEffect(() => {
    setUrl();
  }, []);

  return (
    <div className="p-4">
      {!isSellerVerified ? (
        <p className="text-xl font-semibold">
          👋 Welcome back, {dataUser?.name}
        </p>
      ) : (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-col mb-8">
            <h2 className="text-xl font-bold">Dashboard Overview</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Ringkasan performa toko Anda
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Wallet */}
            <Card>
              <CardHeader className="flex items-center justify-center lg:justify-start">
                <p>Saldo</p>
              </CardHeader>
              <CardBody>
                <div className="flex items-center justify-center lg:justify-between flex-col-reverse lg:flex-row gap-2 lg:gap-0">
                  <p className="text-2xl font-bold text-gray-900 mt-1 text-center lg:text-start dark:text-white">
                    {rupiahFormat(dataUser?.Seller[0]?.wallet?.balance)}
                  </p>
                  <div
                    className={`w-12 h-12 bg-success rounded-lg flex items-center justify-center`}
                  >
                    <MdAttachMoney className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Products */}
            <Card>
              <CardHeader className="flex items-center justify-center lg:justify-start">
                <p>Total Produk</p>
              </CardHeader>
              <CardBody>
                <div className="flex items-center justify-center lg:justify-between flex-col-reverse lg:flex-row gap-2 lg:gap-0">
                  <p className="text-2xl font-bold text-gray-900 mt-1 text-center lg:text-start dark:text-white">
                    {dataSeller?.seller?.products?.length}
                  </p>
                  <div
                    className={`w-12 h-12 bg-primary rounded-lg flex items-center justify-center`}
                  >
                    <FiBox className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Sellers */}
            <Card>
              <CardHeader className="flex items-center justify-center lg:justify-start">
                <p>Total Pesanan</p>
              </CardHeader>
              <CardBody>
                <div className="flex items-center justify-center lg:justify-between flex-col-reverse lg:flex-row gap-2 lg:gap-0">
                  <p className="text-2xl font-bold text-gray-900 mt-1 text-center lg:text-start dark:text-white">
                    {dataOrderSeller?.data?.orders?.length}
                  </p>
                  <div
                    className={`w-12 h-12 bg-success rounded-lg flex items-center justify-center`}
                  >
                    <FiShoppingCart className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Allert */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Order */}
            <Card>
              <CardHeader className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Pesanan Terbaru
                </h3>
                <Button
                  variant="light"
                  color="success"
                  onPress={() => router.push("/dashboard/order")}
                >
                  Lihat Semua
                </Button>
              </CardHeader>
              <CardBody>
                {isLoadingDataOrderSeller &&
                  Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      isLoaded={false}
                      className="mb-2 h-12 w-full rounded-md"
                    />
                  ))}
                {dataOrderSeller?.data?.orders
                  ?.filter((order: any) => order?.status !== "COMPLETED")
                  ?.map((order: any) => (
                    <div className="space-y-3" key={order?.id}>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3 dark:text-white">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {order?.user?.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              #{order?.orderId}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {rupiahFormat(order?.totalPrice)}
                          </p>
                          <Chip
                            startContent={
                              order?.status === "PENDING" ? (
                                <FiClock />
                              ) : order?.status === "PAID" ? (
                                <FiCreditCard />
                              ) : order?.status === "FAILED" ? (
                                <FiX />
                              ) : order?.status === "PROCESSING" ? (
                                <FiBox />
                              ) : order?.status === "DELIVERED" ? (
                                <FiTruck />
                              ) : order?.status === "COMPLETED" ? (
                                <FiCheck />
                              ) : null
                            }
                            variant="bordered"
                            size="sm"
                            color={
                              order?.status === "PENDING"
                                ? "warning"
                                : order?.status === "PAID"
                                  ? "success"
                                  : order?.status === "FAILED"
                                    ? "danger"
                                    : order?.status == "PROCESSING"
                                      ? "secondary"
                                      : order?.status == "DELIVERED"
                                        ? "primary"
                                        : order?.status === "COMPLETED"
                                          ? "default"
                                          : "danger"
                            }
                          >
                            {order?.status === "PENDING" && "Pending"}
                            {order?.status === "PAID" && "Dibayar"}
                            {order?.status === "FAILED" && "Gagal"}
                            {order?.status === "PROCESSING" && "Diproses"}
                            {order?.status === "DELIVERED" && "Dikirim"}
                            {order?.status === "COMPLETED" && "Diterima"}
                          </Chip>
                        </div>
                      </div>
                    </div>
                  ))}

                {dataOrderSeller?.data.orders?.filter(
                  (order: any) => order?.status !== "COMPLETED"
                )?.length === 0 && (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Tidak ada pesanan
                  </p>
                )}
              </CardBody>
            </Card>

            {/* Stock */}
            <Card>
              <CardHeader className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Peringatan Stok
                </h3>
                <FiAlertCircle className="w-5 h-5 text-orange-500" />
              </CardHeader>
              <CardBody>
                {isLoadingSeller &&
                  Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      isLoaded={false}
                      className="mb-2 h-12 w-full rounded-md"
                    />
                  ))}
                {dataSeller?.seller?.products
                  ?.filter((product: TProductResponse) => product?.stock < 20)
                  ?.map((product: TProductResponse) => (
                    <div className="space-y-3" key={product?.id}>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3 dark:text-white">
                          <Image
                            src={product?.imageUrl as string}
                            alt="product"
                            width={50}
                            height={50}
                            className="object-contain aspect-square rounded-md"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white w-56 truncate">
                              {product?.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 w-56 truncate">
                              {product?.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-danger font-medium dark:text-red-500">
                            {product?.stock} {product?.Unit?.symbol}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                {dataSeller?.seller?.products?.filter(
                  (product: TProductResponse) => product?.stock < 20
                ).length === 0 && (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Semua produk memiliki stok yang cukup
                  </p>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
