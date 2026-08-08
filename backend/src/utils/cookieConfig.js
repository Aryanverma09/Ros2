export const COOKIE_NAME = "ROBOT_DASHBOARD_AUTH";
export const COOKIE_OPTIONS = {
    httpOnly:true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 2 * 60 * 60 * 1000, // 2 hours
}