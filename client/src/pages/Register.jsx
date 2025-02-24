import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginRegister.module.css';
import Button from '../components/Button';
import NavBar from '../components/layout/Navbar';
import WaveBackground from '../components/RegisterLogin/WaveBackground';
import emailIcon from '../assets/email_icon.svg';
import userIcon from '../assets/username_icon.svg';
import passwordIcon from '../assets/password_icon.svg';
import eyeIcon from '../assets/eye_icon.svg';

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = (data) => {
    console.log(data); // Replace with API call when ready
    navigate('/login');
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.waveBackgroundContainer}>
        <WaveBackground className={styles.waveBackground} />
      </div>

      <NavBar homepage={false} />

      <div className={styles.registerContainer}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>Hello!</h1>
          <p className={styles.welcomeText}>
            Enter your personal details and start your journey with us.
          </p>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>REGISTER</h2>

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

            {/* Username Field */}
            <div className={styles.inputWrapper}>
              <input
                type='text'
                placeholder='Username'
                {...register('username', {
                  required: 'Username is required',
                  minLength: { value: 3, message: 'At least 3 characters' },
                  maxLength: { value: 20, message: 'Max 20 characters' },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: 'Only letters, numbers, and underscores',
                  },
                })}
              />
              <img src={userIcon} alt='Username Icon' />
              {errors.username && (
                <span className={styles.errorMessage}>
                  {errors.username.message}
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
                  minLength: { value: 6, message: 'At least 6 characters' },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                    message: 'Uppercase, number & special char required',
                  },
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
              Already have an account?{' '}
              <Link to='/login'>
                <span className={styles.loginLink}>Log in</span>
              </Link>
            </p>

            <Button type='submit' text='Register' disabled={!isValid} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
