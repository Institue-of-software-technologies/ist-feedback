"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../../lib/axios'; // Update path to your axios lib
import { Button, Course, Role, trainer_courses, User } from '@/types'; // Update path to your User type
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '@/app/loading';
import { showToast } from '@/components/ToastMessage';
import Form from '@/components/Forms';

interface FormData {
  username: string;
  email: string;
  roleId: string;
  courseId: [];
}

const EditUser = () => {
  const router = useRouter();
  const { userId } = useParams(); // Get the `userId` from the URL
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [, setFilteredRoles] = useState<Role[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  // Fetch user data on mount
  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const response = await api.get(`/users/${userId}`);
          setUser(response.data.user);
          console.log(response.data.user);
          const coursesId = response.data.user.trainer_courses.map(
            (trainerCourse: trainer_courses) => trainerCourse.courseId
          );
          console.log(coursesId);
          setSelectedCourses(coursesId);
        } catch (err) {
          console.log(err);
          setError('Failed to fetch user');
        } finally {
          setLoading(false);
        }
      };
      fetchUser();

      const fetchUsers = async () => {
        try {
          const response = await api.get('/courses', {
            method: 'GET',
          });
          console.log(response);
          setCourses(response.data.course);
        } catch (err) {
          console.log(err);
          showToast.error('Failed to fetch courses');
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }
  }, [userId]);

  // Fetch roles data on mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get('/roles');
        setRoles(response.data.roles);
        setFilteredRoles(response.data.roles);
      } catch (err) {
        console.log(err);
        showToast.error('Failed to fetch roles');
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  // Handle form submission
  const handleSubmit = async (data: FormData) => {
    setFormLoading(true);
    try {
      await api.put(`/users/${userId}`, data);
      showToast.success('User updated successfully!');
      // Delay the redirect to allow the toast to display
      setTimeout(() => {
        router.push('/dashboard/users'); // Redirect to the user list
      }, 2000);
    } catch (err) {
      console.log(err);
      showToast.error('Failed to update user');
    } finally {
      setFormLoading(false);
    }
  };

  const resendInvite = async () => {
    setButtonLoading(true);
    try {
      const response = await api.post(`/users/resend-invite`, {
        email: user?.email,
      });

      // Check if the response status is 200
      if (response.status === 200) {
        showToast.success('Invite resent successfully!');
      } else {
        showToast.error('Failed to resend invite');
        console.log('Unexpected response status:', response.status);
      }
    } catch (err) {
      showToast.error('Failed to resend invite');
      console.error(err);
    } finally {
      setButtonLoading(false);
    }
  };
  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">{error}</div>;

  const inputs = [
    { label: "username", type: "text", value: user?.username },
    { label: "email", type: "email", value: user?.email },
    {
      label: "roleId",
      type: "select",
      value: user?.roleId,
      options: roles.map((role) => ({
        label: role.roleName,
        value: role.id,
      })),
    },
    {
      label: "courses",
      type: "multiple", // Assuming your Form component supports this type correctly.
      defaultSelect: selectedCourses,
      options: courses.map((course) => ({
        label: course.courseName,
        value: course.id,
      })),
    },
  ];

  // Only show the button if the user has not accepted the invite
  const extraButtons: Button[] = [
    {
      label: 'Back',
      type: 'button',
      onClick: () => router.push('/dashboard/users'),
    }
  ];
  
  if (user && !user.acceptInvite) {
    extraButtons.push({
      label: 'Resend Invite',
      type: 'button',
      buttonLoading: buttonLoading, // Now this property is valid
      onClick: resendInvite,
    });
  }

  return (
    <div className="p-6">
      <ToastContainer /> {/* Add the ToastContainer to render toast notifications */}

      <h3 className="text-2xl font-bold mb-4">Edit User</h3>
      <Form<FormData>
        Input={inputs}
        onSubmit={handleSubmit}
        addButton={extraButtons}
        loading={formLoading}
      />
    </div>
  );
};

export default EditUser;
