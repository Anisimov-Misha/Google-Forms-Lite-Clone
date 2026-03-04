import { Module } from '@nestjs/common';
import { StoreModule } from '../store/store.module';
import { FormsResolver } from './forms.resolver';
import { ResponsesResolver } from './responses.resolver';

@Module({
  imports: [StoreModule],
  providers: [FormsResolver, ResponsesResolver],
})
export class ResolversModule { }
