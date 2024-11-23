import {Config, createForm as createFinalForm, MutableState, Mutator} from 'final-form';

const setFieldTouched: Mutator = (args: any[], state: MutableState<any>) => {
  const [name, touched] = args;
  const field = state.fields[name];
  if (field) {
    field.touched = !!touched;
  }
};
export const createForm = <F>(config: Config<F>) => {
  const form = createFinalForm<F>({
    mutators: {setFieldTouched: setFieldTouched as any},
    ...config,
  });
  return form;
};
