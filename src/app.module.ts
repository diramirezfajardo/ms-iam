import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule, I18nJsonParser } from 'nestjs-i18n';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './http/endpoints/users/users.module';
import baseConfig from './config/env/base-config';
import configValidation from './config/env/config-validation';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [baseConfig],
      validationSchema: configValidation,
    }),
    TypeOrmModule.forRoot(),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get<string>('APP_LANG') as string,
        parserOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: configService.get<string>('APP_LANG_WATCH'),
        },
      }),
      parser: I18nJsonParser,
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
