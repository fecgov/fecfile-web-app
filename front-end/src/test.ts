/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from 'vitest';

(global as any).AbortController = class {
  constructor() {
    this.signal = new EventTarget();
  }
  signal: EventTarget;
  abort() {
    const event = new Event('abort');
    this.signal.dispatchEvent(event);
  }
};

// Polyfill for DataTransfer which is missing in jsdom
if (typeof DataTransfer === 'undefined') {
  const DataTransferPolyfill = class {
    private data: Record<string, string> = {};
    setData(format: string, data: string) {
      this.data[format] = data;
    }
    getData(format: string) {
      return this.data[format] || '';
    }
    items = [];
    types = [];
  };

  // Attach to the Node global scope
  (global as any).DataTransfer = DataTransferPolyfill;

  // Attach to the JSDOM window scope if it exists
  if (typeof window !== 'undefined') {
    (window as any).DataTransfer = DataTransferPolyfill;
  }
}

// Polyfill for ClipboardEvent which is missing in jsdom
if (typeof ClipboardEvent === 'undefined') {
  const ClipboardEventPolyfill = class extends Event {
    clipboardData: any;
    constructor(type: string, eventInitDict?: any) {
      super(type, eventInitDict);
      this.clipboardData = eventInitDict?.clipboardData || null;
    }
  };

  (global as any).ClipboardEvent = ClipboardEventPolyfill;
  if (typeof window !== 'undefined') {
    (window as any).ClipboardEvent = ClipboardEventPolyfill;
  }
}

// Polyfill for HTMLDialogElement methods missing in JSDOM
if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.show) {
  HTMLDialogElement.prototype.show = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
}

// Polyfill for matchMedia which is missing in JSDOM
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

window.scrollTo = vi.fn();

Object.defineProperty(URL, 'createObjectURL', { writable: true, value: vi.fn() });
