"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
          Chart as ChartJS,
          ArcElement,
          BarElement,
          CategoryScale,
          LinearScale,
          Tooltip,
          Legend,
} from "chart.js";
import Loading from "@/app/loading";
import { RecentActivities } from "@/types";

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const FeedbackDashboard = () => {

          const [recentActivities, setRecentActivities] = useState<RecentActivities[]>([]); const [loading, setLoading] = useState(true);

          useEffect(() => {
                    const fetchRecentActivities = async () => {
                              try {
                                        const response = await axios.get("/api/recent-activities");
                                        setRecentActivities(response.data || []);
                              } catch (error) {
                                        console.error("Error fetching recent activities:", error);
                              } finally {
                                        setLoading(false);
                              }
                    };

                    fetchRecentActivities();
          }, []);

          // Process data for the recent activities chart
          const processRecentActivitiesData = () => {
                    const activityCounts: { [key: string]: number } = {};
                    recentActivities.forEach((activity) => {
                              const activityType = activity.activityType;
                              activityCounts[activityType] = (activityCounts[activityType] || 0) + 1;
                    });

                    return activityCounts;
          };

          const activityCounts = processRecentActivitiesData();

          // Data for recent activities chart
          const recentActivitiesChartData = {
                    labels: Object.keys(activityCounts),
                    datasets: [
                              {
                                        label: "Number of Activities",
                                        data: Object.values(activityCounts),
                                        backgroundColor: [
                                                  "rgba(75, 192, 192, 0.6)",  // Teal
                                                  "rgba(255, 99, 132, 0.6)",  // Red
                                                  "rgba(255, 206, 86, 0.6)",  // Yellow
                                                  "rgba(54, 162, 235, 0.6)",  // Blue
                                                  "rgba(153, 102, 255, 0.6)", // Purple
                                                  "rgba(255, 159, 64, 0.6)",  // Orange
                                        ],
                              },
                    ],
          };

          if (loading) {
                    return <Loading />;
          }

          return (
                    <div className="container mx-auto p-6">
                              <h1 className="text-3xl font-bold mb-4">Activity Overview</h1>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Chart for Recent Activities */}
                                        <div className="bg-white shadow p-4 rounded">
                                                  <h2 className="text-lg font-bold mb-2">Recent Activities</h2>
                                                  <Bar data={recentActivitiesChartData} />
                                        </div>
                              </div>
                    </div>
          );
};

export default FeedbackDashboard;
