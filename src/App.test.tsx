import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from '@/App.tsx';

describe('App', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('Aušrinė')).toBeInTheDocument();
  });

  it('renders the tagline', { timeout: 15_000 }, async () => {
    render(<App />);
    await waitFor(
      () => expect(screen.getByText('One thing at a time.')).toBeInTheDocument(),
      { timeout: 12_000 },
    );
  });
});
