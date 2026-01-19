import React from "react";
import { Users, Globe, BookOpen } from "lucide-react";
import Image from "next/image";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  image?: string;
  imagePosition?: "top" | "bottom";
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, image, imagePosition = "top" }) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      {image && imagePosition === "top" && (
        <div className="relative h-64 w-full">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
      )}

      <div className="p-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500 rounded-full mb-4">{icon}</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>

      {image && imagePosition === "bottom" && (
        <div className="relative h-64 w-full">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
      )}
    </div>
  );
};

const WhyLearnersSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Why Thousands of Learners Trust Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Join a growing community of learners gaining real skills through expert-led, high-quality courses — built with care, trust, and transparency.</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Expert Trainers */}
          <FeatureCard
            icon={<Users className="w-7 h-7 text-white" />}
            title="Expert Trainers"
            description="Learn from real industry professionals with years of experience and practical knowledge."
            image="/images/trainer-1.jpg"
            imagePosition="top"
          />

          {/* Global Community */}
          <FeatureCard
            icon={<Globe className="w-7 h-7 text-white" />}
            title="Global Community"
            description="Connect, share, and grow with thousands of learners from around the world—exchange ideas, collaborate on goals, and be part of a supportive learning journey."
          />

          {/* Flexible Learning */}
          <FeatureCard
            icon={<BookOpen className="w-7 h-7 text-white" />}
            title="Flexible Learning Experience"
            description="Learn anytime, anywhere — at your own pace, on your own terms, with complete control over how."
            image="/images/student-learning.jpg"
            imagePosition="bottom"
          />
        </div>
      </div>
    </section>
  );
};

export default WhyLearnersSection;
