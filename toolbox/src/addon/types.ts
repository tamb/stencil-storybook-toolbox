/**
 * Types for Stencil component metadata
 */

export interface StencilProp {
  name: string;
  type: string;
  mutable?: boolean;
  reflect?: boolean;
  required?: boolean;
  default?: string;
  attribute?: string;
  description?: string;
}

export interface StencilState {
  name: string;
  type: string;
  description?: string;
}

export interface StencilMethod {
  name: string;
  signature: string;
  returns?: string;
  description?: string;
}

export interface StencilEvent {
  name: string;
  detail?: string;
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
  description?: string;
}

export interface StencilListen {
  event: string;
  target?: string;
  action: string;
  description?: string;
}

export interface StencilMixin {
  name: string;
  properties?: StencilProp[];
  methods?: StencilMethod[];
  description?: string;
}

export interface StencilComponentInfo {
  tag: string;
  props?: StencilProp[];
  state?: StencilState[];
  methods?: StencilMethod[];
  events?: StencilEvent[];
  listeners?: StencilListen[];
  mixins?: StencilMixin[];
  description?: string;
}
