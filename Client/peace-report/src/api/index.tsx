// Import necessary types and dependencies
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

export interface LoginData {
  login: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  token: string;
}

export interface UserInfoResponse {
  email: string;
  name: string;
  username: string;
  journalist: boolean;
  recieveNewsletter: boolean;
  agreeWithTermsConditions: boolean;
}

const baseUrl: string = 'https://localhost:7223';

// Signup API
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

// Login API
export const LoginAPI = async (data: LoginData): Promise<LoginResponse> => {
  const response = await fetch(`${baseUrl}/api/Login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message || 'Failed to login');
  }

  const responseData: LoginResponse = await response.json();
  return responseData;
};

// User Information API
export const getUserInfoAPI = async (): Promise<UserInfoResponse> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No token found');
  }

  const bearerToken = `Bearer ${token}`;

  const response = await fetch(`${baseUrl}/api/User/userinfo?authorization=${encodeURIComponent(bearerToken)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    console.error('API Error Response:', errorResponse);
    throw new Error(errorResponse.message || 'Failed to fetch user info');
  }

  const responseData: UserInfoResponse = await response.json();
  return responseData;
};
