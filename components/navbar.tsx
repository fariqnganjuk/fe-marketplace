"use client";

import { useState } from "react";
import NextLink from "next/link";
import { ThemeSwitch } from "@/components/theme-switch";
import Image from "next/image";
import { MdOutlineReceipt, MdOutlineShoppingCart } from "react-icons/md";
import { siteConfig } from "@/config/site";
import { clsx } from "clsx";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
  Button,
  useDisclosure,
  Badge,
  Avatar,
  Divider,
  DropdownSection,
} from "@heroui/react";
import { link as linkStyles } from "@heroui/theme";
import Cart from "./cart";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { FiLogIn, FiLogOut, FiUser } from "react-icons/fi";
import useCart from "@/hooks/useCart";
import useProfile from "@/hooks/useProfile";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { dataCarts } = useCart();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { dataUser } = useProfile();

  return (
    <HeroUINavbar
      maxWidth="xl"
      isBlurred
      position="sticky"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-2" href="/">
            <Image
              src="/images/logo-sayur.png"
              alt="logo"
              width={40}
              height={40}
              className="w-auto h-auto"
            />
            <div>
              <p className="font-bold text-inherit">SayurSegar</p>
              <p className="text-xs text-default-500">Langsung dari petani</p>
            </div>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems
            .filter((item) => {
              if (item.href === "/admin/dashboard") {
                return (
                  status === "authenticated" &&
                  session?.user?.role === "superadmin"
                );
              }

              if (item.href === "/dashboard") {
                return (
                  status === "authenticated" &&
                  session?.user?.role !== "superadmin"
                );
              }

              return true;
            })
            .map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    pathname === item.href && "text-success font-medium"
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
        </ul>
      </NavbarContent>

      <NavbarContent className="hidden lg:flex" justify="end">
        <NavbarItem className="hidden lg:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>

        {status === "authenticated" ? (
          <Dropdown radius="md">
            <Badge
              isInvisible={dataCarts?.data?._count.items <= 0}
              content={dataCarts?.data?._count.items}
              className="bg-success text-white"
            >
              <DropdownTrigger>
                <Button
                  isIconOnly
                  variant="light"
                  className="flex items-center p-2 justify-center cursor-pointer text-slate-600 dark:text-slate-200"
                >
                  <MdOutlineShoppingCart size={22} />
                </Button>
              </DropdownTrigger>
            </Badge>
            <DropdownMenu>
              <DropdownSection
                aria-label="Cart"
                className="h-80 overflow-y-auto"
              >
                <DropdownItem
                  key="cart"
                  isReadOnly
                  className="[&[data-hover=true]]:bg-transparent [&[data-focus=true]]:bg-transparent"
                >
                  <Cart items={dataCarts?.data?.items} />
                </DropdownItem>
              </DropdownSection>
              <DropdownSection>
                <DropdownItem
                  key="Next-button"
                  className="[&[data-hover=true]]:bg-transparent [&[data-focus=true]]:bg-transparent"
                >
                  {dataCarts?.data?.items?.length ? (
                    <div>
                      <Button
                        color="success"
                        className="w-full text-white"
                        size="sm"
                        onPress={() => {
                          router.push(`/checkout/${dataUser?.id}`);
                        }}
                      >
                        Lanjut ke Pembayaran
                      </Button>
                    </div>
                  ) : null}
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        ) : null}

        <NavbarItem className="hidden lg:flex">
          {status === "authenticated" ? (
            <Dropdown placement="bottom-start" radius="sm">
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                    src: dataUser?.photo
                      ? dataUser?.photo
                      : `https://ui-avatars.com/api/?name=${session?.user.name}&background=random`,
                  }}
                  className="transition-transform"
                  description={`@${session?.user.username}`}
                  name={session?.user.name}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  textValue="Profil"
                  onPress={() => router.push("/profile")}
                >
                  <span className="flex items-center gap-2 w-full">
                    <FiUser />
                    Profil
                  </span>
                </DropdownItem>
                {session?.user?.role !== "superadmin" ? (
                  <DropdownItem
                    showDivider
                    key="my-order"
                    textValue="Pesanan Saya"
                    onPress={() => router.push("/dashboard/my-order")}
                  >
                    <span className="flex items-center gap-2 w-full">
                      <MdOutlineReceipt />
                      Pesanan Saya
                    </span>
                  </DropdownItem>
                ) : null}

                <DropdownItem
                  key="logout"
                  textValue="Keluar"
                  color="danger"
                  onClick={() => signOut()}
                >
                  <span className="flex items-center gap-2 w-full">
                    <FiLogOut />
                    Keluar
                  </span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              color="success"
              className="text-white"
              onPress={() => router.push("/auth/login")}
            >
              <FiLogIn />
              Masuk
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      {/* Mobile */}
      <NavbarContent className="lg:hidden flex pl-4" justify="end">
        {/* Theme Switch */}
        <NavbarMenuItem>
          <div className="items-center justify-center cursor-pointer text-slate-600 hidden lg:flex">
            <ThemeSwitch />
          </div>
        </NavbarMenuItem>
        <NavbarItem>
          {status === "authenticated" ? (
            <Dropdown radius="md">
              <Badge
                isInvisible={dataCarts?.data?._count.items <= 0}
                content={dataCarts?.data?._count.items}
                className="bg-success text-white"
              >
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    variant="light"
                    className="flex items-center p-2 justify-center cursor-pointer text-slate-600 dark:text-slate-200"
                  >
                    <MdOutlineShoppingCart size={22} />
                  </Button>
                </DropdownTrigger>
              </Badge>
              <DropdownMenu>
                <DropdownSection
                  aria-label="Cart"
                  className="h-80 overflow-y-auto"
                >
                  <DropdownItem
                    key="cart"
                    isReadOnly
                    className="[&[data-hover=true]]:bg-transparent [&[data-focus=true]]:bg-transparent"
                  >
                    <Cart items={dataCarts?.data?.items} />
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection>
                  <DropdownItem
                    key="Next-button"
                    className="[&[data-hover=true]]:bg-transparent [&[data-focus=true]]:bg-transparent"
                  >
                    {dataCarts?.data?.items?.length ? (
                      <div>
                        <Button
                          color="success"
                          className="w-full text-white"
                          size="sm"
                          onPress={() => {
                            router.push(`/checkout/${dataUser?.id}`);
                          }}
                        >
                          Lanjut ke Pembayaran
                        </Button>
                      </div>
                    ) : null}
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              size="sm"
              color="success"
              className="text-white"
              onPress={() => router.push("/auth/login")}
            >
              <FiLogIn />
              Masuk
            </Button>
          )}
        </NavbarItem>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="lg:hidden"
        />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="z-50">
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {/* Navigation items */}
          {siteConfig.navItems
            .filter((item) => {
              if (item.href === "/admin/dashboard") {
                return (
                  status === "authenticated" &&
                  session?.user?.role === "superadmin"
                );
              }

              if (item.href === "/dashboard") {
                return (
                  status === "authenticated" &&
                  session?.user?.role !== "superadmin"
                );
              }
              return true;
            })
            .map((item, index) => (
              <NavbarMenuItem key={`${item.href}-${index}`}>
                <NextLink
                  className={clsx(
                    "w-full",
                    linkStyles({ color: "foreground" }),
                    pathname === item.href && "text-success font-medium"
                  )}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NextLink>
              </NavbarMenuItem>
            ))}
          <NavbarMenuItem>
            <div className="flex items-center gap-2">
              <span className="mr-2 text-sm">Theme: </span>
              <ThemeSwitch />
            </div>
          </NavbarMenuItem>

          {/* Authentication */}
          <NavbarMenuItem>
            {status === "authenticated" ? (
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2 py-2">
                  <Avatar
                    size="sm"
                    src={
                      dataUser?.photo
                        ? dataUser?.photo
                        : `https://ui-avatars.com/api/?name=${session?.user.name}&background=random`
                    }
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {session?.user.name}
                    </span>
                    <span className="text-xs text-default-500">
                      @{session?.user.username}
                    </span>
                  </div>
                </div>

                <Button
                  variant="light"
                  className="justify-start"
                  onPress={() => {
                    router.push("/profile");
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="flex items-center gap-2">
                    <FiUser />
                    Profil
                  </span>
                </Button>
                {session?.user?.role !== "superadmin" ? (
                  <Button
                    variant="light"
                    className="justify-start"
                    onPress={() => {
                      router.push("/dashboard/my-order");
                      setIsMenuOpen(false);
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <MdOutlineReceipt />
                      Pesanan Saya
                    </span>
                  </Button>
                ) : null}
                <Divider />
                <Button
                  variant="light"
                  color="danger"
                  className="justify-start"
                  onPress={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="flex items-center gap-2">
                    <FiLogOut />
                    Keluar
                  </span>
                </Button>
              </div>
            ) : null}
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
