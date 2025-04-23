import { describe, expect, test } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

test('visar 0 från början', () => {
  render(<App />);
  const button = screen.getByRole('button', { name: /count is 0/i });
  expect(button).toBeInTheDocument();
});

test('ökar med 1 efter ett klick', () => {
  render(<App />);
  const button = screen.getByRole('button', { name: /count is 0/i });
  fireEvent.click(button);
  expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument();
});