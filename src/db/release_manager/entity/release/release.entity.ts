import {
  Entity,
  Column,
  Unique
} from 'typeorm';
import { MyBaseEntity } from '../base/my-base.entity';

@Entity({ name: 'Release', schema: "tran" })
@Unique(['version'])
export class Release extends MyBaseEntity{

  @Column({ type: 'varchar', name: 'Version', nullable: false })
  version: string;

  @Column({ type: 'varchar', name: 'Repo', nullable: false })
  repo: string;

  @Column({ type: 'boolean', name: 'IsApproved', default: false })
  isApproved: boolean;

  @Column({ type: 'boolean', name: 'IsRunning', default: false })
  isRunning: boolean;

  @Column({ type: 'boolean', name: 'IsCompleted', default: false })
  isCompleted: boolean;
  
  @Column({ type: 'numeric', name: 'MergedByUserId', nullable: true})
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
