import { describe, it } from 'node:test';
import assert from 'node:assert';
import { copyToClipboard, getQrCodeUrl } from '../frontend/src/services/linkService.js';

describe('LinkSnip Frontend - Client Service Contracts', () => {
  it('generates valid QR code URL on the frontend client', () => {
    assert.strictEqual(getQrCodeUrl(''), '', 'Empty shortUrl should yield empty string');
    const sampleUrl = 'https://linksnip.dev/client-preview?src=ui';
    const qrUrl = getQrCodeUrl(sampleUrl);
    assert.ok(qrUrl && qrUrl.length > 0, 'Frontend getQrCodeUrl must return a functional QR generator endpoint URL');
    assert.ok(qrUrl.startsWith('https://'), 'QR URL must use secure https protocol');
    assert.ok(
      qrUrl.includes(encodeURIComponent(sampleUrl)) || qrUrl.includes(sampleUrl),
      'Frontend QR URL must reference the short URL parameter'
    );
  });

  it('resolves clipboard copies only after the browser accepts them', async () => {
    const originalNavigator = globalThis.navigator;
    let copiedText = '';
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { clipboard: { writeText: async (value: string) => { copiedText = value; } } }
    });

    await copyToClipboard('https://linksnip.dev/copied');
    assert.strictEqual(copiedText, 'https://linksnip.dev/copied');
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: originalNavigator });
  });

  it('rejects clipboard failures instead of reporting success', async () => {
    const originalNavigator = globalThis.navigator;
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { clipboard: { writeText: async () => { throw new Error('Permission denied'); } } }
    });

    await assert.rejects(() => copyToClipboard('https://linksnip.dev/blocked'), /Permission denied/);
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: originalNavigator });
  });
});
