import { OneToMany, Entity, Column,  JoinColumn, PrimaryGeneratedColumn, BaseEntity } from "typeorm"
import { Files } from "./Files"

@Entity()
export class Review extends BaseEntity {
    @PrimaryGeneratedColumn("uuid", {comment: "리뷰ID"})
    id!: string

    @Column({type: "varchar", length: 45, comment: "내용"})
    content!: string

    // @JoinColumn()
    @Column({type: "uuid", comment: "작성자"})
    userId!: string

    @OneToMany(type => Files, file => file.reviewId)
    files!: Files[]
}
