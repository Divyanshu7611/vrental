"use client";
import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TbLogout } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { MdOutlineAddHomeWork, MdOutlineLocalOffer } from "react-icons/md";
import { ChevronDown, Home, Building2, Users, Users2, Store, Info, Upload, Heart } from "lucide-react";
import Link from "next/link";
import NotificationDropdown from "./NotificationDropdown";
import NavbarLocationPicker from "./NavbarLocationPicker";

export default function Navbar() {
  const [isToken, setToken] = useState<boolean>(false);
  const [isSelectDrop, setDropDown] = useState<boolean>(false);
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isCategoriesOpen, setCategoriesOpen] = useState<boolean>(false);

  const router = useRouter();
  const userContext = useContext(UserContext);

  const categories = [
    { value: "ROOM", label: "Rooms", icon: <Home className="w-4 h-4 text-black" /> },
    { value: "HOSTEL", label: "Hostels", icon: <Building2 className="w-4 h-4 text-black" /> },
    { value: "PG", label: "PG", icon: <Users className="w-4 h-4 text-black" /> },
    { value: "FLAT", label: "Flats", icon: <Home className="w-4 h-4 text-black" /> },
    { value: "CO-LIVING", label: "Co-Living", icon: <Users2 className="w-4 h-4 text-black" /> },
    { value: "SHOP", label: "Shops", icon: <Store className="w-4 h-4 text-black" /> },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setToken(true);
  }, []);

  // ✅ scroll animation logic
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = () => setDropDown(!isSelectDrop);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // Close categories dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.categories-dropdown')) {
        setCategoriesOpen(false);
      }
    };

    if (isCategoriesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isCategoriesOpen]);

  useEffect(() => {
    if (!isSidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    if (!isSidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSidebarOpen]);

  return (
    <div>
      {/* ✅ PROMOTIONAL BANNER FOR OWNERS */}
      {isToken && userContext?.userAuthData?.role === "OWNER" && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 overflow-hidden shadow-lg border-b-2 border-yellow-400">
          <div className="relative py-2.5 px-4">
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
              <MdOutlineLocalOffer className="text-yellow-300 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-white font-medium">
                <span className="hidden sm:inline">Limited Time Launch Offer – </span>
                <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 text-blue-900 px-2 py-0.5 rounded-md font-bold text-sm sm:text-base mx-1 inline-block animate-pulse-subtle">
                  50% OFF
                </span>
                <span className="hidden sm:inline">for Early Property Owners</span>
                <span className="sm:hidden">Early Bird Offer!</span>
              </span>
              <MdOutlineLocalOffer className="text-yellow-300 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            </div>
          </div>
          {/* Decorative shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine pointer-events-none"></div>
        </div>
      )}

      {/* ✅ NAVBAR WRAPPER */}
      <div
        className={`fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-300 ease-in-out
        ${
          isScrolled
            ? `${isToken && userContext?.userAuthData?.role === "OWNER" ? "top-10" : "top-0"} w-full rounded-t-none rounded-b-3xl px-3 lg:px-10 py-3 bg-white/90 backdrop-blur-xl shadow-lg`
            : `${isToken && userContext?.userAuthData?.role === "OWNER" ? "top-14" : "top-4"} w-[95%] lg:w-[80%] rounded-full px-3 lg:px-8 bg-white/70 backdrop-blur-xl shadow-md`
        }`}
      >
        <div className="flex justify-between items-center gap-2">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="block" aria-label="Vrental home">
              <img
                src="/assets/logo.png"
                alt="Vrental"
                width={160}
                height={60}
                className="h-9 w-auto max-h-10 sm:h-10 object-contain cursor-pointer"
              />
            </Link>
          </div>

          {/* Mobile / tablet: location on the right + menu */}
          <div className="flex lg:hidden items-center justify-end gap-2 min-w-0 flex-1">
            <div className="hidden sm:block min-w-0 max-w-[min(42vw,11rem)] md:max-w-[13rem]">
              <NavbarLocationPicker variant="desktop" dropdownAlign="right" />
            </div>
            {isToken && <NotificationDropdown />}
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full text-2xl text-gray-800 transition hover:bg-gray-100 active:scale-95"
              onClick={toggleSidebar}
              aria-expanded={isSidebarOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            >
              {isSidebarOpen ? <RxCross2 /> : <GiHamburgerMenu />}
            </button>
          </div>

          {/* Desktop: centered nav */}
          <div className="hidden lg:flex flex-1 justify-center min-w-0 px-4">
            <ul className="flex items-center gap-5 xl:gap-6 justify-center flex-wrap">
              <li className="text-base font-semibold text-black cursor-pointer hover:scale-110 hover:font-bold transition-transform">
                <a href="/">Home</a>
              </li>
              
              {/* Categories Dropdown */}
              <li className="relative categories-dropdown">
                <button
                  onClick={() => setCategoriesOpen(!isCategoriesOpen)}
                  className="text-base font-semibold text-black cursor-pointer hover:scale-110 hover:font-bold transition-transform flex items-center gap-1"
                >
                  Categories
                  <ChevronDown className={`w-4 h-4 text-black transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                {isCategoriesOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {categories.map((cat) => (
                      <a
                        key={cat.value}
                        href={`/category?category=${cat.value}`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-100 transition-colors"
                        onClick={() => setCategoriesOpen(false)}
                      >
                        <span className="text-black">{cat.icon}</span>
                        {cat.label}
                      </a>
                    ))}
                  </div>
                )}
              </li>

              <li className="text-base font-semibold text-black cursor-pointer hover:scale-110 hover:font-bold transition-transform">
                <a href="/about">About</a>
              </li>

              <li className="text-base font-semibold text-black cursor-pointer hover:scale-110 hover:font-bold transition-transform">
                <a href="/footer/contact" className="whitespace-nowrap">
                  Contact
                </a>
              </li>

              {isToken && userContext?.userAuthData?.role === "OWNER" && (
                <li className="text-base font-semibold text-black cursor-pointer hover:scale-110 hover:font-bold transition-transform">
                  <a href="/list-apartment" className="flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-black" />
                    List Property
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Desktop right: area + account */}
          <div className="relative hidden lg:flex items-center gap-3 shrink-0">
            <div className="min-w-0 max-w-[13rem] xl:max-w-[15rem]">
              <NavbarLocationPicker variant="desktop" dropdownAlign="right" />
            </div>
            {isToken ? (
              <div className="relative flex items-center">
                <div className="flex items-center aspect-auto gap-3">
                  {/* Notification Dropdown */}
                  <NotificationDropdown />

                  <Link
                    href="/wishlist"
                    prefetch
                    className="flex h-10 w-10 items-center justify-center rounded-full text-black transition hover:scale-110 hover:bg-gray-100"
                    aria-label="Saved listings"
                    title="Saved listings"
                  >
                    <Heart className="h-6 w-6 text-black" strokeWidth={2.25} />
                  </Link>

                  <img
                    src={`https://api.dicebear.com/5.x/initials/svg?seed=${userContext?.userAuthData?.firstName} ${userContext?.userAuthData?.lastName}&backgroundColor=418FA9`}
                    alt="Profile"
                    width={38}
                    height={38}
                    className="rounded-full cursor-pointer"
                    onClick={toggleDropdown}
                  />
                </div>

                {isSelectDrop && (
                  <div className="absolute top-14 right-0 bg-white shadow-md rounded-xl w-52 py-2 z-10">
                    <ul>
                      <li
                        className="text-black flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => router.push("/profile")}
                      >
                        <CgProfile /> Profile
                      </li>

                      {userContext?.userAuthData?.role === "OWNER" && (
                        <li
                          className="text-black flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => router.push("/list-apartment")}
                        >
                          <MdOutlineAddHomeWork /> List Property
                        </li>
                      )}

                      <li className="text-black flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <a href="/wishlist" className="flex items-center gap-2 w-full">
                          <Heart className="h-4 w-4 text-black shrink-0" strokeWidth={2.25} />
                          Saved listings
                        </a>
                      </li>

                      <li
                        className="text-black flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          localStorage.removeItem("token");
                          localStorage.removeItem("userAuthData");
                          toast.success("Logout Successfully");
                          window.location.reload();
                          router.push("/");
                        }}
                      >
                        <TbLogout /> Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-center items-center gap-3">
                <button
                  className="bg-[#156f6f] text-white px-4 py-2 rounded-xl font-medium hover:scale-105 transition"
                  onClick={() => router.push("/auth")}
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu: backdrop + drawer above navbar (z-50) and owner banner (z-60) */}
      <div className="lg:hidden" aria-hidden={!isSidebarOpen}>
        <button
          type="button"
          className={`fixed inset-0 z-[100] bg-slate-900/45 backdrop-blur-[3px] transition-opacity duration-300 ease-out motion-reduce:transition-none ${
            isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-label="Close menu"
          tabIndex={isSidebarOpen ? 0 : -1}
          onClick={() => setSidebarOpen(false)}
        />

        <aside
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
          className={`fixed top-0 right-0 z-[110] flex h-[100dvh] max-h-[100dvh] w-[min(20.5rem,92vw)] flex-col bg-white shadow-[0_0_40px_-10px_rgba(15,23,42,0.35)] transition-[transform,visibility] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none rounded-l-3xl border-l border-gray-100 overflow-hidden ${
            isSidebarOpen
              ? "translate-x-0 visible"
              : "pointer-events-none translate-x-full invisible"
          }`}
        >
          <div className="shrink-0 bg-gradient-to-br from-blue-600 via-blue-600 to-cyan-600 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4 text-white shadow-md">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Menu</p>
                <p className="truncate text-lg font-bold tracking-tight">Vrental</p>
              </div>
              <button
                type="button"
                onClick={toggleSidebar}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 transition hover:bg-white/25 active:scale-95"
                aria-label="Close menu"
              >
                <RxCross2 className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="mb-5 rounded-2xl border border-gray-100 bg-gray-50/80 p-3">
              <p className="mb-2 text-xs font-semibold text-gray-500">Your area</p>
              <NavbarLocationPicker variant="sidebar" />
            </div>

            <nav className="flex flex-col gap-1">
              <a
                href="/"
                onClick={toggleSidebar}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-semibold text-gray-900 transition hover:bg-gray-100"
              >
                <Home className="h-5 w-5 shrink-0 text-black" strokeWidth={2.25} />
                Home
              </a>

              <div className="my-2 border-t border-gray-100" />

              <p className="px-3 pb-1 text-xs font-bold uppercase tracking-wide text-gray-400">Categories</p>
              <ul className="space-y-0.5">
                {categories.map((cat) => (
                  <li key={cat.value}>
                    <a
                      href={`/category?category=${cat.value}`}
                      onClick={toggleSidebar}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-gray-100"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-black">
                        {cat.icon}
                      </span>
                      {cat.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="my-2 border-t border-gray-100" />

              <a
                href="/about"
                onClick={toggleSidebar}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-semibold text-gray-900 transition hover:bg-gray-100"
              >
                <Info className="h-5 w-5 shrink-0 text-black" strokeWidth={2.25} />
                About
              </a>

              <a
                href="/footer/contact"
                onClick={toggleSidebar}
                className="block rounded-xl px-3 py-3 text-[15px] font-semibold text-gray-900 transition hover:bg-gray-100"
              >
                Contact
              </a>

              {isToken ? (
                <>
                  <div className="my-2 border-t border-gray-100" />
                  <a
                    href="/profile"
                    onClick={toggleSidebar}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-semibold text-gray-900 transition hover:bg-gray-100"
                  >
                    <CgProfile className="h-5 w-5 shrink-0 text-black" />
                    Profile
                  </a>

                  {userContext?.userAuthData?.role === "OWNER" && (
                    <a
                      href="/list-apartment"
                      onClick={toggleSidebar}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-semibold text-gray-900 transition hover:bg-gray-100"
                    >
                      <Upload className="h-5 w-5 shrink-0 text-black" strokeWidth={2.25} />
                      List Property
                    </a>
                  )}

                  <a
                    href="/wishlist"
                    onClick={toggleSidebar}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-semibold text-gray-900 transition hover:bg-gray-100"
                  >
                    <Heart className="h-5 w-5 shrink-0 text-black" strokeWidth={2.25} />
                    Saved listings
                  </a>

                  <button
                    type="button"
                    className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[15px] font-semibold text-gray-900 transition hover:bg-gray-100"
                    onClick={() => {
                      toast.success("Logout Successfully");
                      localStorage.removeItem("token");
                      localStorage.removeItem("userAuthData");
                      setSidebarOpen(false);
                      window.location.reload();
                      router.push("/");
                    }}
                  >
                    <TbLogout className="h-5 w-5 shrink-0 text-black" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="my-2 border-t border-gray-100" />
                  <a
                    href="/auth"
                    onClick={toggleSidebar}
                    className="mt-1 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3.5 text-center text-[15px] font-bold text-white shadow-md shadow-blue-500/25 transition hover:shadow-lg active:scale-[0.98]"
                  >
                    Login
                  </a>
                </>
              )}
            </nav>
          </div>
        </aside>
      </div>

      {/* ✅ Important: give space so content doesn't hide behind fixed navbar */}
      <div className={`${isToken && userContext?.userAuthData?.role === "OWNER" ? (isScrolled ? "h-28" : "h-32") : (isScrolled ? "h-20" : "h-24")}`} />
    </div>
  );
}
