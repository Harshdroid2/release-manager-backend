import { QueryRunner, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { MainDbService } from "../../MainDbService";

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
