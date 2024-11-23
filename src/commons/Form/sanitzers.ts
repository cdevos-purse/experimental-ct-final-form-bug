import {FormFieldValueSanitizer} from './types';

type SanitizerName = 'replace';
export const CommonSanitizers: Record<SanitizerName, FormFieldValueSanitizer<any>> = {
  replace: (value, data?:{replacements:[string,string][]}) => {
    let result = value || '';
    if (result && data?.replacements) {
      data.replacements.forEach(([char, replace]) => (result = (result as string).replace?.(char, replace)));
    }
    return result;
  },

};