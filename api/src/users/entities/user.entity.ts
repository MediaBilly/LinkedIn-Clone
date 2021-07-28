import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    ADMIN = 'admin',
    PROFESSIONAL = 'professional'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column({unique: true})
    email: string;

    @Column()
    phone: string;

    @Column({select: false})
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.PROFESSIONAL
    })
    role: UserRole;
}