import { UserRole } from "src/constants/userRoles";

export interface SignupDto {
    email: string, firstName: string, lastName: string, role : UserRole, githubAccessToken: string, githubUsername: string,
    name: string
}