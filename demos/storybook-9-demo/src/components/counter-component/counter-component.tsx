import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'counter-component',
  styleUrl: 'counter-component.css',
  shadow: true,
})
export class CounterComponent {
  /**
   * The initial count value
   */
  @State() count: number = 0;

  private increment = () => {
    this.count += 1;
  };

  private decrement = () => {
    this.count -= 1;
  };

  private reset = () => {
    this.count = 0;
  };

  render() {
    return (
      <div class="counter-container">
        <div class="counter-display">
          <span class="count-value">{this.count}</span>
        </div>
        <div class="counter-controls">
          <button class="counter-button decrement" onClick={this.decrement}>
            -
          </button>
          <button class="counter-button reset" onClick={this.reset}>
            Reset
          </button>
          <button class="counter-button increment" onClick={this.increment}>
            +
          </button>
        </div>
      </div>
    );
  }
}
