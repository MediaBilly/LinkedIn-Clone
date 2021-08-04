import { IsString } from "class-validator";

export class ChangePasswordAdminDto {
    @IsString()
    newPassword: string;
}