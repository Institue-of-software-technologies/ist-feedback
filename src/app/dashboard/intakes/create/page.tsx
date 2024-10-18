"use client";

import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import Form from "@/components/Forms";
import api from "../../../../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

interface FormData {
    intakeName: string;
    intakeYear: string;
}

const NewIntakeForm: React.FC = () => {
    const router = useRouter();
    const onSubmit = async (data: FormData) => {
        try {
            await api.post("/intakes", data);
            toast.success("Intake created successfully!", { position: "top-right", autoClose: 3000 });
            setTimeout(() => {
                router.push('/dashboard/intakes'); 
            }, 1000);
        } catch (error) {
            console.error("Failed to create intake", error);
            toast.error("Failed to create intake", { position: "top-right", autoClose: 3000 });
        }
    };

    const currentYear = new Date().getFullYear();

    const generateYearOptions = () => {
        const yearRange = [];
        for (let i = currentYear - 2 ; i <= currentYear + 3; i++) {
            yearRange.push({label :`${i}`, value: i});
        }
        return yearRange;
    };

    const inputs = [
        { label: "intakeName", type: "text" },
        {
            label: "intakeYear", 
            type: "select",
            options: generateYearOptions()
        }
    ];


    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
            <ToastContainer />
            <h2 className="text-2xl font-bold mb-4">Create New Intake</h2>
            <Form<FormData>
                Input={inputs}
                onSubmit={onSubmit}
            />
        </div>
    );
};

export default NewIntakeForm