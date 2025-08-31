import React from 'react';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const SchoolInformationForm = ({ formData, setFormData, errors }) => {
  const schoolLevels = [
    { value: 'primary', label: 'Primary School' },
    { value: 'o_level', label: 'O-Level (Secondary)' },
    { value: 'a_level', label: 'A-Level (Advanced)' },
    { value: 'combined', label: 'Combined (Primary + Secondary)' }
  ];

  const districts = [
    { value: 'kampala', label: 'Kampala' },
    { value: 'wakiso', label: 'Wakiso' },
    { value: 'mukono', label: 'Mukono' },
    { value: 'jinja', label: 'Jinja' },
    { value: 'mbale', label: 'Mbale' },
    { value: 'gulu', label: 'Gulu' },
    { value: 'mbarara', label: 'Mbarara' },
    { value: 'fort_portal', label: 'Fort Portal' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      schoolInfo: {
        ...prev?.schoolInfo,
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">School Information</h2>
        <p className="text-muted-foreground">Tell us about your educational institution</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="School Name"
            type="text"
            placeholder="Enter your school's full name"
            value={formData?.schoolInfo?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            error={errors?.schoolName}
            required
          />
        </div>

        <Select
          label="School Level"
          placeholder="Select school level"
          options={schoolLevels}
          value={formData?.schoolInfo?.level}
          onChange={(value) => handleInputChange('level', value)}
          error={errors?.schoolLevel}
          required
          id="schoolLevel"
          name="schoolLevel"
          description=""
        />

        <Input
          label="Registration Number"
          type="text"
          placeholder="e.g., REG/2023/001"
          value={formData?.schoolInfo?.registrationNumber}
          onChange={(e) => handleInputChange('registrationNumber', e?.target?.value)}
          error={errors?.registrationNumber}
          description="Official school registration number"
        />

        <Input
          label="Contact Phone"
          type="tel"
          placeholder="+256 700 000 000"
          value={formData?.schoolInfo?.phone}
          onChange={(e) => handleInputChange('phone', e?.target?.value)}
          error={errors?.phone}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="info@yourschool.ac.ug"
          value={formData?.schoolInfo?.email}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
          required
        />

        <div className="md:col-span-2">
          <Input
            label="Physical Address"
            type="text"
            placeholder="Enter complete school address"
            value={formData?.schoolInfo?.address}
            onChange={(e) => handleInputChange('address', e?.target?.value)}
            error={errors?.address}
            required
          />
        </div>

        <Select
          label="District"
          placeholder="Select district"
          options={districts}
          value={formData?.schoolInfo?.district}
          onChange={(value) => handleInputChange('district', value)}
          error={errors?.district}
          required
          searchable
          id="district"
          name="district"
          description=""
        />

        <Input
          label="Total Students (Approx.)"
          type="number"
          placeholder="e.g., 500"
          value={formData?.schoolInfo?.studentCount}
          onChange={(e) => handleInputChange('studentCount', e?.target?.value)}
          error={errors?.studentCount}
          min="1"
          description="Approximate current enrollment"
        />
      </div>
      <div className="border-t border-border pt-6">
        <div className="space-y-4">
          <Checkbox
            label="UNEB Registered School"
            description="Our school is officially registered with Uganda National Examinations Board"
            checked={formData?.schoolInfo?.unebRegistered}
            onChange={(e) => handleInputChange('unebRegistered', e?.target?.checked)}
          />
          
          <Checkbox
            label="Government Aided School"
            description="Our school receives government funding or support"
            checked={formData?.schoolInfo?.governmentAided}
            onChange={(e) => handleInputChange('governmentAided', e?.target?.checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default SchoolInformationForm;