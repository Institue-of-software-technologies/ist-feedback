import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    // Define route-specific permissions
    const permissionsMap: Record<string, string[]> = {
        '/dashboard/permissions': ['manage_permissions'],
        '/dashboard/roles': ['manage_roles'],
        '/dashboard/users': ['manage_users'],
        '/dashboard/feedback': ['manage_feedback'],
        '/dashboard/intakes': ['manage_intakes'],
        '/dashboard/modules': ['manage_modules'],
        '/dashboard/courses': ['manage_courses'],
        '/dashboard/class-times': ['manage_class_time'],
        '/dashboard/feedback-questions': ['manage_feedback_questions'],
        '/dashboard/notifications': ['receive_notifications'],
        '/dashboard/user-profile': ['manage_profile'],
    };

    // Get current path
    const pathname = req.nextUrl.pathname;

    // Match the path with defined permissions
    const requiredPermissions = permissionsMap[pathname as keyof typeof permissionsMap];
    if (!requiredPermissions) return NextResponse.next(); // Allow if no permissions are required for the route

    // Get user session from cookies (or however your session is stored)
    const session = req.cookies.get('next-auth.session-token');
    if (!session) return NextResponse.redirect(new URL('/login', req.url));

    // Parse the session to access permissions
    const userSession = JSON.parse(session.value);

    // Check if user has at least one required permission
    const hasPermission = requiredPermissions.some(permission =>
        userSession.permissions.includes(permission)
    );

    if (!hasPermission) {
        // Redirect to an error page or access denied page
        return NextResponse.redirect(new URL('/403', req.url));
    }

    return NextResponse.next(); // Allow access if permission is valid
}

export const config = {
    matcher: [
        '/dashboard/permissions',
        '/dashboard/roles',
        '/dashboard/users',
        '/dashboard/feedback',
        '/dashboard/modules',
        '/dashboard/courses',
        '/dashboard/notifications',
        '/dashboard/user-profile',
        '/dashboard/feedback-questions',
        '/dashboard/class-times',
        '/dashboard/intakes',
    ],
};
