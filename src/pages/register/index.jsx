import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import RegistrationHeader from './components/RegistrationHeader';
import StepIndicator from './components/StepIndicator';
import SchoolInformationForm from './components/SchoolInformationForm';
import AdministratorForm from './components/AdministratorForm';
import SubscriptionPlanForm from './components/SubscriptionPlanForm';
import PlanSidebar from './components/PlanSidebar';

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    schoolInfo: {
      name: '',
      level: '',
      registrationNumber: '',
      phone: '',
      email: '',
      address: '',
      district: '',
      studentCount: '',
      unebRegistered: false,
      governmentAided: false
    },
    adminInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      password: '',
      confirmPassword: ''
    },
    subscription: {
      planId: '',
      planName: '',
      price: 0,
      currency: 'UGX'
    }
  });

  const totalSteps = 3;

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData?.schoolInfo?.name?.trim()) newErrors.schoolName = 'School name is required';
      if (!formData?.schoolInfo?.level) newErrors.schoolLevel = 'School level is required';
      if (!formData?.schoolInfo?.phone?.trim()) newErrors.phone = 'Phone number is required';
      if (!formData?.schoolInfo?.email?.trim()) newErrors.email = 'Email is required';
      if (!formData?.schoolInfo?.address?.trim()) newErrors.address = 'Address is required';
      if (!formData?.schoolInfo?.district) newErrors.district = 'District is required';
      
      if (formData?.schoolInfo?.email && !/\S+@\S+\.\S+/?.test(formData?.schoolInfo?.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (step === 2) {
      if (!formData?.adminInfo?.firstName?.trim()) newErrors.firstName = 'First name is required';
      if (!formData?.adminInfo?.lastName?.trim()) newErrors.lastName = 'Last name is required';
      if (!formData?.adminInfo?.email?.trim()) newErrors.adminEmail = 'Email is required';
      if (!formData?.adminInfo?.phone?.trim()) newErrors.adminPhone = 'Phone number is required';
      if (!formData?.adminInfo?.position?.trim()) newErrors.position = 'Position is required';
      if (!formData?.adminInfo?.password) newErrors.password = 'Password is required';
      if (!formData?.adminInfo?.confirmPassword) newErrors.confirmPassword = 'Please confirm password';
      
      if (formData?.adminInfo?.email && !/\S+@\S+\.\S+/?.test(formData?.adminInfo?.email)) {
        newErrors.adminEmail = 'Please enter a valid email address';
      }
      
      if (formData?.adminInfo?.password && formData?.adminInfo?.password?.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      
      if (formData?.adminInfo?.password !== formData?.adminInfo?.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (step === 3) {
      if (!formData?.subscription?.planId) {
        newErrors.subscription = 'Please select a subscription plan';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call for registration
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock successful registration
      console.log('Registration data:', formData);
      
      // Navigate to dashboard after successful registration
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedPlan = () => {
    if (!formData?.subscription?.planId) return null;
    
    const plans = [
      {
        id: 'standard',
        name: 'Standard',
        price: 150000,
        description: 'Perfect for small to medium schools',
        features: [
          'Up to 500 students',
          'Basic report card generation',
          'Student management',
          'Assessment input',
          'Email support',
          'UNEB compliance'
        ]
      },
      {
        id: 'pro',
        name: 'Professional',
        price: 300000,
        description: 'Advanced features for growing schools',
        features: [
          'Up to 1,500 students',
          'Advanced report cards',
          'Custom branding',
          'Bulk operations',
          'Advanced analytics',
          'Parent portal access',
          'Priority support',
          'UNEB compliance',
          'Data export tools'
        ]
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 500000,
        description: 'Complete solution for large institutions',
        features: [
          'Unlimited students',
          'Multi-campus support',
          'Full customization',
          'API access',
          'Advanced integrations',
          'Dedicated support',
          'Custom training',
          'UNEB compliance',
          'White-label options'
        ]
      }
    ];
    
    return plans?.find(plan => plan?.id === formData?.subscription?.planId);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <SchoolInformationForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        );
      case 2:
        return (
          <AdministratorForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        );
      case 3:
        return (
          <SubscriptionPlanForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <RegistrationHeader />
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 min-h-[calc(100vh-4rem)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
            
            <div className="bg-card rounded-xl border border-border shadow-sm p-8">
              {renderStepContent()}
              
              {errors?.submit && (
                <div className="mt-6 bg-error/10 border border-error/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Icon name="AlertCircle" size={20} className="text-error mt-0.5" />
                    <p className="text-sm text-error">{errors?.submit}</p>
                  </div>
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1 || isLoading}
                  className="flex items-center space-x-2"
                >
                  <Icon name="ArrowLeft" size={16} />
                  <span>Back</span>
                </Button>
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">
                    Step {currentStep} of {totalSteps}
                  </span>
                  
                  <Button
                    onClick={handleNext}
                    loading={isLoading}
                    disabled={isLoading}
                    className="flex items-center space-x-2 min-w-32"
                  >
                    {isLoading ? (
                      <>
                        <Icon name="Loader2" size={16} className="animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : currentStep === totalSteps ? (
                      <>
                        <Icon name="Check" size={16} />
                        <span>Complete Registration</span>
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <Icon name="ArrowRight" size={16} />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <PlanSidebar selectedPlan={getSelectedPlan()} />
      </div>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Loader2" size={32} color="var(--color-primary-foreground)" className="animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Creating Your Account</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Setting up your school's SAAS platform. This may take a few moments...
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-center space-x-2">
                <Icon name="Check" size={14} className="text-success" />
                <span>Validating school information</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Icon name="Check" size={14} className="text-success" />
                <span>Creating administrator account</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Icon name="Loader2" size={14} className="animate-spin text-primary" />
                <span>Processing subscription</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;