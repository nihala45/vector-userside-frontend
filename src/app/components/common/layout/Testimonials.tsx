"use client";

import { useState } from "react";
import { ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Anjali Sharma",
    role: "Frontend Developer",
    review:
      "Vector Learning App helped me crack my first developer job. The courses are clear, practical, and super helpful.",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    role: "Python Developer",
    review:
      "The mentors explain concepts in a very simple way. I gained a lot of confidence in Python programming.",
    rating: 5,
  },
  {
    name: "Sneha Patel",
    role: "UI/UX Designer",
    review:
      "Best platform to learn design from scratch. The projects helped me build an amazing portfolio.",
    rating: 4,
  },
  {
    name: "Arjun Kumar",
    role: "Data Science Student",
    review:
      "Excellent learning experience! The machine learning course is very beginner friendly.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    role: "Digital Marketer",
    review:
      "The digital marketing course helped me grow my freelancing career quickly.",
    rating: 5,
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev === 0 ? testimonials.length - 1 : prev - 1)
    );
  };

  return (
    <section className="py-20 bg-white dark:bg-zinc-900">
      <div className="max-w-2xl mx-auto px-6 text-center relative">

        {/* ✅ TITLE */}
        <h2 className="text-3xl md:text-4xl font-bold text-violet-700 dark:text-violet-400 mb-4">
          What Our Students Say
        </h2>

        <p className="text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto mb-12">
          Thousands of students trust Vector Learning App to upgrade their skills and careers.
        </p>

        {/* ✅ TESTIMONIAL CARD */}
        <div className="relative bg-violet-50 dark:bg-zinc-800 border border-violet-100 dark:border-zinc-700 rounded-2xl p-10 shadow-md transition">

          {/* ✅ STARS */}
          <div className="flex justify-center mb-4">
            {Array.from({ length: testimonials[currentIndex].rating }).map(
              (_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-violet-600 text-violet-600"
                />
              )
            )}
          </div>

          {/* ✅ REVIEW */}
          <p className="text-zinc-700 dark:text-zinc-200 text-lg leading-relaxed mb-6">
            “{testimonials[currentIndex].review}”
          </p>

          {/* ✅ USER */}
          <h4 className="text-lg font-semibold text-violet-700 dark:text-violet-400">
            {testimonials[currentIndex].name}
          </h4>

          <span className="block text-sm text-zinc-600 dark:text-zinc-300">
            {testimonials[currentIndex].role}
          </span>

          {/* ✅ NAV BUTTONS */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <button
              onClick={prevSlide}
              className="ml-2 bg-violet-600 text-white p-2 rounded-full shadow hover:bg-violet-700"
            >
              <ChevronRight className="rotate-180" />
            </button>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              onClick={nextSlide}
              className="mr-2 bg-violet-600 text-white p-2 rounded-full shadow hover:bg-violet-700"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
