import React, { useState } from 'react';
import PublicNav from '@/src/components/navBars/PublicNav';
import { PublicTextInput } from '@/src/components/forms/PublicTextInput';
import { PublicCheckboxInput } from '@/src/components/forms/PublicCheckboxInput';
import PublicButton from '@/src/components/buttons/publicButton';
import SignupModal from '@/src/components/modals/SignupModal';
import { SignupData, SignupResponse, SignupAPI } from '@/src/api';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignupData>({
    email: '',
    name: '',
    username: '',
    password: '',
    journalist: false,
    recieveNewsletter: false,
    agreeWithTermsConditions: false,
  });

  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepeatPassword(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (formData.password !== repeatPassword) {
      setError("Passwords do not match");
      setShowModal(true);
      return;
    }

    try {
      const response: SignupResponse = await SignupAPI(formData);
      setMessage(response.message);
      setShowModal(true);
    } catch (err) {
      setError(err.message);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setMessage(null);
    setError(null);
  };

  return (
    <main>
      <PublicNav />
      <div className="relative w-full h-screen bg-white flex flex-col md:flex-row pt-24 md:pt-32">
        <div className="relative w-full h-1/3 md:h-full md:w-1/2">
          <img
            src="./HeroImmage01.png"
            alt="Hero Background"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full md:w-1/2 h-2/3 md:h-full">
          <form className="flex flex-col items-center w-11/12 md:w-3/4 p-6 bg-white rounded-md shadow-lg space-y-4" onSubmit={handleSubmit}>
            <h1 className="text-2xl">SIGN-UP NOW:</h1>
            <PublicTextInput id="name" name="name" type="text" placeholder="Example Journalist" label="Name*: " value={formData.name} onChange={handleChange} required />
            <PublicTextInput id="username" name="username" type="text" placeholder="ExampleUserName" label="Username*: " value={formData.username} onChange={handleChange} required />
            <PublicTextInput id="email" name="email" type="email" placeholder="example@yourmail.com" label="Email*: " value={formData.email} onChange={handleChange} required />
            <PublicTextInput id="password" name="password" type="password" placeholder="*****" label="Password*: " value={formData.password} onChange={handleChange} required />
            <PublicTextInput id="repeatPassword" name="repeatPassword" type="password" placeholder="*****" label="Repeat password*: " value={repeatPassword} onChange={handleRepeatPasswordChange} required />
            <PublicCheckboxInput id="agreeWithTermsConditions" name="agreeWithTermsConditions" label={<>Agree with <a href="/terms-conditions">Terms and Conditions</a></>} required checked={formData.agreeWithTermsConditions} onChange={handleChange} />
            <PublicCheckboxInput id="recieveNewsletter" name="recieveNewsletter" label="Register for the newsletter" checked={formData.recieveNewsletter} onChange={handleChange} />
            <PublicCheckboxInput id="journalist" name="journalist" label="Register as a Journalist" checked={formData.journalist} onChange={handleChange} />
            <PublicButton text="Sign-up" type="submit" />
          </form>
        </div>
      </div>
      {showModal && (
        <SignupModal
          message={message}
          error={error}
          onClose={handleCloseModal}
        />
      )}
    </main>
  );
};

export default Signup;
