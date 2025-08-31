import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RegistrationHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">M</span>
            </div>
            <span className="font-semibold text-xl text-foreground">Marka SAAS</span>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="flex items-center space-x-2"
            >
              <Icon name="ArrowLeft" size={16} />
              <span>Back to Login</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RegistrationHeader;