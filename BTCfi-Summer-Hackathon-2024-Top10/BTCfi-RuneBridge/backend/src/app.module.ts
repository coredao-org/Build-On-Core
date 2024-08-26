import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndexerModule } from './indexer/indexer.module';
import { ConfigModule } from '@nestjs/config';
import { BridgeModule } from './bridge/bridge.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { RelayerModule } from './relayer/relayer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      ssl: true,
      synchronize: true,
      logging: false,
    }),
    IndexerModule,
    BridgeModule,
    RelayerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
