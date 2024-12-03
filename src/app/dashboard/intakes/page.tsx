"use client";

import React, { useEffect, useState } from 'react';
import api from '../../../../lib/axios'; // Adjust this path to your axios setup
import { Intake } from '@/types'; // Adjust this path to your User type definition
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import { useUser } from '@/context/UserContext';
import 'react-toastify/dist/ReactToastify.css';
import Table from '@/components/Tables';
import Loading from '../loading';  // Import the Loading component
import { showToast } from '@/components/ToastMessage';


const IntakeManagement: React.FC = () => {
    const { user } = useUser();
    const [intakes, setIntakes] = useState<Intake[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // State to handle delete confirmation
    const [filteredIntake, setFilteredIntake] = useState<Intake[]>([]);  // Holds the filtered users
    const [search, setSearch] = useState<string>('');
    const router = useRouter();

    // Fetch intake from your API
    useEffect(() => {
        const fetchIntakes = async () => {
            try {
                const response = await api.get('/intakes', {
                    method: 'GET',
                });
                console.log(response);
                setIntakes(response.data.intake);
                setFilteredIntake(response.data.intake);
            } catch (err) {
                console.log(err)
                showToast.error('Failed to fetch intakes');
            } finally {
                setLoading(false);
            }
        };

        fetchIntakes();
    }, []);

    // Handle intake deletion
    const handleDelete = async (confirmDelete: Intake) => {
        if (confirmDelete) {
            try {
                await api.delete(`/intakes/${confirmDelete.id}`);
                setIntakes(intakes.filter(intake => intake.id !== confirmDelete.id));
                setFilteredIntake(filteredIntake.filter(filteredIntake => filteredIntake.id !== confirmDelete.id));
                showToast.success('Intake deleted successfully');
            } catch (err) {
                console.log(err)
                showToast.error('Failed to delete intake');
            }
        }
    };

    const handleSearch = (value: string) => {
        console.log(search)
        setSearch(value);

        // Filter the intake based on the search query
        if (value.trim() === '') {
            setFilteredIntake(intakes);  // Show all if search is empty
        } else {
            const filtered = intakes.filter(intake =>
                intake.intakeName.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredIntake(filtered);
        }
    };

    // Handle intake editing
    const handleEdit = (intake: Intake) => {
        showToast.info('Redirecting to edit Intake...');
        router.push(`/dashboard/intakes/edit/${intake.id}`);
    };

    if (loading) return <Loading />;

    const columns = [
        { header: 'intakeName', accessor: 'intakeName' },
        { header: "intakeYear", accessor: "intakeYear" }
    ];

    return (
        <div>
            <ToastContainer /> {/* Include ToastContainer for rendering toasts */}
            {filteredIntake.length === 0 ? (
                <div className="text-center p-4">
                    <p>No Intakes available at the moment.</p>
                </div>
            ) : (
                <Table<Intake>
                    columns={columns}
                    data={filteredIntake}
                    onSearch={handleSearch}
                    onEdit={user && user.permissions.includes('update_intakes') ? handleEdit : undefined}
                    onDelete={user && user.permissions.includes('delete_intakes') ? handleDelete : undefined}
                />
            )}
        </div>
    );
};

export default IntakeManagement;
