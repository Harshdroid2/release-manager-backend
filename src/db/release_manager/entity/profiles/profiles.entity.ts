import {
    Entity, PrimaryGeneratedColumn, Column, Unique,
    CreateDateColumn, UpdateDateColumn
  } from 'typeorm';
  
  @Entity({ name: 'profiles' })
  @Unique(['userId'])
  export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
  @Column({ type: 'bigint', name: 'user_id' })
  userId: number;
  
    @Column({ type: 'text' })
    email: string;
  
    @Column({ type: 'text', name: 'first_name', nullable: true })
    firstName?: string;
  
    @Column({ type: 'text', name: 'last_name', nullable: true })
    lastName?: string;
  
    @Column({ type: 'text', name: 'avatar_url', nullable: true })
    avatarUrl?: string;
  
    @Column({ type: 'boolean', name: 'is_approved', default: false })
    isApproved: boolean;
  
    @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
    updatedAt: Date;
  }
  