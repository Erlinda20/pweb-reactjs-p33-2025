import React from 'react';
import { Box, Button, Text, VStack, Alert, AlertIcon } from '@chakra-ui/react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = 'Something went wrong', 
  onRetry 
}) => {
  return (
    <Box p={6} textAlign="center">
      <VStack spacing={4}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {message}
        </Alert>
        {onRetry && (
          <Button onClick={onRetry} colorScheme="blue">
            Try Again
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default function ErrorState({ message }: { message: string }) {
  return <div className="text-center text-red-500">{message}</div>;
}
