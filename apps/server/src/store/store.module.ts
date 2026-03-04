import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { ResponsesService } from './responses.service';

@Module({
  providers: [FormsService, ResponsesService],
  exports: [FormsService, ResponsesService],
})
export class StoreModule { }
