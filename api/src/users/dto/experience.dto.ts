import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { EmploymentType } from "src/enums/employment-type.enum";

export class ExperienceDto {
    @IsString()
    title: string;

    @IsString()
    company: string;

    @IsOptional()
    @IsEnum(EmploymentType)
    employmentType: EmploymentType;

    @IsOptional()
    @IsString()
    location: string;

    @IsOptional()
    @IsDateString()
    startDate: Date;

    @IsOptional()
    @IsDateString()
    endDate: Date;

    @IsOptional()
    @IsString()
    description: string;
}