export type InputType =
  'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

export const FieldValidationErrors  ={
  cannotBeEmpty : 'cannotBeEmpty',
  dateOutOfRange : 'dateOutOfRange',
  format : 'format',
  lengthOutOfRange : 'lengthOutOfRange',
} as const




export interface FormFieldValueFormatter {
  (value: string | null): string | null;
}

export interface FormFieldValueSanitizer<Data> {
  (value: string | null, data?: Data): string | null;
}


