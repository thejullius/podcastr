import { createContext, ReactNode, useContext, useState } from "react";

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  hasNext: boolean;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  hasPrevious: boolean;
  episodeList: Episode[];
  currentEpisodeIndex: number;

  playNext: () => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
  clearPlayerState: () => void;
  play: (episode: Episode) => void;
  setPlayingState: (state: boolean) => void;
  playlist: (list: Episode[], index: number) => void;
};

type PlayerContextProviderProps = {
  children: ReactNode;
};

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({
  children,
}: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const hasNext = !!episodeList[currentEpisodeIndex + 1];
  const hasPrevious = !!episodeList[currentEpisodeIndex - 1];

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function shuffle() {
    setCurrentEpisodeIndex(Math.floor(Math.random() * episodeList.length));
  }

  function clearPlayerState() {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  function playlist(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function playNext() {
    if (isShuffling) {
      return shuffle();
    } else if (!hasNext && isLooping) {
      setCurrentEpisodeIndex(0);
    } else {
      hasNext && setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevious() {
    if (isShuffling) {
      return shuffle();
    } else {
      hasPrevious && setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function setPlayingState(state: boolean): void {
    setIsPlaying(state);
  }

  return (
    <PlayerContext.Provider
      value={{
        play,
        hasNext,
        playNext,
        playlist,
        isPlaying,
        isLooping,
        toggleLoop,
        togglePlay,
        isShuffling,
        episodeList,
        hasPrevious,
        playPrevious,
        toggleShuffle,
        setPlayingState,
        clearPlayerState,
        currentEpisodeIndex,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const userPlayer = () => useContext(PlayerContext);
