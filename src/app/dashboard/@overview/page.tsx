"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use Next.js router for navigation
import { FaGraduationCap, FaUsers, FaBook, FaClock } from "react-icons/fa";
import axios from "axios";
import { useUser } from "@/context/UserContext";

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
  const [totalCourses, setTotalCourses] = useState<number | null>(null);
  const [totalIntakes, setTotalIntakes] = useState<number | null>(null);
  const [totalModules, setTotalModules] = useState<number | null>(null);
  const [totalClassTimes, setTotalClassTimes] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authorized, setAuthorized] = useState<boolean>(false); // Authorization state
  const [userPermissions, setUserPermissions] = useState<string[]>([]); // Store user permissions
  const { user } = useUser();
  const router = useRouter(); // Next.js router

  useEffect(() => {
    const checkAuthorization = () => {
      // Fetch the roles and permissions from localStorage
      if (user?.permissions.includes("view_dashboard")) {
        setUserPermissions(user.permissions);
        setAuthorized(true);
      } else {
        router.push("/403"); // Redirect unauthorized users to a 403 page
      }
    };

    checkAuthorization();
  }, [router, user?.permissions]);

  useEffect(() => {
    if (!authorized) return;

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
        setLoading(false);
      }
    };

    fetchCounts();
  }, [authorized]);

  // Card data configuration with permission-based visibility
  const cards = [
    {
      title: "Total Courses",
      value: totalCourses,
      icon: <FaGraduationCap size={40} className="text-indigo-500" />,
      bgColor: "bg-gradient-to-r from-indigo-200 via-indigo-400 to-indigo-600",
      requiredPermission: "view_courses", // Permission required to view this card
    },
    {
      title: "Total Intakes",
      value: totalIntakes,
      icon: <FaUsers size={40} className="text-green-500" />,
      bgColor: "bg-gradient-to-r from-green-200 via-green-400 to-green-600",
      requiredPermission: "view_intakes", // Permission required to view this card
    },
    {
      title: "Total Modules",
      value: totalModules,
      icon: <FaBook size={40} className="text-yellow-500" />,
      bgColor: "bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600",
      requiredPermission: "view_modules", // Permission required to view this card
    },
    {
      title: "Total Class Times",
      value: totalClassTimes,
      icon: <FaClock size={40} className="text-red-500" />,
      bgColor: "bg-gradient-to-r from-red-200 via-red-400 to-red-600",
      requiredPermission: "view_class_times", // Permission required to view this card
    },
  ];

  // Filter cards based on user permissions
  const visibleCards = cards.filter((card) =>
    userPermissions.includes(card.requiredPermission)
  );

  // Render nothing until authorization check is complete
  if (!authorized) return null;

  return (
    <div className="container mx-auto px-6 py-10">
      {/* <h1 className="text-4xl font-semibold mb-8 text-center">Dashboard Overview</h1> */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {visibleCards.map((card, index) => (
          <div
            key={index}
            className={`rounded-lg shadow-lg p-12 ${card.bgColor} text-white transform hover:scale-105 transition-transform`}
          >
            <div className="flex-col items-center justify-between">
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
