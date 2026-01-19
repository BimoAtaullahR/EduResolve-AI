"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full rounded-bl-4xl rounded-br-[28rem] bg-gradient-to-b from-primary-blue to-primary-dark overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-8 pb-20">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            <span className="text-sm font-semibold text-gray-700">Learn From the Top Experts</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            <span className="italic font-light">Learn Anywhere, Anytime</span>
            <br />
            <span className="font-extrabold">Empower Your Future</span>
          </h1>
        </div>

        {/* Subtext */}
        <p className="text-center text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-8">
          Join thousands of learners gaining new skills, advancing careers
          <br className="hidden md:block" />
          and shaping a better tomorrow, one lesson at a time.
        </p>

        {/* Search Bar */}
        <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input type="text" placeholder="Search your Course..." className="w-full pl-12 pr-4 py-4 bg-white rounded-full shadow-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all" />
          </div>
        </div>

        {/* Hero Image & Decorative Elements */}
        <div className="relative flex justify-center items-end">
          {/* Sun Decoration - Left */}

          {/* Star Decoration - Right */}
          <div className="absolute right-10 top-0 md:right-32 md:top-10">
            <svg className="w-10 h-10 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L9.5 9.5H2l6 4.5-2 7.5 6-4.5 6 4.5-2-7.5 6-4.5h-7.5L12 2z" />
            </svg>
          </div>

          {/* Rating Card - Left */}
          <div className="absolute left-0 bottom-20 md:left-10 md:bottom-32 z-20">
            <div className="bg-white rounded-2xl p-4 shadow-xl w-48">
              <div className="text-3xl font-bold text-gray-900 mb-1">4.8</div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4].map((i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <defs>
                    <linearGradient id="halfStar">
                      <stop offset="50%" stopColor="#FACC15" />
                      <stop offset="50%" stopColor="#D1D5DB" />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#halfStar)"
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                By students worldwide for
                <br />
                quality learning and support.
              </p>
            </div>
          </div>

          {/* Stats Card - Right */}
          <div className="absolute right-0 bottom-32 md:right-10 md:bottom-40 z-20">
            <div className="bg-white rounded-2xl p-4 shadow-xl w-56">
              {/* Avatar Group */}
              <div className="flex -space-x-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-yellow-500 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-white"></div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">60k+</div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Learners growing with expert
                <br />
                guidance from trusted mentors.
              </p>
            </div>
          </div>

          {/* Hero Person Image */}
          <div className="relative w-80 h-96 md:w-96 md:h-[500px]">
            <Image src="/hero-student.png" alt="Happy student with books" fill className="object-contain object-bottom" priority />
          </div>
        </div>
      </div>
    </section>
  );
}
