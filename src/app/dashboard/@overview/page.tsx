"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaGraduationCap, FaUsers, FaBook, FaClock } from "react-icons/fa"; // FontAwesome icons

// Skeleton loader for cards
const SkeletonCard = () => (
  <div className="rounded-lg shadow-lg p-6 bg-gray-300 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="h-3 w-3 bg-gray-400 rounded-full"></div>
      <div className="text-right">
        <div className="h-4 bg-gray-400 rounded w-32 mb-2"></div>
        <div className="h-6 bg-gray-400 rounded w-24"></div>
      </div>
    </div>
  </div>
);

const OverviewPage = () => {
  // State variables for counts
  const [totalCourses, setTotalCourses] = useState<number | null>(null);
  const [totalIntakes, setTotalIntakes] = useState<number | null>(null);
  const [totalModules, setTotalModules] = useState<number | null>(null);
  const [totalClassTimes, setTotalClassTimes] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch data from the dashboard API
        const response = await axios.get("/api/dashboard");
        setTotalCourses(response.data.totalCourses);
        setTotalIntakes(response.data.totalIntakes);
        setTotalModules(response.data.totalModules);
        setTotalClassTimes(response.data.totalClassTimes);
      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchCounts();
  }, []);

  // Card data configuration
  const cards = [
    {
      title: "Total Courses",
      value: totalCourses,
      icon: <FaGraduationCap size={40} className="text-indigo-500" />,
      bgColor: "bg-gradient-to-r from-indigo-200 via-indigo-400 to-indigo-600",
    },
    {
      title: "Total Intakes",
      value: totalIntakes,
      icon: <FaUsers size={40} className="text-green-500" />,
      bgColor: "bg-gradient-to-r from-green-200 via-green-400 to-green-600",
    },
    {
      title: "Total Modules",
      value: totalModules,
      icon: <FaBook size={40} className="text-yellow-500" />,
      bgColor: "bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600",
    },
    {
      title: "Total Class Times",
      value: totalClassTimes,
      icon: <FaClock size={40} className="text-red-500" />,
      bgColor: "bg-gradient-to-r from-red-200 via-red-400 to-red-600",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-semibold mb-8 text-center">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`rounded-lg shadow-lg p-6 ${card.bgColor} text-white transform hover:scale-105 transition-transform`}
          >
            <div className="flex items-center justify-between">
              {card.icon}

              <div className="text-right">
                <h2 className="text-lg font-semibold">{card.title}</h2>
                <p className="text-3xl font-bold">
                  {loading ? (
                    <SkeletonCard />
                  ) : card.value !== null ? (
                    card.value
                  ) : (
                    "No Data"
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewPage;
