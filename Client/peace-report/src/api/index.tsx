const baseUrl: string = 'https://localhost:7223';

// Signup API
export interface ISignupData {
  email: string;
  name: string;
  username: string;
  password: string;
  journalist: boolean;
  recieveNewsletter: boolean;
  agreeWithTermsConditions: boolean;
}

export interface ISignupResponse {
  status: string;
  message: string;
}

export const SignupAPI = async (data: ISignupData): Promise<ISignupResponse> => {
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

  const responseData: ISignupResponse = await response.json();
  return responseData;
};

// Login API
export interface ILoginData {
  login: string;
  password: string;
}

export interface ILoginResponse {
  status: string;
  message: string;
  token: string;
}

export const LoginAPI = async (data: ILoginData): Promise<ILoginResponse> => {
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

  const responseData: ILoginResponse = await response.json();
  return responseData;
};

// Get User Information API
export interface IUserInfoResponse {
  email: string;
  name: string;
  username: string;
  journalist: boolean;
  recieveNewsletter: boolean;
  agreeWithTermsConditions: boolean;
}

export const getUserInfoAPI = async (): Promise<IUserInfoResponse> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No token found');
  }

  const bearerToken = `Bearer ${token}`;

  const response = await fetch(`${baseUrl}/api/User/userinfo`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': bearerToken,
    },
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    console.error('API Error Response:', errorResponse);
    throw new Error(errorResponse.message || 'Failed to fetch user info');
  }

  const responseData: IUserInfoResponse = await response.json();
  return responseData;
};


// Get Articles
export interface IContentElement {
  type: string;
  value: string;
}

export interface IArticle {
  id: string;
  title: string;
  authorUsername: string;
  content: Array<IContentElement>;
}

export interface IArticlesResponse {
  articles: Array<IArticle>;
}

export const GetArticlesAPI = async (): Promise<IArticlesResponse> => {
  const response = await fetch(`${baseUrl}/api/Article`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    console.error('API Error Response:', errorResponse);
    throw new Error(errorResponse.message || 'Failed to fetch article info');
  }

  const responseData = await response.json();
  return { articles: responseData };
};

// Get article by ID
export const GetArticleByIdAPI = async (id: string): Promise<IArticle> => {
  const response = await fetch(`${baseUrl}/api/Article/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorResponse = { message: 'Failed to fetch article' };
    try {
      errorResponse = await response.json();
    } catch (error) {
      console.error('Failed to parse error response:', error);
    }
    console.error('API Error Response:', errorResponse);
    throw new Error(errorResponse.message);
  }

  const article: IArticle = await response.json();
  return article;
};


// API Endpoint for a new Article
export interface ContentItem {
  type: 'text' | 'image';
  value: string | File;
}

export interface INewArticle {
  title: string;
  images: File[];
  texts: string[];
  contentOrder: number[];
}

export const NewArticleAPI = async (newArticle: INewArticle, token: string): Promise<IArticle> => {
  const formData = new FormData();
  formData.append('title', newArticle.title);

  newArticle.images.forEach((image, index) => {
    formData.append('Images', image);
  });

  newArticle.texts.forEach((text, index) => {
    formData.append(`texts[${index}]`, text);
  });

  newArticle.contentOrder.forEach((order, index) => {
    formData.append(`contentOrder[${index}]`, order.toString());
  });

  const response = await fetch(`${baseUrl}/api/Article`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Error: ${response.statusText} - ${errorText}`);
    throw new Error(`Error: ${response.statusText} - ${errorText}`);
  }

  return response.json();
};

// Update Article API
export interface IUpdateArticle {
  title?: string;
  images?: File[];
  imageUrls?: string[];
  texts?: string[];
  contentOrder?: number[];
}

export const UpdateArticleAPI = async (id: string, updateArticle: IUpdateArticle, token: string): Promise<IArticle> => {
  const formData = new FormData();
  
  if (updateArticle.title) {
    formData.append('title', updateArticle.title);
  }
  
  if (updateArticle.images) {
    updateArticle.images.forEach((image, index) => {
      formData.append('Images', image);
    });
  }
  
  if (updateArticle.imageUrls) {
    updateArticle.imageUrls.forEach((url, index) => {
      formData.append(`ImageUrls[${index}]`, url);
    });
  }
  
  if (updateArticle.texts) {
    updateArticle.texts.forEach((text, index) => {
      formData.append(`Texts[${index}]`, text);
    });
  }
  
  if (updateArticle.contentOrder) {
    updateArticle.contentOrder.forEach((order, index) => {
      formData.append(`ContentOrder[${index}]`, order.toString());
    });
  }

  const response = await fetch(`${baseUrl}/api/Article/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Error: ${response.statusText} - ${errorText}`);
    throw new Error(`Error: ${response.statusText} - ${errorText}`);
  }

  const updatedArticle: IArticle = await response.json();
  return updatedArticle;
};

// Delete Article API
export const DeleteArticleAPI = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${baseUrl}/api/Article/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Error: ${response.statusText} - ${errorText}`);
    throw new Error(`Error: ${response.statusText} - ${errorText}`);
  }
};
