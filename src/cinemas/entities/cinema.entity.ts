import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cinema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  picture: string;

  @Column()
  link: string;
}
