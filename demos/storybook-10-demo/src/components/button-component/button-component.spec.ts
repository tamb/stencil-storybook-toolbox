import { newSpecPage } from '@stencil/core/testing';
import { ButtonComponent } from './button-component';

describe('button-component', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [ButtonComponent],
      html: '<button-component></button-component>',
    });
    expect(root).toEqualHtml(`
      <button-component>
        <mock:shadow-root>
          <button class="btn btn-primary btn-medium" disabled="false">
            Click me
          </button>
        </mock:shadow-root>
      </button-component>
    `);
  });

  it('renders with custom label', async () => {
    const { root } = await newSpecPage({
      components: [ButtonComponent],
      html: '<button-component label="Submit"></button-component>',
    });
    const button = root.shadowRoot.querySelector('button');
    expect(button.textContent).toBe('Submit');
  });

  it('renders with variant', async () => {
    const { root } = await newSpecPage({
      components: [ButtonComponent],
      html: '<button-component variant="danger"></button-component>',
    });
    const button = root.shadowRoot.querySelector('button');
    expect(button.classList.contains('btn-danger')).toBe(true);
  });

  it('renders disabled state', async () => {
    const { root } = await newSpecPage({
      components: [ButtonComponent],
      html: '<button-component disabled></button-component>',
    });
    const button = root.shadowRoot.querySelector('button');
    expect(button.hasAttribute('disabled')).toBe(true);
  });
});
