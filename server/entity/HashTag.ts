import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from "typeorm";
import { Media } from "./Media";

@Entity()
export class HashTag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ default: false })
  isProcessing: boolean;

  @Column({ nullable: false })
  mediaCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(type => Media, media => media.hashtag)
  medias: Media[];
}
