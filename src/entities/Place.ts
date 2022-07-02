import { BaseEntity, OneToMany, Entity, JoinColumn, PrimaryGeneratedColumn, Column } from "typeorm"
import { Review } from "./Review"

@Entity()
export class Place extends BaseEntity {
    @PrimaryGeneratedColumn("uuid", {comment: "장소ID"})
    id!: string

    @Column({type: "uuid", comment: "리뷰Id"})
    reviewId!: string

    @OneToMany(type => Review, review => review.id)
    reviews!: Review[]
}
