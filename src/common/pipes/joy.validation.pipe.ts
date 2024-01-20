import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { validationError } from './validation';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform<any> {
  constructor(private schema: ObjectSchema) {}
  transform(query: any, metatype: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return query;
    }

    const { error } = this.schema.validate(query, { convert: true });
    const errors = error?.details?.reduce((object, value) => {
      return {
        ...object,
        [`${value.path}`]:
          validationError[value.type] ?? value.message.replace(/"/g, `'`),
      };
    }, {});

    if (errors) {
      throw new BadRequestException(errors);
    }

    return query;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
