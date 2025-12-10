"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetCourse } from "@/src/app/apis/courses/Queries";

/* ✅ MANUAL BASE PRICES USING SLUG */
const COURSE_PRICES: Record<string, number> = {
  "django-web-development": 2499,
  "python-programming": 1499,
  "tamil": 2999,
  "chapter-4": 999,
  "explicabo-duis-amet": 1199,
  "eos-magnam-aut-hic": 1099,
  "rerum-aliquid-ullamc": 1299,
  "dolor-reiciendis-del": 1399,
  "qui-quis-quo-eius-ex": 1599,
  "tempore-reprehender": 1499,
};

/* ✅ FALLBACK IMAGE */
const FALLBACK_IMAGE = "/courses/default.png";

/* ✅ SMART PRICE GENERATOR (NO DUPLICATES LOOKING RANDOM) */
const generatePrice = (index: number) => {
  const basePrices = [999, 1199, 1299, 1499, 1699, 1899, 2099, 2499];
  return basePrices[index % basePrices.length];
};

const Courses = () => {
  const { data, isLoading, isError } = useGetCourse();

  /* ✅ FILTER ONLY PUBLISHED + LIMIT TO 8 COURSES */
  const courses = Array.isArray(data)
    ? data
        .filter((course) => course.status === "published")
        .slice(0, 8)
    : [];

  /* ✅ LOADING STATE */
  if (isLoading) {
    return (
      <div className="py-20 text-center text-lg font-medium text-violet-600">
        Loading courses...
      </div>
    );
  }

  /* ✅ ERROR STATE */
  if (isError) {
    return (
      <div className="py-20 text-center text-red-500">
        Failed to load courses.
      </div>
    );
  }

  /* ✅ EMPTY STATE */
  if (!courses.length) {
    return (
      <div className="py-20 text-center text-zinc-500">
        No courses available.
      </div>
    );
  }

  return (
    <section className="py-20 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-10xl mx-auto px-6">

        {/* ✅ SECTION HEADER */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-violet-700 dark:text-violet-400">
            Popular Courses
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
            Choose from our most in-demand professional courses and start learning today.
          </p>
        </div>

        {/* ✅ COURSE GRID — 4 COLUMNS × 2 ROWS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course: any, index: number) => {
            const finalPrice =
              COURSE_PRICES[course.slug] ?? generatePrice(index);

            const imageUrl = course.image
              ? `${process.env.NEXT_PUBLIC_API_URL}${course.image}`
              : FALLBACK_IMAGE;

            return (
              <div
                key={course.id}
                className="rounded-xl overflow-hidden border border-violet-100 bg-white dark:bg-zinc-800 shadow-sm hover:shadow-lg transition"
              >
                {/* ✅ IMAGE */}
                <div className="relative w-full h-48">
                  <Image
                    src={imageUrl}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* ✅ CONTENT */}
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-semibold text-violet-700 dark:text-violet-400 line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between pt-4">
                    <span className="text-violet-700 font-bold text-lg">
                      ₹{finalPrice.toLocaleString("en-IN")}
                    </span>

                    {/* ✅ SAFE LINK */}
                    <Link
                      href={`/courses/${course.slug}`}
                      className="rounded-lg bg-violet-600 px-4 py-2 text-white text-sm font-medium hover:bg-violet-700 transition"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ✅ VIEW ALL BUTTON */}
        <div className="text-center mt-12">
          <Link
            href="/courses"
            className="inline-block rounded-full bg-violet-700 px-8 py-3 text-white font-semibold hover:bg-violet-800 transition"
          >
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Courses;
