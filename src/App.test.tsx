import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from '@/App.tsx';

describe('App', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Aušrinė' })).toBeInTheDocument();
  });

  it('renders the header', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText(/0 tasks/)).toBeInTheDocument();
  });

  it('renders the first tagline word-by-word', () => {
    render(<App />);
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('in')).toBeInTheDocument();
    expect(screen.getByText('little')).toBeInTheDocument();
    expect(screen.getByText('chunks.')).toBeInTheDocument();
  });
});
