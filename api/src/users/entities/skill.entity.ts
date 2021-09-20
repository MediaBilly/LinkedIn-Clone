import { JobAlert } from "src/jobs/entities/job-alert.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Skill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => User, user => user.skills)
    users: User[];

    @ManyToMany(() => JobAlert, jobAlert => jobAlert.requiredSkills)
    jobAlerts: User[];
}