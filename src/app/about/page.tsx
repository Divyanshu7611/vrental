import React from "react";
import Image from "next/image";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";

export default function AboutUs() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 via-white to-blue-50">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <header className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-white to-blue-50 px-6 py-10 shadow-sm sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700/80">
            About Vrental
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-5xl">
            Helping you find a home{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              faster
            </span>
            .
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
            VRental is your destination for verified rooms, hostels, PG, co-living,
            apartments, and flats — built to make searching simpler, transparent, and
            reliable.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            Launch date: <span className="text-gray-900">August 1, 2024</span>
          </div>
        </header>

        <section className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-3">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Founder & CEO
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
              Welcome to VRental, your premier destination for finding and renting rooms,
              hostels, paying guest (PG) accommodations, co-living apartments, and flats.
              Created by <span className="font-semibold text-gray-800">Kushal Gaur</span>,
              VRental is designed to simplify and enhance the rental experience for users
              and owners alike.
            </p>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 to-cyan-600 p-6 text-white shadow-sm sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/80">
              What we focus on
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-white/90" />
                Verified listings and clear details
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-white/90" />
                Simple discovery across categories
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-white/90" />
                Smooth experience for renters and owners
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-10 lg:mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-500">
                Team
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                Meet the people behind VRental
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <article className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8">
              <div className="flex items-start gap-4">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl ring-1 ring-gray-200 bg-gray-50">
                  <Image
                    src="/assets/kushal.jpeg"
                    alt="Kushal Gaur"
                    fill
                    className="object-cover object-[center_8%]"
                    sizes="80px"
                    priority
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold text-gray-900">
                    Kushal Gaur
                  </h3>
                  <p className="mt-1 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                    CEO & Founder
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                Kushal is a passionate innovator who recognized the challenges in finding
                quality rental accommodations. He focuses on creating a product that is
                simple, trustworthy, and genuinely useful for everyday renters.
              </p>
            </article>

            <article className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8">
              <div className="flex items-start gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-1 ring-gray-200 bg-gray-50">
                  <Image
                    src="/assets/divyanshu.jpeg"
                    alt="Divyanshu Sharma"
                    fill
                    className="object-cover object-[center_20%]"
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold text-gray-900">
                    Divyanshu Sharma
                  </h3>
                  <p className="mt-1 inline-flex items-center rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-100">
                    Technical Lead · Full-Stack Engineer
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                Divyanshu builds and maintains VRental’s core experience end-to-end — from
                UI performance to reliable backend flows — so the platform stays fast,
                stable, and easy to use.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Our mission
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
              At VRental, our mission is to provide a comprehensive and hassle-free platform
              for finding and renting various types of living accommodations — with verified
              data, clear amenities, and a smooth browsing journey.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              What we offer
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-600 sm:text-base">
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                <span>
                  <span className="font-semibold text-gray-800">Room rentals</span> with detailed info and photos
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                <span>
                  <span className="font-semibold text-gray-800">Hostels</span> that match your budget and needs
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                <span>
                  <span className="font-semibold text-gray-800">PG options</span> for convenience and affordability
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                <span>
                  <span className="font-semibold text-gray-800">Co-living</span> for a community-centric lifestyle
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                <span>
                  <span className="font-semibold text-gray-800">Flats & apartments</span> with amenities and pricing
                </span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:mt-12 sm:p-10">
          <h2 className="text-xl font-black tracking-tight text-gray-900 sm:text-3xl">
            Get in touch
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
            We’re here to help you find your next home. If you have questions or need
            assistance, please reach out via the website’s contact options.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
