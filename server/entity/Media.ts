import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  ManyToOne
} from "typeorm";
import { HashTag } from "./HashTag";

@Entity()
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  mediaId: string;

  @Column({ nullable: true })
  commentCount: number;

  @Column({ nullable: true })
  likeCount: number;

  @Column({ nullable: true })
  caption: string;

  @Column({ nullable: true })
  code: string;

  @Column({})
  takenAt: Date;

  @ManyToOne(type => HashTag, hashtag => hashtag.medias,{onDelete:'CASCADE'})
  hashtag: HashTag;
}
