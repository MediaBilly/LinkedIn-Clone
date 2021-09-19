import { Education } from "./education.model";
import { Skill } from "./skill.model";

export enum UserRole {
    ADMIN = 'a',
    PROFESSIONAL = 'p'
}

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    role: UserRole;
    profilePicName: string;
    skills: Skill[];
    educations: Education[];
}