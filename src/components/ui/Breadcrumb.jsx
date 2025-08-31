import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathMap = {
    '/dashboard': { label: 'Dashboard', icon: 'LayoutDashboard' },
    '/student-management': { label: 'Students', icon: 'Users' },
    '/assessment-input': { label: 'Assessments', icon: 'ClipboardList' },
    '/report-card-generation': { label: 'Reports', icon: 'FileText' },
    '/school-settings': { label: 'Settings', icon: 'Settings' },
    '/subscription-management': { label: 'Subscription', icon: 'Crown' },
    '/billing-management': { label: 'Billing', icon: 'CreditCard' },
    '/login': { label: 'Login', icon: 'LogIn' },
    '/register': { label: 'Register', icon: 'UserPlus' }
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location?.pathname?.split('/')?.filter(segment => segment);
    const breadcrumbs = [{ label: 'Home', path: '/dashboard', icon: 'Home' }];

    let currentPath = '';
    pathSegments?.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const pathInfo = pathMap?.[currentPath];
      
      if (pathInfo && currentPath !== '/dashboard') {
        breadcrumbs?.push({
          label: pathInfo?.label,
          path: currentPath,
          icon: pathInfo?.icon,
          isLast: index === pathSegments?.length - 1
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on auth pages
  if (location?.pathname === '/login' || location?.pathname === '/register') {
    return null;
  }

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleKeyDown = (event, path) => {
    if (event?.key === 'Enter' || event?.key === ' ') {
      event?.preventDefault();
      handleNavigation(path);
    }
  };

  return (
    <nav 
      className="flex items-center space-x-2 text-sm text-muted-foreground mb-6"
      aria-label="Breadcrumb navigation"
    >
      {breadcrumbs?.map((crumb, index) => (
        <React.Fragment key={crumb?.path}>
          {index > 0 && (
            <Icon 
              name="ChevronRight" 
              size={14} 
              className="text-muted-foreground/60"
              aria-hidden="true"
            />
          )}
          
          {crumb?.isLast ? (
            <div className="flex items-center space-x-1.5 text-foreground font-medium">
              <Icon name={crumb?.icon} size={14} />
              <span>{crumb?.label}</span>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(crumb?.path)}
              onKeyDown={(e) => handleKeyDown(e, crumb?.path)}
              className="flex items-center space-x-1.5 px-2 py-1 h-auto text-muted-foreground hover:text-foreground transition-colors duration-200"
              aria-label={`Navigate to ${crumb?.label}`}
            >
              <Icon name={crumb?.icon} size={14} />
              <span>{crumb?.label}</span>
            </Button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;