"use client";

import ModalConfirmBeseller from "@/components/modal-confirm-beseller";
import useProfile from "@/hooks/useProfile";
import { Button } from "@heroui/button";
import { Alert, Card, CardBody, Spinner, useDisclosure } from "@heroui/react";
import Link from "next/link";
import { FaStore } from "react-icons/fa";
import {
  FiCreditCard,
  FiEdit,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import { MdOutlineDescription, MdVerified } from "react-icons/md";

const StoreInfo = () => {
  const { dataUser, isLoadingUser } = useProfile();
  const { onOpenChange, isOpen } = useDisclosure();
  const isSellerVerified =
    dataUser?.Seller[0]?.verified && dataUser?.Seller?.length;

  if (isLoadingUser)
    return (
      <div className="flex items-center justify-center h-[250px]">
        <Spinner size="lg" color="success" />
      </div>
    );

  if (!dataUser?.Seller?.length)
    return (
      <div className="flexjustify-center h-[250px]">
        <ModalConfirmBeseller isOpen={isOpen} onOpenChange={onOpenChange} />
        <Alert
          title="Informasi"
          description="Kamu belum memiliki lapak atau belum terverifikasi, silahkan buat lapak terlebih dahulu dan tunggu verifikasi"
          color="warning"
          endContent={
            <Button
              color="success"
              variant="light"
              onPress={() => onOpenChange()}
            >
              Buat Lapak
            </Button>
          }
        />
      </div>
    );

  return (
    <div className="space-y-8">
      {isSellerVerified ? (
        <div className="flex justify-between flex-col md:flex-row items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Informasi Lapak</h1>
            <p className="text-sm text-foreground-500 dark:text-foreground-400">
              Kelola informasi dan pengaturan lapak Anda
            </p>
          </div>
          <div>
            <Button
              color="success"
              className="text-white"
              as={Link}
              href={`/dashboard/store-info/edit/${dataUser?.Seller[0]?.id}`}
            >
              <FiEdit />
              Edit Info
            </Button>
          </div>
        </div>
      ) : (
        <Alert
          title="Informasi"
          description="Lapak kamu belum terfertifikasi, silahkan tunggu!"
          color="warning"
        />
      )}
      <Card>
        <CardBody className="grid md:grid-cols-2 grid-cols-1 p-6 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Nama Lapak */}
            <div className="bg-success/10 p-4 rounded-md flex items-center gap-4">
              <div className="p-2 rounded-sm bg-success w-16 h-16 flex items-center justify-center text-white">
                <FaStore size={32} />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  <span className="flex items-center gap-1 dark:text-white">
                    {dataUser?.Seller[0]?.storeName}{" "}
                    {dataUser?.Seller[0]?.verified && (
                      <MdVerified className="text-primary" />
                    )}
                  </span>
                </h2>
                <p className="text-sm text-foreground-500">
                  Pemilik: {dataUser?.name}
                </p>
              </div>
            </div>

            {/* Info Lapak */}
            <div className="flex items-start space-x-3">
              <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Lokasi
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {dataUser?.Seller[0]?.storeLocation}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-2 bg-foreground-200/40 rounded-md">
              <FiPhone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Telepon
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {dataUser?.phone}
                </p>
              </div>
              <Button
                isIconOnly
                variant="bordered"
                color="primary"
                size="sm"
                as={Link}
                href="/profile"
                className="ml-auto"
              >
                <FiEdit />
              </Button>
            </div>

            <div className="flex items-start space-x-3 p-2 bg-foreground-200/40 rounded-md">
              <FiMail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {dataUser?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <FiCreditCard className="w-4 h-4 mr-2" />
                Informasi Pembayaran
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Bank:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {dataUser?.Seller[0]?.bankName.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    No. Rekening:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {dataUser?.Seller[0]?.accountNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Deskripsi Toko */}
            <div>
              <div className="flex gap-2">
                <MdOutlineDescription className="w-5 h-5 text-gray-400 mt-0.5 dark:text-gray-400" />
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Deskripsi Toko
                </h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {dataUser?.Seller[0]?.description}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default StoreInfo;
