import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class MyBaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "Id" })
  id?: number;

  @CreateDateColumn({
    type: "timestamptz",
    default: (): string => "CURRENT_TIMESTAMP(6)",
    name: "CreatedAt",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: "UpdatedAt",
    type: "timestamptz",
    default: (): string => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updatedAt!: Date;
}