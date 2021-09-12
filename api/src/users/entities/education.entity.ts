import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Education {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.educations, { onDelete: 'CASCADE' })
    user: User;

    @Column()
    school: string;

    @Column({ nullable: true })
    degree: string;

    @Column({ nullable: true })
    fieldOfStudy: string;

    @Column({ type: 'date', nullable: true })
    startDate: string;

    @Column({ type: 'date', nullable: true })
    endDate: string;

    @Column({ nullable: true })
    grade: string;

    @Column({ nullable: true })
    activitiesAndSocieties: string;

    @Column({ nullable: true })
    description: string;
}