import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';


const InvoiceHistory = ({ onInvoiceClick, onDownloadInvoice }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock invoice data
  const invoices = [
    {
      id: 1,
      number: 'INV-2024-001',
      date: '2024-01-15',
      amount: 150000,
      status: 'paid',
      description: 'Professional Plan - January 2024',
      dueDate: '2024-01-30'
    },
    {
      id: 2,
      number: 'INV-2023-012',
      date: '2023-12-15',
      amount: 150000,
      status: 'paid',
      description: 'Professional Plan - December 2023',
      dueDate: '2023-12-30'
    },
    {
      id: 3,
      number: 'INV-2023-011',
      date: '2023-11-15',
      amount: 120000,
      status: 'paid',
      description: 'Standard Plan - November 2023',
      dueDate: '2023-11-30'
    },
    {
      id: 4,
      number: 'INV-2023-010',
      date: '2023-10-15',
      amount: 120000,
      status: 'overdue',
      description: 'Standard Plan - October 2023',
      dueDate: '2023-10-30'
    },
    {
      id: 5,
      number: 'INV-2023-009',
      date: '2023-09-15',
      amount: 120000,
      status: 'paid',
      description: 'Standard Plan - September 2023',
      dueDate: '2023-09-30'
    }
  ];

  const dateFilterOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'last_3_months', label: 'Last 3 Months' },
    { value: 'last_year', label: 'Last Year' }
  ];

  const statusFilterOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const filteredInvoices = invoices?.filter(invoice => {
    const matchesSearch = invoice?.number?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         invoice?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice?.status === statusFilter;
    // For demo purposes, keeping all invoices for date filter
    return matchesSearch && matchesStatus;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredInvoices?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices?.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-success/10 text-success';
      case 'overdue':
        return 'bg-error/10 text-error';
      case 'pending':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  const handleExportData = () => {
    console.log('Exporting invoice data...');
    // Mock export functionality
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground mb-4 sm:mb-0">Invoice History</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            iconName="Download"
          >
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full"
            />
          </div>
          <Select
            value={dateFilter}
            onChange={setDateFilter}
            options={dateFilterOptions}
            className="w-full sm:w-40"
            label="Date Filter"
            description="Filter invoices by date range"
            error=""
            id="date-filter"
            name="dateFilter"
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusFilterOptions}
            className="w-full sm:w-32"
            label="Status Filter"
            description="Filter invoices by status"
            error=""
            id="status-filter"
            name="statusFilter"
          />
        </div>
      </div>

      {/* Invoice Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-medium text-foreground">Invoice #</th>
              <th className="text-left p-4 font-medium text-foreground">Date</th>
              <th className="text-left p-4 font-medium text-foreground">Description</th>
              <th className="text-left p-4 font-medium text-foreground">Amount</th>
              <th className="text-left p-4 font-medium text-foreground">Status</th>
              <th className="text-left p-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInvoices?.map((invoice) => (
              <tr 
                key={invoice?.id} 
                className="border-b border-border hover:bg-muted/50 cursor-pointer"
                onClick={() => onInvoiceClick(invoice)}
              >
                <td className="p-4">
                  <div className="font-medium text-primary">{invoice?.number}</div>
                </td>
                <td className="p-4">
                  <div className="text-foreground">
                    {new Date(invoice?.date)?.toLocaleDateString()}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-foreground">{invoice?.description}</div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-foreground">
                    UGX {invoice?.amount?.toLocaleString()}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice?.status)}`}>
                    {invoice?.status?.charAt(0)?.toUpperCase() + invoice?.status?.slice(1)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onDownloadInvoice(invoice);
                      }}
                      iconName="Download"
                      className="text-muted-foreground hover:text-foreground"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onInvoiceClick(invoice);
                      }}
                      iconName="Eye"
                      className="text-muted-foreground hover:text-foreground"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredInvoices?.length)} of {filteredInvoices?.length} invoices
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                iconName="ChevronLeft"
              />
              <span className="text-sm text-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                iconName="ChevronRight"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceHistory;