import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { DateTime } from 'luxon';

export class addUsersTable1681167938954 implements MigrationInterface {
  private readonly tableName = 'users';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            unsigned: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '50',
            isNullable: false,
            isUnique: false,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );
    await this.addExampleUsers(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }

  private async addExampleUsers(queryRunner: QueryRunner): Promise<void> {
    this.insetRow(
      queryRunner,
      'diego.drf4@gmail.com',
      '123456',
      DateTime.now().toISO() as string,
    );

    this.insetRow(
      queryRunner,
      'diego.ramirez@ce.ucn.cl',
      '123456',
      DateTime.now().toISO() as string,
    );
  }

  private async insetRow(
    queryRunner: QueryRunner,
    email: string,
    password: string,
    createdAt: string,
  ) {
    await queryRunner.query(
      `INSERT INTO ${this.tableName} 
      (email, password, created_at) 
      VALUES 
      ('${email}', '${password}', '${createdAt}');`,
    );
  }
}
