"use client";

import React, { useContext, useMemo } from "react";
import Link from "next/link";
import { UserContext } from "@/context/UserContext";
import FlatCard from "@/components/mini/FlatCard";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import { Heart, Home, Search } from "lucide-react";

const WishlistPage: React.FC = () => {
  const userContext = useContext(UserContext);

  const wishlistItems = useMemo(() => {
    if (!userContext?.wishlist) return [];
    return Object.values(userContext.wishlist).filter((item) => item && item.id);
  }, [userContext?.wishlist]);

  if (!userContext || !userContext.userAuthData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 pt-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
            <Heart className="h-8 w-8" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Sign in to see saved listings</h1>
          <p className="mt-2 text-slate-600">
            Save properties you like and find them here anytime.
          </p>
          <Link
            href="/auth"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
          >
            Log in
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-cyan-50/30">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24 lg:pt-12">
        <header className="mb-10 text-center sm:text-left">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-800">
            <Heart className="h-3.5 w-3.5 fill-rose-600 text-rose-600" />
            Saved for later
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Your saved listings
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Rentals you&apos;ve saved—no cart, no checkout. Tap a card to view details or remove
            from your list anytime.
          </p>
          {wishlistItems.length > 0 && (
            <p className="mt-3 text-sm font-medium text-slate-500">
              {wishlistItems.length} {wishlistItems.length === 1 ? "property" : "properties"} saved
            </p>
          )}
        </header>

        {wishlistItems.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-sm ring-1 ring-slate-100">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Heart className="h-8 w-8" strokeWidth={1.75} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Nothing saved yet</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Browse homes and tap the heart on a listing to save it here for easy access.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
              >
                <Search className="h-4 w-4" />
                Browse listings
              </Link>
              <Link
                href="/category?category=FLAT"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                <Home className="h-4 w-4" />
                View flats
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 sm:gap-8">
            {wishlistItems.map((apartment) => (
              <FlatCard
                key={apartment.id}
                id={apartment.id}
                title={apartment.title}
                description={apartment.description}
                location={apartment.location}
                price={apartment.price}
                image={apartment.image}
                flexProp={apartment.flexProp}
                category={apartment.category}
                averageRating={apartment.averageRating}
                contactNo={apartment.contactNo}
                furnitureDescription={apartment.furnitureDescription}
                parking={apartment.parking}
                electricity={apartment.electricity}
                facility={apartment.facility}
                availableFor={apartment.availableFor}
                furniture={apartment.furniture}
                client={apartment.client}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;
