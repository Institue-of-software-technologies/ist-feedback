"use client";
import React from 'react';
import AdminUsers from '@/components/AdminUsers'; // Assuming you have an AdminUsers component
import { useUser } from '@/context/UserContext'; // Import the useUser hook

const Dashboard: React.FC = () => {
  const { user } = useUser(); // Get the user from context
  console.log(user);
  

  // Check if the user is available and has the permission to view the dashboard
  if (!user || !user.permissions.includes('view_dashboard')) {
    return <div>You do not have access to this page.</div>;
  }

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>

      {/* Conditionally render admin-specific components based on user permissions */}
      {user.permissions.includes('view_users') && (
        <div>
          <h2>Admin User Management</h2>
          <AdminUsers /> {/* AdminUsers component to manage users */}
        </div>
      )}

      {/* Add more conditional components based on other permissions if necessary */}
      {user.permissions.includes('view_reports') && (
        <div>
          <h2>Reports</h2>
          {/* Render report-related components here */}
        </div>
      )}

      {user.permissions.includes('manage_settings') && (
        <div>
          <h2>Settings</h2>
          {/* Render settings-related components here */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
