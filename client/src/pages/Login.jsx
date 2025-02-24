import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginRegister.module.css';
import Button from '../components/Button';
import NavBar from '../components/layout/Navbar';
import WaveBackground from '../components/RegisterLogin/WaveBackground';
import emailIcon from '../Assets/email_icon.svg';
import passwordIcon from '../Assets/password_icon.svg';
import eyeIcon from '../Assets/eye_icon.svg';

function Login() {
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

  const onSubmit = (data) => {
    console.log('Login Data:', data); // Replace with API call when ready
    navigate('/dashboard');
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.waveBackgroundContainer}>
        <WaveBackground className={styles.waveBackground} />
      </div>

      <NavBar homepage={false} />

      <div className={styles.registerContainer}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>Welcome Back!</h1>
          <p className={styles.welcomeText}>
            To continue, please enter your login details.
          </p>
        </div>

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

            <Button type='submit' text='Login' disabled={!isValid} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
