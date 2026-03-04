import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Question } from './question.entity';

@ObjectType()
export class Form {
  @Field(() => ID)
  id!: string;

  @Field()

  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [Question])
  questions!: Question[];

  @Field()

  createdAt!: string;
}
