import type { Meta, StoryObj } from '@storybook/html';

const meta: Meta = {
  title: 'Components/Counter',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A simple counter component that allows users to increment, decrement, and reset a count value.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => '<counter-component></counter-component>',
};

export const Interactive: Story = {
  render: () => `
    <div style="padding: 2rem;">
      <counter-component></counter-component>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Click the buttons to increment, decrement, or reset the counter.',
      },
    },
  },
};
