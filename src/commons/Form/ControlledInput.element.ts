import {css, html, LitElement, PropertyValues} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {
  InputType,
  FormFieldValueFormatter,
} from './types';
import {FieldState, FormApi} from 'final-form';
import {FinalFormController} from './final-form/RegisterFieldDecorator';

function showValidState(state: FieldState<Record<string, any>[string]>) {
  if (!state.dirty){
    return null;
  }
  if(!state.valid){
    return false;
  }
  if(state.valid){
    return true;
  }
  return state.active;

}

@customElement('controlled-input')
export class ControlledInput extends LitElement {
  @state()
  inhibateValidation = false;

  @property()
  // @ts-expect-error
  form!: FormApi;

  @property()
  shell = false;

  @property()
  label: string | undefined = undefined;

  @property()
  descriptiveText: string | undefined = undefined;

  @property()
  placeholder: string | undefined = undefined;

  @property()
  type: InputType = 'text';

  @property()
  name?: string;

  @property({type: 'string', reflect: true})
  validationMode: 'onblur' | 'onchange' = 'onchange';

  @property()
  formatter: FormFieldValueFormatter = (v: string | null) => v;

  // @ts-expect-error
  #controller: FinalFormController<any>;

  protected override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    try {
      this.#controller = new FinalFormController(
        this,
        this.form,
        this.formatter
      );
    } catch (e) {
      console.log(e);
    }
  }

  protected override updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);
    if (_changedProperties.has('form')) {
      this.dispatchEvent(
        new CustomEvent('onregister', {detail: this.#controller.form})
      );
    }
  }

  static override get styles() {
    return css`
      .inline-container {
        display: flex;
        flex-direction: row;
        align-items: start;
        gap: var(--space-3);
      }

      .basic-container {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }

      span,
      input:not([type='checkbox']) {
        display: flex;
        padding: var(--space-4);
        height: var(--space-7);
        align-items: center;
        align-self: stretch;
        gap: var(--space-3);
        border-radius: var(--radius-lg);
        font-size: var(--text-md-regular-size);
        font-weight: var(--text-md-regular-weight);
        border: 1.5px solid var(--on-surface-primary-light);

        background-color: var(--surface-primary);

        ::placeholder {
          color: var(--on-surface-primary-lighter);
        }
      }

      p {
        margin: 0;
        color: var(--on-surface-primary-light);
      }

      p.error {
        color: var(--on-surface-error-default);
      }

      .focused:not([type='checkbox']) {
        border: 1.5px solid var(--on-surface-primary-alt);
        outline: 1.5px solid var(--on-surface-primary-alt);
      }

      .focused[data-valid='true']:not([type='checkbox']) {
        border: 1.5px solid var(--on-surface-success-default);
        outline: 1.5px solid var(--on-surface-success-default);
      }

      .focused[aria-invalid='true']:not([type='checkbox']) {
        outline: 1.5px solid var(--on-surface-error-default);
        border: 1.5px solid var(--on-surface-error-default);
      }

      label {
        color: var(--on-surface-primary-alt);
        font-size: var(--text-sm-regular-size);
        font-weight: var(--text-sm-regular-weight);
      }

      input:not([type='checkbox'])[aria-invalid='true'],
      span[aria-invalid='true'] {
        border: 1.5px solid var(--on-surface-error-default);
      }

      input:not([type='checkbox'])[data-valid='true'],
      span[data-valid='true'] {
        border: 1.5px solid var(--on-surface-success-default);
      }
    `;
  }

  override render() {
    console.log({controller : this.#controller});

    if (!this.#controller) return html``;
    console.log({controller : this.#controller});
    const {register, form} = this.#controller;
    const state = form.getFieldState(this.name ?? '');
    const dataValid = showValidState(state ?? {} as any);
    const ariaInvalid = !state?.active && state?.dirty && !!state?.error;
    const afterText = (ariaInvalid && state?.error) || this.descriptiveText;

    const descriptiveText = html`
      <p
        class="${dataValid ? 'valid' : ''} ${state?.dirty && state?.error
          ? 'error'
          : ''}"
      >
        ${afterText}
      </p>
    `;
    if (this.shell) {
      return html`
        <div class="basic-container">
          <input type="hidden" ${register(this.name ?? '')} />
          <label for="${this.id}">${this.label}</label>
          <span
            id="${this.id}"
            class="${this.className} ${state?.active ? 'focused' : ''}"
            aria-invalid="${ariaInvalid}"
            data-valid="${dataValid}"
          >
            <slot></slot>
          </span>
          ${descriptiveText}
        </div>
      `;
    }

    if (this.type === 'checkbox') {
      return html`
        <div class="inline-container">
          <input
            id="${this.id}"
            class="${this.className} ${state?.active ? 'focused' : ''}"
            placeholder="${this.placeholder}"
            type="checkbox"
            aria-invalid="${ariaInvalid}"
            data-valid="${dataValid}"
            ${register(this.name ?? '')}
          />
          <label for="${this.id}"> ${afterText} </label>
        </div>
      `;
    }

    //

    return html`
      <div class="basic-container">
        <label for="${this.id}">${this.label}</label>
        <input
          id="${this.id}"
          class="${this.className} ${state?.active ? 'focused' : ''}"
          placeholder="${this.placeholder}"
          type="${this.type}"
          aria-invalid="${ariaInvalid}"
          data-valid="${dataValid}"
          ${register(this.name ?? '')}
        />
        ${afterText}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'controlled-input': ControlledInput;
  }
}
