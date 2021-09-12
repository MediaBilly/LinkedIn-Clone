import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

export enum EmploymentType {
    FULL_TIME = 'ft',
    PART_TIME = 'pt',
    SELF_EMPLOYED = 'se',
    FREELANCE = 'fl',
    CONTRACT = 'co',
    INTERNSHIP = 'in',
    APPRENTICESHIP = 'ap',
    SEASONAL = 'sl'
}

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

    @Column()
    company: string; // Placeholder (will be a foreign key to another entity)

    @Column()
    location: string;

    @Column({ type: 'date' })
    startDate: string;

    @Column({ type: 'date', nullable: true })
    endDate: string;

    @Column({ nullable: true })
    description: string;

}