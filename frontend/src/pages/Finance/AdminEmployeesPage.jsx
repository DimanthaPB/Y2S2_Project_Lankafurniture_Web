import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/Finance/DashboardLayout';
import AuthContext from '../../context/AuthContext';
import EmployeeModal from '../../components/Finance/EmployeeModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EmployeesPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
      if (editingEmployee) {
        await axios.put(`http://localhost:5001/api/employees/${editingEmployee._id}`, employeeData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Employee updated successfully!');
      } else {
        await axios.post('http://localhost:5001/api/employees', employeeData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Employee added successfully!');
      }
      setIsModalOpen(false);
      fetchEmployees();
    } catch (err) {
      toast.error('Something went wrong while saving employee.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Employee deleted successfully!');
      fetchEmployees();
    } catch (err) {
      toast.error('Failed to delete employee.');
      console.error(err);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/employees/report', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Employee_Report.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Failed to generate report');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) =>
    `${emp.name} ${emp.designation} ${emp.employeeId}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-900">Employees</h1>
        <div className="flex space-x-3">
          <button
            onClick={handleAddEmployee}
            className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded transition"
          >
            Add Employee
          </button>
          <button
            onClick={handleGenerateReport}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition"
          >
            Generate Report
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm p-2 border border-amber-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div className="overflow-x-auto bg-amber-50 shadow rounded-lg border border-amber-200">
        <table className="min-w-full text-left">
          <thead className="bg-amber-100 text-amber-900">
            <tr>
              <th className="p-3">Employee ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Designation</th>
              <th className="p-3">EPF No</th>
              <th className="p-3">Bank Name</th>
              <th className="p-3">Account No</th>
              <th className="p-3">Branch</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp._id} className="border-b hover:bg-amber-100">
                  <td className="p-3">{emp.employeeId}</td>
                  <td className="p-3">{emp.name}</td>
                  <td className="p-3">{emp.designation}</td>
                  <td className="p-3">{emp.epfNo}</td>
                  <td className="p-3">{emp.bankName}</td>
                  <td className="p-3">{emp.accountNo}</td>
                  <td className="p-3">{emp.bankBranch}</td>
                  <td className="p-3 flex space-x-2">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => navigate(`/salaries/${emp._id}`)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded transition"
                    >
                      Salaries
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-4 text-center text-amber-700">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmployee}
        employee={editingEmployee}
      />
    </DashboardLayout>
  );
};

export default EmployeesPage;