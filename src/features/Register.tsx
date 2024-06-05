import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../App/store';
import { register } from './registerSlice';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.register);
  const [credentials, setCredentials] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(credentials).some((value) => !value.trim())) {
      alert('Please fill out all fields');
      return;
    }
    try {
      await dispatch(register(credentials));
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <>
      <h1>Register</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <label>First Name:</label>
          <input placeholder="First Name..." type="text" name="first_name" value={credentials.first_name} onChange={handleChange} />
          <br />
          <label>Last Name:</label>
          <input placeholder="Last Name..." type="text" name="last_name" value={credentials.last_name} onChange={handleChange} />
          <br />
          <label>Username:</label>
          <input placeholder="Username..." type="text" name="username" value={credentials.username} onChange={handleChange} />
          <br />
          <label>Email:</label>
          <input placeholder="Email..." type="text" name="email" value={credentials.email} onChange={handleChange} />
          <br />
          <label>Password:</label>
          <input placeholder="Password..." type="password" name="password" value={credentials.password} onChange={handleChange} />
          <br />
          <button type="submit" disabled={isLoading}>Register</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </>
  );
};

export default Register;
