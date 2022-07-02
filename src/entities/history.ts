import { OneToOne, OneToMany, Entity, JoinColumn, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"
import { Review } from "./Review"
import { User } from "./User"

@Entity()
export class History extends BaseEntity {
    @PrimaryGeneratedColumn({comment: "히스토리Id"})
    id!: number

    @Column({type: "uuid", comment: "리뷰Id"})
    reviewId!: string

    // @OneToOne(type => Review, review => review.id)
    // review!: Review

    @Column({type: "uuid", comment: "사용자Id"})
    userId!: string

    // @OneToOne(type => User, user => user.id)
    // user!: User

    @Column({type: "varchar", length: 3, comment: "내역"})
    action!: string

    @Column({type: "datetime", comment: "시간"})
    time!: Date
}
