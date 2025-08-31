import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const UserManagementSettings = ({ onChanges }) => {
  const [roles, setRoles] = useState([
    {
      name: 'Administrator',
      permissions: ['manage_users', 'manage_settings', 'view_reports', 'manage_students'],
      userCount: 2,
      canEdit: false
    },
    {
      name: 'Teacher',
      permissions: ['view_reports', 'manage_assessments', 'view_students'],
      userCount: 25,
      canEdit: true
    },
    {
      name: 'Parent',
      permissions: ['view_reports'],
      userCount: 450,
      canEdit: true
    }
  ]);

  const [parentPortalSettings, setParentPortalSettings] = useState({
    enabled: true,
    registrationOpen: true,
    requireApproval: true,
    allowProfileEdit: false,
    emailNotifications: true
  });

  const [invitations, setInvitations] = useState([
    {
      email: 'john.teacher@email.com',
      role: 'Teacher',
      status: 'pending',
      sentDate: '2024-01-15',
      id: 1
    },
    {
      email: 'mary.parent@email.com',
      role: 'Parent',
      status: 'accepted',
      sentDate: '2024-01-10',
      id: 2
    }
  ]);

  const [newInvite, setNewInvite] = useState({ email: '', role: 'Teacher' });

  const availablePermissions = [
    { id: 'manage_users', label: 'Manage Users', description: 'Add, edit, and remove users' },
    { id: 'manage_settings', label: 'Manage Settings', description: 'Configure system settings' },
    { id: 'view_reports', label: 'View Reports', description: 'Access student reports' },
    { id: 'manage_students', label: 'Manage Students', description: 'Add, edit student information' },
    { id: 'manage_assessments', label: 'Manage Assessments', description: 'Input and edit grades' },
    { id: 'view_students', label: 'View Students', description: 'View student information' }
  ];

  const roleOptions = [
    { value: 'Teacher', label: 'Teacher' },
    { value: 'Parent', label: 'Parent' },
    { value: 'Assistant', label: 'Assistant' }
  ];

  const handleRolePermissionChange = (roleIndex, permissionId) => {
    const updated = [...roles];
    const permissions = updated?.[roleIndex]?.permissions || [];
    
    if (permissions?.includes(permissionId)) {
      updated[roleIndex].permissions = permissions?.filter(p => p !== permissionId);
    } else {
      updated[roleIndex].permissions = [...permissions, permissionId];
    }
    
    setRoles(updated);
    onChanges?.(true);
  };

  const handleParentPortalChange = (field, value) => {
    setParentPortalSettings(prev => ({ ...prev, [field]: value }));
    onChanges?.(true);
  };

  const handleSendInvitation = () => {
    if (!newInvite?.email) return;

    const invitation = {
      email: newInvite?.email,
      role: newInvite?.role,
      status: 'pending',
      sentDate: new Date()?.toISOString()?.split('T')?.[0],
      id: Date.now()
    };

    setInvitations(prev => [invitation, ...prev]);
    setNewInvite({ email: '', role: 'Teacher' });
    onChanges?.(true);
  };

  const handleResendInvitation = (inviteId) => {
    setInvitations(prev => prev?.map(invite => 
      invite?.id === inviteId 
        ? { ...invite, sentDate: new Date()?.toISOString()?.split('T')?.[0] }
        : invite
    ));
    onChanges?.(true);
  };

  const handleRevokeInvitation = (inviteId) => {
    setInvitations(prev => prev?.filter(invite => invite?.id !== inviteId));
    onChanges?.(true);
  };

  return (
    <div className="space-y-8">
      {/* Role-based Access Control */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Shield" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Role-based Access Control</h3>
        </div>

        <div className="space-y-6">
          {roles?.map((role, roleIndex) => (
            <div key={roleIndex} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-foreground">{role?.name}</h4>
                  <p className="text-sm text-muted-foreground">{role?.userCount} users</p>
                </div>
                {role?.canEdit && (
                  <Button variant="outline" size="sm">
                    Edit Role
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {availablePermissions?.map(permission => (
                  <div key={permission?.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${roleIndex}-${permission?.id}`}
                      checked={role?.permissions?.includes(permission?.id)}
                      onChange={() => handleRolePermissionChange(roleIndex, permission?.id)}
                      disabled={!role?.canEdit}
                      className="w-4 h-4 text-primary"
                    />
                    <label 
                      htmlFor={`${roleIndex}-${permission?.id}`}
                      className="text-sm text-foreground"
                    >
                      {permission?.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Parent Portal Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Users" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Parent Portal Settings</h3>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="portal-enabled"
                  checked={parentPortalSettings?.enabled}
                  onChange={(e) => handleParentPortalChange('enabled', e?.target?.checked)}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="portal-enabled" className="text-sm font-medium text-foreground">
                  Enable Parent Portal
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="registration-open"
                  checked={parentPortalSettings?.registrationOpen}
                  onChange={(e) => handleParentPortalChange('registrationOpen', e?.target?.checked)}
                  disabled={!parentPortalSettings?.enabled}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="registration-open" className="text-sm font-medium text-foreground">
                  Allow Self Registration
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="require-approval"
                  checked={parentPortalSettings?.requireApproval}
                  onChange={(e) => handleParentPortalChange('requireApproval', e?.target?.checked)}
                  disabled={!parentPortalSettings?.enabled}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="require-approval" className="text-sm font-medium text-foreground">
                  Require Admin Approval
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="allow-profile-edit"
                  checked={parentPortalSettings?.allowProfileEdit}
                  onChange={(e) => handleParentPortalChange('allowProfileEdit', e?.target?.checked)}
                  disabled={!parentPortalSettings?.enabled}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="allow-profile-edit" className="text-sm font-medium text-foreground">
                  Allow Profile Editing
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="email-notifications"
                  checked={parentPortalSettings?.emailNotifications}
                  onChange={(e) => handleParentPortalChange('emailNotifications', e?.target?.checked)}
                  disabled={!parentPortalSettings?.enabled}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="email-notifications" className="text-sm font-medium text-foreground">
                  Email Notifications
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Invitations */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="UserPlus" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">User Invitations</h3>
        </div>

        {/* Send New Invitation */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-muted rounded-lg">
          <div className="flex-1">
            <Input
              placeholder="Email address"
              type="email"
              value={newInvite?.email}
              onChange={(e) => setNewInvite(prev => ({ ...prev, email: e?.target?.value }))}
            />
          </div>
          <Select
            value={newInvite?.role}
            onChange={(value) => setNewInvite(prev => ({ ...prev, role: value }))}
            options={roleOptions}
            className="w-full sm:w-40"
          />
          <Button
            onClick={handleSendInvitation}
            disabled={!newInvite?.email}
            className="w-full sm:w-auto"
          >
            Send Invitation
          </Button>
        </div>

        {/* Invitations List */}
        <div className="space-y-3">
          {invitations?.map(invitation => (
            <div key={invitation?.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="font-medium text-foreground">{invitation?.email}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{invitation?.role}</span>
                      <span>•</span>
                      <span>Sent {invitation?.sentDate}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    invitation?.status === 'accepted' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                  }`}>
                    {invitation?.status}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {invitation?.status === 'pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResendInvitation(invitation?.id)}
                  >
                    Resend
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRevokeInvitation(invitation?.id)}
                  className="text-error hover:text-error"
                >
                  Revoke
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagementSettings;