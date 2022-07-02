import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm"
import { Review } from "./Review"

@Entity()
export class Files extends BaseEntity {
    @PrimaryGeneratedColumn({comment: "파일 Index"})
    id!: number

    @Column({type: "uuid", comment: "리뷰Id"})
    reviewId!: string

    @OneToMany(type => Review, review => review.id)
    reviews!: Review[]

    @Column({type: "uuid", comment: "이미지 파일 id"})
    photoId!: string
}
