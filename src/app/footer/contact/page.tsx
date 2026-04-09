"use client";

import React from "react";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import { Mail, Phone, Headphones, Briefcase, MessageSquare, MapPin } from "lucide-react";

const channels = [
  {
    title: "General inquiries",
    description: "Questions about VRENTAL, listings, or how the platform works.",
    email: "info@vrental.in",
    phone: "+91 9509206802",
    icon: Mail,
    accent: "from-blue-500 to-cyan-500",
    ring: "ring-blue-100",
  },
  {
    title: "Support",
    description: "Technical issues, account help, or listing-related support.",
    email: "support@vrental.in",
    phone: "+91 9509206802",
    icon: Headphones,
    accent: "from-emerald-500 to-teal-500",
    ring: "ring-emerald-100",
  },
  {
    title: "Business & partnerships",
    description: "Collaborations, corporate tie-ups, and business development.",
    email: "business@vrental.in",
    phone: "+91 9509206802",
    icon: Briefcase,
    accent: "from-violet-500 to-purple-500",
    ring: "ring-violet-100",
  },
  {
    title: "Feedback",
    description: "Ideas and suggestions to help us improve your experience.",
    email: "feedback@vrental.in",
    phone: null,
    icon: MessageSquare,
    accent: "from-amber-500 to-orange-500",
    ring: "ring-amber-100",
  },
];

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-cyan-50/40">
      <Navbar />

      <main className="relative">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-blue-600/10 via-cyan-500/5 to-transparent"
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pb-28 lg:pt-14">
          <header className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              Vrental
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Contact us
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              We&apos;re here to help. Choose the channel that fits your question—we typically respond
              within one business day.
            </p>
          </header>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:gap-6">
            {channels.map((ch) => {
              const Icon = ch.icon;
              return (
                <article
                  key={ch.title}
                  className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ${ch.ring} transition hover:shadow-md hover:shadow-slate-200/60 sm:p-7`}
                >
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${ch.accent} text-white shadow-md`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2} aria-hidden />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">{ch.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{ch.description}</p>

                  <ul className="mt-5 space-y-3 text-sm">
                    <li>
                      <a
                        href={`mailto:${ch.email}`}
                        className="inline-flex items-center gap-2 font-medium text-blue-600 transition hover:text-blue-700"
                      >
                        <Mail className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                        {ch.email}
                      </a>
                    </li>
                    {ch.phone && (
                      <li>
                        <a
                          href={`tel:${ch.phone.replace(/\s/g, "")}`}
                          className="inline-flex items-center gap-2 font-medium text-slate-800 transition hover:text-slate-900"
                        >
                          <Phone className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                          {ch.phone}
                        </a>
                      </li>
                    )}
                  </ul>
                </article>
              );
            })}
          </div>

          <section className="mt-10 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-100 sm:mt-12">
            <div className="grid lg:grid-cols-2">
              <div className="border-b border-slate-100 p-8 lg:border-b-0 lg:border-r lg:p-10">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <MapPin className="h-5 w-5" strokeWidth={2} aria-hidden />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Visit us</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  For in-person meetings, please reach out by email or phone first so we can schedule
                  a convenient time.
                </p>
              </div>
              <div className="flex flex-col justify-center bg-gradient-to-br from-slate-50 to-cyan-50/50 p-8 lg:p-10">
                <p className="text-sm leading-relaxed text-slate-700">
                  Thank you for choosing <span className="font-semibold text-slate-900">VRENTAL</span>.
                  We look forward to assisting you and making your rental journey smoother.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
