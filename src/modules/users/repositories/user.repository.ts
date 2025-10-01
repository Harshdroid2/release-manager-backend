import {
  QueryRunner,
  Repository,
} from "typeorm";
import { Injectable } from "@nestjs/common";
import { MainDbService } from "src/db/release_manager/mainDbService";
import { User } from "src/db/release_manager/entity";

@Injectable()
export class UserRepository {
  constructor(
    private mainDbService: MainDbService
  ) {}

  public async getByEmail(email: string): Promise<User | null> {
    return this.getRepository().findOne({ where: { email } });
  }


  private getRepository(queryRunner?: QueryRunner): Repository<User> {
    return (queryRunner?.manager ?? this.mainDbService.connection()).getRepository(User);
  }
}
