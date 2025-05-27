// Utilitaires de test
export const mockClient = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
};

export const mockApiResponse = {
  success: true,
  data: mockClient,
};

export const simulateApiCall = async <T>(data: T): Promise<T> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return data;
};