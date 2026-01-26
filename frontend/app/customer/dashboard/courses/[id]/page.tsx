"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { courses, Course } from "@/app/components/CoursesSection";
import { Star, Clock, BookOpen, Users, Award, CheckCircle2, PlayCircle, FileText, Download, Share2, Heart, ChevronDown, ChevronUp } from "lucide-react";

// Extended course data with curriculum
const coursesWithCurriculum: Record<
  number,
  {
    description: string;
    learningOutcomes: string[];
    requirements: string[];
    curriculum: {
      week: number;
      title: string;
      lessons: { id: number; title: string; duration: string; isPreview: boolean }[];
    }[];
    instructor: {
      name: string;
      title: string;
      bio: string;
      students: string;
      courses: number;
    };
  }
> = {
  1: {
    description:
      "Master Figma from the ground up! This comprehensive course takes you from complete beginner to confident designer. Learn to create stunning user interfaces, prototypes, and design systems using industry-standard tools and workflows.",
    learningOutcomes: [
      "Create professional UI designs using Figma",
      "Master components, variants, and auto-layout",
      "Build interactive prototypes and animations",
      "Collaborate effectively with design teams",
      "Implement design systems and style guides",
    ],
    requirements: ["No prior design experience needed", "A computer with internet connection", "Free Figma account (we'll help you set it up)"],
    curriculum: [
      {
        week: 1,
        title: "Getting Started with Figma",
        lessons: [
          { id: 1, title: "Introduction to Figma Interface", duration: "12:30", isPreview: true },
          { id: 2, title: "Setting Up Your Workspace", duration: "8:45", isPreview: true },
          { id: 3, title: "Basic Shapes and Tools", duration: "15:20", isPreview: false },
          { id: 4, title: "Working with Text and Typography", duration: "18:10", isPreview: false },
        ],
      },
      {
        week: 2,
        title: "Components and Design Systems",
        lessons: [
          { id: 5, title: "Creating Your First Component", duration: "14:25", isPreview: false },
          { id: 6, title: "Component Variants and Properties", duration: "20:15", isPreview: false },
          { id: 7, title: "Building a Design System", duration: "22:40", isPreview: false },
        ],
      },
      {
        week: 3,
        title: "Advanced Layouts and Prototyping",
        lessons: [
          { id: 8, title: "Mastering Auto-Layout", duration: "16:30", isPreview: false },
          { id: 9, title: "Interactive Prototypes", duration: "19:45", isPreview: false },
          { id: 10, title: "Animations and Transitions", duration: "17:20", isPreview: false },
        ],
      },
    ],
    instructor: {
      name: "Sarah Johnson",
      title: "Senior Product Designer at Google",
      bio: "With over 10 years of experience in UI/UX design, Sarah has worked with Fortune 500 companies and startups alike, creating user experiences that delight millions of users.",
      students: "45,000+",
      courses: 8,
    },
  },
  // Add more courses as needed - using simplified data for others
  2: {
    description: "Become a full-stack web developer in this intensive bootcamp. Learn HTML, CSS, JavaScript, React, Node.js, and deploy real-world applications.",
    learningOutcomes: ["Build responsive websites from scratch", "Master JavaScript and modern frameworks", "Create backend APIs with Node.js", "Deploy applications to production"],
    requirements: ["Basic computer skills", "Dedication to learn"],
    curriculum: [
      {
        week: 1,
        title: "Web Fundamentals",
        lessons: [
          { id: 1, title: "HTML Essentials", duration: "25:00", isPreview: true },
          { id: 2, title: "CSS Styling", duration: "30:00", isPreview: false },
        ],
      },
    ],
    instructor: {
      name: "DevHub Team",
      title: "Software Engineering Experts",
      bio: "Professional developers with combined 50+ years experience",
      students: "30,000+",
      courses: 12,
    },
  },
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = parseInt(params.id as string);
  const course = courses.find((c) => c.id === courseId);
  const courseDetails = coursesWithCurriculum[courseId];

  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
  const [isEnrolled, setIsEnrolled] = useState(false);

  if (!course || !courseDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <button onClick={() => router.push("/customer/dashboard/courses")} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const handleEnroll = () => {
    setIsEnrolled(true);
    // Here you'd typically call an API to enroll the user
    setTimeout(() => {
      alert("Successfully enrolled! You can now access all course materials.");
    }, 500);
  };

  const levelColors = {
    Beginner: "bg-green-100 text-green-700",
    Intermediate: "bg-orange-100 text-orange-700",
    "All Levels": "bg-blue-100 text-blue-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Course Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 text-blue-200">
                <span>{course.category}</span>
                <span>•</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[course.level]}`}>{course.level}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold">{course.title}</h1>

              <p className="text-lg text-blue-100">{courseDetails.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-blue-200">({course.students} students)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration} total</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{course.lessons} lessons</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white" />
                  ))}
                </div>
                <span className="text-sm">{course.students} students enrolled</span>
              </div>
            </div>

            {/* Right: Enrollment Card */}
            <div className="lg:block hidden">
              <div className="bg-white rounded-2xl p-6 shadow-xl sticky top-6">
                <div className="aspect-video bg-gray-200 rounded-xl mb-4 relative overflow-hidden">
                  {course.image ? (
                    <Image src={course.image} alt={course.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-400 to-blue-600">
                      <PlayCircle className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-gray-900">${course.price}</span>
                      <span className="text-gray-500 line-through">$99.99</span>
                      <span className="text-green-600 font-semibold text-sm">50% OFF</span>
                    </div>
                    <p className="text-sm text-gray-500">Lifetime access • 30-day money-back guarantee</p>
                  </div>

                  <button
                    onClick={handleEnroll}
                    disabled={isEnrolled}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${isEnrolled ? "bg-green-100 text-green-700 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl"}`}
                  >
                    {isEnrolled ? "✓ Enrolled" : "Enroll Now"}
                  </button>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                      <Heart className="w-5 h-5" />
                      <span>Save</span>
                    </button>
                    <button className="flex-1 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>

                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span>30-day money-back guarantee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Enroll Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <button onClick={handleEnroll} disabled={isEnrolled} className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${isEnrolled ? "bg-green-100 text-green-700" : "bg-blue-500 text-white hover:bg-blue-600"}`}>
          {isEnrolled ? "✓ Enrolled" : `Enroll Now - $${course.price}`}
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Course Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courseDetails.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
              <div className="space-y-4">
                {courseDetails.curriculum.map((week) => (
                  <div key={week.week} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setExpandedWeek(expandedWeek === week.week ? null : week.week)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">{week.week}</div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">{week.title}</h3>
                          <p className="text-sm text-gray-500">{week.lessons.length} lessons</p>
                        </div>
                      </div>
                      {expandedWeek === week.week ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </button>

                    {expandedWeek === week.week && (
                      <div className="border-t border-gray-200">
                        {week.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0 border-gray-100">
                            <div className="flex items-center gap-3">
                              <PlayCircle className="w-5 h-5 text-gray-400" />
                              <span className="text-gray-700">{lesson.title}</span>
                              {lesson.isPreview && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Preview</span>}
                            </div>
                            <span className="text-sm text-gray-500">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
              <ul className="space-y-3">
                {courseDetails.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0 mt-2" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Instructor</h2>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">{courseDetails.instructor.name.charAt(0)}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{courseDetails.instructor.name}</h3>
                  <p className="text-gray-600 mb-3">{courseDetails.instructor.title}</p>
                  <p className="text-gray-700 mb-4">{courseDetails.instructor.bio}</p>
                  <div className="flex gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-gray-400" />
                      <span>{courseDetails.instructor.students} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                      <span>{courseDetails.instructor.courses} courses</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sidebar (Desktop Only) */}
          <div className="hidden lg:block">{/* Sticky space for enrollment card that's in the hero */}</div>
        </div>
      </div>
    </div>
  );
}
