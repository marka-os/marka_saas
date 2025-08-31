import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LoginPage from './pages/login';
import StudentManagement from './pages/student-management';
import Dashboard from './pages/dashboard';
import ReportCardGeneration from './pages/report-card-generation';
import AssessmentInput from './pages/assessment-input';
import Register from './pages/register';
import SchoolSettings from './pages/school-settings';
import BillingManagement from './pages/billing-management';
import SubscriptionManagement from './pages/subscription-management';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AssessmentInput />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/student-management" element={<StudentManagement />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report-card-generation" element={<ReportCardGeneration />} />
        <Route path="/assessment-input" element={<AssessmentInput />} />
        <Route path="/register" element={<Register />} />
        <Route path="/school-settings" element={<SchoolSettings />} />
        <Route path="/billing-management" element={<BillingManagement />} />
        <Route path="/subscription-management" element={<SubscriptionManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;