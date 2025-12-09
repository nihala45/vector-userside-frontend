"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const FeaturesCarousel = () => {
  const features = [
    {
      title: "Expert Mentors",
      desc: "Learn from experienced industry professionals.",
      icon: "🎓",
    },
    {
      title: "Video Learning",
      desc: "High quality video lessons anytime, anywhere.",
      icon: "📺",
    },
    {
      title: "Certificates",
      desc: "Earn certificates after completing courses.",
      icon: "🏆",
    },
    {
      title: "Mobile Friendly",
      desc: "Learn smoothly from any device.",
      icon: "📱",
    },
    {
      title: "Progress Tracking",
      desc: "Track your learning progress easily.",
      icon: "📊",
    },
    {
      title: "Affordable Pricing",
      desc: "Premium courses at simple prices.",
      icon: "💰",
    },
    {
      title: "Lifetime Access",
      desc: "Access your courses forever.",
      icon: "⏳",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* ✅ SCREEN SIZE DETECTION */
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1024);
      setIsTablet(width >= 768 && width < 1024);
      setIsMobile(width < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  /* ✅ AUTO SLIDE (DESKTOP ONLY) */
  useEffect(() => {
    if (features.length > 5 && !isPaused && isDesktop) {
      const interval = setInterval(() => {
        setCurrentIndex(
          (prev) => (prev + 1) % Math.ceil(features.length / 5)
        );
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [features.length, isPaused, isDesktop]);

  const nextSlide = useCallback(() => {
    if (features.length > 5 && isDesktop) {
      setCurrentIndex(
        (prev) => (prev + 1) % Math.ceil(features.length / 5)
      );
    }
  }, [features.length, isDesktop]);

  const prevSlide = useCallback(() => {
    if (features.length > 5 && isDesktop) {
      setCurrentIndex((prev) =>
        prev === 0
          ? Math.ceil(features.length / 5) - 1
          : prev - 1
      );
    }
  }, [features.length, isDesktop]);

  /* ✅ CHUNK DATA (5 FOR DESKTOP, 2 FOR TABLET, 2 FOR MOBILE) */
  const getChunkedData = () => {
    let itemsPerView;
    if (isDesktop) itemsPerView = 5;
    else if (isTablet) itemsPerView = 2;
    else itemsPerView = 2;

    const chunked = [];
    for (let i = 0; i < features.length; i += itemsPerView) {
      chunked.push(features.slice(i, i + itemsPerView));
    }
    return chunked;
  };

  const chunkedData = getChunkedData();

  /* ✅ MOBILE & TABLET GRID VIEW */
  if (isMobile || isTablet) {
    return (
      <section className="">
        <div className="">
          <h2 className="text-center text-3xl font-bold text-violet-700 mb-10">
            Why Choose Vector Learning App?
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {features.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-xl p-5 border border-violet-100 bg-violet-50 shadow text-center"
                )}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-semibold text-violet-700">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-600 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ✅ DESKTOP CAROUSEL VIEW (5 PER SLIDE) */
  return (
    <section
      className=""
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-10xl max-h-30xl mx-auto px-6 relative">

        <h2 className="text-center text-3xl md:text-4xl font-bold text-violet-700 mb-12">
          Why Choose Vector Learning App?
        </h2>

        {/* ✅ ARROWS */}
        {chunkedData.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-violet-600 text-white p-3 rounded-full shadow-md hover:bg-violet-700"
            >
              <ChevronRight className="rotate-180" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-violet-600 text-white p-3 rounded-full shadow-md hover:bg-violet-700"
            >
              <ChevronRight />
            </button>
          </>
        )}

        {/* ✅ CAROUSEL */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {chunkedData.map((chunk, chunkIndex) => (
              <div key={chunkIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-5 gap-6">
                  {chunk.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "rounded-xl p-6 border border-violet-100 bg-violet-50 shadow-sm hover:shadow-lg transition text-center"
                      )}
                    >
                      <div className="text-4xl mb-4">{item.icon}</div>
                      <h3 className="text-lg font-semibold text-violet-700">
                        {item.title}
                      </h3>
                      <p className="text-sm text-zinc-600 mt-1">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesCarousel;
