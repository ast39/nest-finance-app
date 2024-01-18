const empty = 'Данное поле не может быть пустым';
const required = 'Данное поле обязательно';
const max = 'Максимальное число символов превышено';
const min = 'Минимальное число символов превышено';

export const validationError = {
  'any.empty': empty,
  'string.empty': empty,
  'number.empty': empty,
  'boolean.empty': empty,
  'array.empty': empty,

  'any.required': required,
  'string.required': required,
  'number.required': required,
  'boolean.required': required,
  'array.required': required,

  'object.base': 'Данное поле может только обьектом',
  'array.base': 'Данное поле может только массивом',
  'string.base': 'Данное поле может только строкой',
  'boolean.base': 'Данное поле может только true/false',
  'number.base': 'Данное поле может только числом',

  'string.email': 'Некорректный email',

  'any.max': max,
  'string.max': max,
  'number.max': max,

  'any.min': min,
  'string.min': min,
  'number.min': min,
};
