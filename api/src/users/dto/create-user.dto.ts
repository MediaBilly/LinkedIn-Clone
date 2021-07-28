import { IsAlpha, IsEmail, IsPhoneNumber } from "class-validator";

export class CreateUserDto {
    @IsAlpha()
    firstname: string;

    @IsAlpha()
    lastname: string;

    @IsEmail()
    email: string;

    @IsPhoneNumber()
    phone: string;
    
    password: string;
}