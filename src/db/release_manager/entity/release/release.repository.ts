import {
  QueryRunner,
  Repository,
} from "typeorm";
import { Injectable } from "@nestjs/common";
import { MainDbService } from "../../MainDbService";
import { Release, ReleaseDto } from "./release.entity";

@Injectable()
export class ReleaseRepository {
  constructor(
    private mainDbService: MainDbService
  ) {}

  public async create(releaseDto: ReleaseDto): Promise<Release> {
    return this.getRepository().save(releaseDto);
  }


  public getRepository(queryRunner?: QueryRunner): Repository<Release> {
    return (queryRunner?.manager ?? this.mainDbService.connection()).getRepository(Release);
  }
}