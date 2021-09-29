import { JobAlert } from "./job-alert.model";
import { User } from "./user.model";

export interface JobApplication {
    id: number;
    created_at: Date;
    jobAlert: JobAlert;
    applicant: User;
    coverLetter: string;
}