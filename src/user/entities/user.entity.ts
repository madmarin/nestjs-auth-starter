import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities';

@Entity('users')
@Index(['email'], { unique: true, where: '"isActive" = true' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'email', type: 'varchar', length: 100, nullable: false })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ name: 'firstName', type: 'varchar', length: 50, nullable: false })
  firstName: string;

  @Column({ name: 'lastName', type: 'varchar', length: 50, nullable: false })
  lastName: string;

  @Column({ name: 'phone', type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;
}
