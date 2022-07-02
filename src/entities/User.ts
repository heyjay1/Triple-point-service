import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn({comment: "사용자 Id"})
    id!: string

    @Column({type: "int", comment: "포인트"})
    point!: number
}
