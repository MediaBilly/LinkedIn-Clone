import { IsBoolean } from "class-validator";

export class VisibilitySettingsDto {
    @IsBoolean()
    experienceVisible: boolean;

    @IsBoolean()
    educationVisible: boolean;

    @IsBoolean()
    skillsVisible: boolean;
}