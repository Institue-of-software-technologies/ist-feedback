"use client";
import { useParams,useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '../../../../../lib/axios';
import Form from '@/components/Forms';
import { User } from '@/types';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../loading';
import { showToast } from '@/components/ToastMessage';

interface FormData {
  userId: number;
  username: string;
  email: string;
  OldPassword: string;
  NewPassword: string;
  ConfirmNewPassword: string;
}

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formLoading, setformLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      const featchUserProfile = async () => {
        try {
          const user = await api.get(`/users/${userId}`);
          setUser(user.data.user)
        } catch (err) {
          console.log(err)
          setError('Failed to fetch user');
        } finally {
          setLoading(false)
        }
      };
      featchUserProfile();
    }
  }, [userId]);

  const handleSubmit = async (data: FormData) => {
    setformLoading(true);
    try {
      await api.put(`/users`, { ...data, userId });
      showToast.success('Profile updated successfully!');
    } catch (err) {
      console.log(err);
      showToast.error('Failed to update user profile');
    } finally {
      setformLoading(false); // Stop loading once the request is done
    }
  };

  if (loading) return <div><Loading /></div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const inputs = [
    { label: "username", type: "text", value: user?.username },
    { label: "email", type: "email", value: user?.email,readonly:true },
    { label: "OldPassword", type: "password", },
    { label: "NewPassword", type: "password" },
    { label: "ConfirmNewPassword", type: "password" },
  ];
  const extraButtons = [
    {
      label: 'Clear',
      type: 'button',
      onClick: () => router.push('/dashboard'),
    }
  ];
  
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <ToastContainer />
      <div className="flex flex-col min-h-screen p-3 ">
        <h1 className='text-xl'>Update User Profile</h1>
          <Form<FormData>
            Input={inputs}
            onSubmit={handleSubmit}
            buttonText="Update"
            loading={formLoading}
            addButton={extraButtons}
          />
          {/* Password Guidelines Section */}
          <div className="mt-8 bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Password Requirements</h2>
            <ul className="list-disc pl-5">
              <li className="text-sm text-gray-700">At least 8 characters long</li>
              <li className="text-sm text-gray-700">Includes both uppercase and lowercase letters</li>
              <li className="text-sm text-gray-700">Includes at least one number</li>
              <li className="text-sm text-gray-700">Includes at least one special character (e.g., !@#$%^&*)</li>
            </ul>
          </div>

      </div>
    </div>

  );
}

export default UserProfile;