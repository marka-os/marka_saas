import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AdministratorForm = ({ formData, setFormData, errors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      adminInfo: {
        ...prev?.adminInfo,
        [field]: value
      }
    }));
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars?.charAt(Math.floor(Math.random() * chars?.length));
    }
    handleInputChange('password', password);
    handleInputChange('confirmPassword', password);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Administrator Account</h2>
        <p className="text-muted-foreground">Create the primary administrator account for your school</p>
      </div>
      <div className="bg-muted rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Administrator Privileges</p>
            <p className="text-xs text-muted-foreground mt-1">
              This account will have full access to manage students, teachers, assessments, and school settings.
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          type="text"
          placeholder="Enter first name"
          value={formData?.adminInfo?.firstName}
          onChange={(e) => handleInputChange('firstName', e?.target?.value)}
          error={errors?.firstName}
          required
        />

        <Input
          label="Last Name"
          type="text"
          placeholder="Enter last name"
          value={formData?.adminInfo?.lastName}
          onChange={(e) => handleInputChange('lastName', e?.target?.value)}
          error={errors?.lastName}
          required
        />

        <div className="md:col-span-2">
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@yourschool.ac.ug"
            value={formData?.adminInfo?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.adminEmail}
            description="This will be used for login and system notifications"
            required
          />
        </div>

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+256 700 000 000"
          value={formData?.adminInfo?.phone}
          onChange={(e) => handleInputChange('phone', e?.target?.value)}
          error={errors?.adminPhone}
          required
        />

        <Input
          label="Position/Title"
          type="text"
          placeholder="e.g., Head Teacher, Principal"
          value={formData?.adminInfo?.position}
          onChange={(e) => handleInputChange('position', e?.target?.value)}
          error={errors?.position}
          required
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={formData?.adminInfo?.password}
            onChange={(e) => handleInputChange('password', e?.target?.value)}
            error={errors?.password}
            description="Minimum 8 characters with letters, numbers, and symbols"
            required
          />
          <div className="absolute right-3 top-9 flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="h-8 w-8"
            >
              <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
            </Button>
            <Button
              variant="ghost"
              size="xs"
              type="button"
              onClick={generatePassword}
              className="text-xs"
            >
              Generate
            </Button>
          </div>
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData?.adminInfo?.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
            error={errors?.confirmPassword}
            required
          />
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 h-8 w-8"
          >
            <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={16} />
          </Button>
        </div>
      </div>
      <div className="border-t border-border pt-6">
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={20} className="text-success mt-0.5" />
            <div>
              <p className="text-sm font-medium text-success">Security Notice</p>
              <p className="text-xs text-success/80 mt-1">
                Your password will be encrypted and stored securely. You can change it anytime from your profile settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministratorForm;