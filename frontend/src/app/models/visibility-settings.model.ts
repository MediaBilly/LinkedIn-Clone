import { User } from "./user.model";

export interface VisibilitySettings {
    id: number;
    user: User;
    experienceVisible: boolean;
    educationVisible: boolean;
    skillsVisible: boolean;
}