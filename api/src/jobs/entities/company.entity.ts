import { Experience } from "src/users/entities/experience.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { JobAlert } from "./job-alert.entity";

@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => JobAlert, jobAlert => jobAlert.company)
    jobAlerts: JobAlert[];

    @OneToMany(() => Experience, experience => experience.company)
    userExperiences: Experience[];
}