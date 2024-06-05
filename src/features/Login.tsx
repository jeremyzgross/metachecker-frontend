import React, { useState } from 'react'
import { useDispatch, useSelector  } from 'react-redux'
import { RootState, AppDispatch } from '../App/store'
import { logout, login } from './loginSlice'
import { useNavigate } from 'react-router-dom';

const Login: React.FC = ()=>{
  const navigate = useNavigate()
  const dispatch: AppDispatch = useDispatch() //dispatch actions
  const { username, isLoading, error } = useSelector((state: RootState) => state.login); //state values
  const [credentials, setCredentials] = useState({username: '', password: ''})

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await dispatch(login(credentials));
    navigate('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
  }
};


    return (
    <div>
      <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <input required placeholder='Username...' type="text" name="username" value={credentials.username} onChange={handleChange} />
          </div>
          <div>
            <input required placeholder='Password...'  type="password" name= "password" value={credentials.password} onChange={handleChange} />
          </div>
          <button type="submit" disabled={isLoading}>Login</button>
        </form>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};
export default Login;
