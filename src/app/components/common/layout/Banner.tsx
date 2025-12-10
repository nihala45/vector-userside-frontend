"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetBanners } from "@/src/app/apis/website-management/Mutations";

type BannerItem = {
  id: number;
  title: string;
  button_text: string;
  button_link: string;
  banner_image: string;
  is_active: boolean;
  created_at: string;
};

const BASE_MEDIA_URL = "http://127.0.0.1:8000"; // ✅ change in production

export default function Banner() {
  const { data, isLoading } = useGetBanners();

  // ✅ SAFELY GET ONLY ACTIVE BANNERS
  const banners: BannerItem[] = Array.isArray(data)
    ? data.filter((b) => b.is_active)
    : [];

  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ RESET INDEX WHEN DATA LOADS (CRITICAL FIX)
  useEffect(() => {
    if (banners.length > 0) {
      setCurrentIndex(0);
    }
  }, [banners.length]);

  // ✅ AUTO SLIDE
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const activeBanner = banners[currentIndex];

  // ✅ ABSOLUTE IMAGE URL FIX
  const imageUrl = activeBanner?.banner_image
    ? activeBanner.banner_image.startsWith("http")
      ? activeBanner.banner_image
      : `${BASE_MEDIA_URL}${activeBanner.banner_image}`
    : "/banner-learning.png";

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* ✅ FULL BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt="Hero Banner"
          fill
          className="object-cover"
          priority
          unoptimized
        />

        {/* ✅ STRONG OVERLAY FOR VISIBILITY */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* ✅ CONTENT */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto max-w-7xl px-6 text-white">
          {isLoading ? (
            <h1 className="text-4xl md:text-5xl font-bold">
              Loading...
            </h1>
          ) : activeBanner ? (
            <>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-2xl">
                {activeBanner.title}
              </h1>

              <div className="mt-6">
                <Link
                  href={activeBanner.button_link}
                  className="inline-block rounded-xl bg-violet-600 px-8 py-4 text-lg font-semibold text-white hover:bg-violet-700 transition"
                >
                  {activeBanner.button_text}
                </Link>
              </div>
            </>
          ) : (
            <h1 className="text-4xl md:text-5xl font-bold">
              No banners available
            </h1>
          )}
        </div>
      </div>

      {/* ✅ DOT INDICATORS */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-3 w-3 rounded-full transition ${
                index === currentIndex
                  ? "bg-white"
                  : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
