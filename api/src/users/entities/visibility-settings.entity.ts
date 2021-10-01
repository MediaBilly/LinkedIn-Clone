import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class VisibilitySettings {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'boolean', default: true})
    experienceVisible: boolean;

    @Column({type: 'boolean', default: true})
    educationVisible: boolean;

    @Column({type: 'boolean', default: true})
    skillsVisible: boolean;

    @OneToOne(() => User, user => user.visibilitySettings, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;
}