import { IsString } from "class-validator";

export class JobApplicationDto {
    @IsString()
    coverLetter: string;
}