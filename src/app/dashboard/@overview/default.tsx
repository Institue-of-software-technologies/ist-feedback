"use client";

import React, { useEffect, useState } from "react";
import { FaClipboardList } from "react-icons/fa";
import { RecentActivities } from '@/types';

const OverviewPage = () => {
    const [recentActivities, setRecentActivities] = useState<RecentActivities[]>([]);

    useEffect(() => {
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

        fetchRecentActivities();
    }, []);

    return (
        <div className="bg-white shadow-lg p-6 rounded-lg">
            <h2 className="text-3xl font-bold mb-6">Overview</h2>

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
