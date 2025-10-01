import {
  Entity,
  Column,
  Unique,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Profile } from '../profiles/profiles.entity';
import { UserRole } from '../../../../constants/userRoles';
import { MyBaseEntity } from '../base/my-base.entity';

@Entity({ name: 'users' })
@Unique(['email'])
export class User extends MyBaseEntity{

  @Column({ type: 'text', name: 'Email' })
  email: string;

  @Column({ type: 'text', name: 'GithubUsername', nullable: true })
  githubUsername?: string;

  @Column({ type: 'text', name: 'GithubAccessToken', nullable: true })
  githubAccessToken?: string;

  @Column({ 
    type: 'enum', 
    enum: UserRole, 
    default: UserRole.DEV,
    name: 'Role'
  })
  role: UserRole;

  @Column({ type: 'boolean', name: 'IsActive', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', name: 'IsVerified', default: false })
  isVerified: boolean;

  @Column({ type: 'text', name: 'Password', nullable: true })
  password?: string;

  @Column({ type: 'timestamptz', name: 'LastLogin', nullable: true })
  lastLogin?: Date;

  @OneToOne(() => Profile, profile => profile.userId)
  @JoinColumn({ name: 'id', referencedColumnName: 'userId' })
  profile?: Profile;
}
