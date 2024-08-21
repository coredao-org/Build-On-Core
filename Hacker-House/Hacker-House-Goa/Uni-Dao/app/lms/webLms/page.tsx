//@ts-nocheck
import React from "react";
import CourseCard from "@/components/lms/CourseCard";

const coursesData = [
  {
    id: 1,
    title: "Introduction to Blockchain Technology",
    description: "Learn the fundamentals of blockchain technology and its applications.",
    image: "/path-to-image/blockchain.png",
    link: "./1"
  },
  {
    id: 2,
    title: "Getting Started with Web3",
    description: "A comprehensive guide to understanding and building Web3 applications.",
    image: "/path-to-image/web3.png",
    link: "./2"

  },
  {
    id: 3,
    title: "Mastering Aptos Blockchain",
    description: "Deep dive into Aptos blockchain, its architecture, and smart contracts.",
    image: "/path-to-image/aptos.png",
    link: "./3"

  },
  {
    id: 4,
    title: "Building Decentralized Applications (dApps)",
    description: "Learn to develop and deploy decentralized applications using various tools and technologies.",
    image: "/path-to-image/dapps.png",
    link: "./4"

  },
  {
    id: 5,
    title: "Understanding Smart Contracts",
    description: "An in-depth course on writing and deploying smart contracts on different blockchain platforms.",
    image: "/path-to-image/smart-contracts.png",
    link: "./5"

  }
];

export default function Page() {
  return (
    <div className="w-full flex flex-col relative items-center px-10 gap-8">
      <p className="fixed text-3xl text-center py-4 bg-white/5 w-full">
        Available Courses
      </p>

      <div className="w-full flex justify-center flex-wrap gap-8 pt-20">
        {coursesData.map(course => (
          <CourseCard 
            key={course.id}
            title={course.title}
            description={course.description}
            image={course.image}
            path={course.link}
          />
        ))}
      </div>
    </div>
  );
}
