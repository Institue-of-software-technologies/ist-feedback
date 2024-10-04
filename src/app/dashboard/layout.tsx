"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // App Router useRouter
import { useUser } from '@/context/UserContext';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useUser();
  const router = useRouter(); // Router instance for programmatic navigation
  const [activeTab, setActiveTab] = useState<string>('Dashboard'); // Default to 'Dashboard' tab
  const [currentView, setCurrentView] = useState<string>('view'); // For toggling between view/create

  // Function to handle logout
  const handleLogout = () => {
    console.log("User logged out");
    // Add your logout logic here
  };

  // Main tabs data with view/create links
  const tabs = [
    {
      name: "Dashboard",
      permission: "view_dashboard", // A common permission for all users
      viewLabel: "Dashboard",
      viewLink: "/dashboard",
    },
    {
      name: "User Management",
      permission: "manage_users",
      viewLabel: "View Users",
      createLabel: "Create User",
      viewLink: "/dashboard/users",
      createLink: "/dashboard/users/create",
    },
    {
      name: "Course Management",
      permission: "manage_courses",
      viewLabel: "View Courses",
      createLabel: "Create Course",
      viewLink: "/dashboard/courses/view",
      createLink: "/dashboard/courses/create",
    },
    {
      name: "Role Management",
      permission: "manage_roles",
      viewLabel: "View Roles",
      createLabel: "Create Role",
      viewLink: "/dashboard/roles",
      createLink: "/dashboard/roles/create",
    },
    {
      name: "Permission Management",
      permission: "manage_permissions",
      viewLabel: "View Permissions",
      createLabel: "Create Permission",
      viewLink: "/dashboard/permissions/view",
      createLink: "/dashboard/permissions/create",
    },
    {
      name: "Feedback Management",
      permission: "manage_feedback",
      viewLabel: "View Feedback",
      createLabel: "Create Feedback",
      viewLink: "/dashboard/feedback/view",
      createLink: "/dashboard/feedback/create",
    },
    {
      name: "Intake Management",
      permission: "manage_intakes",
      viewLabel: "View Intakes",
      createLabel: "Create Intake",
      viewLink: "/dashboard/intakes/view",
      createLink: "/dashboard/intakes/create",
    },
    {
      name: "Class Time Management",
      permission: "manage_class_time",
      viewLabel: "View Class Times",
      createLabel: "Create Class Time",
      viewLink: "/dashboard/class-times/view",
      createLink: "/dashboard/class-times/create",
    },
    {
      name: "Trainer Management",
      permission: "manage_trainers",
      viewLabel: "View Trainers",
      createLabel: "Create Trainer",
      viewLink: "/dashboard/trainers/view",
      createLink: "/dashboard/trainers/create",
    },
    {
      name: "Feedback Reports",
      permission: "send_feedback_reports",
      viewLabel: "View Feedback Reports",
      createLabel: "Send Feedback Report",
      viewLink: "/dashboard/feedback-reports/view",
      createLink: "/dashboard/feedback-reports/send",
    },
  ];

  // Get the currently active tab details
  const activeTabDetails = tabs.find((tab) => tab.name === activeTab);

  // Set the active tab and view, and update the URL path
  const handleTabChange = (tabName: string, view: string) => {
    const tab = tabs.find((t) => t.name === tabName);
    if (tab) {
      setActiveTab(tab.name); // Set the active tab
      setCurrentView(view); // Set the view mode (view/create)

      const newPath: string | undefined = view === 'view' ? tab.viewLink : tab.createLink;;
      if (newPath) {
        router.push(newPath); // Only push if newPath is defined
      } else {
        console.error("newPath is undefined"); // Handle the undefined case (optional)
      }


    }
  };

  // Set the default tab based on user permissions
  useEffect(() => {
    if (user) {
      if (user.permissions.includes('view_dashboard')) {
        setActiveTab('Dashboard');
        setCurrentView('view');
        router.push('/dashboard'); // Ensure URL is set to dashboard on load
      }
    }
  }, [user]);

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
          {tabs.map((tab) => (
            user.permissions.includes(tab.permission) && (
              <li key={tab.name}>
                <button
                  onClick={() => handleTabChange(tab.name, 'view')} // Navigate to view mode
                  className={`p-2 rounded ${activeTab === tab.name ? 'bg-gray-600' : 'hover:bg-gray-700'} transition-colors`}>
                  {tab.name}
                </button>
              </li>
            )
          ))}
          <li>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded transition-colors">Logout</button>
          </li>
        </ul>
      </nav>

      {/* Sub-tabs for View/Create */}
      {activeTabDetails && (
        <div className="bg-gray-200 p-4">
          {activeTabDetails.createLabel && (
            <button
              onClick={() => handleTabChange(activeTab, 'view')} // Switch to view mode
              className={`p-2 rounded mr-2 ${currentView === 'view' ? 'bg-gray-600 text-white' : 'bg-gray-300 hover:bg-gray-400'} transition-colors`}>
              {activeTabDetails.viewLabel}
            </button>
          )}
          {activeTabDetails.createLabel && (
            <button
              onClick={() => handleTabChange(activeTab, 'create')} // Switch to create mode
              className={`p-2 rounded ${currentView === 'create' ? 'bg-gray-600 text-white' : 'bg-gray-300 hover:bg-gray-400'} transition-colors`}>
              {activeTabDetails.createLabel}
            </button>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow p-5 overflow-y-auto">
        {currentView === 'view' && (
          <div>
            <h2 className="text-xl font-bold">{activeTabDetails?.viewLabel}</h2>
            {/* Render the content for viewing */}
            {children}
          </div>
        )}

        {currentView === 'create' && (
          <div>
            <h2 className="text-xl font-bold">{activeTabDetails?.createLabel}</h2>
            {/* Render the content for creating */}
            {children}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;

