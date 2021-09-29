import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { JobAlert } from "./job-alert.entity";

@Entity()
export class JobApplication {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => JobAlert, jobAlert => jobAlert.applications, { eager: true, onDelete: 'CASCADE' })
    jobAlert: JobAlert;

    @ManyToOne(() => User, user => user.jobApplications, { onDelete: 'CASCADE', eager: true })
    applicant: User;

    @Column({ nullable: true })
    coverLetter: string;
}