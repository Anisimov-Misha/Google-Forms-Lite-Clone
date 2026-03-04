import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Form } from '../graphql/entities/form.entity';
import { CreateFormInput } from '../graphql/dto/create-form.input';

@Injectable()
export class FormsService {
  private readonly forms: Map<string, Form> = new Map();

  findAll(): Form[] {
    return Array.from(this.forms.values()).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  findById(id: string): Form {
    const form = this.forms.get(id);
    if (!form) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }
    return form;
  }

  create(input: CreateFormInput): Form {
    const newForm: Form = {
      id: uuidv4(),
      title: input.title,
      description: input.description,
      questions: (input.questions || []).map((q) => ({
        id: uuidv4(),
        text: q.text,
        type: q.type,
        options: q.options,
        required: q.required,
      })),
      createdAt: new Date().toISOString(),
    };

    this.forms.set(newForm.id, newForm);
    return newForm;
  }
}
