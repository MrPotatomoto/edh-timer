import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Container,
  Heading,
  SimpleGrid,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Flex,
} from "@chakra-ui/react";
import Player from "./Player";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

interface PlayerData {
  id: string;
  name: string;
  time: number;
}

const App: React.FC = () => {
  const [activePlayer, setActivePlayer] = useState<string | null>(null);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [players, setPlayers] = useState<PlayerData[]>(() => {
    const savedPlayers = localStorage.getItem("players");
    return savedPlayers
      ? JSON.parse(savedPlayers)
      : [
          { id: uuidv4(), name: "Player 1", time: 0 },
          { id: uuidv4(), name: "Player 2", time: 0 },
          { id: uuidv4(), name: "Player 3", time: 0 },
          { id: uuidv4(), name: "Player 4", time: 0 },
        ];
  });

  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [reset, setReset] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
    setTotalTime(players.reduce((acc, player) => acc + player.time, 0));
  }, [players]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleStartStop = (id: string) => {
    if (activePlayer === id) {
      setActivePlayer(null);
    } else {
      setActivePlayer(id);
    }
  };

  const handleReset = () => {
    const resetPlayers = [
      { id: uuidv4(), name: "Player 1", time: 0 },
      { id: uuidv4(), name: "Player 2", time: 0 },
      { id: uuidv4(), name: "Player 3", time: 0 },
      { id: uuidv4(), name: "Player 4", time: 0 },
    ];
    setPlayers(resetPlayers);
    localStorage.setItem("players", JSON.stringify(resetPlayers));
    setActivePlayer(null);
    setReset(true);
    setTimeout(() => setReset(false), 0); // reset the flag after resetting
    setIsResetDialogOpen(false);
  };

  const handleTimeUpdate = (id: string, time: number) => {
    setPlayers((prevPlayers) => {
      const newPlayers = prevPlayers.map((player) =>
        player.id === id ? { ...player, time } : player
      );
      localStorage.setItem("players", JSON.stringify(newPlayers));
      return newPlayers;
    });
  };

  const handleNameChange = (id: string, newName: string) => {
    setPlayers((prevPlayers) => {
      const newPlayers = prevPlayers.map((player) =>
        player.id === id ? { ...player, name: newName } : player
      );
      localStorage.setItem("players", JSON.stringify(newPlayers));
      return newPlayers;
    });
  };

  const addPlayer = () => {
    setPlayers((prevPlayers) => {
      const newPlayers = [
        ...prevPlayers,
        { id: uuidv4(), name: `Player ${prevPlayers.length + 1}`, time: 0 },
      ];
      localStorage.setItem("players", JSON.stringify(newPlayers));
      return newPlayers;
    });
  };

  const removePlayer = (id: string) => {
    setPlayers((prevPlayers) => {
      const newPlayers = prevPlayers.filter((player) => player.id !== id);
      localStorage.setItem("players", JSON.stringify(newPlayers));
      return newPlayers;
    });
    if (activePlayer === id) {
      setActivePlayer(null);
    }
  };

  return (
    <Container
      maxW="container.xl"
      minW={"250px"}
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={4}
    >
      <Flex alignItems={"center"} justifyContent={"space-between"} width="100%">
        <Heading my={2} textAlign="center">
          EDH Timer
        </Heading>
        <Text fontSize="3xl">{formatTime(totalTime)}</Text>
      </Flex>
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} mt={2} w="full">
        {players.map((player) => (
          <Player
            key={player.id}
            id={player.id}
            playerName={player.name}
            initialTime={player.time}
            isRunning={activePlayer === player.id}
            reset={reset}
            onTimeUpdate={handleTimeUpdate}
            onNameChange={handleNameChange}
            onStartStop={handleStartStop}
            onRemove={removePlayer}
          />
        ))}
      </SimpleGrid>
      <Button onClick={addPlayer} mt={4} w="full" bgColor={"brand.600"}>
        Add Player
      </Button>
      <Button
        onClick={() => setIsResetDialogOpen(true)}
        mt={4}
        colorScheme="red"
        w="full"
      >
        Reset All
      </Button>

      <AlertDialog
        isOpen={isResetDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsResetDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Confirm Reset</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to reset the entire application? This action
              cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsResetDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleReset} ml={3}>
                Reset
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default App;
