import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  apiKey: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  role: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
