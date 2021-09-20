import { EmploymentType } from "src/enums/employment-type.enum";
import { Company } from "src/jobs/entities/company.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Experience {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.experiences)
    user: User;

    @Column({
        type: 'enum',
        enum: EmploymentType,
        default: EmploymentType.FULL_TIME,
        nullable: true
    })
    employmentType: EmploymentType;

    @ManyToOne(() => Company, company => company.userExperiences)
    company: Company;

    @Column()
    location: string;

    @Column({ type: 'date' })
    startDate: string;

    @Column({ type: 'date', nullable: true })
    endDate: string;

    @Column({ nullable: true })
    description: string;

}