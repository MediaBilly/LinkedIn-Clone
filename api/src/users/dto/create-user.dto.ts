import { IsAlpha, IsEmail, IsPhoneNumber, IsString } from "class-validator";

export class CreateUserDto {
    @IsAlpha()
    firstname: string;

    @IsAlpha()
    lastname: string;

    @IsEmail()
    email: string;

    @IsPhoneNumber()
    phone: string;
    
    @IsString()
    password: string;
}