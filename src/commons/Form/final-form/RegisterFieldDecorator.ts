import {
  noChange,
  nothing,
  ReactiveController,
  ReactiveControllerHost,
} from 'lit';
import {
  Directive,
  directive,
  ElementPart,
  PartInfo,
  PartType,
} from 'lit/directive.js';

import {
  FieldConfig,
  FormApi,
  FormSubscription,
  formSubscriptionItems,
  Unsubscribe,
} from 'final-form';
import {FormFieldValueFormatter} from '../types';

export type {Config} from 'final-form';

const allFormSubscriptionItems = formSubscriptionItems.reduce(
  (acc, item) => ((acc[item as keyof FormSubscription] = true), acc),
  {} as FormSubscription
);

export class FinalFormController<FormValues> implements ReactiveController {
  #host: ReactiveControllerHost;
  #unsubscribe: Unsubscribe | null = null;
  form: FormApi<FormValues>;
  formatter?: FormFieldValueFormatter;

  // https://final-form.org/docs/final-form/types/Config
  constructor(
    host: ReactiveControllerHost,
    formApi: FormApi<FormValues>,
    formatter?: FormFieldValueFormatter
  ) {
    this.form = formApi;
    this.formatter = formatter;
    (this.#host = host).addController(this);
  }

  hostConnected() {
    try {
      this.#unsubscribe = this.form.subscribe(() => {
        this.#host.requestUpdate();
      }, allFormSubscriptionItems);
    }
    catch (e){
      console.warn("Subscribe failed for some reason",e);
    }
  }

  hostUpdate() {}

  hostDisconnected() {
    this.#unsubscribe?.();
  }

  // https://final-form.org/docs/final-form/types/FieldConfig
  register = <K extends keyof FormValues>(
    name: K,
    fieldConfig?: FieldConfig<FormValues[K]>
  ) => {
    console.log(`Registering ${name}`);
    try {
      return registerDirective(this.form, name, fieldConfig, this.formatter);
    }
    catch (e){
      console.warn(e);
      throw e;
    }
  };
}

class RegisterDirective extends Directive {
  #registered = false;

  constructor(partInfo: PartInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error(
        'The `register` directive must be used in the `element` attribute'
      );
    }
  }

  override update(
    part: ElementPart,
    [form, name, fieldConfig, formatter]: Parameters<this['render']>
  ) {

    if (!this.#registered) {
      form.registerField(
        name,
        (fieldState) => {
          const {blur, change, focus, value} = fieldState;
          const el = part.element as HTMLInputElement | HTMLSelectElement;
          el.name = String(name);
          if (!this.#registered) {
            el.addEventListener('blur', () => blur());
            el.addEventListener('input', (event) => {
              if (el.type === 'checkbox') {
                change((event.target as HTMLInputElement).checked);
              } else {
                let newValue = (event.target as HTMLInputElement).value;
                if (!event.type.includes('deleteContent') && formatter) {
                  newValue = formatter(newValue) ?? '';
                }
                change(newValue);
              }
            });
            el.addEventListener('focus', () => focus());
          }
          // initial values sync
          if (el.type === 'checkbox') {
            (el as HTMLInputElement).checked = value === true;
          } else {
            el.value = value === undefined ? '' : value;
          }
        },
        {value: true},
        fieldConfig
      );
      this.#registered = true;
    }

    return noChange;
  }

  // Can't get generics carried over from directive call
  render(
    _form: FormApi<any>,
    _name: PropertyKey,
    _fieldConfig?: FieldConfig<any>,
    _flormatter?: FormFieldValueFormatter
  ) {
    return nothing;
  }
}

const registerDirective = directive(RegisterDirective);
