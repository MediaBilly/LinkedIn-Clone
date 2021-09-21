import { EmploymentType } from "src/enums/employment-type.enum";
import { Company } from "src/jobs/entities/company.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Experience {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.experiences, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
    user: User;

    @Column()
    title: string;

    @Column({
        type: 'enum',
        enum: EmploymentType,
        default: EmploymentType.FULL_TIME,
        nullable: true
    })
    employmentType: EmploymentType;

    @ManyToOne(() => Company, company => company.userExperiences, { eager: true })
    company: Company;

    @Column()
    location: string;

    @Column({ type: 'timestamp' })
    startDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    endDate: Date;

    @Column({ nullable: true })
    description: string;

}