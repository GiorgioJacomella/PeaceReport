export interface SignupData {
  email: string;
  name: string;
  username: string;
  password: string;
  journalist: boolean;
  recieveNewsletter: boolean;
  agreeWithTermsConditions: boolean;
}

export interface SignupResponse {
  status: string;
  message: string;
}

const baseUrl: string = 'https://localhost:7223';

export const SignupAPI = async (data: SignupData): Promise<SignupResponse> => {
  const response = await fetch(`${baseUrl}/api/Signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to signup');
  }

  const responseData: SignupResponse = await response.json();
  return responseData;
};