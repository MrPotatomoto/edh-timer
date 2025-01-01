import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Button,
  Input,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

interface PlayerProps {
  id: string;
  playerName: string;
  initialTime: number;
  isRunning: boolean;
  reset: boolean;
  onTimeUpdate: (id: string, time: number) => void;
  onNameChange: (id: string, newName: string) => void;
  onStartStop: (id: string) => void;
  onRemove: (id: string) => void;
}

const Player: React.FC<PlayerProps> = ({
  id,
  playerName,
  initialTime,
  isRunning,
  reset,
  onTimeUpdate,
  onNameChange,
  onStartStop,
  onRemove,
}) => {
  const [time, setTime] = useState<number>(initialTime);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (reset) {
      setTime(0);
      onTimeUpdate(id, 0);
    }
  }, [reset, onTimeUpdate, id]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          onTimeUpdate(id, newTime);
          return newTime;
        });
      }, 1000);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, time, onTimeUpdate, id]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onNameChange(id, event.target.value);
  };

  const handleNameEditKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      setIsEditing(false);
    }
  };

  const handleRemove = () => {
    onRemove(id);
    setIsRemoveDialogOpen(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Box
      borderRadius="md"
      p={2}
      textAlign="center"
      flex="1"
      position="relative"
      bgColor={"brand.700"}
      m={0}
    >
      <IconButton
        aria-label="Remove player"
        icon={<DeleteIcon />}
        size="sm"
        position="absolute"
        top={14}
        right={4}
        onClick={(e) => {
          e.stopPropagation();
          setIsRemoveDialogOpen(true);
        }}
        color={"#fdb2b2"}
      />
      {isEditing ? (
        <Input
          ref={inputRef}
          value={playerName}
          onChange={handleNameChange}
          onKeyDown={handleNameEditKeyDown}
          onBlur={() => setIsEditing(false)}
          mb={2}
        />
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <Text mr={2} fontSize={"2xl"}>
            {playerName}
          </Text>
          <IconButton
            position="absolute"
            right={4}
            top={4}
            aria-label="Edit player name"
            icon={<EditIcon />}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          />
        </Box>
      )}
      <Text fontSize="3xl">{formatTime(time)}</Text>
      <Button
        onClick={() => onStartStop(id)}
        mt={2}
        w="full"
        bgColor={"brand.600"}
      >
        {isRunning ? "Stop" : "Start"}
      </Button>

      <AlertDialog
        isOpen={isRemoveDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsRemoveDialogOpen(false)}
      >
        <AlertDialogOverlay marginX={4}>
          <AlertDialogContent>
            <AlertDialogHeader>Confirm Removal</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to remove this player? This action cannot be
              undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsRemoveDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleRemove} ml={3}>
                Remove
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Player;
