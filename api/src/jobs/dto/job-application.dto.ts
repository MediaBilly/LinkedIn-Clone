import { IsOptional, IsString } from "class-validator";

export class JobApplicationDto {
    @IsOptional()
    @IsString()
    coverLetter: string;
}