import { IsDate, IsNumber, IsString } from 'class-validator';
import { DateTime } from 'luxon';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserSessionEntity } from './user_session.entity';

@Entity('users')
export class UserEntity {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id?: number;

  @IsString()
  @Column({ name: 'email', length: 100, unique: true })
  email?: string;

  @IsString()
  @Column({ name: 'password', length: 100, unique: true })
  password?: string;

  @IsDate()
  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt?: DateTime | Date;

  @IsDate()
  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt?: DateTime | Date;

  @AfterLoad()
  afterLoad() {
    this.id = this.id ? +this.id : undefined;
    this.createdAt = DateTime.fromJSDate(<Date>this.createdAt);
    this.updatedAt = DateTime.fromJSDate(<Date>this.updatedAt);
  }

  @BeforeInsert()
  autogeneratedInsertData() {
    this.createdAt = DateTime.now().toJSDate();
  }

  @BeforeUpdate()
  autogeneratedUpdateData1() {
    this.createdAt = (this.createdAt as DateTime).toJSDate();
  }

  @BeforeUpdate()
  autogeneratedUpdateData2() {
    this.updatedAt = DateTime.now().toJSDate();
  }

  @OneToMany(
    () => UserSessionEntity,
    (userSessionEntity: UserSessionEntity) => userSessionEntity.user,
  )
  sessions?: UserSessionEntity[];
}
