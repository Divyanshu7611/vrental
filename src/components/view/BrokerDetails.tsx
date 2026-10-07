"use client";

import React from "react";
import { Building2, MapPin, BadgeCheck, Briefcase, IndianRupee } from "lucide-react";

export interface BrokerProfilePublic {
  fullName: string;
  profilePhoto: string;
  mobile: number;
  email: string;
  firmName: string;
  officeAddress: string;
  areasServed: string;
  reraNumber: string;
  brokerageDetails: string;
  experience: string;
  otherDetails?: string;
}

interface BrokerDetailsProps {
  broker: BrokerProfilePublic;
}

export default function BrokerDetails({ broker }: BrokerDetailsProps) {
  return (
    <div className="sticky top-24 overflow-hidden rounded-2xl border border-indigo-200/80 bg-white shadow-[0_20px_50px_-24px_rgba(15,23,42,0.25)] ring-1 ring-black/[0.03]">
      <div className="h-1 bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-500" aria-hidden />
      <div className="p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2 text-indigo-700">
          <BadgeCheck className="h-5 w-5" />
          <span className="text-sm font-bold uppercase tracking-wide">Verified Broker</span>
        </div>

        <div className="mb-5 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={broker.profilePhoto}
            alt={broker.fullName}
            className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white shadow-md"
          />
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-gray-900">{broker.fullName}</h2>
            <p className="text-sm text-gray-500">{broker.firmName}</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
            <span>{broker.officeAddress}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
            <span>Serves: {broker.areasServed}</span>
          </div>
          <div className="flex items-start gap-2">
            <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
            <span>{broker.experience} experience</span>
          </div>
          <div className="flex items-start gap-2">
            <IndianRupee className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
            <span>{broker.brokerageDetails}</span>
          </div>
          <div className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-800">
            RERA: {broker.reraNumber}
          </div>
          {broker.otherDetails ? (
            <p className="rounded-xl bg-gray-50 px-3 py-2 text-gray-600">{broker.otherDetails}</p>
          ) : null}
        </div>

        <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Contact</p>
          <p className="mt-1 text-lg font-bold text-gray-900">{broker.mobile}</p>
          <p className="text-sm text-gray-600">{broker.email}</p>
          <a
            href={`tel:${broker.mobile}`}
            className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Call broker
          </a>
        </div>
      </div>
    </div>
  );
}
