"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation'; // App Router useRouter
import { useUser } from '@/context/UserContext';
import {
  RiDashboard2Fill,
} from "react-icons/ri";
import {
  FaUsers,
  FaGraduationCap,
  FaWpforms,
  FaUsersCog,
  FaUserLock,
  FaPowerOff,
  FaBookReader,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { VscFeedback } from "react-icons/vsc";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { SiGoogleforms } from "react-icons/si";
import api from '../../../lib/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './loading';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useUser();
  const router = useRouter(); // Router instance for programmatic navigation
  const [activeTab, setActiveTab] = useState<string>('Dashboard'); // Default to 'Dashboard' tab
  const [currentView, setCurrentView] = useState<string>('view'); // For toggling between view/create
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false); // State to manage sidebar visibility

  // Function to handle logout
  const handleLogout = async () => {
    try {
      localStorage.clear();
      const response = await api.post('/auth/logout');
      if (response.status === 200) {
        setTimeout(() => {
          router.push('/login');
        }, 3000);

        toast.success('Logout successfully', { position: "top-right", autoClose: 3000 });
      }
    } catch (error) {
      toast.error('Failed to logout', { position: "top-right", autoClose: 3000 });
    }
  };

  // Main tabs data with view/create links
  const tabs = [
    {
      name: "Dashboard",
      permission: "view_dashboard", // A common permission for all users
      viewLabel: "Dashboard",
      icon: <RiDashboard2Fill size={"55px"} />,
      viewLink: "/dashboard",
    },
    {
      name: "User Management",
      permission: "manage_users",
      viewLabel: "View Users",
      createLabel: "Create User",
      viewLink: "/dashboard/users",
      icon: <FaUsers size={"55px"} />,
      createLink: "/dashboard/users/create",
    },
    {
      name: "Course Management",
      permission: "manage_courses",
      viewLabel: "View Courses",
      createLabel: "Create Course",
      viewLink: "/dashboard/courses",
      icon: <FaGraduationCap size={"55px"} />,
      createLink: "/dashboard/courses/create",
    },
    {
      name: "Module Management",
      permission: "manage_modules",
      viewLabel: "View Modules",
      createLabel: "Create Module",
      viewLink: "/dashboard/modules",
      icon: <FaWpforms size={"55px"} />,
      createLink: "/dashboard/modules/create",
    },
    {
      name: "Intake Management",
      permission: "manage_intakes",
      viewLabel: "View Intakes",
      createLabel: "Create Intake",
      viewLink: "/dashboard/intakes",
      icon: <FaBookReader size={"55px"} />,
      createLink: "/dashboard/intakes/create",
    },
    {
      name: "Class Time Management",
      permission: "manage_class_time",
      viewLabel: "View Class Times",
      createLabel: "Create Class Time",
      viewLink: "/dashboard/class-times",
      icon: <PiChalkboardTeacherFill size={"55px"} />,
      createLink: "/dashboard/class-times/create",
    },
    {
      name: "Role Management",
      permission: "manage_roles",
      viewLabel: "View Roles",
      createLabel: "Create Role",
      viewLink: "/dashboard/roles",
      icon: <FaUsersCog size={"55px"} />,
      createLink: "/dashboard/roles/create",
    },
    {
      name: "Permission Management",
      permission: "manage_permissions",
      viewLabel: "View Permissions",
      createLabel: "Create Permission",
      viewLink: "/dashboard/permissions",
      icon: <FaUserLock size={"55px"} />,
      createLink: "/dashboard/permissions/create",
    },
    {
      name: "Trainer Management",
      permission: "manage_trainers",
      viewLabel: "View Trainers",
      createLabel: "Create Trainer",
      viewLink: "/dashboard/trainers/view",
      icon: <FaUsers size={"55px"} />,
      createLink: "/dashboard/trainers/create",
    },
    {
      name: "Feedback Management",
      permission: "manage_feedback",
      viewLabel: "View Feedback",
      createLabel: "Create Feedback",
      viewLink: "/dashboard/feedback/view",
      icon: <VscFeedback size={"55px"} />,
      createLink: "/dashboard/feedback/create",
    },
    {
      name: "Feedback Reports",
      permission: "send_feedback_reports",
      viewLabel: "View Feedback Reports",
      createLabel: "Send Feedback Report",
      viewLink: "/dashboard/feedback-reports/view",
      icon: <SiGoogleforms size={"55px"} />,
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

      const newPath: string | undefined = view === 'view' ? tab.viewLink : tab.createLink;
      if (newPath) {
        router.push(newPath); // Only push if newPath is defined
        setSidebarOpen(false); // Close sidebar on navigation
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
  }, [router, user]);

  if (!user || !user.permissions.includes('view_dashboard')) {
    return <div className="text-red-600 text-center mt-20">You do not have access to this page.</div>;
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex h-screen bg-background text-foreground">
        <ToastContainer />

        {/* Sidebar for Mobile */}
        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-50 transform transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="flex items-center justify-between p-4 bg-red-600">
            <h2 className="text-lg font-semibold">Dashboard</h2>
            <button
              className="text-white focus:outline-none"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes size={20} />
            </button>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {tabs.map((tab) => (
                user.permissions.includes(tab.permission) && (
                  <li key={tab.name}>
                    <button
                      onClick={() => handleTabChange(tab.name, 'view')}
                      className={`flex items-center w-full p-2 rounded hover:bg-gray-700 ${activeTab === tab.name ? 'bg-gray-700' : ''
                        } transition-colors`}
                    >
                      {tab.icon}
                      <span className="ml-2">{tab.name}</span>
                    </button>
                  </li>
                )
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full p-2 rounded hover:bg-gray-700 transition-colors"
                >
                  <FaPowerOff size={20} />
                  <span className="ml-2">Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          {/* Header */}
          <header className="flex items-center justify-between bg-red-600 text-white p-4 lg:hidden">
            <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
            <button
              className="text-white focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars size={24} />
            </button>
          </header>

          {/* Top Navigation for Large Screens */}
          <nav className="hidden lg:flex justify-between bg-gray-800 text-white p-4 shadow-lg">
            <ul className="flex w-full items-center justify-between">
              {tabs.map((tab) => (
                user.permissions.includes(tab.permission) && (
                  <li key={tab.name}>
                    <div className="relative group inline-block">
                      <button
                        onClick={() => handleTabChange(tab.name, 'view')} // Navigate to view mode
                        className={`p-2 rounded ${activeTab === tab.name ? 'bg-gray-600' : 'hover:bg-gray-700'} transition-colors`}
                      >
                        {tab.icon}
                      </button>
                      <div className="absolute hidden group-hover:block bg-white text-black text-sm rounded px-2 py-1 whitespace-nowrap top-full left-1/2 transform -translate-x-1/2 mt-2">
                        {tab.name}
                      </div>
                    </div>
                  </li>
                )
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-2 rounded hover:bg-gray-700 transition-colors"
                >
                  <FaPowerOff size={20} />
                  <span className="ml-2">Logout</span>
                </button>
              </li>
            </ul>
          </nav>


          {/* Sub-tabs for View/Create */}
          {activeTabDetails && (
            <div className="bg-gray-200 p-4 flex space-x-2">
              {activeTabDetails.viewLabel && (
                <button
                  onClick={() => handleTabChange(activeTab, 'view')} // Switch to view mode
                  className={`p-2 rounded ${currentView === 'view' ? 'bg-gray-600 text-white' : 'bg-gray-300 hover:bg-gray-400'} transition-colors`}
                >
                  {activeTabDetails.viewLabel}
                </button>
              )}
              {activeTabDetails.createLabel && (
                <button
                  onClick={() => handleTabChange(activeTab, 'create')} // Switch to create mode
                  className={`p-2 rounded ${currentView === 'create' ? 'bg-gray-600 text-white' : 'bg-gray-300 hover:bg-gray-400'} transition-colors`}
                >
                  {activeTabDetails.createLabel}
                </button>
              )}
            </div>
          )}

          {/* Main Content */}
          <main className="flex-grow p-5 overflow-y-auto bg-background text-foreground">
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
      </div>
    </Suspense>
  );
};

export default DashboardLayout;
