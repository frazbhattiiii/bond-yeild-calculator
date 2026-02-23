import { Module } from '@nestjs/common';
import { BondController } from '@/bond/bond.controller';
import { BondService } from '@/bond/bond.service';

@Module({
  controllers: [BondController],
  providers: [BondService],
})
export class BondModule {}
