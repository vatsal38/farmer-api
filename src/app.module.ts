import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { FarmerModule } from './farmer/farmer.module';
import { CustomerModule } from './customer/customer.module';
import { ExpenseMasterModule } from './expense-master/expense-master.module';
import { UploadController } from './upload-image/upload.controller';
import { HttpModule } from '@nestjs/axios';
import { FirebaseService } from './common/firebase.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TasksModule } from './task/tasks.module';
import { GlobalMasterModule } from './global-master/global-master.module';
import { AppController } from './app.controller';
import { BankModule } from './bank/bank.module';
import { SalesModule } from './sales-bill/sales.module';
const ENV: string = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [ENV === 'production' ? '.env.prod' : `.env`],
      expandVariables: true,
    }),
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get<string>('MAIL_HOST'),
            port: configService.get<number>('MAIL_PORT'),
            auth: {
              user: configService.get<string>('MAIL_USER'),
              pass: configService.get<string>('MAIL_PASS'),
            },
          },
          defaults: {
            from: configService.get<string>('MAIL_FROM'),
          },
          template: {
            dir: join(__dirname, '..', 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: false,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongoURI = configService.get('MONGO_URI');
        const database = configService.get('DB_MONGO_DATABASE');

        return {
          uri: mongoURI,
          dbName: database,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    ProductModule,
    FarmerModule,
    CustomerModule,
    ExpenseMasterModule,
    HttpModule,
    TasksModule,
    GlobalMasterModule,
    BankModule,
    SalesModule,
  ],
  controllers: [UploadController, AppController],
  providers: [FirebaseService, AppService],
})
export class AppModule {}
