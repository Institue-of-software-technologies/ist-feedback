"use client";
import React from 'react';
import Link from 'next/link'; // For routing
import { useUser } from '@/context/UserContext';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useUser();

  // Function to handle logout
  const handleLogout = () => {
    console.log("User logged out");
    // Add your logout logic here
  };

  if (!user || !user.permissions.includes('view_dashboard')) {
    return <div className="text-red-600 text-center mt-20">You do not have access to this page.</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-red-600 text-white p-5 text-center">
        <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 text-white p-4 shadow-lg">
        <ul className="flex space-x-6">
          {user.permissions.includes('manage_users') && (
            <li>
              <Link href="/dashboard/users" passHref>
                <button className="hover:text-red-400 transition-colors">User Management</button>
              </Link>
            </li>
          )}
          {user.permissions.includes('manage_roles') && (
            <li>
              <Link href="/dashboard/roles" passHref>
                <button className="hover:text-red-400 transition-colors">Role Management</button>
              </Link>
            </li>
          )}
          {user.permissions.includes('manage_permissions') && (
            <li>
              <Link href="/dashboard/permissions" passHref>
                <button className="hover:text-red-400 transition-colors">Permission Management</button>
              </Link>
            </li>
          )}
          {user.permissions.includes('manage_courses') && (
            <li>
              <Link href="/dashboard/courses" passHref>
                <button className="hover:text-red-400 transition-colors">Course Management</button>
              </Link>
            </li>
          )}
          {user.permissions.includes('manage_feedback') && (
            <li>
              <Link href="/dashboard/feedback" passHref>
                <button className="hover:text-red-400 transition-colors">Feedback Management</button>
              </Link>
            </li>
          )}
          {user.permissions.includes('manage_intakes') && (
            <li>
              <Link href="/dashboard/feedback" passHref>
                <button className="hover:text-red-400 transition-colors">intake Management</button>
              </Link>
            </li>
          )}
          {user.permissions.includes('manage_class_time') && (
            <li>
              <Link href="/dashboard/feedback" passHref>
                <button className="hover:text-red-400 transition-colors">class time Management</button>
              </Link>
            </li>
          )}
          {user.permissions.includes('view_notifications') && (
            <li>
              <Link href="/dashboard/notifications" passHref>
                <button className="hover:text-red-400 transition-colors">Notifications</button>
              </Link>
            </li>
          )}
          {user.permissions.includes('view_reports') && (
            <li>
              <Link href="/dashboard/reports" passHref>
                <button className="hover:text-red-400 transition-colors">Reports</button>
              </Link>
            </li>
          )}
          <li>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded transition-colors">Logout</button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-5 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
