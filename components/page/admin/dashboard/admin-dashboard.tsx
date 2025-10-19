"use client";

import useCategory from "@/hooks/useCateogry";
import useProduct from "@/hooks/useProduct";
import useSeller from "@/hooks/useSeller";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Skeleton,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { FiAlertCircle, FiBox, FiClock, FiEye } from "react-icons/fi";
import { MdAttachMoney, MdCategory, MdStore } from "react-icons/md";
import ModalSeller from "./seller/modal-seller";
import useWallet from "@/hooks/useWallet";
import { rupiahFormat } from "@/utils/rupiahFormat";
import useWalletTransaction from "@/hooks/useWalletTransaction";
import { IWalletTransaction } from "@/types/wallet-transaction";
import ModalDetail from "./wallet-transaction/modal-detail";
import { TSeller } from "@/types/seller";
import useChangeUrl from "@/hooks/useChangeUrl";
import { useEffect } from "react";

const AdminDashboard = () => {
  const { dataCategories } = useCategory();
  const { dataProducts } = useProduct();
  const { dataAllSeller, setSellerId, dataSellerById, isLoadingAllSeller } =
    useSeller();
  const { dataBalance } = useWallet();
  const {
    dataAllWalletTransactions,
    isLoadingDataAllWalletTransaction,
    setSelectedId,
    dataWalletTransactionById,
  } = useWalletTransaction();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isOpenDetail,
    onOpen: onOpenDetail,
    onClose: onCloseDetail,
  } = useDisclosure();

  const handleOnClose = () => {
    onClose();
    setSellerId(null);
  };

  const { setUrl } = useChangeUrl();

  useEffect(() => {
    setUrl();
  }, []);

  return (
    <div className="space-y-4 p-4">
      <ModalDetail
        isOpen={isOpenDetail}
        onClose={onCloseDetail}
        walletTransaction={dataWalletTransactionById?.data}
      />

      <ModalSeller
        isOpen={isOpen}
        onClose={handleOnClose}
        seller={dataSellerById?.data}
      />

      {/* Header */}
      <div className="flex flex-col mb-8">
        <h2 className="text-xl font-bold">Dashboard Overview</h2>
        <p className="text-xs text-gray-500">
          Ringkasan performa toko Anda hari ini
        </p>
      </div>

      {/* Revenue */}
      <div>
        <Card className="w-full lg:w-fit">
          <CardHeader className="flex items-center justify-center lg:justify-start">
            Total Pendapatan
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-center lg:justify-between flex-col-reverse lg:flex-row gap-2 lg:gap-4">
              <Skeleton
                isLoaded={!!dataBalance?.data?.balance}
                className="rounded-md"
              >
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200 mt-1 text-center lg:text-start">
                  {rupiahFormat(dataBalance?.data?.balance)}
                </p>
              </Skeleton>
              <div
                className={`w-12 h-12 bg-success rounded-lg flex items-center justify-center`}
              >
                <MdAttachMoney className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Categories */}
        <Card className="w-full">
          <CardHeader className="flex items-center justify-center lg:justify-start">
            Total Kategori
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-center lg:justify-between flex-col-reverse lg:flex-row gap-2 lg:gap-4">
              <Skeleton
                isLoaded={!!dataCategories?.total}
                className="rounded-md w-24 h-9"
              >
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200 mt-1 text-center lg:text-start">
                  {dataCategories?.total}
                </p>
              </Skeleton>
              <div
                className={`w-12 h-12 bg-warning rounded-lg flex items-center justify-center`}
              >
                <MdCategory className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Products */}
        <Card className="w-full">
          <CardHeader className="flex items-center justify-center lg:justify-start">
            Total Produk
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-center lg:justify-between flex-col-reverse lg:flex-row gap-2 lg:gap-4">
              <Skeleton
                isLoaded={!!dataProducts?.data?.total}
                className="rounded-md w-24 h-9"
              >
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200 mt-1 text-center lg:text-start">
                  {dataProducts?.data?.total}
                </p>
              </Skeleton>
              <div
                className={`w-12 h-12 bg-primary rounded-lg flex items-center justify-center`}
              >
                <FiBox className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Sellers */}
        <Card className="w-full">
          <CardHeader className="flex items-center justify-center lg:justify-start">
            Total Penjual
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-center lg:justify-between flex-col-reverse lg:flex-row gap-2 lg:gap-4">
              <Skeleton
                isLoaded={!!dataAllSeller?.data?.sellers?.length}
                className="rounded-md w-24 h-9"
              >
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200 mt-1 text-center lg:text-start">
                  {dataAllSeller?.data?.sellers?.length}
                </p>
              </Skeleton>
              <div
                className={`w-12 h-12 bg-secondary rounded-lg flex items-center justify-center`}
              >
                <MdStore className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Allert */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Seller */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
              Penjual yang belum verifikasi
            </h3>
            <FiAlertCircle className="w-5 h-5 text-orange-500" />
          </CardHeader>
          <CardBody className="relative min-h-[calc(100vh-500px)]">
            {isLoadingAllSeller ? (
              <div className="flex items-center justify-center absolute inset-0 z-50 bg-black/10 backdrop-blur-sm">
                <Spinner color="success" />
              </div>
            ) : null}
            {dataAllSeller?.data?.sellers
              ?.filter((seller: any) => seller?.verified !== true)
              .map((seller: TSeller) => (
                <div className="space-y-3" key={seller?.id}>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3 dark:text-gray-200">
                      <img
                        src={`https://ui-avatars.com/api/?name=${seller?.storeName}&background=random`}
                        alt={seller?.storeName}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-200">
                          {seller?.storeName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-200">
                          {seller?.user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Tooltip color="primary" content="Detail Penjual">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="primary"
                          className="cursor-pointer active:opacity-50"
                          onPress={() => {
                            setSellerId(seller?.id as string);
                            onOpen();
                          }}
                        >
                          <FiEye />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))}

            {dataAllSeller?.data?.sellers?.filter(
              (seller: any) => seller?.verified !== true
            ).length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Semua penjual sudah terverifikasi
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Wallet Transaction */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
              Transaksi Wallet
            </h3>
            <Chip
              color="warning"
              size="sm"
              variant="bordered"
              startContent={<FiClock />}
            >
              pending
            </Chip>
          </CardHeader>
          <CardBody className="relative min-h-[calc(100vh-500px)]">
            {isLoadingDataAllWalletTransaction ? (
              <div className="flex items-center justify-center absolute inset-0 z-50 bg-black/10 backdrop-blur-sm">
                <Spinner color="success" />
              </div>
            ) : null}
            {dataAllWalletTransactions?.data?.walletTransaction
              ?.filter(
                (transaction: IWalletTransaction) =>
                  transaction?.status === "pending"
              )
              .map((transaction: IWalletTransaction) => (
                <div
                  key={transaction?.id}
                  className="flex items-center justify-between mb-3 bg-warning-200/20 p-2 rounded-sm"
                >
                  <div>
                    <p className="uppercase dark:text-gray-200">
                      {transaction?.wallet?.seller?.bankName}
                    </p>
                    <p className="uppercase dark:text-gray-200">
                      {transaction?.wallet?.seller?.accountName}
                    </p>
                    <p>{transaction?.wallet?.seller?.accountNumber}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="font-semibold">
                      {rupiahFormat(transaction?.amount)}
                    </p>
                    <Tooltip color="primary" content="Ubah produk">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        className="cursor-pointer active:opacity-50"
                        onPress={() => {
                          onOpenDetail();
                          setSelectedId(transaction?.id as string);
                        }}
                      >
                        <FiEye />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              ))}

            {dataAllWalletTransactions?.data?.walletTransaction?.filter(
              (transaction: IWalletTransaction) =>
                transaction?.status === "pending"
            ).length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Semua transaksi wallet sudah selesai
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
