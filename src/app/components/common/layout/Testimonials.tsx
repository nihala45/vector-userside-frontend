"use client";

import { Star } from "lucide-react";
import { useGetTestimonials } from "@/src/app/apis/website-management/Mutations";

const Testimonials = () => {
  const { data, isLoading, isError } = useGetTestimonials();

  /* ✅ FILTER ONLY ACTIVE + LIMIT TO 5 */
  const testimonials = Array.isArray(data)
    ? data
        .filter((item) => item.is_active === true)
        .slice(0, 5)
    : [];

  /* ✅ LOADING STATE */
  if (isLoading) {
    return (
      <section className="py-20 text-center text-lg text-violet-600">
        Loading testimonials...
      </section>
    );
  }

  /* ✅ ERROR STATE */
  if (isError) {
    return (
      <section className="py-20 text-center text-red-500">
        Failed to load testimonials.
      </section>
    );
  }

  /* ✅ EMPTY STATE */
  if (!testimonials.length) {
    return (
      <section className="py-20 text-center text-zinc-500">
        No testimonials available.
      </section>
    );
  }

  return (
    <section className="py-20 bg-white dark:bg-zinc-900">
      <div className="max-w-10xl mx-auto px-6 text-center">

        {/* ✅ TITLE */}
        <h2 className="text-3xl md:text-4xl font-bold text-violet-700 dark:text-violet-400 mb-4">
          What Our Students Say
        </h2>

        <p className="text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto mb-12">
          Thousands of students trust Vector Learning App to upgrade their skills and careers.
        </p>

        {/* ✅ TESTIMONIAL GRID — ONLY 5 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {testimonials.map((item: any) => (
            <div
              key={item.id}
              className="bg-violet-50 dark:bg-zinc-800 border border-violet-100 dark:border-zinc-700 rounded-2xl p-6 shadow-md"
            >
              {/* ✅ STARS */}
              <div className="flex justify-center mb-3">
                {Array.from({ length: item.rating || 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-violet-600 text-violet-600"
                  />
                ))}
              </div>

              {/* ✅ TESTIMONIAL TEXT */}
              <p className="text-zinc-700 dark:text-zinc-200 text-sm leading-relaxed mb-4 line-clamp-4">
                “{item.testimonial}”
              </p>

              {/* ✅ NAME */}
              <h4 className="text-base font-semibold text-violet-700 dark:text-violet-400">
                {item.full_name}
              </h4>

              {/* ✅ PROFESSION + COMPANY */}
              <span className="block text-xs text-zinc-600 dark:text-zinc-300">
                {item.profession}
                {item.company ? ` • ${item.company}` : ""}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
