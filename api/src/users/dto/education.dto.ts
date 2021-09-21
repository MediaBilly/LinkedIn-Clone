import { IsDateString, IsOptional, IsString } from "class-validator";

export class EducationDto {
    @IsString()
    school: string;

    @IsOptional()
    @IsString()
    degree: string;

    @IsOptional()
    @IsString()
    fieldOfStudy: string;

    @IsOptional()
    @IsDateString()
    startDate: Date;

    @IsOptional()
    @IsDateString()
    endDate: Date;

    @IsOptional()
    @IsString()
    grade: string;

    @IsOptional()
    @IsString()
    description: string;
}