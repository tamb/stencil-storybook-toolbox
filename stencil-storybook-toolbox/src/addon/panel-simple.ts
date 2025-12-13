/**
 * Simple panel implementation using DOM APIs (no React dependency)
 * This is used as a fallback or alternative to the React-based panel
 */

import type { StencilComponentInfo } from './types';

export function renderStencilPanel(element: HTMLElement, componentInfo: StencilComponentInfo | null): void {
  element.innerHTML = '';

  if (!componentInfo) {
    element.innerHTML = `
      <div style="padding: 16px; color: #666;">
        <p>No Stencil component information available.</p>
        <p style="font-size: 12px; margin-top: 8px;">
          Make sure you're viewing a story that renders a Stencil component.
        </p>
      </div>
    `;
    return;
  }

  const sectionStyle = 'margin-bottom: 16px; border: 1px solid #e0e0e0; border-radius: 4px; overflow: hidden;';
  const headerStyle = 'padding: 12px 16px; background-color: #f5f5f5; font-weight: 600; cursor: pointer; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;';
  const contentStyle = 'padding: 16px; background-color: #fff;';
  const itemStyle = 'padding: 8px 0; border-bottom: 1px solid #f0f0f0;';
  const labelStyle = 'font-weight: 600; color: #333; margin-right: 8px;';
  const valueStyle = 'color: #666; font-family: monospace; font-size: 13px;';

  let html = `
    <div style="padding: 16px; font-family: system-ui, sans-serif;">
      <h2 style="margin-top: 0; margin-bottom: 16px;">${componentInfo.tag}</h2>
      ${componentInfo.description ? `<p style="color: #666; margin-bottom: 16px;">${componentInfo.description}</p>` : ''}
  `;

  if (componentInfo.props && componentInfo.props.length > 0) {
    html += `
      <div style="${sectionStyle}">
        <div style="${headerStyle}" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'; this.lastElementChild.textContent = this.nextElementSibling.style.display === 'none' ? '▶' : '▼';">
          <span>Props (${componentInfo.props.length})</span>
          <span>▼</span>
        </div>
        <div style="${contentStyle}">
          ${componentInfo.props.map(prop => `
            <div style="${itemStyle}">
              <div>
                <span style="${labelStyle}">${prop.name}:</span>
                <span style="${valueStyle}">${prop.type}</span>
              </div>
              ${prop.attribute ? `<div style="font-size: 12px; color: #999; margin-top: 4px;">@attribute: ${prop.attribute}</div>` : ''}
              ${prop.default !== undefined ? `<div style="font-size: 12px; color: #999; margin-top: 4px;">default: ${String(prop.default)}</div>` : ''}
              ${prop.required ? '<span style="font-size: 12px; color: #d32f2f; margin-left: 8px;">required</span>' : ''}
              ${prop.reflect ? '<span style="font-size: 12px; color: #1976d2; margin-left: 8px;">reflect</span>' : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (componentInfo.state && componentInfo.state.length > 0) {
    html += `
      <div style="${sectionStyle}">
        <div style="${headerStyle}" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'; this.lastElementChild.textContent = this.nextElementSibling.style.display === 'none' ? '▶' : '▼';">
          <span>State (${componentInfo.state.length})</span>
          <span>▼</span>
        </div>
        <div style="${contentStyle}">
          ${componentInfo.state.map(state => `
            <div style="${itemStyle}">
              <span style="${labelStyle}">${state.name}:</span>
              <span style="${valueStyle}">${state.type}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (componentInfo.methods && componentInfo.methods.length > 0) {
    html += `
      <div style="${sectionStyle}">
        <div style="${headerStyle}" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'; this.lastElementChild.textContent = this.nextElementSibling.style.display === 'none' ? '▶' : '▼';">
          <span>Methods (${componentInfo.methods.length})</span>
          <span>▼</span>
        </div>
        <div style="${contentStyle}">
          ${componentInfo.methods.map(method => `
            <div style="${itemStyle}">
              <div>
                <span style="${labelStyle}">${method.name}:</span>
                <span style="${valueStyle}">${method.signature}</span>
              </div>
              ${method.returns ? `<div style="font-size: 12px; color: #999; margin-top: 4px;">returns: ${method.returns}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (componentInfo.events && componentInfo.events.length > 0) {
    html += `
      <div style="${sectionStyle}">
        <div style="${headerStyle}" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'; this.lastElementChild.textContent = this.nextElementSibling.style.display === 'none' ? '▶' : '▼';">
          <span>Events (${componentInfo.events.length})</span>
          <span>▼</span>
        </div>
        <div style="${contentStyle}">
          ${componentInfo.events.map(event => `
            <div style="${itemStyle}">
              <div>
                <span style="${labelStyle}">${event.name}</span>
              </div>
              ${event.detail ? `<div style="font-size: 12px; color: #999; margin-top: 4px;">detail: ${event.detail}</div>` : ''}
              <div style="font-size: 12px; color: #999; margin-top: 4px;">
                ${event.bubbles ? 'bubbles ' : ''}
                ${event.cancelable ? 'cancelable ' : ''}
                ${event.composed ? 'composed' : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (componentInfo.listeners && componentInfo.listeners.length > 0) {
    html += `
      <div style="${sectionStyle}">
        <div style="${headerStyle}" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'; this.lastElementChild.textContent = this.nextElementSibling.style.display === 'none' ? '▶' : '▼';">
          <span>Listeners (${componentInfo.listeners.length})</span>
          <span>▼</span>
        </div>
        <div style="${contentStyle}">
          ${componentInfo.listeners.map(listener => `
            <div style="${itemStyle}">
              <div>
                <span style="${labelStyle}">@${listener.event}</span>
                ${listener.target ? `<span style="font-size: 12px; color: #999; margin-left: 8px;">on ${listener.target}</span>` : ''}
              </div>
              <div style="font-size: 12px; color: #666; margin-top: 4px;">${listener.action}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (componentInfo.mixins && componentInfo.mixins.length > 0) {
    html += `
      <div style="${sectionStyle}">
        <div style="${headerStyle}" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'; this.lastElementChild.textContent = this.nextElementSibling.style.display === 'none' ? '▶' : '▼';">
          <span>Mixins (${componentInfo.mixins.length})</span>
          <span>▼</span>
        </div>
        <div style="${contentStyle}">
          ${componentInfo.mixins.map(mixin => `
            <div style="${itemStyle}">
              <div>
                <span style="${labelStyle}">${mixin.name}</span>
              </div>
              ${mixin.properties && mixin.properties.length > 0 ? `<div style="font-size: 12px; color: #666; margin-top: 4px;">Properties: ${mixin.properties.map(p => p.name).join(', ')}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  html += '</div>';
  element.innerHTML = html;
}

