"use client";

import Banner from "../components/common/layout/Banner";
import Features from "../components/common/layout/Features";
import Courses from "../components/common/layout/Courses";
import Testimonials from "../components/common/layout/Testimonials";


export default function Home() {
  return (
    <main className="bg-zinc-50 dark:bg-zinc-900">

     
      <Banner />

    
      <Features />

      
      <Courses />

    
      <Testimonials />

      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold text-violet-700">
          More Sections Coming Soon...
        </h2>
      </section>

    </main>
  );
}
