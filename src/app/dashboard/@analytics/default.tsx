"use client";
import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
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

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const FeedbackDashboard = () => {
    const [feedbackData, setFeedbackData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchFeedbackReports = async () => {
            try {
                const response = await axios.get("/api/analytics");
                setFeedbackData(response.data.feedbackReports);
            } catch (error) {
                console.error("Error fetching feedback reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbackReports();
    }, []);

    // Process data for visualizations
    const processChartData = () => {
        const questionCounts: { [key: string]: number } = {};
        const feedbackPerTrainer: { [trainer: string]: number } = {};

        feedbackData.forEach((report) => {
            // Aggregate question types
            const questionType = report.question.questionType;
            questionCounts[questionType] = (questionCounts[questionType] || 0) + 1;

            // Aggregate feedback per trainer
            const trainerName = report.feedback.trainer.username;
            feedbackPerTrainer[trainerName] = (feedbackPerTrainer[trainerName] || 0) + 1;
        });

        return { questionCounts, feedbackPerTrainer };
    };

    const { questionCounts, feedbackPerTrainer } = processChartData();

    // Data for bar chart (feedback by question type)
    const barChartData = {
        labels: Object.keys(questionCounts),
        datasets: [
            {
                label: "Number of Questions",
                data: Object.values(questionCounts),
                backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
            },
        ],
    };

    // Data for pie chart (feedback by trainer)
    const pieChartData = {
        labels: Object.keys(feedbackPerTrainer),
        datasets: [
            {
                label: "Feedback to Trainer",
                data: Object.values(feedbackPerTrainer),
                backgroundColor: [
                    "rgba(75, 192, 192, 0.6)",  // Teal
                    "rgba(255, 99, 132, 0.6)",  // Red
                    "rgba(255, 206, 86, 0.6)",  // Yellow
                    "rgba(54, 162, 235, 0.6)",  // Blue
                    "rgba(153, 102, 255, 0.6)", // Purple
                    "rgba(255, 159, 64, 0.6)",  // Orange
                    "rgba(201, 203, 207, 0.6)", // Grey
                    "rgba(66, 135, 245, 0.6)",  // Light Blue
                    "rgba(99, 255, 132, 0.6)",  // Lime Green
                    "rgba(255, 123, 172, 0.6)", // Pink
                    "rgba(123, 99, 255, 0.6)",  // Violet
                    "rgba(99, 191, 255, 0.6)",  // Sky Blue
                    "rgba(192, 75, 192, 0.6)",  // Magenta
                    "rgba(255, 223, 99, 0.6)",  // Gold
                    "rgba(72, 61, 139, 0.6)",   // Dark Slate Blue
                    "rgba(50, 205, 50, 0.6)",   // Lime
                    "rgba(255, 127, 80, 0.6)",  // Coral
                    "rgba(218, 112, 214, 0.6)", // Orchid
                    "rgba(144, 238, 144, 0.6)", // Light Green
                    "rgba(173, 216, 230, 0.6)", // Light Blue
                ],

            },
        ],
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Feedback Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Feedback by Question Type */}
                <div className="bg-white shadow p-4 rounded">
                    <h2 className="text-lg font-bold mb-2">Feedback by Question Type</h2>
                    <Bar data={barChartData} />
                </div>

                {/* Feedback by Trainer */}
                <div className="bg-white shadow p-4 rounded">
                    <h2 className="text-lg font-bold mb-2">Feedback by Trainer</h2>
                    <Pie data={pieChartData} />
                </div>
            </div>
        </div>
    );
};

export default FeedbackDashboard;
