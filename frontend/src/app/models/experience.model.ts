import { EmploymentType } from "../enums/employment-type.enum";
import { Company } from "./company.model";

export interface Experience {
    id: number;
    title: string;
    employmentType: EmploymentType;
    company: Company;
    location: string;
    startDate: Date;
    endDate: Date;
    description: string;
}