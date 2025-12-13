import { newE2EPage } from '@stencil/core/testing';

describe('button-component', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<button-component></button-component>');
    const element = await page.find('button-component');
    expect(element).toHaveClass('hydrated');
  });

  it('emits buttonClick event when clicked', async () => {
    const page = await newE2EPage();

    await page.setContent('<button-component></button-component>');
    const button = await page.find('button-component >>> button');
    const buttonClickSpy = await page.spyOnEvent('buttonClick');

    await button.click();
    await page.waitForChanges();

    expect(buttonClickSpy).toHaveReceivedEvent();
  });

  it('does not emit event when disabled', async () => {
    const page = await newE2EPage();

    await page.setContent('<button-component disabled></button-component>');
    const button = await page.find('button-component >>> button');
    const buttonClickSpy = await page.spyOnEvent('buttonClick');

    await button.click();
    await page.waitForChanges();

    expect(buttonClickSpy).not.toHaveReceivedEvent();
  });
});
