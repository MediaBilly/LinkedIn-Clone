import { Experience } from "src/users/entities/experience.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { JobAlert } from "../../jobs/entities/job-alert.entity";

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