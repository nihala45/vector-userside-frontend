import Image from "next/image";
import Link from "next/link";

const Courses = () => {
  const courses = [
    {
      title: "Full Stack Web Development",
      desc: "Learn HTML, CSS, JavaScript, React & Node.js from scratch.",
      price: "₹1,999",
      image: "/courses/web-dev.png",
    },
    {
      title: "Python for Beginners",
      desc: "Master Python programming with real-world projects.",
      price: "₹1,499",
      image: "/courses/python.png",
    },
    {
      title: "UI / UX Design",
      desc: "Design beautiful user interfaces and experiences.",
      price: "₹1,299",
      image: "/courses/uiux.png",
    },
    {
      title: "Data Science",
      desc: "Learn Data Analysis, Machine Learning & AI basics.",
      price: "₹2,499",
      image: "/courses/data-science.png",
    },
    {
      title: "Java Programming",
      desc: "Become job-ready with core and advanced Java concepts.",
      price: "₹1,599",
      image: "/courses/java.png",
    },
    {
      title: "Digital Marketing",
      desc: "SEO, Social Media, Ads & Growth Hacking.",
      price: "₹1,299",
      image: "/courses/marketing.png",
    },
  ];

  return (
    <section className="py-20 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-6">

        {/* ✅ SECTION HEADER */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-violet-700 dark:text-violet-400">
            Popular Courses
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
            Choose from our most in-demand professional courses and start learning today.
          </p>
        </div>

        {/* ✅ COURSE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden border border-violet-100 bg-white dark:bg-zinc-800 shadow-sm hover:shadow-lg transition"
            >
              {/* ✅ IMAGE */}
              <div className="relative w-full h-48">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* ✅ CONTENT */}
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-semibold text-violet-700 dark:text-violet-400">
                  {course.title}
                </h3>

                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  {course.desc}
                </p>

                <div className="flex items-center justify-between pt-4">
                  <span className="text-violet-700 font-bold text-lg">
                    {course.price}
                  </span>

                  <Link
                    href="/courses"
                    className="rounded-lg bg-violet-600 px-4 py-2 text-white text-sm font-medium hover:bg-violet-700 transition"
                  >
                    Enroll Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
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
