import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../common/user-role.enum';

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

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
