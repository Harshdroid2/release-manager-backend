import {
  Entity,
  Column,
  Unique,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { MyBaseEntity } from '../base/my-base.entity';

@Entity({ name: 'Release', schema: "tran" })
@Unique(['version'])
export class Release extends MyBaseEntity{

  @Column({ type: 'varchar', name: 'Version' })
  version: string;

  @Column({ type: 'varchar', name: 'Repo', default: true })
  repo: string;

  @Column({ type: 'boolean', name: 'IsApproved', default: true })
  isApproved: boolean;

  @Column({ type: 'boolean', name: 'IsRunning', default: true })
  isRunning: boolean;

  @Column({ type: 'boolean', name: 'IsCompleted', default: true })
  isCompleted: boolean;
  
  @Column({ type: 'numeric', name: 'MergedByUserId', default: false })
  mergedByUserId: number;


    constructor(
      version: string,
      isApproved: boolean,
      isRunning: boolean,
      isCompleted: boolean,
      mergedByUserId: number,
      repo: string
    ){
      super();
      this.version = version;
      this.isApproved = isApproved;
      this.isRunning = isRunning;
      this.isCompleted = isCompleted;
      this.mergedByUserId = mergedByUserId;
      this.repo = repo
    }
}

export class ReleaseDto extends Release{
  constructor({
    version,
    isApproved,
    isRunning,
    isCompleted,
    mergedByUserId,
    repo
  }:{
    version: string,
    isApproved: boolean,
    isRunning: boolean,
    isCompleted: boolean,
    mergedByUserId: number,
    repo: string
  }) {
    super(
        version,
        isApproved,
        isRunning,
        isCompleted,
        mergedByUserId,
        repo
    );
  }
}
