import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SystemPreferences = ({ onChanges }) => {
  const [notifications, setNotifications] = useState({
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    reportGeneration: true,
    systemAlerts: true,
    parentUpdates: true,
    teacherReminders: true
  });

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    frequency: 'daily',
    retentionPeriod: '30',
    lastBackup: '2024-01-20 14:30:00'
  });

  const [integrations, setIntegrations] = useState({
    googleWorkspace: { enabled: false, configured: false },
    microsoftOffice: { enabled: true, configured: true },
    parentPortal: { enabled: true, configured: true },
    smsGateway: { enabled: false, configured: false }
  });

  const [systemSettings, setSystemSettings] = useState({
    timezone: 'Africa/Kampala',
    dateFormat: 'DD/MM/YYYY',
    currency: 'UGX',
    language: 'en',
    sessionTimeout: '30'
  });

  const backupFrequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const timezoneOptions = [
    { value: 'Africa/Kampala', label: 'East Africa Time (UTC+3)' },
    { value: 'UTC', label: 'Universal Time (UTC)' },
    { value: 'Africa/Cairo', label: 'Egypt Time (UTC+2)' },
    { value: 'Africa/Lagos', label: 'West Africa Time (UTC+1)' }
  ];

  const dateFormatOptions = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
  ];

  const currencyOptions = [
    { value: 'UGX', label: 'Ugandan Shilling (UGX)' },
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' }
  ];

  const handleNotificationChange = (field, value) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
    onChanges?.(true);
  };

  const handleBackupSettingChange = (field, value) => {
    setBackupSettings(prev => ({ ...prev, [field]: value }));
    onChanges?.(true);
  };

  const handleSystemSettingChange = (field, value) => {
    setSystemSettings(prev => ({ ...prev, [field]: value }));
    onChanges?.(true);
  };

  const handleIntegrationToggle = (integration) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: {
        ...prev?.[integration],
        enabled: !prev?.[integration]?.enabled
      }
    }));
    onChanges?.(true);
  };

  const handleManualBackup = () => {
    console.log('Starting manual backup...');
    setBackupSettings(prev => ({
      ...prev,
      lastBackup: new Date()?.toISOString()?.replace('T', ' ')?.slice(0, 19)
    }));
  };

  return (
    <div className="space-y-8">
      {/* Notification Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Bell" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Notification Settings</h3>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Notification Channels</h4>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="email-enabled"
                  checked={notifications?.emailEnabled}
                  onChange={(e) => handleNotificationChange('emailEnabled', e?.target?.checked)}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="email-enabled" className="text-sm text-foreground">
                  Email Notifications
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="sms-enabled"
                  checked={notifications?.smsEnabled}
                  onChange={(e) => handleNotificationChange('smsEnabled', e?.target?.checked)}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="sms-enabled" className="text-sm text-foreground">
                  SMS Notifications
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="push-enabled"
                  checked={notifications?.pushEnabled}
                  onChange={(e) => handleNotificationChange('pushEnabled', e?.target?.checked)}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="push-enabled" className="text-sm text-foreground">
                  Push Notifications
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-foreground">System Notifications</h4>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="report-generation"
                  checked={notifications?.reportGeneration}
                  onChange={(e) => handleNotificationChange('reportGeneration', e?.target?.checked)}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="report-generation" className="text-sm text-foreground">
                  Report Generation
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="system-alerts"
                  checked={notifications?.systemAlerts}
                  onChange={(e) => handleNotificationChange('systemAlerts', e?.target?.checked)}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="system-alerts" className="text-sm text-foreground">
                  System Alerts
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-foreground">User Notifications</h4>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="parent-updates"
                  checked={notifications?.parentUpdates}
                  onChange={(e) => handleNotificationChange('parentUpdates', e?.target?.checked)}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="parent-updates" className="text-sm text-foreground">
                  Parent Updates
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="teacher-reminders"
                  checked={notifications?.teacherReminders}
                  onChange={(e) => handleNotificationChange('teacherReminders', e?.target?.checked)}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="teacher-reminders" className="text-sm text-foreground">
                  Teacher Reminders
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Backup Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Database" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Data Backup Settings</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <input
              type="checkbox"
              id="auto-backup"
              checked={backupSettings?.autoBackup}
              onChange={(e) => handleBackupSettingChange('autoBackup', e?.target?.checked)}
              className="w-4 h-4 text-primary"
            />
            <label htmlFor="auto-backup" className="text-sm font-medium text-foreground">
              Enable Automatic Backup
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select
              label="Backup Frequency"
              value={backupSettings?.frequency}
              onChange={(value) => handleBackupSettingChange('frequency', value)}
              options={backupFrequencyOptions}
              disabled={!backupSettings?.autoBackup}
              description=""
              error=""
              id="backup-frequency"
              name="frequency"
            />

            <Input
              label="Retention Period (days)"
              type="number"
              value={backupSettings?.retentionPeriod}
              onChange={(e) => handleBackupSettingChange('retentionPeriod', e?.target?.value)}
              disabled={!backupSettings?.autoBackup}
              min="1"
              max="365"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Last Backup</label>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground flex-1">
                  {backupSettings?.lastBackup}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualBackup}
                >
                  Backup Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Zap" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Integration Settings</h3>
        </div>

        <div className="space-y-4">
          {Object.entries(integrations)?.map(([key, integration]) => (
            <div key={key} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  integration?.configured && integration?.enabled 
                    ? 'bg-success' 
                    : integration?.enabled 
                      ? 'bg-warning' :'bg-muted-foreground'
                }`} />
                <div>
                  <h4 className="font-medium text-foreground capitalize">
                    {key?.replace(/([A-Z])/g, ' $1')?.trim()}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {integration?.configured && integration?.enabled 
                      ? 'Connected and configured' 
                      : integration?.enabled 
                        ? 'Enabled but needs configuration' :'Disabled'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={integration?.enabled}
                  onChange={() => handleIntegrationToggle(key)}
                  className="w-4 h-4 text-primary"
                />
                {integration?.enabled && (
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Configuration */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Globe" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">System Configuration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Timezone"
            value={systemSettings?.timezone}
            onChange={(value) => handleSystemSettingChange('timezone', value)}
            options={timezoneOptions}
            description=""
            error=""
            id="timezone"
            name="timezone"
          />

          <Select
            label="Date Format"
            value={systemSettings?.dateFormat}
            onChange={(value) => handleSystemSettingChange('dateFormat', value)}
            options={dateFormatOptions}
            description=""
            error=""
            id="date-format"
            name="dateFormat"
          />

          <Select
            label="Currency"
            value={systemSettings?.currency}
            onChange={(value) => handleSystemSettingChange('currency', value)}
            options={currencyOptions}
            description=""
            error=""
            id="currency"
            name="currency"
          />

          <Input
            label="Session Timeout (minutes)"
            type="number"
            value={systemSettings?.sessionTimeout}
            onChange={(e) => handleSystemSettingChange('sessionTimeout', e?.target?.value)}
            min="5"
            max="480"
            description="How long users stay logged in while inactive"
          />
        </div>
      </div>
    </div>
  );
};

export default SystemPreferences;