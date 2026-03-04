import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Form } from '../graphql/entities/form.entity';
import { FormsService } from '../store/forms.service';
import { CreateFormInput } from '../graphql/dto/create-form.input';

@Resolver(() => Form)
export class FormsResolver {
  constructor(private readonly formsService: FormsService) { }

  @Query(() => [Form], { name: 'forms' })
  getForms(): Form[] {
    return this.formsService.findAll();
  }

  @Query(() => Form, { name: 'form' })
  getForm(@Args('id', { type: () => ID }) id: string): Form {
    return this.formsService.findById(id);
  }

  @Mutation(() => Form)
  createForm(@Args('input') input: CreateFormInput): Form {
    return this.formsService.create(input);
  }
}
