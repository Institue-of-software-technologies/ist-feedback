"use client"; // Ensures it's a client component
import React from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname from next/navigation
import AdminUsers from '@/components/AdminUsers'; // Assuming you have an AdminUsers component
import { useUser } from '@/context/UserContext';

const Dashboard: React.FC = () => {
  const { user } = useUser(); // Get the user context
  const pathname = usePathname(); // Get the current pathname

  // Check if the user has permission to view the dashboard
  if (!user?.permissions.includes('view_dashboard')) {
    return <div>You do not have access to this page.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>

      {/* Admin User Management */}
      {pathname === '/dashboard/users' && user.permissions.includes('view_users') && (
        <>
          
        </>
      )}

      {/* Role Management */}
      {pathname === '/dashboard/roles' && user.permissions.includes('view_roles') && (
        <div>
          <h2 className="text-xl font-semibold"> All Roles</h2>
          <AdminUsers />
        </div>
      )}

      {/* Course Management */}
      {pathname === '/dashboard/courses/view' && user.permissions.includes('view_courses') && (
        <div>
          <h2 className="text-xl font-semibold">Course Management</h2>
          {/* Course management component goes here */}
        </div>
      )}

      {/* Create New User */}
      {pathname === '/dashboard/users/create' && user.permissions.includes('create_users') && (
        <div>
          <h2 className="text-xl font-semibold">Create New User</h2>
          {/* Form to create a new user goes here */}
        </div>
      )}

      {/* Create New Role */}
      {pathname === '/dashboard/roles/create' && user.permissions.includes('create_roless') && (
        <div>
          <h2 className="text-xl font-semibold">Create New Role</h2>
          {/* Form to create a new user goes here */}
        </div>
      )}

      {/* Feedback Management */}
      {pathname === '/dashboard/feedback/view' && user.permissions.includes('view_feedback_questions') && (
        <div>
          <h2 className="text-xl font-semibold">Feedback Management</h2>
          {/* Feedback management component goes here */}
        </div>
      )}

      {/* Intake Management */}
      {pathname === '/dashboard/intakes/view' && user.permissions.includes('view_intakes') && (
        <div>
          <h2 className="text-xl font-semibold">Intake Management</h2>
          {/* Intake management component goes here */}
        </div>
      )}

      {/* Class Time Management */}
      {pathname === '/dashboard/class-times/view' && user.permissions.includes('view_class_times') && (
        <div>
          <h2 className="text-xl font-semibold">Class Time Management</h2>
          {/* Class time management component goes here */}
        </div>
      )}

      {/* Trainer Management */}
      {pathname === '/dashboard/trainers/view' && user.permissions.includes('view_trainers') && (
        <div>
          <h2 className="text-xl font-semibold">Trainer Management</h2>
          {/* Trainer management component goes here */}
        </div>
      )}

      {/* Feedback Results */}
      {pathname === '/dashboard/feedback-results/view' && user.permissions.includes('view_feedback_results') && (
        <div>
          <h2 className="text-xl font-semibold">Feedback Results</h2>
          {/* Feedback results component goes here */}
        </div>
      )}

      {/* Additional routes and their permissions can be added similarly */}
    </div>
  );
};

export default Dashboard;
