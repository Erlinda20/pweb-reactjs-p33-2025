import React from 'react';
import { Spinner, Center, Text, VStack } from '@chakra-ui/react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'xl', text = 'Loading...' }) => {
  return (
    <Center h="200px">
      <VStack spacing={4}>
        <Spinner size={size} color="blue.500" />
        <Text color="gray.600">{text}</Text>
      </VStack>
    </Center>
  );
};

export default function Loader() {
  return <div className="text-center p-4">Loading...</div>;
}
