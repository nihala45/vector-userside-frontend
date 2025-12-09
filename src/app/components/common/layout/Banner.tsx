import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-purple-500 py-24 text-white">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center gap-12">

        {/* ✅ LEFT CONTENT */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Learn Anytime, Anywhere with  
            <span className="block text-violet-200">
              Vector Learning App
            </span>
          </h1>

          <p className="text-lg text-violet-100 max-w-xl">
            Master new skills, explore expert-led courses, and upgrade your career with our modern e-learning platform.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/courses"
              className="rounded-lg bg-white px-6 py-3 text-violet-700 font-semibold hover:bg-violet-100 transition"
            >
              Explore Courses
            </Link>

            <Link
              href="/auth/register"
              className="rounded-lg border border-white px-6 py-3 text-white font-semibold hover:bg-white hover:text-violet-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* ✅ RIGHT IMAGE */}
        <div className="flex-1 flex justify-center">
          <Image
            src="/banner-learning.png"   // ✅ Put image in public/
            alt="Learning Banner"
            width={500}
            height={400}
            className="w-full max-w-md drop-shadow-2xl"
            priority
          />
        </div>

      </div>
    </section>
  );
}
