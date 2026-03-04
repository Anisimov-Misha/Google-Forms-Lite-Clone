import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FormResponse } from '../graphql/entities/form-response.entity';
import { ResponsesService } from '../store/responses.service';
import { SubmitResponseInput } from '../graphql/dto/submit-response.input';
import { FormsService } from '../store/forms.service';

@Resolver(() => FormResponse)
export class ResponsesResolver {
  constructor(
    private readonly responsesService: ResponsesService,
    private readonly formsService: FormsService,
  ) { }

  @Query(() => [FormResponse], { name: 'responses' })
  getResponses(@Args('formId', { type: () => ID }) formId: string): FormResponse[] {
    // Basic validation: does the form exist?
    this.formsService.findById(formId);
    return this.responsesService.findByFormId(formId);
  }

  @Mutation(() => FormResponse)
  submitResponse(@Args('input') input: SubmitResponseInput): FormResponse {
    // Basic validation: does the form exist?
    this.formsService.findById(input.formId);
    return this.responsesService.create(input);
  }
}
