"use client";

import React, { useEffect, useState } from 'react';
import api from '../../../../lib/axios'; // Adjust this path to your axios setup
import { Feedback } from '@/types'; // Adjust this path to your User type definition
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import { useUser } from '@/context/UserContext';
import 'react-toastify/dist/ReactToastify.css';
import Table from '@/components/Tables';
import { showToast } from '@/components/ToastMessage';
import Loading from "@/app/loading";

const FeedBackManagement: React.FC = () => {
    const { user } = useUser();
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([]);
    const [search, setSearch] = useState<string>('');
    const router = useRouter();

    // Fetch feedback from your API
    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await api.get('/feedback-reports', {
                    method: 'GET',
                    headers: {
                        'user-role': `${user?.role}`, 
                        'user-id': `${user?.id}`,
                    },
                });

                // Ensure response contains 'feedbacks' array (plural)
                if (response?.data?.feedbacks && Array.isArray(response.data.feedbacks)) {
                    setFeedbacks(response.data.feedbacks);
                    setFilteredFeedback(response.data.feedbacks);
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (err) {
                console.error('Failed to fetch feedbacks:', err);
                showToast.error('Failed to fetch feedbacks', { position: "top-right", autoClose: 3000 });
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, [user?.id, user?.role]);

    const handleSearch = (value: string) => {
        console.log(search);
        setSearch(value);

        // Filter the feedback based on the search query
        if (value.trim() === '') {
            setFilteredFeedback(feedbacks);  // Show all if search is empty
        } else {
            const filtered = feedbacks.filter(feedback =>
                feedback.studentToken.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredFeedback(filtered);
        }
    };

    // Handle feedback view
    const handleView = (feedback: Feedback) => {
        showToast.info('Redirecting to View Feedback Report...');
        router.push(`/dashboard/feedback-reports/${feedback.id}`);
    };

    if (loading) return <Loading />

    const columns = [
        { header: 'Student Token', accessor: 'studentToken' },
        { header: 'Trainer Name', accessor: 'trainer.username' },
        { header: 'Course', accessor: 'trainer.course.courseName' },
        { header: 'Class Time', accessor: 'classTime.classTime' },
        { header: 'Intake Name', accessor: 'intake.intakeName' },
        { header: 'Intake Year', accessor: 'intake.intakeYear' },
    ];

    return (
        <div>
            <ToastContainer /> {/* Include ToastContainer for rendering toasts */}
            {filteredFeedback && filteredFeedback.length === 0 ? (
                <div className="text-center p-4">
                    <p>No Feedbacks available at the moment.</p>
                </div>
            ) : (
                <Table<Feedback>
                    columns={columns}
                    data={filteredFeedback}
                    onSearch={handleSearch}
                    onView={user && user.permissions.includes('view_feedback_results') ? handleView : undefined}
                />
            )}
        </div>
    );
};

export default FeedBackManagement;
