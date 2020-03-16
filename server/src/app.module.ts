import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose'
import { CovidModule } from './covid/covid.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/covid19'),
    CovidModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
