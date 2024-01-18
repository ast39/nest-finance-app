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
  transform(value: any, metatype: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const { error } = this.schema.validate(value);
    console.info(error);
    const errors = error?.details?.reduce((object, value) => {
      return {
        ...object,
        [`${value.path}`]:
          validationError[value.type] ?? value.message.replace(/"/g, `'`),
      };
    }, {});
    console.info(errors);
    if (errors) {
      throw new BadRequestException(errors);
    }

    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
