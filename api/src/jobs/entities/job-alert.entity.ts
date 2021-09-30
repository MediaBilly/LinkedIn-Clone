import { EmploymentType } from "src/enums/employment-type.enum";
import { Skill } from "src/users/entities/skill.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "../../companies/entities/company.entity";
import { JobApplication } from "./job-application.entity";

@Entity()
export class JobAlert {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.jobAlerts, { eager: true, onDelete: 'CASCADE' })
    creator: User;

    @ManyToOne(() => Company, company => company.jobAlerts, { eager: true, onDelete: 'CASCADE' })
    company: Company;

    @CreateDateColumn()
    created_at: Date;

    @Column()
    title: string;

    @Column()
    location: string;
    
    @Column()
    description: string;

    @Column({
        type: 'enum',
        enum: EmploymentType,
        default: EmploymentType.FULL_TIME
    })
    type: EmploymentType;

    @ManyToMany(() => Skill, skill => skill.jobAlerts, { eager: true })
    @JoinTable()
    requiredSkills: Skill[];

    @OneToMany(() => JobApplication, jobApplication => jobApplication.jobAlert)
    applications: JobApplication[];

    // Number of common skills with the request user. Calculated on queries and used to order the jobs to the user.
    commonSkills: number;
    
}