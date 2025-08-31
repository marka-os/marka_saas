import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import BrandingSection from './components/BrandingSection';
import ComplianceBadges from './components/ComplianceBadges';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="flex-1 max-w-2xl">
          <BrandingSection />
        </div>
        
        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-muted/30">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Tablet Layout */}
      <div className="hidden md:block lg:hidden min-h-screen">
        <div className="flex flex-col min-h-screen">
          {/* Header Branding */}
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 border-b border-border">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold">M</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">Marka SAAS</h1>
                    <p className="text-sm text-muted-foreground">UNEB Report Card Management</p>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <ComplianceBadges />
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-lg">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block md:hidden min-h-screen">
        <div className="flex flex-col min-h-screen">
          {/* Mobile Header */}
          <div className="bg-primary p-4 text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">M</span>
              </div>
              <h1 className="text-xl font-bold text-primary-foreground">Marka SAAS</h1>
            </div>
            <p className="text-primary-foreground/80 text-sm">UNEB Compliant Report Cards</p>
          </div>
          
          {/* Mobile Form */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
              <LoginForm />
            </div>
          </div>
          
          {/* Mobile Trust Indicators */}
          <div className="p-4 bg-muted/50 border-t border-border">
            <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>UNEB Certified</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>500+ Schools</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span>Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;