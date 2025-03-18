import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginRegister.module.css';
import Button from '../components/Button';
import NavBar from '../components/layout/Navbar';
import WaveBackground from '../components/RegisterLogin/WaveBackground';
import emailIcon from '../assets/email_icon.svg';
import passwordIcon from '../assets/password_icon.svg';
import eyeIcon from '../assets/eye_icon.svg';
import axios from 'axios';
import logo from '../assets/Icon_black_png.png';

function Login({ isPWA = false }) {
  const { login } = useApp();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const [apiError, setApiError] = useState('');

  const onSubmit = async (data) => {
    try {
        console.log("Form data:", data);
        const response = await login(data.email, data.password);
        console.log("Login response:", response);

        if (response && response.message === 'Login successful') {
            navigate('/dashboard');
        } else {
            setApiError(response?.message || 'Login failed');
        }
    } catch (error) {
        console.error("Login Error:", error);
        setApiError(error.response?.data?.message || 'Login failed');
    }
};

  return (
    <div className={`${styles.registerPage} ${isPWA ? styles.mobile : ''}`}>
      <div className={styles.waveBackgroundContainer}>
        <WaveBackground className={styles.waveBackground} />
      </div>
      {!isPWA && <NavBar homepage={false} />}

      <div className={styles.registerContainer}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>Welcome Back!</h1>
          <p className={styles.welcomeText}>
            To continue, please enter your login details.
          </p>
        </div>
        <img src={logo} alt='Logo' className={styles.logo} />

        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>LOGIN</h2>

          <form
            className={styles.registerForm}
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Email Field */}
            <div className={styles.inputWrapper}>
              <input
                type='email'
                placeholder='Email ID'
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              <img src={emailIcon} alt='Email Icon' />
              {errors.email && (
                <span className={styles.errorMessage}>
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                {...register('password', {
                  required: 'Password is required',
                })}
              />
              <img
                src={showPassword ? eyeIcon : passwordIcon}
                alt='Toggle Password Visibility'
                className={styles.eyeIcon}
                onClick={togglePasswordVisibility}
                style={{ cursor: 'pointer' }}
              />
              {errors.password && (
                <span className={styles.errorMessage}>
                  {errors.password.message}
                </span>
              )}
            </div>

            <p className={styles.loginRedirect}>
              Don't have an account?{' '}
              <Link to='/register' className={styles.loginLink}>
                Register
              </Link>
            </p>

            <Button
              type='submit'
              text='Login'
              disabled={!isValid}
              color={isPWA ? 'primary' : 'dark'}
            />
            {apiError && <div className={styles.apiError}>{apiError}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
