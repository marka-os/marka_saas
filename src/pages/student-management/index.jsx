import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import StudentTable from './components/StudentTable';
import StudentToolbar from './components/StudentToolbar';
import StudentModal from './components/StudentModal';
import Pagination from './components/Pagination';
import BulkActionsBar from './components/BulkActionsBar';

const StudentManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    class: '',
    stream: '',
    academicYear: '',
    status: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [studentModal, setStudentModal] = useState({
    isOpen: false,
    mode: 'add',
    student: null
  });

  // Mock student data
  const mockStudents = [
    {
      id: 1,
      firstName: "Amina",
      lastName: "Nakato",
      email: "amina.nakato@email.com",
      lin: "UG2024001234",
      class: "P7",
      stream: "A",
      dateOfBirth: "2010-03-15",
      gender: "female",
      parentName: "Sarah Nakato",
      parentPhone: "+256 701 234567",
      parentEmail: "sarah.nakato@email.com",
      address: "Kampala, Uganda",
      status: "active",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      firstName: "David",
      lastName: "Mukasa",
      email: "david.mukasa@email.com",
      lin: "UG2024001235",
      class: "S4",
      stream: "B",
      dateOfBirth: "2008-07-22",
      gender: "male",
      parentName: "John Mukasa",
      parentPhone: "+256 702 345678",
      parentEmail: "john.mukasa@email.com",
      address: "Entebbe, Uganda",
      status: "active",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      firstName: "Grace",
      lastName: "Achieng",
      email: "grace.achieng@email.com",
      lin: "UG2024001236",
      class: "S6",
      stream: "A",
      dateOfBirth: "2006-11-08",
      gender: "female",
      parentName: "Mary Achieng",
      parentPhone: "+256 703 456789",
      parentEmail: "mary.achieng@email.com",
      address: "Jinja, Uganda",
      status: "active",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      firstName: "Samuel",
      lastName: "Okello",
      email: "samuel.okello@email.com",
      lin: "UG2024001237",
      class: "P5",
      stream: "C",
      dateOfBirth: "2012-01-30",
      gender: "male",
      parentName: "Peter Okello",
      parentPhone: "+256 704 567890",
      parentEmail: "peter.okello@email.com",
      address: "Gulu, Uganda",
      status: "inactive",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 5,
      firstName: "Rebecca",
      lastName: "Namuli",
      email: "rebecca.namuli@email.com",
      lin: "UG2024001238",
      class: "S2",
      stream: "A",
      dateOfBirth: "2009-05-14",
      gender: "female",
      parentName: "Agnes Namuli",
      parentPhone: "+256 705 678901",
      parentEmail: "agnes.namuli@email.com",
      address: "Mbale, Uganda",
      status: "active",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 6,
      firstName: "Joseph",
      lastName: "Kato",
      email: "joseph.kato@email.com",
      lin: "UG2024001239",
      class: "P3",
      stream: "B",
      dateOfBirth: "2014-09-12",
      gender: "male",
      parentName: "Rose Kato",
      parentPhone: "+256 706 789012",
      parentEmail: "rose.kato@email.com",
      address: "Masaka, Uganda",
      status: "transferred",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 7,
      firstName: "Esther",
      lastName: "Nabirye",
      email: "esther.nabirye@email.com",
      lin: "UG2024001240",
      class: "S5",
      stream: "A",
      dateOfBirth: "2007-12-03",
      gender: "female",
      parentName: "Francis Nabirye",
      parentPhone: "+256 707 890123",
      parentEmail: "francis.nabirye@email.com",
      address: "Mbarara, Uganda",
      status: "active",
      photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 8,
      firstName: "Michael",
      lastName: "Ssemakula",
      email: "michael.ssemakula@email.com",
      lin: "UG2024001241",
      class: "P6",
      stream: "A",
      dateOfBirth: "2011-04-18",
      gender: "male",
      parentName: "Catherine Ssemakula",
      parentPhone: "+256 708 901234",
      parentEmail: "catherine.ssemakula@email.com",
      address: "Mukono, Uganda",
      status: "graduated",
      photo: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face"
    }
  ];

  useEffect(() => {
    // Initialize with mock data
    setStudents(mockStudents);
    setFilteredStudents(mockStudents);
  }, []);

  useEffect(() => {
    // Apply filters and search
    let filtered = students;

    // Search filter
    if (searchTerm) {
      filtered = filtered?.filter(student =>
        `${student?.firstName} ${student?.lastName}`?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        student?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        student?.lin?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Class filter
    if (filters?.class) {
      filtered = filtered?.filter(student => student?.class === filters?.class);
    }

    // Stream filter
    if (filters?.stream) {
      filtered = filtered?.filter(student => student?.stream === filters?.stream);
    }

    // Status filter
    if (filters?.status) {
      filtered = filtered?.filter(student => student?.status === filters?.status);
    }

    // Sort
    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        const aValue = a?.[sortConfig?.key];
        const bValue = b?.[sortConfig?.key];
        
        if (aValue < bValue) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredStudents(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [students, searchTerm, filters, sortConfig]);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({
        class: '',
        stream: '',
        academicYear: '',
        status: ''
      });
    } else {
      setFilters(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const handleSort = (config) => {
    setSortConfig(config);
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => {
      if (prev?.includes(studentId)) {
        return prev?.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSelectAll = () => {
    const currentPageStudents = getCurrentPageStudents();
    const currentPageIds = currentPageStudents?.map(student => student?.id);
    
    if (selectedStudents?.length === currentPageIds?.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(currentPageIds);
    }
  };

  const handleAddStudent = () => {
    setStudentModal({
      isOpen: true,
      mode: 'add',
      student: null
    });
  };

  const handleEditStudent = (student) => {
    setStudentModal({
      isOpen: true,
      mode: 'edit',
      student
    });
  };

  const handleViewProfile = (student) => {
    setStudentModal({
      isOpen: true,
      mode: 'view',
      student
    });
  };

  const handleManageAssessments = (student) => {
    console.log('Manage assessments for:', student);
    // Navigate to assessment management for this student
  };

  const handleSaveStudent = async (studentData) => {
    if (studentModal?.mode === 'add') {
      const newStudent = {
        ...studentData,
        id: Math.max(...students?.map(s => s?.id)) + 1,
        photo: studentData?.photo || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`
      };
      setStudents(prev => [...prev, newStudent]);
    } else if (studentModal?.mode === 'edit') {
      setStudents(prev => prev?.map(student => 
        student?.id === studentModal?.student?.id 
          ? { ...student, ...studentData }
          : student
      ));
    }
  };

  const handleImportCSV = () => {
    console.log('Import CSV functionality');
    // Implement CSV import logic
  };

  const handleExportData = async () => {
    console.log('Exporting student data...');
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Export completed');
  };

  const handleBulkStatusUpdate = async (status) => {
    console.log('Updating status to:', status, 'for students:', selectedStudents);
    setStudents(prev => prev?.map(student => 
      selectedStudents?.includes(student?.id) 
        ? { ...student, status }
        : student
    ));
    setSelectedStudents([]);
  };

  const handleBulkDelete = async () => {
    console.log('Deleting students:', selectedStudents);
    setStudents(prev => prev?.filter(student => !selectedStudents?.includes(student?.id)));
    setSelectedStudents([]);
  };

  const handleBulkExport = () => {
    console.log('Exporting selected students:', selectedStudents);
  };

  const handleClearSelection = () => {
    setSelectedStudents([]);
  };

  const getCurrentPageStudents = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredStudents?.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredStudents?.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={handleMenuToggle} isMenuOpen={sidebarOpen} />
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
      />
      <main className={`pt-16 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
      }`}>
        <div className="p-6">
          <Breadcrumb />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Student Management
            </h1>
            <p className="text-muted-foreground">
              Manage student profiles, enrollment, and academic information
            </p>
          </div>

          <StudentToolbar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            filters={filters}
            onFilterChange={handleFilterChange}
            onAddStudent={handleAddStudent}
            onImportCSV={handleImportCSV}
            onExportData={handleExportData}
            onToggleFilters={() => setShowFilters(!showFilters)}
            showFilters={showFilters}
            selectedCount={selectedStudents?.length}
          />

          <StudentTable
            students={getCurrentPageStudents()}
            selectedStudents={selectedStudents}
            onSelectStudent={handleSelectStudent}
            onSelectAll={handleSelectAll}
            onEditStudent={handleEditStudent}
            onViewProfile={handleViewProfile}
            onManageAssessments={handleManageAssessments}
            sortConfig={sortConfig}
            onSort={handleSort}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredStudents?.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />

          <BulkActionsBar
            selectedCount={selectedStudents?.length}
            onBulkStatusUpdate={handleBulkStatusUpdate}
            onBulkDelete={handleBulkDelete}
            onBulkExport={handleBulkExport}
            onClearSelection={handleClearSelection}
          />

          <StudentModal
            isOpen={studentModal?.isOpen}
            onClose={() => setStudentModal({ isOpen: false, mode: 'add', student: null })}
            student={studentModal?.student}
            onSave={handleSaveStudent}
            mode={studentModal?.mode}
          />
        </div>
      </main>
    </div>
  );
};

export default StudentManagement;