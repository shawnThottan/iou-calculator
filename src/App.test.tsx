import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

import 'jest-canvas-mock';

test('renders the init line on startup', () => {
  render(<App />);
  const linkElement = screen.getByText('Click/Press and drag to Draw Rectangles.');
  expect(linkElement).toBeInTheDocument();
});
