"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

const AnalysisPage = () => {
          const [usageData, setUsageData] = useState<any[]>([]);  // Store session data here

          useEffect(() => {
                    const fetchUsageData = async () => {
                              const response = await fetch('/api/analysis');  // Fetch analysis data from API
                              const data = await response.json();

                              if (data.usageData) {
                                        setUsageData(data.usageData);
                              }
                    };

                    fetchUsageData();
          }, []);

          // Prepare data for the chart
          const chartData = usageData.map(session => {
                    // Convert the loginTime to a more readable format
                    const loginTime = new Date(session.loginTime);
                    const formattedLoginTime = loginTime.toLocaleTimeString();  // or use .toLocaleDateString() for the full date

                    // Convert duration (assumed to be in seconds) into minutes and seconds, but keep it numeric for plotting
                    const durationInSeconds = session.duration;
                    const minutes = Math.floor(durationInSeconds / 60);
                    const seconds = durationInSeconds % 60;
                    const formattedDuration = `${minutes}m ${seconds}s`;  // Display format for tooltip

                    return {
                              loginTime: formattedLoginTime,  // Use formatted login time
                              duration: durationInSeconds,    // Keep duration numeric for plotting
                              formattedDuration,              // Store formatted duration for tooltip
                    };
          });

          return (
                    <div style={{ width: "100%", height: "700px", margin: "auto", backgroundColor: "#f9f9f9", padding: "80px", borderRadius: "8px" }}>
                              <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#333", fontSize: "24px" }}>Analysis - User Session Time</h1>
                              <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 50, bottom: 50 }}>
                                                  <CartesianGrid strokeDasharray="3 3" />
                                                  <XAxis
                                                            dataKey="loginTime"
                                                            tick={{ fontSize: 15 }}
                                                            tickMargin={10} 
                                                  >
                                                            <Label
                                                                      value="Login Time"
                                                                      offset={-10}
                                                                      position="insideBottom"
                                                                      style={{ fontSize: 16, fontWeight: 600 }}
                                                                      dy={30} 
                                                            />
                                                  </XAxis>
                                                  <YAxis
                                                            tick={{ fontSize: 15 }}
                                                            tickMargin={10} 
                                                  >
                                                            <Label
                                                                      value="Duration (Seconds)"
                                                                      angle={-80}
                                                                      position="insideLeft"
                                                                      style={{ fontSize: 16, fontWeight: 600 }}
                                                                      dx={-30} 
                                                            />
                                                  </YAxis>
                                                  <Tooltip
                                                            formatter={(value: any, name: string, props: any) => {
                                                                      return [`${props.payload.formattedDuration}`, name];  // Use the formatted duration in tooltip
                                                            }}
                                                  />
                                                  <Legend />
                                                  <Line type="monotone" dataKey="duration" stroke="#82ca9d" />
                                        </LineChart>
                              </ResponsiveContainer>
                    </div>

          );
};

export default AnalysisPage;
