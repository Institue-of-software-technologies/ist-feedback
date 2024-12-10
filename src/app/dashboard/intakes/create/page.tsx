"use client";

import React, { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Form from "@/components/Forms";
import api from "../../../../../lib/axios";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/ToastMessage";

interface FormData {
    intakeName: string;
    intakeYear: string;
}

const NewIntakeForm: React.FC = () => {
    const router = useRouter();
    const [formLoading, setFormLoading] = useState<boolean>(false);
    const onSubmit = async (data: FormData) => {
        setFormLoading(true);
        try {
            await api.post("/intakes", data);
            showToast.success("Intake created successfully!");
            setTimeout(() => {
                router.push('/dashboard/intakes');
            }, 1000);
        } catch (error) {
            console.error("Failed to create intake", error);
            showToast.error("Failed to create intake");
        }
        finally {
            setFormLoading(false);
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

    const inputs = [
        { label: "intakeName", type: "text" },
        {
            label: "intakeYear",
            type: "select",
            options: generateYearOptions()
        }
    ];
    const extraButtons = [
        {
          label: 'Back',
          type: 'button',
          onClick: () => router.push('/dashboard/intakes'),
        }
      ];
      


    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
            <ToastContainer />
            <h2 className="text-2xl font-bold mb-4">Create New Intake</h2>
            <Form<FormData>
                Input={inputs}
                onSubmit={onSubmit}
                loading={formLoading}
                addButton={extraButtons}
            />
        </div>
    );
};

export default NewIntakeForm
