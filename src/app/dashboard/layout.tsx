"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation'; // App Router useRouter
import { useUser } from '@/context/UserContext';
import {
  RiDashboard2Fill,
  RiUserLine,
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
import { PiBellSimpleDuotone, PiChalkboardTeacherFill, PiUserCircleDuotone, PiUserCircleGearDuotone } from "react-icons/pi";
import { TbUserQuestion } from "react-icons/tb";
import api from '../../../lib/axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './loading';
import istLogo from '../../../public/assets/image/cropedImag.png';
import Image from 'next/image';
import { showToast } from '@/components/ToastMessage';

type DashboardLayoutProps = {
  children: React.ReactNode;
  overview: React.ReactNode;
  analysis: React.ReactNode;
  analytics: React.ReactNode;
  recentactivities: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, overview, analysis, analytics, recentactivities }) => {
  const { user } = useUser();
  const router = useRouter(); // Router instance for programmatic navigation
  const [activeTab, setActiveTab] = useState<string>('Dashboard'); // Default to 'Dashboard' tab
  const [currentView, setCurrentView] = useState<string>('view'); // For toggling between view/create
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false); // State to manage sidebar visibility
  const [menuOpen, setMenuOpen] = useState<boolean>(false); // State to menu visibility
  const [loggedInUser] = useState<string | null>(user?.username ?? null);


  // Function to handle logout
  const handleLogout = async () => {
    try {
      localStorage.clear();
      const response = await api.post('/auth/logout');
      if (response.status === 200) {
        setTimeout(() => {
          router.push('/login');
        }, 3000);

      }
    } catch (error) {
      console.log(error)
      showToast.error('Failed to logout');
    }
  };

  // Main tabs data with view/create links
  const tabs = [
    {
      name: 'Dashboard',
      permission: 'view_dashboard', // A common permission for all users
      viewLabel: 'Dashboard',
      icon: <RiDashboard2Fill size={'40px'} />,
      sideIcon: <RiDashboard2Fill size={'30px'} />,
      viewLink: '/dashboard',
    },
    {
      name: 'User',
      permission: 'manage_users',
      viewLabel: 'View Users',
      createLabel: 'Create User',
      viewLink: '/dashboard/users',
      icon: <FaUsers size={'40px'} />,
      sideIcon: <FaUsers size={'30px'} />,
      createLink: '/dashboard/users/create',
    },
    {
      name: 'Course',
      permission: 'manage_courses',
      viewLabel: 'View Courses',
      createLabel: 'Create Course',
      viewLink: '/dashboard/courses',
      icon: <FaGraduationCap size={'40px'} />,
      sideIcon: <FaGraduationCap size={'30px'} />,
      createLink: '/dashboard/courses/create',
    },
    {
      name: "Module ",
      permission: "manage_modules",
      viewLabel: "View Modules",
      createLabel: "Create Module",
      viewLink: "/dashboard/modules",
      icon: <FaWpforms size={"40px"} />,
      sideIcon: <FaWpforms size={"30px"} />,
      createLink: "/dashboard/modules/create",
    },
    {
      name: "Intake ",
      permission: "manage_intakes",
      viewLabel: "View Intakes",
      createLabel: "Create Intake",
      viewLink: "/dashboard/intakes",
      icon: <FaBookReader size={"40px"} />,
      sideIcon: <FaBookReader size={"30px"} />,
      createLink: "/dashboard/intakes/create",
    },
    {
      name: "Class Time",
      permission: "manage_class_time",
      viewLabel: "View Class Times",
      createLabel: "Create Class Time",
      viewLink: "/dashboard/class-times",
      icon: <PiChalkboardTeacherFill size={"40px"} />,
      sideIcon: <PiChalkboardTeacherFill size={"30px"} />,
      createLink: "/dashboard/class-times/create",
    },
    {
      name: 'Role',
      permission: 'manage_roles',
      viewLabel: 'View Roles',
      createLabel: 'Create Role',
      viewLink: '/dashboard/roles',
      icon: <FaUsersCog size={'40px'} />,
      sideIcon: <FaUsersCog size={'30px'} />,
      createLink: '/dashboard/roles/create',
    },
    {
      name: 'Permission',
      permission: 'manage_permissions',
      viewLabel: 'View Permissions',
      createLabel: 'Create Permission',
      viewLink: '/dashboard/permissions',
      icon: <FaUserLock size={'40px'} />,
      sideIcon: <FaUserLock size={'30px'} />,
      createLink: '/dashboard/permissions/create',
    },
    // {
    //   name: 'Trainer',
    //   permission: 'manage_trainers',
    //   viewLabel: 'View Trainers',
    //   createLabel: 'Create Trainer',
    //   viewLink: '/dashboard/trainers',
    //   icon: <FaUsers size={'40px'} />,
    //   sideIcon: <FaUsers size={'30px'} />,
    //   createLink: '/dashboard/trainers/create',
    // },
    {
      name: "Feedback Questions",
      permission: "manage_feedback_questions",
      viewLabel: "View Feedback Question",
      createLabel: "Create Feedback Question",
      viewLink: "/dashboard/feedback-questions",
      icon: <TbUserQuestion size={"40px"} />,
      sideIcon: <TbUserQuestion size={"30px"} />,
      createLink: "/dashboard/feedback-questions/create",
    },
    {
      name: "Feedback",
      permission: "manage_feedback",
      viewLabel: "View Feedback",
      createLabel: "Create Feedback",
      viewLink: "/dashboard/feedback",
      icon: <VscFeedback size={"40px"} />,
      sideIcon: <VscFeedback size={"30px"} />,
      createLink: "/dashboard/feedback/create",
    },
    // {
    //   name: 'Feedback Reports',
    //   permission: 'send_feedback_reports',
    //   viewLabel: 'View Feedback Reports',
    //   createLabel: 'Send Feedback Report',
    //   viewLink: '/dashboard/feedback-reports/',
    //   icon: <SiGoogleforms size={'40px'} />,
    //   sideIcon: <SiGoogleforms size={'30px'} />,
    //   createLink: '/dashboard/feedback-reports/send',
    // },
    {
      name: 'My Profile',
      permission: 'profile',
      viewLabel: 'Manage Profile',
      viewLink: `/dashboard/user-profile/${user?.id}`,
      icon: <PiUserCircleGearDuotone size={'20px'} />,
      sideIcon: <PiUserCircleGearDuotone size={'30px'} />,
    },
    {
      name: 'Notification',
      permission: 'profile',
      viewLabel: 'Notification',
      viewLink: `/dashboard/notifications`,
      icon: <PiBellSimpleDuotone size={'20px'} />,
      sideIcon: <PiBellSimpleDuotone size={'30px'} />,
    },
  ];

  const menuItems = [
    {
      name: 'My Profile',
      permission: 'manage_profile',
      viewLabel: 'Manage Profile',
      viewLink: `/dashboard/user-profile/${user?.id}`,
      icon: <PiUserCircleGearDuotone size={'20px'} />,
      sideIcon: <PiUserCircleGearDuotone size={'30px'} />,
    },
    {
      name: 'Notification',
      permission: 'receive_notifications',
      viewLabel: 'Notification',
      viewLink: `/dashboard/notifications`,
      icon: <PiBellSimpleDuotone size={'20px'} />,
      sideIcon: <PiBellSimpleDuotone size={'30px'} />,
    },
  ]

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
      <div className="flex h-full min-h-screen bg-background text-foreground">
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
          <div className="flex items-center justify-between p-1 bg-gray-800 w-full overflow-x-hidden white-space-nowrap">
            <div className="flex justify-center items-center">
              <Image
                className="w-[100px] h-[75px]"
                src={istLogo}
                alt="ist_logo"
                width={150}
                height={150}
              />
            </div>
            <button
              className="text-white focus:outline-none m-3"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes size={20} />
            </button>
          </div>


          <nav className="p-4">
            <div className="max-h-[calc(100vh-4rem)] overflow-y-auto overflow-scroll">  {/* Allows vertical scroll */}
              <ul className="space-y-2">
                {tabs.map((tab) => (
                  user.permissions.includes(tab.permission) && (
                    <li key={tab.name}>
                      <button
                        onClick={() => handleTabChange(tab.name, 'view')}
                        className={`flex items-center w-full p-2 rounded hover:bg-gray-700 ${activeTab === tab.name ? 'bg-gray-700' : ''} transition-colors`}
                      >
                        <span>{tab.sideIcon}</span>
                        <span className="ml-2">{tab.name}</span>
                      </button>
                    </li>
                  )
                ))}
                {menuItems.map((tab) => (
                  user.permissions.includes(tab.permission) && (
                    <li key={tab.name}>
                      <button
                        onClick={() => handleTabChange(tab.name, 'view')}
                        className={`flex items-center w-full p-2 rounded hover:bg-gray-700 ${activeTab === tab.name ? 'bg-gray-700' : ''} transition-colors`}
                      >
                        <span>{tab.sideIcon}</span>
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
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          {/* Header */}
          <header className="flex items-center justify-between bg-gray-800 text-white p-4 lg:hidden">
            <div className="mb-1 d flex justify-center items-center">
              <Image
                className="w-[100px] h-[75px]"
                src={istLogo}
                alt="ist_logo"
                width={100}
                height={100}
              />
            </div>
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
                        <div className="flex flex-col items-center">
                          <span className='m-1'>{tab.icon}</span>
                          <span className='m-1'>{tab.name}</span>
                        </div>

                      </button>
                    </div>
                  </li>
                )
              ))}
              <li>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex flex-col items-center p-2 rounded hover:bg-gray-700 transition-colors"
                >
                  <span><PiUserCircleDuotone size={40} /></span>
                  <span className="ml-2">My Profile</span>
                </button>
                {menuOpen && (
                  <div className="absolute z-10 mt-2 right-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 m-4">
                    <div
                      className="py-1 flex flex-col justify-around" // Add flex-row for horizontal layout
                      role="menu"
                      aria-labelledby="options-menu"
                    >
                      <label
                        className={`flex flex-row items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer`}
                      >
                        <div className="flex items-center">
                          <span className="m-1"><RiUserLine size={20} /></span>
                          <span className="m-1">{loggedInUser}</span>
                        </div>
                      </label>
                      {menuItems.map((options) => (
                        user.permissions.includes(options.permission) && (
                        <label
                          onClick={() => { handleTabChange(options.name, 'view'); setMenuOpen(!menuOpen) }}
                          key={options.name}
                          className={`flex flex-row items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer`}
                        >
                          <div className="flex items-center">
                            <span className="m-1">{options.icon}</span>
                            <span className="m-1">{options.name}</span>
                          </div>
                        </label>
                        )
                      ))}
                      <label
                        onClick={() => { handleLogout(); setMenuOpen(!menuOpen) }}
                        className="flex flex-row items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="flex items-center">
                          <span className="m-1">
                            <FaPowerOff size={20} />
                          </span>
                          <span className="m-1">Logout</span>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
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
          <main className="flex-grow p-2 bg-background text-foreground">
            {currentView === 'view' && (
              <div>
                {activeTab === 'Dashboard' && (
                  <div>
                    {analysis}
                  </div>
                )}
                {activeTab === 'Dashboard' && (
                  <div>
                    {overview}
                  </div>
                )}


                {activeTab === 'Dashboard' && (
                  <div>
                    {analytics}
                  </div>
                )}
                {activeTab === 'Dashboard' && (
                  <div>
                    {recentactivities}
                  </div>
                )}
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