import { NextResponse } from "next/server";
import api from "../../../../lib/axios";

// TypeScript interfaces
interface Course {
  id: number;
  courseName: string;
}

interface Role {
  id: number;
  roleName: string;
}

interface Permission{
  id: number;
  permissionName: string;
  createdAt: string;
  updatedAt: string;
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
  totalRoles: number;
  totalPermissions: number;
  courses: Course[];
  intakes: Intake[];
  modules: Module[];
  classTimes: ClassTime[];
  roles: Role[];
  permissions: Permission[];
}

export async function GET() {
  try {
    // Fetch all data in parallel
    const [
      coursesResponse,
      intakesResponse,
      modulesResponse,
      classTimesResponse,
      rolesResponse,
      permissionsResponse
    ] = await Promise.all([
      api.get<{ course: Course[] }>("/courses"),
      api.get<{ intake: Intake[] }>("/intakes"),
      api.get<Module[]>("/modules"),
      api.get<{ classTime: ClassTime[] }>("/class-times"),
      api.get<Role[] >("/roles"),
      api.get< Permission[] >("/permissions"),
    ]);

    // Compute counts and structure the response
    const response: DashboardResponse = {
      totalCourses: coursesResponse.data.course.length,
      totalIntakes: intakesResponse.data.intake.length,
      totalModules: modulesResponse.data.length,
      totalClassTimes: classTimesResponse.data.classTime.length,
      totalRoles: rolesResponse.data.length,
      totalPermissions: permissionsResponse.data.length,
      courses: coursesResponse.data.course,
      intakes: intakesResponse.data.intake,
      modules: modulesResponse.data,
      classTimes: classTimesResponse.data.classTime,
      roles: rolesResponse.data,
      permissions: permissionsResponse.data,
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
