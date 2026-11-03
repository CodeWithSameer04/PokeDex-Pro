import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Compass,
  Swords,
  Layers,
  Calculator,
  GraduationCap,
  Sparkles,
  Gamepad2,
  ChevronDown,
  Crosshair,
  BookMarked,
  Wrench,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useGameVersion } from '../../context/GameVersionContext';
import { GAME_VERSIONS } from '../../data/gamesData';
import { SearchModal } from './SearchModal';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { selectedVersion, setVersionById } = useGameVersion();
  const location = useLocation();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isLearnDropdownOpen, setIsLearnDropdownOpen] = useState(false);

  const toolsRef = useRef<HTMLDivElement>(null);
  const learnRef = useRef<HTMLDivElement>(null);
  const versionRef = useRef<HTMLDivElement>(null);

  // Global Ctrl+K / Cmd+K or / shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close menus on route change or click outside
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsVersionDropdownOpen(false);
    setIsToolsDropdownOpen(false);
    setIsLearnDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (toolsRef.current && !toolsRef.current.contains(target)) {
        setIsToolsDropdownOpen(false);
      }
      if (learnRef.current && !learnRef.current.contains(target)) {
        setIsLearnDropdownOpen(false);
      }
      if (versionRef.current && !versionRef.current.contains(target)) {
        setIsVersionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary standalone links
  const primaryLinks = [
    { label: 'Pokédex', path: '/pokedex', icon: <Compass className="w-3.5 h-3.5 mr-1.5" /> },
    { label: 'Types', path: '/types', icon: <Layers className="w-3.5 h-3.5 mr-1.5" /> },
    { label: 'Moves', path: '/moves', icon: <Swords className="w-3.5 h-3.5 mr-1.5" /> },
    { label: 'Abilities', path: '/abilities', icon: <Sparkles className="w-3.5 h-3.5 mr-1.5" /> },
    { label: 'Calculator', path: '/calculator', icon: <Calculator className="w-3.5 h-3.5 mr-1.5" /> },
  ];

  // Grouped Tools
  const toolLinks = [
    {
      label: 'Move Checker',
      path: '/move-checker',
      icon: <Crosshair className="w-4 h-4 text-red-400" />,
      desc: 'Simulate STAB & defender matchup',
    },
    {
      label: 'Battle Guide',
      path: '/battle-guide',
      icon: <BookMarked className="w-4 h-4 text-amber-400" />,
      desc: 'Formulas, weather & hazards',
    },
  ];

  // Grouped Training
  const learnLinks = [
    {
      label: 'Learning Center',
      path: '/learn',
      icon: <GraduationCap className="w-4 h-4 text-emerald-400" />,
      desc: 'Beginner mechanics & guides',
    },
    {
      label: 'Battle Quiz',
      path: '/quiz',
      icon: <Gamepad2 className="w-4 h-4 text-blue-400" />,
      desc: 'Test your type matchup knowledge',
    },
  ];

  const isToolsActive = toolLinks.some(l => location.pathname.startsWith(l.path));
  const isLearnActive = learnLinks.some(l => location.pathname.startsWith(l.path));

  return (
    <>
      <header className="sticky top-0 z-40 bg-darkbg-900/95 backdrop-blur-md border-b border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* 1. Left: Brand Logo */}
            <Link to="/" className="flex items-center space-x-2.5 flex-shrink-0 group">
              <div className="relative w-8 h-8 rounded-full border-2 border-red-500 overflow-hidden shadow-glow-fire transition-transform group-hover:rotate-12 duration-300 flex-shrink-0">
                <div className="w-full h-1/2 bg-red-600" />
                <div className="w-full h-1/2 bg-white" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-slate-900 border-2 border-white rounded-full" />
                </div>
              </div>
              <div className="flex flex-col flex-shrink-0">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 bg-clip-text text-transparent whitespace-nowrap leading-tight">
                  POKÉDEX PRO
                </span>
                <span className="text-[9px] text-slate-400 font-mono tracking-widest hidden sm:block whitespace-nowrap">
                  KNOWLEDGE & BATTLE
                </span>
              </div>
            </Link>

            {/* 2. Middle: Desktop Navigation Links (Visible on lg and above) */}
            <nav className="hidden lg:flex items-center space-x-1 flex-shrink">
              {primaryLinks.map(link => {
                const isActive = location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                );
              })}

              {/* Tools Dropdown */}
              <div className="relative" ref={toolsRef}>
                <button
                  onClick={() => {
                    setIsToolsDropdownOpen(prev => !prev);
                    setIsLearnDropdownOpen(false);
                    setIsVersionDropdownOpen(false);
                  }}
                  className={`flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isToolsActive || isToolsDropdownOpen
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5 mr-1" />
                  <span>Battle Tools</span>
                  <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isToolsDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-darkbg-800 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 space-y-1">
                    {toolLinks.map(t => (
                      <Link
                        key={t.path}
                        to={t.path}
                        onClick={() => setIsToolsDropdownOpen(false)}
                        className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                          location.pathname.startsWith(t.path)
                            ? 'bg-red-500/10 text-red-400'
                            : 'text-slate-200 hover:bg-slate-700/60'
                        }`}
                      >
                        <div className="p-1.5 rounded-lg bg-darkbg-900 border border-slate-700/60 flex-shrink-0 mt-0.5">
                          {t.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-white">{t.label}</div>
                          <div className="text-[11px] text-slate-400 leading-tight">{t.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Training Dropdown */}
              <div className="relative" ref={learnRef}>
                <button
                  onClick={() => {
                    setIsLearnDropdownOpen(prev => !prev);
                    setIsToolsDropdownOpen(false);
                    setIsVersionDropdownOpen(false);
                  }}
                  className={`flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isLearnActive || isLearnDropdownOpen
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 mr-1" />
                  <span>Training</span>
                  <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${isLearnDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLearnDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-darkbg-800 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 space-y-1">
                    {learnLinks.map(t => (
                      <Link
                        key={t.path}
                        to={t.path}
                        onClick={() => setIsLearnDropdownOpen(false)}
                        className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                          location.pathname.startsWith(t.path)
                            ? 'bg-red-500/10 text-red-400'
                            : 'text-slate-200 hover:bg-slate-700/60'
                        }`}
                      >
                        <div className="p-1.5 rounded-lg bg-darkbg-900 border border-slate-700/60 flex-shrink-0 mt-0.5">
                          {t.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-white">{t.label}</div>
                          <div className="text-[11px] text-slate-400 leading-tight">{t.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* 3. Right: Utility Controls (Version, Search, Theme, Mobile toggle) */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
              {/* Game Version Selector Dropdown */}
              <div className="relative" ref={versionRef}>
                <button
                  onClick={() => {
                    setIsVersionDropdownOpen(prev => !prev);
                    setIsToolsDropdownOpen(false);
                    setIsLearnDropdownOpen(false);
                  }}
                  className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap"
                  title="Select Game Version"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                  <span className="hidden xl:inline font-mono text-[11px] text-slate-400">Gen {selectedVersion.generation}:</span>
                  <span className="max-w-[75px] sm:max-w-[100px] truncate">{selectedVersion.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
                </button>

                {isVersionDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-darkbg-800 border border-slate-700 rounded-2xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/60 mb-1">
                      Select Game Version
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {GAME_VERSIONS.map(ver => (
                        <button
                          key={ver.id}
                          onClick={() => {
                            setVersionById(ver.id);
                            setIsVersionDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700/50 transition-colors ${
                            ver.id === selectedVersion.id
                              ? 'text-red-400 font-semibold bg-red-500/10'
                              : 'text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="font-medium">{ver.name}</div>
                            <div className="text-[10px] text-slate-400">
                              Gen {ver.generation} • {ver.region} ({ver.releaseYear})
                            </div>
                          </div>
                          {ver.id === selectedVersion.id && (
                            <span className="text-red-400 font-bold">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs text-slate-300 transition-colors whitespace-nowrap"
                title="Search Pokémon, Moves, Types, Abilities"
              >
                <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden md:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
                  Ctrl+K
                </kbd>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 transition-colors flex-shrink-0"
                title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-blue-400" />
                )}
              </button>

              {/* Mobile Menu Hamburger (Visible below lg) */}
              <button
                onClick={() => setIsMobileMenuOpen(prev => !prev)}
                className="lg:hidden p-1.5 sm:p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 transition-colors flex-shrink-0"
                title="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-darkbg-900 px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Primary Section */}
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-1.5">
                Encyclopedia
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {primaryLinks.map(link => {
                  const isActive = location.pathname.startsWith(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Tools Section */}
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-1.5">
                Battle Tools & Guides
              </div>
              <div className="space-y-1">
                {toolLinks.map(t => (
                  <Link
                    key={t.path}
                    to={t.path}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      location.pathname.startsWith(t.path)
                        ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {t.icon}
                      <span>{t.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal">{t.desc}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Training Section */}
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-1.5">
                Academy & Testing
              </div>
              <div className="space-y-1">
                {learnLinks.map(t => (
                  <Link
                    key={t.path}
                    to={t.path}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      location.pathname.startsWith(t.path)
                        ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {t.icon}
                      <span>{t.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal">{t.desc}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
