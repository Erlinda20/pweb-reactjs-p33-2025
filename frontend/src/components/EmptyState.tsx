import React from 'react';
import { Box, Text, VStack, Button } from '@chakra-ui/react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title = 'No data found', 
  message = 'There is no data to display at the moment.',
  action 
}) => {
  return (
    <Box p={8} textAlign="center">
      <VStack spacing={4}>
        <Text fontSize="6xl">📭</Text>
        <Text fontSize="xl" fontWeight="bold">{title}</Text>
        <Text color="gray.600">{message}</Text>
        {action}
      </VStack>
    </Box>
  );
};

export default function EmptyState({ message }: { message: string }) {
  return <div className="text-center text-gray-500">{message}</div>;
}
