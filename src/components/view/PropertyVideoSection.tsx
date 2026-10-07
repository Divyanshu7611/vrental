"use client";

import React from "react";
import { Play, Instagram, Youtube } from "lucide-react";
import { parseApartmentVideoLinks, ParsedVideoLink } from "@/lib/videoLinks";

interface PropertyVideoSectionProps {
  instagramVideoLink?: string;
  youtubeVideoLink?: string;
}

function VideoCard({ link }: { link: ParsedVideoLink }) {
  const isInstagram = link.platform === "instagram";

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-2xl border border-gray-200 bg-gray-900 shadow-md transition hover:shadow-xl"
    >
      <div className="relative aspect-video w-full">
        {isInstagram ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
            <Instagram className="h-16 w-16 text-white/90" />
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={link.thumbnailUrl}
            alt={link.label}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/40">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-gray-900 shadow-lg">
            <Play className="ml-1 h-7 w-7 fill-current" />
          </div>
        </div>
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {isInstagram ? <Instagram className="h-3.5 w-3.5" /> : <Youtube className="h-3.5 w-3.5" />}
          {isInstagram ? "Instagram" : "YouTube"}
        </div>
      </div>
      <div className="bg-white px-4 py-3">
        <p className="font-semibold text-gray-900">{link.label}</p>
        <p className="text-sm text-gray-500">Tap to watch on {isInstagram ? "Instagram" : "YouTube"}</p>
      </div>
    </a>
  );
}

export default function PropertyVideoSection({
  instagramVideoLink,
  youtubeVideoLink,
}: PropertyVideoSectionProps) {
  const links = parseApartmentVideoLinks(instagramVideoLink, youtubeVideoLink);
  if (links.length === 0) return null;

  return (
    <div className="pt-4">
      <h2 className="mb-4 text-xl font-semibold">Property Videos</h2>
      <div className={`grid gap-4 ${links.length > 1 ? "md:grid-cols-2" : "grid-cols-1"}`}>
        {links.map((link) => (
          <VideoCard key={`${link.platform}-${link.url}`} link={link} />
        ))}
      </div>
    </div>
  );
}
