import { Field, InputType } from '@nestjs/graphql';
import { QuestionType } from '../enums/question-type.enum';

@InputType()
export class QuestionInput {
  @Field()
  text!: string;

  @Field(() => QuestionType)
  type!: QuestionType;

  @Field(() => [String], { nullable: true })
  options?: string[];

  @Field({ defaultValue: false })
  required!: boolean;
}
