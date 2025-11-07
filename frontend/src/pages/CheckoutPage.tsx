import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  VStack, 
  HStack, 
  Text, 
  Input, 
  NumberInput, 
  NumberInputField, 
  NumberInputStepper, 
  NumberIncrementStepper, 
  NumberDecrementStepper,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Divider,
  Stack,
  useToast,
  Alert,
  AlertIcon,
  Spinner,
  Center
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { api, TransactionItem } from '../../services/api';

interface CartItem extends TransactionItem {
  title: string;
  price: number;
  stock: number;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [newBook, setNewBook] = useState({ book_id: '', quantity: 1 });

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('checkoutCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('checkoutCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = () => {
    if (!newBook.book_id || newBook.quantity < 1) {
      toast({
        title: 'Error',
        description: 'Please enter valid book ID and quantity',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const bookId = parseInt(newBook.book_id);
    const existingItem = cart.find(item => item.book_id === bookId);

    if (existingItem) {
      setCart(cart.map(item =>
        item.book_id === bookId
          ? { ...item, quantity: item.quantity + newBook.quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        book_id: bookId,
        quantity: newBook.quantity,
        title: `Book ${bookId}`,
        price: 10000,
        stock: 10
      }]);
    }

    setNewBook({ book_id: '', quantity: 1 });
    toast({
      title: 'Book added to cart',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const removeFromCart = (bookId: number) => {
    setCart(cart.filter(item => item.book_id !== bookId));
  };

  const updateQuantity = (bookId: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(cart.map(item =>
      item.book_id === bookId ? { ...item, quantity } : item
    ));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one book to checkout',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (cart.length === 1) {
      toast({
        title: 'Error',
        description: 'Please add more than one book to checkout',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const transactionItems: TransactionItem[] = cart.map(item => ({
        book_id: item.book_id,
        quantity: item.quantity
      }));

      await api.createTransaction(transactionItems);
      
      setCart([]);
      localStorage.removeItem('checkoutCart');
      
      toast({
        title: 'Success',
        description: 'Transaction completed successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/transactions');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create transaction',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center h="400px">
        <VStack>
          <Spinner size="xl" />
          <Text>Processing your order...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box p={6}>
      <Heading mb={6}>Checkout</Heading>

      {/* Add Book Form */}
      <Card mb={6}>
        <CardHeader>
          <Heading size="md">Add Book to Cart</Heading>
        </CardHeader>
        <CardBody>
          <HStack spacing={4} align="flex-end">
            <Box>
              <Text mb={2}>Book ID</Text>
              <Input
                type="number"
                placeholder="Enter book ID"
                value={newBook.book_id}
                onChange={(e) => setNewBook({ ...newBook, book_id: e.target.value })}
                width="200px"
              />
            </Box>
            <Box>
              <Text mb={2}>Quantity</Text>
              <NumberInput
                value={newBook.quantity}
                onChange={(_, value) => setNewBook({ ...newBook, quantity: value })}
                min={1}
                width="120px"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
            <Button onClick={addToCart} colorScheme="green">
              Add to Cart
            </Button>
          </HStack>
        </CardBody>
      </Card>

      {/* Cart Items */}
      <Card>
        <CardHeader>
          <Heading size="md">Cart Items</Heading>
        </CardHeader>
        <CardBody>
          {cart.length === 0 ? (
            <Text textAlign="center" color="gray.500" py={8}>
              Your cart is empty
            </Text>
          ) : (
            <VStack spacing={4} align="stretch">
              {cart.map((item) => (
                <Card key={item.book_id} variant="outline">
                  <CardBody>
                    <HStack justify="space-between">
                      <Box flex={1}>
                        <Heading size="sm">{item.title}</Heading>
                        <Text color="gray.600">Book ID: {item.book_id}</Text>
                        <Text color="gray.600">Price: Rp {item.price.toLocaleString()}</Text>
                        {item.quantity > item.stock && (
                          <Alert status="warning" mt={2} size="sm">
                            <AlertIcon />
                            Quantity exceeds available stock!
                          </Alert>
                        )}
                      </Box>
                      
                      <HStack spacing={4}>
                        <HStack>
                          <Button
                            size="sm"
                            onClick={() => updateQuantity(item.book_id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <Text minW="40px" textAlign="center">{item.quantity}</Text>
                          <Button
                            size="sm"
                            onClick={() => updateQuantity(item.book_id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </HStack>
                        
                        <Text fontWeight="bold" minW="100px" textAlign="right">
                          Rp {(item.price * item.quantity).toLocaleString()}
                        </Text>
                        
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => removeFromCart(item.book_id)}
                        >
                          Remove
                        </Button>
                      </HStack>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          )}
        </CardBody>

        {cart.length > 0 && (
          <CardFooter>
            <VStack width="100%" spacing={4}>
              <Divider />
              <HStack justify="space-between" width="100%">
                <Heading size="lg">Total Amount:</Heading>
                <Heading size="lg" color="green.500">
                  Rp {getTotalAmount().toLocaleString()}
                </Heading>
              </HStack>
              <Button
                onClick={handleCheckout}
                disabled={cart.length <= 1}
                colorScheme={cart.length <= 1 ? "gray" : "blue"}
                size="lg"
                width="100%"
              >
                {cart.length <= 1 ? 'Add more books to checkout' : 'Complete Checkout'}
              </Button>
            </VStack>
          </CardFooter>
        )}
      </Card>
    </Box>
  );
};

export default CheckoutPage;
