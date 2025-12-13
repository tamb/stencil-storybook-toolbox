# button-component

A customizable button component with multiple variants and sizes.

## Usage

```html
<button-component label="Click me" variant="primary" size="medium"></button-component>
```

## Properties

| Property | Attribute | Description | Type | Default |
|----------|-----------|-------------|------|---------|
| `disabled` | `disabled` | Whether the button is disabled | `boolean` | `false` |
| `label` | `label` | The button label text | `string` | `'Click me'` |
| `size` | `size` | The button size | `'large' \| 'medium' \| 'small'` | `'medium'` |
| `variant` | `variant` | The button variant style | `'danger' \| 'primary' \| 'secondary' \| 'success'` | `'primary'` |

## Events

| Event | Description |
|-------|-------------|
| `buttonClick` | Event emitted when the button is clicked |
