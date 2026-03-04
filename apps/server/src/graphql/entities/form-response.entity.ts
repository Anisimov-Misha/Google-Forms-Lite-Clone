import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Answer } from './answer.entity';

@ObjectType()
export class FormResponse {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  formId!: string;

  @Field(() => [Answer])
  answers!: Answer[];

  @Field()

  submittedAt!: string;
}
