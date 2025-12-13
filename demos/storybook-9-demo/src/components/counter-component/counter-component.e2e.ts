import { newE2EPage } from '@stencil/core/testing';

describe('counter-component', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<counter-component></counter-component>');
    const element = await page.find('counter-component');
    expect(element).toHaveClass('hydrated');
  });

  it('increments count when + button is clicked', async () => {
    const page = await newE2EPage();

    await page.setContent('<counter-component></counter-component>');
    const incrementButton = await page.find('counter-component >>> .increment');
    const countValue = await page.find('counter-component >>> .count-value');

    expect(await countValue.getProperty('textContent')).toBe('0');

    await incrementButton.click();
    await page.waitForChanges();

    expect(await countValue.getProperty('textContent')).toBe('1');
  });

  it('decrements count when - button is clicked', async () => {
    const page = await newE2EPage();

    await page.setContent('<counter-component></counter-component>');
    const decrementButton = await page.find('counter-component >>> .decrement');
    const countValue = await page.find('counter-component >>> .count-value');

    expect(await countValue.getProperty('textContent')).toBe('0');

    await decrementButton.click();
    await page.waitForChanges();

    expect(await countValue.getProperty('textContent')).toBe('-1');
  });

  it('resets count when Reset button is clicked', async () => {
    const page = await newE2EPage();

    await page.setContent('<counter-component></counter-component>');
    const incrementButton = await page.find('counter-component >>> .increment');
    const resetButton = await page.find('counter-component >>> .reset');
    const countValue = await page.find('counter-component >>> .count-value');

    await incrementButton.click();
    await incrementButton.click();
    await page.waitForChanges();
    expect(await countValue.getProperty('textContent')).toBe('2');

    await resetButton.click();
    await page.waitForChanges();
    expect(await countValue.getProperty('textContent')).toBe('0');
  });
});
