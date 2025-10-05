import { Controller, Get, Injectable } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
@Injectable()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/")
  ping(): string {
    return this.appService.getHello();
  }
}