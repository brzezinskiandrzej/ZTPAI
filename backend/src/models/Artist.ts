import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("artists")
export class Artist {
  @PrimaryGeneratedColumn()
  artist_id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  bio?: string;
}
