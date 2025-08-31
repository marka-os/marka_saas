import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ onMenuToggle, isMenuOpen = false }) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleUserDropdownToggle = () => {
    setUserDropdownOpen(!userDropdownOpen);
    setNotificationsOpen(false);
  };

  const handleNotificationsToggle = () => {
    setNotificationsOpen(!notificationsOpen);
    setUserDropdownOpen(false);
  };

  const handleLogout = () => {
    // Logout logic here
    console.log('Logging out...');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-1000 h-16">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Section - Logo and Menu Toggle */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">M</span>
            </div>
            <span className="font-semibold text-lg text-foreground hidden sm:block">
              Marka SAAS
            </span>
          </div>
        </div>

        {/* Right Section - Notifications and User Menu */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNotificationsToggle}
              className="relative"
              aria-label="Notifications"
            >
              <Icon name="Bell" size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full flex items-center justify-center">
                <span className="text-error-foreground text-xs font-medium">3</span>
              </span>
            </Button>

            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-modal z-1100">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium text-popover-foreground">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-border hover:bg-muted transition-colors duration-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-popover-foreground">New assessment submitted for Grade 7A</p>
                        <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-b border-border hover:bg-muted transition-colors duration-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-popover-foreground">Report cards generated successfully</p>
                        <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-muted transition-colors duration-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-popover-foreground">System maintenance scheduled for tonight</p>
                        <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-border">
                  <Button variant="ghost" size="sm" fullWidth>
                    View All Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={handleUserDropdownToggle}
              className="flex items-center space-x-2 px-3"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="var(--color-secondary-foreground)" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">Sarah Nakato</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`}
              />
            </Button>

            {userDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-modal z-1100">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} color="var(--color-secondary-foreground)" />
                    </div>
                    <div>
                      <p className="font-medium text-popover-foreground">Sarah Nakato</p>
                      <p className="text-sm text-muted-foreground">Administrator</p>
                      <p className="text-xs text-muted-foreground">Kampala International School</p>
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left hover:bg-muted transition-colors duration-200 flex items-center space-x-3">
                    <Icon name="User" size={16} />
                    <span className="text-sm text-popover-foreground">Profile Settings</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-muted transition-colors duration-200 flex items-center space-x-3">
                    <Icon name="Building" size={16} />
                    <span className="text-sm text-popover-foreground">School Settings</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-muted transition-colors duration-200 flex items-center space-x-3">
                    <Icon name="Settings" size={16} />
                    <span className="text-sm text-popover-foreground">System Settings</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-muted transition-colors duration-200 flex items-center space-x-3">
                    <Icon name="HelpCircle" size={16} />
                    <span className="text-sm text-popover-foreground">Help & Support</span>
                  </button>
                </div>
                
                <div className="border-t border-border py-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left hover:bg-muted transition-colors duration-200 flex items-center space-x-3 text-error"
                  >
                    <Icon name="LogOut" size={16} color="var(--color-error)" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;