import { test, expect } from '@sand4rt/experimental-ct-web';
import { ControlledInput } from './ControlledInput.element';
import { createForm } from "final-form";

test.describe('Controlled input', () => {
  test('render props', async ({ mount }) => {
    const form = createForm({
      initialValues: { value: '' },
      onSubmit: () => {},
    });
    const component = await mount(ControlledInput, {
      props: {
        label: 'Label',
        descriptiveText: 'Descriptive text',
        form: form as any,
        name: 'value',
      },
    });
    await expect(component).toContainText('Label');
    await expect(component).toContainText('Descriptive text');
  });
});
