import { IsAlpha, IsEmail, IsPhoneNumber, IsString } from "class-validator";

export class UpdateUserDto {
    @IsAlpha()
    firstname: string;

    @IsAlpha()
    lastname: string;

    @IsEmail()
    email: string;

    @IsString()
    phone: string;
}