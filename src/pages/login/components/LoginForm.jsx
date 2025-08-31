import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock credentials for different user types
  const mockCredentials = {
    admin: { email: 'admin@kampalaschool.ug', password: 'Admin@2024' },
    teacher: { email: 'teacher@kampalaschool.ug', password: 'Teacher@2024' },
    parent: { email: 'parent@kampalaschool.ug', password: 'Parent@2024' }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check mock credentials
      const isValidCredentials = Object.values(mockCredentials)?.some(
        cred => cred?.email === formData?.email && cred?.password === formData?.password
      );
      
      if (isValidCredentials) {
        // Mock JWT token storage
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocktoken';
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('userEmail', formData?.email);
        
        if (formData?.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        
        navigate('/dashboard');
      } else {
        setErrors({
          general: `Invalid credentials. Use: ${Object.values(mockCredentials)?.map(c => c?.email)?.join(', ')}`
        });
      }
    } catch (error) {
      setErrors({
        general: 'Login failed. Please check your connection and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Mock forgot password functionality
    alert('Password reset link would be sent to your email address');
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-xl shadow-modal border border-border p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Icon name="GraduationCap" size={32} color="var(--color-primary-foreground)" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Sign in to your Marka SAAS account
          </p>
        </div>

        {/* Error Message */}
        {errors?.general && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Icon name="AlertCircle" size={20} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-error font-medium text-sm">Authentication Failed</p>
                <p className="text-error/80 text-sm mt-1">{errors?.general}</p>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your school email"
            value={formData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            required
            disabled={isLoading}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            disabled={isLoading}
          />

          <div className="flex items-center justify-between">
            <Checkbox
              label="Remember me"
              name="rememberMe"
              checked={formData?.rememberMe}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            
            <Button
              variant="link"
              onClick={handleForgotPassword}
              disabled={isLoading}
              className="text-sm p-0 h-auto"
            >
              Forgot password?
            </Button>
          </div>

          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={isLoading}
            iconName="LogIn"
            iconPosition="right"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {/* Register Link */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-muted-foreground text-sm mb-4">
            Don't have an account for your school?
          </p>
          <Button
            variant="outline"
            fullWidth
            onClick={handleRegisterRedirect}
            disabled={isLoading}
            iconName="UserPlus"
            iconPosition="left"
          >
            Register New School
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;