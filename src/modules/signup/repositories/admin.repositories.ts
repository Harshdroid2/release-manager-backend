import {
  QueryRunner,
  Repository,
} from "typeorm";
import { Injectable } from "@nestjs/common";
import { MainDbService } from "src/db/release_manager/mainDbService";
import { User } from "src/db/release_manager/entity";
import { Admin } from "src/db/release_manager/entity/admin/admin.entity";

@Injectable()
export class AdminRepository {
  constructor(
    private mainDbService: MainDbService
  ) {}

  public async getByEmail(email: string): Promise<User | null> {
    return this.getRepository().findOne({ where: { email } });
  }

  public async create(dto: Partial<Admin>): Promise<void> {
    await this.getRepository().save(dto)
  }


  private getRepository(queryRunner?: QueryRunner): Repository<User> {
    return (queryRunner?.manager ?? this.mainDbService.connection()).getRepository(User);
  }
}