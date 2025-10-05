import {
  QueryRunner,
  Repository,
} from "typeorm";
import { Injectable } from "@nestjs/common";
import { MainDbService } from "../../MainDbService";
import { User } from "src/db/release_manager/entity";
import { Admin, AdminDto } from "./admin.entity";

@Injectable()
export class AdminRepository {
  constructor(
    private mainDbService: MainDbService
  ) {}

  public async getByEmail(email: string): Promise<Admin | null> {
    return this.getRepository().findOne({ where: { email } });
  }

  public async create(adminDto: AdminDto): Promise<Admin> {
    return this.getRepository().save(adminDto);
  }


  private getRepository(queryRunner?: QueryRunner): Repository<Admin> {
    return (queryRunner?.manager ?? this.mainDbService.connection()).getRepository(Admin);
  }
}