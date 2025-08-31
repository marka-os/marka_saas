import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const StudentModal = ({ 
  isOpen, 
  onClose, 
  student, 
  onSave, 
  mode = 'add' // 'add', 'edit', 'view'
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    lin: '',
    class: '',
    stream: '',
    dateOfBirth: '',
    gender: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    status: 'active',
    photo: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    if (student && mode !== 'add') {
      setFormData({
        firstName: student?.firstName || '',
        lastName: student?.lastName || '',
        email: student?.email || '',
        lin: student?.lin || '',
        class: student?.class || '',
        stream: student?.stream || '',
        dateOfBirth: student?.dateOfBirth || '',
        gender: student?.gender || '',
        parentName: student?.parentName || '',
        parentPhone: student?.parentPhone || '',
        parentEmail: student?.parentEmail || '',
        address: student?.address || '',
        status: student?.status || 'active',
        photo: student?.photo || ''
      });
    } else {
      // Reset form for add mode
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        lin: '',
        class: '',
        stream: '',
        dateOfBirth: '',
        gender: '',
        parentName: '',
        parentPhone: '',
        parentEmail: '',
        address: '',
        status: 'active',
        photo: ''
      });
    }
    setErrors({});
    setActiveTab('personal');
  }, [student, mode, isOpen]);

  const classOptions = [
    { value: 'P1', label: 'Primary 1' },
    { value: 'P2', label: 'Primary 2' },
    { value: 'P3', label: 'Primary 3' },
    { value: 'P4', label: 'Primary 4' },
    { value: 'P5', label: 'Primary 5' },
    { value: 'P6', label: 'Primary 6' },
    { value: 'P7', label: 'Primary 7' },
    { value: 'S1', label: 'Senior 1' },
    { value: 'S2', label: 'Senior 2' },
    { value: 'S3', label: 'Senior 3' },
    { value: 'S4', label: 'Senior 4' },
    { value: 'S5', label: 'Senior 5' },
    { value: 'S6', label: 'Senior 6' }
  ];

  const streamOptions = [
    { value: 'A', label: 'Stream A' },
    { value: 'B', label: 'Stream B' },
    { value: 'C', label: 'Stream C' },
    { value: 'D', label: 'Stream D' }
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'graduated', label: 'Graduated' },
    { value: 'transferred', label: 'Transferred' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData?.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!formData?.email?.trim()) newErrors.email = 'Email is required';
    if (!formData?.lin?.trim()) newErrors.lin = 'LIN number is required';
    if (!formData?.class) newErrors.class = 'Class is required';
    if (!formData?.stream) newErrors.stream = 'Stream is required';
    if (!formData?.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData?.gender) newErrors.gender = 'Gender is required';
    if (!formData?.parentName?.trim()) newErrors.parentName = 'Parent name is required';
    if (!formData?.parentPhone?.trim()) newErrors.parentPhone = 'Parent phone is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData?.email && !emailRegex?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving student:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: 'User' },
    { id: 'academic', label: 'Academic Info', icon: 'GraduationCap' },
    { id: 'contact', label: 'Contact Info', icon: 'Phone' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1000 p-4">
      <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {mode === 'add' ? 'Add New Student' : 
                 mode === 'edit' ? 'Edit Student' : 'Student Profile'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {mode === 'add' ? 'Enter student information below' :
                 mode === 'edit' ? 'Update student information' : 'View student details'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-8 px-6">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span className="font-medium">{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <form onSubmit={handleSubmit}>
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                {/* Photo Section */}
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={formData?.photo || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`}
                      alt="Student photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {mode !== 'view' && (
                    <div>
                      <Button variant="outline" size="sm">
                        <Icon name="Upload" size={16} className="mr-2" />
                        Upload Photo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG up to 2MB
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    type="text"
                    value={formData?.firstName}
                    onChange={(e) => handleInputChange('firstName', e?.target?.value)}
                    error={errors?.firstName}
                    required
                    disabled={mode === 'view'}
                  />
                  
                  <Input
                    label="Last Name"
                    type="text"
                    value={formData?.lastName}
                    onChange={(e) => handleInputChange('lastName', e?.target?.value)}
                    error={errors?.lastName}
                    required
                    disabled={mode === 'view'}
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData?.email}
                    onChange={(e) => handleInputChange('email', e?.target?.value)}
                    error={errors?.email}
                    required
                    disabled={mode === 'view'}
                  />
                  
                  <Input
                    label="LIN Number"
                    type="text"
                    value={formData?.lin}
                    onChange={(e) => handleInputChange('lin', e?.target?.value)}
                    error={errors?.lin}
                    required
                    disabled={mode === 'view'}
                    description="Learner Identification Number"
                  />
                  
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={formData?.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e?.target?.value)}
                    error={errors?.dateOfBirth}
                    required
                    disabled={mode === 'view'}
                  />
                  
                  <Select
                    label="Gender"
                    options={genderOptions}
                    value={formData?.gender}
                    onChange={(value) => handleInputChange('gender', value)}
                    error={errors?.gender}
                    required
                    disabled={mode === 'view'}
                    id="gender"
                    name="gender"
                    description=""
                  />
                </div>
              </div>
            )}

            {/* Academic Info Tab */}
            {activeTab === 'academic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Class"
                    options={classOptions}
                    value={formData?.class}
                    onChange={(value) => handleInputChange('class', value)}
                    error={errors?.class}
                    required
                    disabled={mode === 'view'}
                    id="class"
                    name="class"
                    description=""
                  />
                  
                  <Select
                    label="Stream"
                    options={streamOptions}
                    value={formData?.stream}
                    onChange={(value) => handleInputChange('stream', value)}
                    error={errors?.stream}
                    required
                    disabled={mode === 'view'}
                    id="stream"
                    name="stream"
                    description=""
                  />
                  
                  <Select
                    label="Status"
                    options={statusOptions}
                    value={formData?.status}
                    onChange={(value) => handleInputChange('status', value)}
                    disabled={mode === 'view'}
                    id="status"
                    name="status"
                    description=""
                    error=""
                  />
                </div>
              </div>
            )}

            {/* Contact Info Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Parent/Guardian Name"
                    type="text"
                    value={formData?.parentName}
                    onChange={(e) => handleInputChange('parentName', e?.target?.value)}
                    error={errors?.parentName}
                    required
                    disabled={mode === 'view'}
                  />
                  
                  <Input
                    label="Parent Phone Number"
                    type="tel"
                    value={formData?.parentPhone}
                    onChange={(e) => handleInputChange('parentPhone', e?.target?.value)}
                    error={errors?.parentPhone}
                    required
                    disabled={mode === 'view'}
                  />
                  
                  <Input
                    label="Parent Email"
                    type="email"
                    value={formData?.parentEmail}
                    onChange={(e) => handleInputChange('parentEmail', e?.target?.value)}
                    disabled={mode === 'view'}
                  />
                </div>
                
                <Input
                  label="Home Address"
                  type="text"
                  value={formData?.address}
                  onChange={(e) => handleInputChange('address', e?.target?.value)}
                  disabled={mode === 'view'}
                  description="Full residential address"
                />
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        {mode !== 'view' && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={handleSubmit}
              loading={isLoading}
            >
              {mode === 'add' ? 'Add Student' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentModal;