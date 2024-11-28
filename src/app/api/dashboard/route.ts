import { NextResponse } from "next/server";
import api from "../../../../lib/axios";

// TypeScript interfaces
interface Course {
  id: number;
  courseName: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  username: string;
  role: {
    id: number;
    roleName: string;
  };
}

interface Intake {
  id: number;
  intakeName: string;
  intakeYear: string;
  createdAt: string;
  updatedAt: string;
}

interface Module {
  id: number;
  moduleName: string;
  createdAt: string;
  updatedAt: string;
}

interface ClassTime {
  id: number;
  classTime: string;
  classTimeStart: string;
  classTimeEnd: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardResponse {
  totalCourses: number;
  totalIntakes: number;
  totalModules: number;
  totalClassTimes: number;
  totalUsers: number;
  courses: Course[];
  intakes: Intake[];
  modules: Module[];
  classTimes: ClassTime[];
  users: User[];
}

export async function GET() {
  try {
    // Fetch all data in parallel
    const [
      coursesResponse,
      intakesResponse,
      modulesResponse,
      classTimesResponse,
      usersResponse,
    ] = await Promise.all([
      api.get<{ course: Course[] }>("/courses"),
      api.get<{ intake: Intake[] }>("/intakes"),
      api.get<Module[]>("/modules"),
      api.get<{ classTime: ClassTime[] }>("/class-times"),
      api.get<{ users: User[] }>("/users"),
    ]);

    const users = usersResponse.data?.users || [];

    // Compute counts and structure the response
    const response: DashboardResponse = {
      totalCourses: coursesResponse.data.course.length,
      totalIntakes: intakesResponse.data.intake.length,
      totalModules: modulesResponse.data.length,
      totalClassTimes: classTimesResponse.data.classTime.length,
      totalUsers: users.length,
      courses: coursesResponse.data.course,
      intakes: intakesResponse.data.intake,
      modules: modulesResponse.data,
      classTimes: classTimesResponse.data.classTime,
      users,
    };

    // Return the structured response
    return NextResponse.json(response);
  } catch (error) {
    // Handle errors gracefully
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error fetching data", error: errorMessage },
      { status: 500 }
    );
  }
}
