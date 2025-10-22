import { QueryRunner, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MyUser } from "./my-user.entity";
import { MainDbService } from "../../MainDbService";

@Injectable()
export class MyUserRepository {
  constructor(
        private mainDbService: MainDbService
  ) {}

  public async getByEmail(email: string): Promise<MyUser | null> {
    return this.getRepository().findOne({ where: { email } });
  }

    private getRepository(queryRunner?: QueryRunner): Repository<MyUser> {
      return (queryRunner?.manager ?? this.mainDbService.connection()).getRepository(MyUser);
    }
}
