import {
  Entity,
  Column,
  Unique
} from 'typeorm';
import { UserRole } from '../../../../constants/userRoles';
import { MyBaseEntity } from '../base/my-base.entity';

@Entity({ name: 'CompanyAdmin', schema: "tran" })
@Unique(['email'])
export class Admin extends MyBaseEntity{

  @Column({ type: 'varchar', name: 'Email' })
  email: string;

  @Column({ type: 'varchar', name: 'Name', nullable: true })
  name: string | null;

  @Column({ type: 'varchar', name: 'Username' })
  username: string;

  @Column({ 
    type: 'enum', 
    enum: UserRole, 
    name: 'Role'
  })
  role: UserRole;

  @Column({ type: 'boolean', name: 'IsActive', default: true })
  isActive: boolean;

  constructor(
    email: string,
    name: string,
    username: string,
    role: UserRole,
    isActive: boolean
  ){
    super();
    this.email = email;
    this.name = name;
    this.username = username;
    this.role = role;
    this.isActive = isActive
  }
}

export class AdminDto extends Admin{
  constructor({
    email,
    name,
    username,
    role,
    isActive
  }:{
    email: string,
    name: string,
    username: string,
    role: UserRole,
    isActive: boolean
  }) {
    super(
      email,
      name,
      username,
      role,
      isActive
    );
  }
}
