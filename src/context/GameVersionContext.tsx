import React, { createContext, useContext, useState, useEffect } from 'react';
import { GAME_VERSIONS, GameVersionDetail } from '../data/gamesData';

interface GameVersionContextType {
  selectedVersion: GameVersionDetail;
  setVersionById: (versionId: string) => void;
  selectedGeneration: number;
  isPokemonAvailableInVersion: (genIntroduced: number) => boolean;
  isMoveAvailableInVersion: (moveGen: number) => boolean;
}

const GameVersionContext = createContext<GameVersionContextType | undefined>(undefined);

export const GameVersionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedVersion, setSelectedVersion] = useState<GameVersionDetail>(() => {
    const saved = localStorage.getItem('poke_version');
    const match = GAME_VERSIONS.find(g => g.id === saved);
    return match || GAME_VERSIONS[0]; // Default to Gen 9 Scarlet & Violet
  });

  useEffect(() => {
    localStorage.setItem('poke_version', selectedVersion.id);
  }, [selectedVersion]);

  const setVersionById = (id: string) => {
    const match = GAME_VERSIONS.find(g => g.id === id);
    if (match) {
      setSelectedVersion(match);
    }
  };

  const isPokemonAvailableInVersion = (genIntroduced: number) => {
    return genIntroduced <= selectedVersion.generation;
  };

  const isMoveAvailableInVersion = (moveGen: number) => {
    return moveGen <= selectedVersion.generation;
  };

  return (
    <GameVersionContext.Provider
      value={{
        selectedVersion,
        setVersionById,
        selectedGeneration: selectedVersion.generation,
        isPokemonAvailableInVersion,
        isMoveAvailableInVersion,
      }}
    >
      {children}
    </GameVersionContext.Provider>
  );
};

export const useGameVersion = () => {
  const context = useContext(GameVersionContext);
  if (!context) throw new Error('useGameVersion must be used within GameVersionProvider');
  return context;
};
