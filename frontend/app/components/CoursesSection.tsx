"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Clock, BookOpen, Users, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

// Course type
interface Course {
  id: number;
  title: string;
  author: string;
  image: string;
  rating: number;
  level: "Beginner" | "Intermediate" | "All Levels";
  lessons: number;
  duration: string;
  students: string;
  price: number;
  category: string;
}

// Sample course data (image placeholders)
const courses: Course[] = [
  {
    id: 1,
    title: "Learn Figma from Basic",
    author: "purepearl studio",
    image: "/assets/images/course-1.jpg",
    rating: 4.5,
    level: "Beginner",
    lessons: 17,
    duration: "2h 16m",
    students: "850+",
    price: 50.0,
    category: "UI/UX Design",
  },
  {
    id: 2,
    title: "Web Development Bootcamp",
    author: "devhub",
    image: "/assets/images/course-2.jpg",
    rating: 4.5,
    level: "All Levels",
    lessons: 28,
    duration: "4h 10m",
    students: "2.1K+",
    price: 75.0,
    category: "Development",
  },
  {
    id: 3,
    title: "Webflow for Beginners",
    author: "finvision",
    image: "/assets/images/course-3.jpg",
    rating: 4.5,
    level: "Beginner",
    lessons: 25,
    duration: "3h 30m",
    students: "1.4K+",
    price: 60.0,
    category: "Development",
  },
  {
    id: 4,
    title: "Learn Framer from Basic",
    author: "smartpath",
    image: "/assets/images/course-4.jpg",
    rating: 4.5,
    level: "Beginner",
    lessons: 20,
    duration: "2h 50m",
    students: "850+",
    price: 68.0,
    category: "UI/UX Design",
  },
  {
    id: 5,
    title: "Digital Marketing Essentials",
    author: "market360",
    image: "/assets/images/course-5.jpg",
    rating: 4.5,
    level: "All Levels",
    lessons: 18,
    duration: "3h 05m",
    students: "900+",
    price: 55.0,
    category: "Digital Marketing",
  },
  {
    id: 6,
    title: "English for Daily Conversations",
    author: "languageflow",
    image: "/assets/images/course-6.jpg",
    rating: 4.5,
    level: "Intermediate",
    lessons: 15,
    duration: "2h 00m",
    students: "700+",
    price: 40.0,
    category: "Language Learning",
  },
];

const categories = ["All courses", "UI/UX Design", "Development", "Digital Marketing", "Language Learning"];

// Level badge colors
const levelColors = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-orange-100 text-orange-700",
  "All Levels": "bg-blue-100 text-blue-700",
};

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
      {/* Course Image */}
      <div className="relative h-60 w-full bg-gray-200 rounded-b-4xl overflow-hidden">
        {/* Placeholder - User will add image */}
        {course.image ? (
          <Image src={course.image} alt={course.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
            <span className="text-white text-sm">Course Image</span>
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-semibold text-gray-800">{course.rating}</span>
        </div>

        {/* Level Badge */}
        <div className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-medium ${levelColors[course.level]}`}>{course.level}</div>
      </div>

      {/* Course Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{course.title}</h3>

        {/* Author */}
        <p className="text-sm text-gray-500 mb-3">
          by <span className="text-blue-500 hover:underline cursor-pointer">{course.author}</span>
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{course.lessons} Lessons</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Students */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
          <Users className="w-3.5 h-3.5" />
          <span>{course.students} Students Enrolled</span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold text-gray-900">${course.price.toFixed(2)}</span>
            <span className="text-xs text-gray-400">/lifetime</span>
          </div>
          <Link href="/login">
            <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors cursor-pointer">Enroll Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const CoursesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All courses");
  const [currentPage, setCurrentPage] = useState(0);

  // Filter courses by category
  const filteredCourses = activeCategory === "All courses" ? courses : courses.filter((course) => course.category === activeCategory);

  return (
    <section className="py-20 px-4" style={{ backgroundColor: "#e7f0ff" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Explore Most Popular Courses</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Learn from top-rated instructors across in-demand categories and start growing your skills today.</p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${activeCategory === category ? "bg-blue-500 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* Pagination & Navigation */}
        <div className="flex items-center justify-center gap-4">
          {/* Pagination Dots */}
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${currentPage === page ? "bg-blue-500 w-6" : "bg-gray-300 hover:bg-gray-400"}`} />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 ml-4">
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-white hover:border-blue-300 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
