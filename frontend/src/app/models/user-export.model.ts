import { Education } from "./education.model";
import { Experience } from "./experience.model";
import { Skill } from "./skill.model";
import { User } from "./user.model";

export enum UserRole {
    Admin = 'a',
    Professional = 'p'
}

export interface UserExport {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    role: UserRole;
    profilePicName: string;
    skills: Skill[];
    educations: Education[];
    experiences: Experience[];
    connections: User[];
}