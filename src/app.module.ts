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

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: 'vatsal9999.vm@gmail.com',
          pass: 'qnrn bmat rixw mypt',
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@example.com>',
      },
      template: {
        dir: join(__dirname, '..', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: false,
        },
      },
    }),
    MongooseModule.forRoot(
      'mongodb+srv://farmer-nest:123456Farmer@atlascluster.8nmj5fd.mongodb.net/farmer?retryWrites=true&w=majority&appName=AtlasCluster',
    ),
    AuthModule,
    UserModule,
    ProductModule,
    FarmerModule,
    CustomerModule,
    ExpenseMasterModule,
  ],
})
export class AppModule {}
