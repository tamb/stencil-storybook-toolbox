import type { Meta, StoryObj } from '@storybook/html';

type ButtonArgs = {
  label?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
};

const meta: Meta<ButtonArgs> = {
  title: 'Components/Button',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A customizable button component with multiple variants and sizes.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'The button label text',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'success'],
      description: 'The button variant style',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Default: Story = {
  args: {
    label: 'Click me',
    variant: 'primary',
    size: 'medium',
    disabled: false,
  },
  render: (args) => `
    <button-component
      label="${args.label}"
      variant="${args.variant}"
      size="${args.size}"
      ${args.disabled ? 'disabled' : ''}
    ></button-component>
  `,
};

export const Primary: Story = {
  render: () => '<button-component label="Primary Button" variant="primary"></button-component>',
};

export const Secondary: Story = {
  render: () => '<button-component label="Secondary Button" variant="secondary"></button-component>',
};

export const Danger: Story = {
  render: () => '<button-component label="Danger Button" variant="danger"></button-component>',
};

export const Success: Story = {
  render: () => '<button-component label="Success Button" variant="success"></button-component>',
};

export const Sizes: Story = {
  render: () => `
    <div style="display: flex; gap: 1rem; align-items: center; padding: 2rem;">
      <button-component label="Small" size="small"></button-component>
      <button-component label="Medium" size="medium"></button-component>
      <button-component label="Large" size="large"></button-component>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Button component in different sizes: small, medium, and large.',
      },
    },
  },
};

export const Disabled: Story = {
  render: () => `
    <div style="display: flex; gap: 1rem; padding: 2rem;">
      <button-component label="Disabled Primary" variant="primary" disabled></button-component>
      <button-component label="Disabled Secondary" variant="secondary" disabled></button-component>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Disabled button states for different variants.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => `
    <div style="display: flex; gap: 1rem; flex-wrap: wrap; padding: 2rem;">
      <button-component label="Primary" variant="primary"></button-component>
      <button-component label="Secondary" variant="secondary"></button-component>
      <button-component label="Danger" variant="danger"></button-component>
      <button-component label="Success" variant="success"></button-component>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All available button variants displayed together.',
      },
    },
  },
};
