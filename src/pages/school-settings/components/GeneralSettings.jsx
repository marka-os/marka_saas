import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const GeneralSettings = ({ onChanges }) => {
  const [formData, setFormData] = useState({
    schoolName: 'Kampala International School',
    motto: 'Excellence in Education',
    address: '123 Education Avenue, Kampala, Uganda',
    phone: '+256-700-123456',
    email: 'admin@kis.ac.ug',
    website: 'www.kis.ac.ug',
    unebRegistration: 'UNEB-2023-001',
    foundedYear: '1995',
    schoolType: 'Private',
    logoUrl: ''
  });

  const [logoFile, setLogoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onChanges?.(true);
  };

  const handleLogoUpload = async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    setLogoFile(file);
    setUploading(true);
    
    // Mock upload process
    setTimeout(() => {
      setFormData(prev => ({ 
        ...prev, 
        logoUrl: URL.createObjectURL(file) 
      }));
      setUploading(false);
      onChanges?.(true);
    }, 1500);
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, logoUrl: '' }));
    setLogoFile(null);
    onChanges?.(true);
  };

  return (
    <div className="space-y-8">
      {/* School Identity Section */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Building" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">School Identity</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Logo Upload Section */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              School Logo
            </label>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-border bg-muted flex items-center justify-center overflow-hidden">
                  {formData?.logoUrl ? (
                    <img 
                      src={formData?.logoUrl} 
                      alt="School Logo" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Icon name="ImagePlus" size={24} className="text-muted-foreground" />
                  )}
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    disabled={uploading}
                    loading={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload Logo'}
                  </Button>
                  {formData?.logoUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveLogo}
                      className="text-error hover:text-error"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG up to 2MB. Recommended size: 200x200px
                </p>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <Input
            label="School Name"
            value={formData?.schoolName}
            onChange={(e) => handleInputChange('schoolName', e?.target?.value)}
            required
            placeholder="Enter school name"
          />

          <Input
            label="School Motto"
            value={formData?.motto}
            onChange={(e) => handleInputChange('motto', e?.target?.value)}
            placeholder="Enter school motto"
          />

          <Input
            label="Founded Year"
            type="number"
            value={formData?.foundedYear}
            onChange={(e) => handleInputChange('foundedYear', e?.target?.value)}
            placeholder="2000"
          />

          <Input
            label="School Type"
            value={formData?.schoolType}
            onChange={(e) => handleInputChange('schoolType', e?.target?.value)}
            placeholder="Public/Private"
          />
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Phone" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <Input
              label="Address"
              value={formData?.address}
              onChange={(e) => handleInputChange('address', e?.target?.value)}
              placeholder="Enter full address"
            />
          </div>

          <Input
            label="Phone Number"
            type="tel"
            value={formData?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            placeholder="+256-700-000000"
          />

          <Input
            label="Email Address"
            type="email"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            placeholder="admin@school.edu"
          />

          <Input
            label="Website"
            type="url"
            value={formData?.website}
            onChange={(e) => handleInputChange('website', e?.target?.value)}
            placeholder="www.yourschool.edu"
          />

          <Input
            label="UNEB Registration"
            value={formData?.unebRegistration}
            onChange={(e) => handleInputChange('unebRegistration', e?.target?.value)}
            placeholder="UNEB-YYYY-XXX"
            description="Uganda National Examinations Board registration number"
          />
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="HelpCircle" size={20} className="text-muted-foreground mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Need Help?</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Your school information will be displayed on report cards and official documents.
            </p>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;