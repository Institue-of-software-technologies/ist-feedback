import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { Course, TrainerCourses, User } from '@/db/models/index';
import { Role } from '@/db/models/Role';
// GET: Fetch user by ID
export async function GET(req: Request, { params }: { params: { userId: string } }) {
  
  try {
    const user = await User.findOne({
       where: { id: params.userId },
       include: [
        {
          model: Role,
          as: "roleUsers",
          attributes: ["id", "roleName"],
        },
        {
          model: TrainerCourses,
          as: "trainer_courses",
          include: [
            {
              model: Course,
              as: "course",
              attributes: ["id", "courseName",], 
            },
          ],
        },
      ],
      });
    if (!user) {
      return NextResponse.json({ message: 'User not found - *' }, { status: 404 });
    } 
    return NextResponse.json({user});
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching user', error }, { status: 500 });
  }
}

// PUT: Update user by ID
export async function PUT(req: Request, { params }: { params: { userId: string } }) {
  try {
    const body = await req.json();
    const { username, email, password, roleId, multiSelectField } = body;

    console.log("Request body:", body); // Debugging request body

    const user = await User.findByPk(params.userId);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const updatedUser = await user.update({
      username: username || user.username,
      email: email || user.email,
      password: password ? await bcrypt.hash(password, 10) : user.password,
      roleId: roleId || user.roleId,
    });

    // Handle multiSelectField
    if (multiSelectField && multiSelectField.length > 0) {
      try {
          // Assuming `userId` is the ID of the user you're updating (e.g., `3`)
          const userId = params.userId; // Replace with dynamic value as needed
  
          // Delete existing trainer courses for this user
          await TrainerCourses.destroy({
              where: { trainerId: userId }
          });
  
          // Insert new trainer courses based on the selected courses
          const trainerCourses = multiSelectField.map((courseId: number) => ({
              trainerId: userId,
              courseId: courseId
          }));
  
          // Insert the new records in bulk
          await TrainerCourses.bulkCreate(trainerCourses);
          console.log('Trainer courses updated successfully.');
      } catch (error) {
          console.error("Error updating trainer courses:", error);
          return NextResponse.json({ message: 'Error updating user', error }, { status: 500 });
      }
  } else {
      console.log('No courses selected.');
  }

    console.log("User successfully updated:", updatedUser);
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: 'Error updating user', error }, { status: 500 });
  }
}


// DELETE: Delete user by ID
export async function DELETE(req: Request, { params }: { params: { userId: string } }) {
  try {
    // Log the incoming userId
    console.log("Received userId for deletion:", params.userId);

    const user = await User.findByPk(params.userId);
    console.log("Backend delete user:", user); // Log the user object

    if (user) {
      await user.destroy();
      // Return a response without content
      return new Response(null, { status: 204 }); // Correctly return 204 No Content
    } else {
      console.log("User not found for id:", params.userId); // Log when user is not found
      return NextResponse.json({ message: 'User not found - backend' }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting user:", error); // Log the error object
    return NextResponse.json({ message: 'Error deleting user', error }, { status: 500 });
  }
}



