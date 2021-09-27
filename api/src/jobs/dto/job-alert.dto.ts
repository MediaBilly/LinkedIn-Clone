import { IsEnum, IsInt, IsString, MinLength } from "class-validator";
import { EmploymentType } from "src/enums/employment-type.enum";

export class JobAlertDto {
    @IsInt()
    companyId: number;

    @IsString()
    title: string;
    
    @IsString()
    description: string;

    @IsEnum(EmploymentType)
    type: EmploymentType;

    @MinLength(1, {
        each: true
    })
    requiredSkills: string[];
}