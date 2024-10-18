"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../../lib/axios'; // Update path to your axios lib
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from '@/components/Forms';
import { Intake } from '@/types';

interface FormData {
    intakeName: string;
    intakeYear:string
}

const EditIntake = () => {
    const router = useRouter();
    const { intakeId } = useParams(); // Get the `userId` from the URL
    const [intake, setIntake] = useState<Intake | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch intake data on mount
    useEffect(() => {
        if (intakeId) {
            const fetchIntake = async () => {
                try {
                    const response = await api.get(`/intakes/${intakeId}`);
                    setIntake(response.data.intake);
                } catch (err) {
                    setError('Failed to fetch intake');
                } finally {
                    setLoading(false);
                }
            };
            fetchIntake();
        }
    }, [intakeId]);

    // Handle form submission
    const handleSubmit = async (data: FormData) => {
        console.log(data)
        try {
            await api.put(`/intakes/${intakeId}`, data);
            toast.success('Intake updated successfully!', {
                position: "top-right",
                autoClose: 2000, 
            });

            // Delay the redirect to allow the toast to display
            setTimeout(() => {
                router.push('/dashboard/intakes'); 
            }, 1000);
        } catch (err) {
            toast.error('Failed to update intake', {
                position: "top-right",
                autoClose: 3000, 
            });
        }
    };

    const currentYear = new Date().getFullYear();

    const generateYearOptions = () => {
        const yearRange = [];
        for (let i = currentYear - 2; i <= currentYear + 3; i++) {
            yearRange.push({ label: `${i}`, value: i });
        }
        return yearRange;
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    const inputs = [
        { label: "intakeName", type: "text", value: intake?.intakeName },
        {
            label: "intakeYear",
            type: "select",
            value:intake?.intakeYear,
            options: generateYearOptions()
        }
    ];

    return (
        <div className="p-6">
            <ToastContainer />

            <h3 className="text-2xl font-bold mb-4">Edit Intake</h3>
            <Form<FormData>
                Input={inputs}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default EditIntake;
