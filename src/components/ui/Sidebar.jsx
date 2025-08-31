import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, isOpen = false, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('');

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      description: 'Overview and analytics'
    },
    {
      label: 'Students',
      path: '/student-management',
      icon: 'Users',
      description: 'Student management'
    },
    {
      label: 'Assessments',
      path: '/assessment-input',
      icon: 'ClipboardList',
      description: 'Assessment entry'
    },
    {
      label: 'Reports',
      path: '/report-card-generation',
      icon: 'FileText',
      description: 'Report generation'
    },
    {
      label: 'Settings',
      path: '/school-settings',
      icon: 'Settings',
      description: 'School configuration'
    },
    {
      label: 'Subscription',
      path: '/subscription-management',
      icon: 'Crown',
      description: 'Plan & usage'
    },
    {
      label: 'Billing',
      path: '/billing-management',
      icon: 'CreditCard',
      description: 'Billing & payments'
    }
  ];

  useEffect(() => {
    const currentPath = location?.pathname;
    const activeNav = navigationItems?.find(item => item?.path === currentPath);
    setActiveItem(activeNav ? activeNav?.path : '');
  }, [location?.pathname]);

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  const handleKeyDown = (event, path) => {
    if (event?.key === 'Enter' || event?.key === ' ') {
      event?.preventDefault();
      handleNavigation(path);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-900 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      {/* Sidebar */}
      <aside 
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] bg-card border-r border-border z-900
          transition-transform duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-72'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems?.map((item) => {
              const isActive = activeItem === item?.path;
              
              return (
                <div
                  key={item?.path}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleNavigation(item?.path)}
                  onKeyDown={(e) => handleKeyDown(e, item?.path)}
                  className={`
                    group relative flex items-center px-3 py-3 rounded-lg cursor-pointer
                    transition-all duration-200 ease-out
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-card' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }
                    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                  `}
                  aria-label={`Navigate to ${item?.label}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <Icon 
                      name={item?.icon} 
                      size={20} 
                      className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`}
                      color={isActive ? 'var(--color-primary-foreground)' : 'currentColor'}
                    />
                    
                    {!isCollapsed && (
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">
                          {item?.label}
                        </p>
                        <p className={`text-xs truncate mt-0.5 ${
                          isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                        }`}>
                          {item?.description}
                        </p>
                      </div>
                    )}
                  </div>
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute right-2 w-2 h-2 bg-accent rounded-full" />
                  )}
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-modal opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-1100 whitespace-nowrap">
                      <p className="font-medium text-sm text-popover-foreground">{item?.label}</p>
                      <p className="text-xs text-muted-foreground">{item?.description}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-border">
            {!isCollapsed && (
              <div className="bg-muted rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                    <Icon name="CheckCircle" size={16} color="var(--color-success-foreground)" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">System Status</p>
                    <p className="text-xs text-success">All systems operational</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Students:</span>
                    <span className="font-mono">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Users:</span>
                    <span className="font-mono">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Sync:</span>
                    <span className="font-mono">2 min ago</span>
                  </div>
                </div>
              </div>
            )}

            <Button
              variant="ghost"
              size={isCollapsed ? "icon" : "sm"}
              fullWidth={!isCollapsed}
              className="text-muted-foreground hover:text-foreground"
              onClick={() => console.log('Help clicked')}
            >
              <Icon name="HelpCircle" size={16} />
              {!isCollapsed && <span className="ml-2">Help & Support</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;