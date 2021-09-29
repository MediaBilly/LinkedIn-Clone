import { EmploymentType } from "../enums/employment-type.enum";
import { Company } from "./company.model";
import { JobApplication } from "./job-application.model";
import { Skill } from "./skill.model";
import { User } from "./user.model";

export interface JobAlert {
    id: number;
    creator: User;
    company: Company;
    created_at: Date;
    title: string;
    location: string;
    description: string;
    type: EmploymentType;
    requiredSkills: Skill[];
    applications: JobApplication[];
}