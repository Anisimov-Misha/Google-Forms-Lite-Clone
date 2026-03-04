import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { FormResponse } from '../graphql/entities/form-response.entity';
import { SubmitResponseInput } from '../graphql/dto/submit-response.input';

@Injectable()
export class ResponsesService {
  private readonly responses: Map<string, FormResponse[]> = new Map(); // Key is FormId

  findByFormId(formId: string): FormResponse[] {
    return this.responses.get(formId) || [];
  }

  create(input: SubmitResponseInput): FormResponse {
    const newResponse: FormResponse = {
      id: uuidv4(),
      formId: input.formId,
      answers: (input.answers || []).map((a) => ({
        questionId: a.questionId,
        values: a.values,
      })),
      submittedAt: new Date().toISOString(),
    };

    const existingResponses = this.responses.get(input.formId) || [];
    this.responses.set(input.formId, [...existingResponses, newResponse]);

    return newResponse;
  }
}
