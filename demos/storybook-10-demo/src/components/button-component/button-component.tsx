import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'button-component',
  styleUrl: 'button-component.css',
  shadow: true,
})
export class ButtonComponent {
  /**
   * The button label text
   */
  @Prop() label: string = 'Click me';

  /**
   * The button variant style
   */
  @Prop() variant: 'primary' | 'secondary' | 'danger' | 'success' = 'primary';

  /**
   * Whether the button is disabled
   */
  @Prop() disabled: boolean = false;

  /**
   * The button size
   */
  @Prop() size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * Event emitted when the button is clicked
   */
  @Event() buttonClick: EventEmitter<void>;

  private handleClick = () => {
    if (!this.disabled) {
      this.buttonClick.emit();
    }
  };

  render() {
    return (
      <button
        class={`btn btn-${this.variant} btn-${this.size}`}
        disabled={this.disabled}
        onClick={this.handleClick}
      >
        {this.label}
      </button>
    );
  }
}
