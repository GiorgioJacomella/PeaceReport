import React, { useState } from 'react';
import { useRouter } from 'next/router';
import PublicNav from '@/src/components/navBars/PublicNav';
import { PublicTextInput } from '@/src/components/forms/PublicTextInput';
import PublicButton from '@/src/components/buttons/publicButton';
import { LoginData, LoginResponse, LoginAPI } from '@/src/api';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({
    login: '',
    password: '',
  });

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response: LoginResponse = await LoginAPI(formData);
      localStorage.setItem('token', response.token);
      setMessage(response.message);
      router.push('/myview');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main>
      <PublicNav />
      <div className="relative w-full h-screen bg-white flex flex-col md:flex-row pt-24">
        <div className="relative w-full h-1/3 md:h-full md:w-1/2">
          <img
            src="./HeroImmage02.png"
            alt="Hero Background"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full md:w-1/2 h-2/3 md:h-full">
          <form className="flex flex-col items-center w-11/12 md:w-3/4 p-6 bg-white rounded-md shadow-lg space-y-4" onSubmit={handleSubmit}>
            <h1 className="text-2xl">Login:</h1>
            <PublicTextInput id="login" name="login" type="text" placeholder="Your login" label="Login*: " value={formData.login} onChange={handleChange} required />
            <PublicTextInput id="password" name="password" type="password" placeholder="*****" label="Password*: " value={formData.password} onChange={handleChange} required />
            <PublicButton text="Login" type="submit" />
          </form>
          {message && <p className="text-green-500">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </main>
  );
};

export default Login;
