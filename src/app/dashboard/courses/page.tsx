"use client";

import React, { useEffect, useState } from 'react';
import api from '../../../../lib/axios'; // Adjust this path to your axios setup
import { Course } from '@/types'; // Adjust this path to your User type definition
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import { useUser } from '@/context/UserContext';
import 'react-toastify/dist/ReactToastify.css';
import Table from '@/components/Tables';
import Loading from '../loading';  // Import the Loading component
import { showToast } from '@/components/ToastMessage';


const CourseManagement: React.FC = () => {
  const { user } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // State to handle delete confirmation
  const [filteredCourse, setFilteredCourse] = useState<Course[]>([]);  // Holds the filtered users
  const [search, setSearch] = useState<string>('');
  const router = useRouter();

  // Fetch course from your API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses', {
          method: 'GET',
        });
        console.log(response);
        setCourses(response.data.course);
        setFilteredCourse(response.data.course);
      } catch (err) {
        console.log(err)
        showToast.error('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle course deletion
  const handleDelete = async (confirmDelete: Course) => {
    if (confirmDelete) {
      try {
        await api.delete(`/courses/${confirmDelete.id}`);
        setCourses(courses.filter(course => course.id !== confirmDelete.id));
        setFilteredCourse(filteredCourse.filter(filteredCourse => filteredCourse.id !== confirmDelete.id));
        showToast.success('course deleted successfully');
      } catch (err) {
        console.log(err)
        showToast.error('Failed to delete course');
      }
    }
  };

  const handleSearch = (value: string) => {
    console.log(search)
    setSearch(value);

    // Filter the course based on the search query
    if (value.trim() === '') {
      setFilteredCourse(courses);  // Show all if search is empty
    } else {
      const filtered = courses.filter(course =>
        course.courseName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCourse(filtered);
    }
  };

  // Handle course editing
  const handleEdit = (course: Course) => {
    showToast.info('Redirecting to edit course...');
    router.push(`/dashboard/courses/edit/${course.id}`);
  };

  if (loading) return <Loading />;

  const columns = [
    { header: 'courseName', accessor: 'courseName' },
  ];

  return (
    <div>
      <ToastContainer /> {/* Include ToastContainer for rendering toasts */}
      {filteredCourse.length === 0 ? (
        <div className="text-center p-4">
          <p>No courses available at the moment.</p>
        </div>
      ) : (
        <Table<Course>
          columns={columns}
          data={filteredCourse}
          onSearch={handleSearch}
          onEdit={user && user.permissions.includes('update_courses') ? handleEdit : undefined}
          onDelete={user && user.permissions.includes('delete_courses') ? handleDelete : undefined}
        />
      )}
    </div>
  );
};

export default CourseManagement;
