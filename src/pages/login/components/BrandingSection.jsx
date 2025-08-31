import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const BrandingSection = () => {
  const trustSignals = [
    {
      icon: 'Shield',
      title: 'UNEB Compliant',
      description: 'Fully compliant with Uganda National Examinations Board standards'
    },
    {
      icon: 'Award',
      title: 'Certified Platform',
      description: 'Approved by Ministry of Education and Sports Uganda'
    },
    {
      icon: 'Users',
      title: '500+ Schools',
      description: 'Trusted by educational institutions across Uganda'
    },
    {
      icon: 'Lock',
      title: 'Secure & Private',
      description: 'Bank-level security for student data protection'
    }
  ];

  const schoolLogos = [
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=120&h=80&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=120&h=80&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1562774053-701939374585?w=120&h=80&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=120&h=80&fit=crop&crop=center'
  ];

  return (
    <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-success/5 p-8 lg:p-12 flex flex-col justify-center min-h-full">
      {/* Main Logo and Branding */}
      <div className="mb-12">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
            <Icon name="GraduationCap" size={32} color="var(--color-primary-foreground)" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Marka SAAS</h1>
            <p className="text-muted-foreground">UNEB Report Card Management</p>
          </div>
        </div>
        
        <p className="text-lg text-foreground/80 leading-relaxed">
          Streamline your school's academic assessment management with our comprehensive 
          UNEB-compliant platform designed specifically for Ugandan educational institutions.
        </p>
      </div>
      {/* Trust Signals */}
      <div className="space-y-6 mb-12">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Why Schools Choose Marka SAAS
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trustSignals?.map((signal, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-card/50 rounded-lg border border-border/50">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={signal?.icon} size={20} color="var(--color-primary)" />
              </div>
              <div>
                <h3 className="font-medium text-foreground text-sm">{signal?.title}</h3>
                <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                  {signal?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* School Testimonials */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Trusted by Leading Schools
        </h3>
        
        <div className="bg-card/30 rounded-lg p-6 border border-border/50">
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <Icon name="Quote" size={20} color="var(--color-success)" />
            </div>
            <div>
              <p className="text-foreground/90 text-sm leading-relaxed mb-3">
                "Marka SAAS has transformed how we manage student assessments. The UNEB compliance 
                features and automated report generation have saved us countless hours while ensuring 
                accuracy in our academic records."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="var(--color-secondary-foreground)" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Sarah Nakato</p>
                  <p className="text-muted-foreground text-xs">Head Teacher, Kampala International School</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Partner Schools */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">
          PARTNER SCHOOLS
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {schoolLogos?.map((logo, index) => (
            <div key={index} className="bg-card/50 rounded-lg p-3 border border-border/50 overflow-hidden">
              <Image
                src={logo}
                alt={`Partner school ${index + 1}`}
                className="w-full h-12 object-cover rounded"
              />
            </div>
          ))}
        </div>
      </div>
      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-border/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <p>&copy; {new Date()?.getFullYear()} Marka SAAS. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Icon name="Shield" size={12} />
              <span>UNEB Certified</span>
            </span>
            <span className="flex items-center space-x-1">
              <Icon name="Lock" size={12} />
              <span>SSL Secured</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingSection;