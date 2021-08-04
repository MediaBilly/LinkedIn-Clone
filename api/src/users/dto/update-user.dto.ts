import { IsAlpha, IsEmail, IsPhoneNumber } from "class-validator";

export class UpdateUserDto {
    @IsAlpha()
    firstname: string;

    @IsAlpha()
    lastname: string;

    @IsEmail()
    email: string;

    @IsPhoneNumber()
    phone: string;
}