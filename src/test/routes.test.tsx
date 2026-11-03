import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../context/ThemeContext';
import { GameVersionProvider } from '../context/GameVersionContext';
import { App } from '../App';

function renderWithRoute(route: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <GameVersionProvider>
          <MemoryRouter initialEntries={[route]}>
            <App />
          </MemoryRouter>
        </GameVersionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

describe('PokéAtlas Route & 404 Navigation Tests', () => {
  beforeEach(() => {
    window.scrollTo = () => {};
  });

  it('renders homepage correctly on "/"', () => {
    renderWithRoute('/');
    expect(screen.getByRole('heading', { level: 1, name: /Everything About Pok/i })).toBeInTheDocument();
  });

  it('renders pokedex route on "/pokedex"', () => {
    renderWithRoute('/pokedex');
    expect(screen.getByRole('heading', { level: 1, name: /Pokédex Encyclopedia|Pokedex Encyclopedia/i })).toBeInTheDocument();
  });

  it('renders pokemon detail route on "/pokemon/1"', () => {
    renderWithRoute('/pokemon/1');
    expect(screen.getByRole('heading', { level: 1, name: /Bulbasaur/i })).toBeInTheDocument();
  });

  it('renders moves database route on "/moves"', () => {
    renderWithRoute('/moves');
    expect(screen.getByRole('heading', { level: 1, name: /Move Database/i })).toBeInTheDocument();
  });

  it('renders individual move route on "/moves/1"', () => {
    renderWithRoute('/moves/1');
    expect(screen.getByRole('heading', { level: 1, name: /Pound/i })).toBeInTheDocument();
  });

  it('renders types route on "/types"', () => {
    renderWithRoute('/types');
    expect(screen.getByRole('heading', { level: 1, name: /Type Explorer/i })).toBeInTheDocument();
  });

  it('renders type detail route on "/types/fire"', () => {
    renderWithRoute('/types/fire');
    expect(screen.getByRole('heading', { level: 1, name: /Fire Type/i })).toBeInTheDocument();
  });

  it('renders abilities route on "/abilities"', () => {
    renderWithRoute('/abilities');
    expect(screen.getByRole('heading', { level: 1, name: /Ability Database/i })).toBeInTheDocument();
  });

  it('renders individual ability route on "/abilities/1"', () => {
    renderWithRoute('/abilities/1');
    expect(screen.getByRole('heading', { level: 1, name: /Stench/i })).toBeInTheDocument();
  });

  it('renders type calculator route on "/calculator"', () => {
    renderWithRoute('/calculator');
    expect(screen.getByRole('heading', { level: 1, name: /Type Effectiveness Calculator/i })).toBeInTheDocument();
  });

  it('renders move checker route on "/move-checker"', () => {
    renderWithRoute('/move-checker');
    expect(screen.getByRole('heading', { level: 1, name: /Move Effectiveness Checker/i })).toBeInTheDocument();
  });

  it('renders learning center route on "/learn"', () => {
    renderWithRoute('/learn');
    expect(screen.getByRole('heading', { level: 1, name: /Beginner Learning Center/i })).toBeInTheDocument();
  });

  it('renders battle quiz route on "/quiz"', () => {
    renderWithRoute('/quiz');
    expect(screen.getByRole('heading', { level: 1, name: /Battle Quiz/i })).toBeInTheDocument();
  });

  it('renders about route on "/about"', () => {
    renderWithRoute('/about');
    expect(screen.getByRole('heading', { level: 1, name: /About/i })).toBeInTheDocument();
  });

  it('renders battle guide route on "/battle-guide"', () => {
    renderWithRoute('/battle-guide');
    expect(screen.getByRole('heading', { level: 1, name: /Competitive Battle Guide/i })).toBeInTheDocument();
  });

  it('renders custom 404 NotFoundPage on invalid route', () => {
    renderWithRoute('/this-route-does-not-exist');
    expect(screen.getByRole('heading', { level: 1, name: /Page Not Found/i })).toBeInTheDocument();
    expect(screen.getByText(/Error 404/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Return Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore Pokédex/i })).toBeInTheDocument();
  });
});
