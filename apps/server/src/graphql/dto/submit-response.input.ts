import { Field, ID, InputType } from '@nestjs/graphql';
import { AnswerInput } from './answer.input';

@InputType()
export class SubmitResponseInput {
  @Field(() => ID)
  formId!: string;

  @Field(() => [AnswerInput], { nullable: 'itemsAndList' })
  answers?: AnswerInput[];
}
