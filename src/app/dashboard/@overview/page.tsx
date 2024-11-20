"use client";

import React, { useEffect, useState } from "react";
import { FaChartLine, FaClipboardList } from "react-icons/fa";
import { RecentActivities } from '@/types';

const OverviewPage = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [recentActivities, setRecentActivities] = useState<RecentActivities[]>([]);

  useEffect(() => {
    // Fetch total users
    const fetchUserCount = async () => {
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const data = await response.json();
          setTotalUsers(data.count);
        } else {
          console.error("Failed to fetch total users");
        }
      } catch (error) {
        console.error("Failed to fetch total users", error);
      }
    };

    // Fetch total courses
    const fetchCourseCount = async () => {
      try {
        const response = await fetch("/api/courses");
        if (response.ok) {
          const data = await response.json();
          setTotalCourses(data.count);
        } else {
          console.error("Failed to fetch total courses");
        }
      } catch (error) {
        console.error("Failed to fetch total courses", error);
      }
    };

    // Fetch recent activities
    const fetchRecentActivities = async () => {
      try {
        const response = await fetch("/api/recent-activities");
        if (response.ok) {
          const data = await response.json();
          setRecentActivities(data);
        } else {
          console.error("Failed to fetch recent activities");
        }
      } catch (error) {
        console.error("Failed to fetch recent activities", error);
      }
    };

    fetchUserCount();
    fetchCourseCount();
    fetchRecentActivities();
  }, []);

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-3xl font-bold mb-6">Overview</h2>

      {/* Key Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-100 p-4 rounded flex items-center">
          <FaChartLine className="text-blue-500 text-3xl mr-4" />
          <div>
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-xl font-bold">{totalUsers}</p>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded flex items-center">
          <FaChartLine className="text-green-500 text-3xl mr-4" />
          <div>
            <h3 className="text-lg font-semibold">Courses Available</h3>
            <p className="text-xl font-bold">{totalCourses}</p>
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="bg-gray-100 p-4 rounded">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FaClipboardList className="text-orange-500 text-2xl mr-2" />
          Recent Activities
        </h3>

        {/* If no recent activities, show a message */}
        {recentActivities.length === 0 ? (
          <p>No recent activity</p>
        ) : (
          <ul className="list-disc list-inside">
            {recentActivities.map((activity) => (
              <li key={activity.id}>
                {activity.description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OverviewPage;
