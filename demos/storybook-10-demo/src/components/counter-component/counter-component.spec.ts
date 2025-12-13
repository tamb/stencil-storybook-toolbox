import { newSpecPage } from '@stencil/core/testing';
import { CounterComponent } from './counter-component';

describe('counter-component', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [CounterComponent],
      html: '<counter-component></counter-component>',
    });
    expect(root).toEqualHtml(`
      <counter-component>
        <mock:shadow-root>
          <div class="counter-container">
            <div class="counter-display">
              <span class="count-value">0</span>
            </div>
            <div class="counter-controls">
              <button class="counter-button decrement">-</button>
              <button class="counter-button reset">Reset</button>
              <button class="counter-button increment">+</button>
            </div>
          </div>
        </mock:shadow-root>
      </counter-component>
    `);
  });
});
