import { Module } from '@nestjs/common';
import { CovidController } from './covid.controller';
import { CovidService } from './covid.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CovidSchema } from '../database/covid.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Covid19', schema: CovidSchema}])],
  controllers: [CovidController],
  providers: [CovidService]
})
export class CovidModule {}
