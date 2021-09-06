export enum UserRole {
    ADMIN = 'a',
    PROFESSIONAL = 'p'
}

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    role: UserRole;
    profilePicName: string;
}