import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Container, Card, Button, Alert, Spinner } from 'react-bootstrap';
import styles from './LoginPage.module.scss';
import authService from '@/services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  
  // Check if already authenticated
  useEffect(() => {
    if (authService.isAuthenticated()) {
      // If already logged in, redirect to dashboard
      navigate('/management');
    }
  }, [navigate]);
  
  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validated, setValidated] = useState(false);
  
  // 2FA states
  const [step, setStep] = useState('login');
  const [adminId, setAdminId] = useState(null);
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [token, setToken] = useState('');
  
  const resetForm = () => {
    setError('');
    setLoading(false);
    setValidated(false);
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authService.login(email, password);
      
      if (response.needsSetup) {
        // First-time login, need to set up 2FA
        setStep('setup');
        setAdminId(response.adminId);
        setSecret(response.secret);
        setQrCode(response.qrCode);
      } else if (response.needsVerification) {
        // 2FA already set up, need to verify
        setStep('verify');
        setAdminId(response.adminId);
      } else {
        // No 2FA needed, direct login
        navigate('/management');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка авторизации. Пожалуйста, проверьте введенные данные.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await authService.verify2FA(adminId, token);
      navigate('/management');
    } catch (err) {
      setError(err.response?.data?.message || 'Неверный код подтверждения. Пожалуйста, попробуйте еще раз.');
      setLoading(false);
    }
  };
  
  const handleSetup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await authService.setup2FA(adminId, token);
      navigate('/management');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка настройки двухфакторной аутентификации. Пожалуйста, попробуйте еще раз.');
      setLoading(false);
    }
  };
  
  // Login Form
  const renderLoginForm = () => {
    const isEmailValid = email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/);
    const isPasswordValid = password.length >= 6;
    
    return (
      <Form noValidate validated={validated} onSubmit={handleLogin}>
        <div className={styles.formTitle}>Вход в систему управления</div>
        
        {error && <Alert variant="danger" className={styles.errorAlert}>{error}</Alert>}
        
        <Form.Group className={styles.formGroup}>
          <Form.Label>Электронная почта</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Введите email"
            className={`${styles.formControl} ${validated && !isEmailValid ? 'is-invalid' : ''} ${validated && isEmailValid && email ? 'is-valid' : ''}`}
            disabled={loading}
            autoComplete="email"
          />
        </Form.Group>
        
        <Form.Group className={styles.formGroup}>
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Введите пароль"
            className={`${styles.formControl} ${validated && !isPasswordValid ? 'is-invalid' : ''} ${validated && isPasswordValid && password ? 'is-valid' : ''}`}
            disabled={loading}
            autoComplete="current-password"
          />
        </Form.Group>
        
        <Button 
          type="submit" 
          className={styles.submitButton} 
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : 'Войти'}
        </Button>
      </Form>
    );
  };
  
  // Verify Form
  const renderVerifyForm = () => (
    <Form onSubmit={handleVerify}>
      <div className={styles.formTitle}>Подтверждение входа</div>
      
      {error && <Alert variant="danger" className={styles.errorAlert}>{error}</Alert>}
      
      <Form.Group className={styles.formGroup}>
        <Form.Control
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value.replace(/\D/g, '').substring(0, 6))}
          required
          placeholder="123456"
          className={`${styles.codeInput} ${token.length === 6 ? 'is-valid' : token.length > 0 ? 'is-invalid' : ''}`}
          disabled={loading}
          maxLength={6}
          autoComplete="one-time-code"
        />
      </Form.Group>
      
      <Button 
        type="submit" 
        className={styles.submitButton} 
        disabled={loading || token.length !== 6}
      >
        {loading ? <Spinner animation="border" size="sm" /> : 'Подтвердить'}
      </Button>
      
      <Button
        variant="link"
        onClick={() => {
          setStep('login');
          resetForm();
        }}
        className={styles.backButton}
      >
        Вернуться к входу
      </Button>
    </Form>
  );
  
  // Setup Form
  const renderSetupForm = () => (
    <Form onSubmit={handleSetup}>
      <div className={styles.formTitle}>Настройка двухфакторной аутентификации</div>
      <div className={styles.formText}>
        Отсканируйте QR-код с помощью приложения Google Authenticator или другого приложения для двухфакторной аутентификации
      </div>
      
      {error && <Alert variant="danger" className={styles.errorAlert}>{error}</Alert>}
      
      <div className={styles.qrContainer}>
        <img 
          src={`data:image/png;base64,${qrCode}`} 
          alt="QR-код для настройки 2FA" 
          className={styles.qrCode} 
        />
      </div>
      
      <div className={styles.secretKeyWrapper}>
        <div className={styles.secretKeyLabel}>Или введите этот секретный ключ вручную:</div>
        <div className={styles.secretKey}>{secret}</div>
      </div>
      
      <Form.Group className={styles.formGroup}>
        <Form.Control
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value.replace(/\D/g, '').substring(0, 6))}
          required
          placeholder="123456"
          className={`${styles.codeInput} ${token.length === 6 ? 'is-valid' : token.length > 0 ? 'is-invalid' : ''}`}
          disabled={loading}
          maxLength={6}
          autoComplete="one-time-code"
        />
        <div className={styles.formHint}>
          Введите 6-значный код из приложения для завершения настройки
        </div>
      </Form.Group>
      
      <Button 
        type="submit" 
        className={styles.submitButton} 
        disabled={loading || token.length !== 6}
      >
        {loading ? <Spinner animation="border" size="sm" /> : 'Завершить настройку'}
      </Button>
      
      <Button
        variant="link"
        onClick={() => {
          setStep('login');
          resetForm();
        }}
        className={styles.backButton}
      >
        Вернуться к входу
      </Button>
    </Form>
  );
  
  return (
    <div className={styles.loginPage}>
      <Container className={styles.loginContainer}>
        <Card className={styles.loginCard}>
          <Card.Body className={styles.cardBody}>
            <div className={styles.logo}>Capital Estate</div>
            
            <div className={styles.formContainer}>
              {step === 'login' && renderLoginForm()}
              {step === 'verify' && renderVerifyForm()}
              {step === 'setup' && renderSetupForm()}
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default LoginPage; 