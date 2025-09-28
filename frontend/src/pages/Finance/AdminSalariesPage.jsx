import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/Finance/DashboardLayout';
import SalaryModal from '../../components/Finance/SalaryModal';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';

const SalariesPage = () => {
  const { employeeId } = useParams();
  const { token } = useContext(AuthContext);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSalary, setEditSalary] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchEmployeeInfo = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/employees/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployeeInfo(res.data);
    } catch (err) {
      console.error("Failed to fetch employee info:", err);
    }
  };

  const fetchSalaries = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/salaries/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSalaries(res.data);
    } catch {
      toast.error('Failed to fetch salaries');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this salary record?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/salaries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Salary deleted');
      fetchSalaries();
    } catch {
      toast.error('Failed to delete salary');
    }
  };

  const handleViewPayslip = async (salaryId) => {
    setDownloadingId(salaryId);
    try {
      const res = await axios.get(`http://localhost:5001/api/salaries/${salaryId}/payslip`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Payslip view error:', err);
      toast.error('Could not view payslip');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleExportPDF = (salary) => {
    const doc = new jsPDF();
    doc.text(`Payslip for ${salary.month} ${salary.year}`, 20, 20);
    doc.text(`Net Salary: ${salary.totals.netSalary}`, 20, 30);
    doc.save(`Payslip_${salary.month}_${salary.year}.pdf`);
  };

  useEffect(() => {
    fetchSalaries();
    fetchEmployeeInfo();
  }, [employeeId]);

  if (loading) return <DashboardLayout><p>Loading...</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-900">
          Salaries {employeeInfo && `- ${employeeInfo.name} (${employeeInfo.employeeId})`}
        </h1>
        <button
          onClick={() => { setEditSalary(null); setIsModalOpen(true); }}
          className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded transition"
        >
          Add Salary
        </button>
      </div>

      <div className="overflow-x-auto bg-amber-50 shadow rounded-lg border border-amber-200">
        <table className="min-w-full text-left">
          <thead className="bg-amber-100 text-amber-900">
            <tr>
              <th className="p-3">Month</th>
              <th className="p-3">Year</th>
              <th className="p-3">Basic Amount</th>
              <th className="p-3">Allowances</th>
              <th className="p-3">Gross Amount</th>
              <th className="p-3">Net Amount</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((s) => (
              <tr key={s._id} className="border-b hover:bg-amber-100">
                <td className="p-3">{s.month}</td>
                <td className="p-3">{s.year}</td>
                <td className="p-3">{s.basic}</td>
                <td className="p-3">{s.totals.totalAllowances}</td>
                <td className="p-3">{s.totals.grossSalary}</td>
                <td className="p-3">{s.totals.netSalary}</td>
                <td className="p-3 flex space-x-2">
                  <button
                    onClick={() => handleViewPayslip(s._id)}
                    disabled={downloadingId === s._id}
                    className={`px-3 py-1 rounded text-white ${
                      downloadingId === s._id
                        ? 'bg-gray-400'
                        : 'bg-amber-600 hover:bg-amber-700'
                    }`}
                  >
                    {downloadingId === s._id ? 'Opening...' : 'View Payslip'}
                  </button>
                  <button
                    onClick={() => { setEditSalary(s); setIsModalOpen(true); }}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SalaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employeeId={employeeId}
        salary={editSalary}
        onSuccess={fetchSalaries}
        token={token}
      />
    </DashboardLayout>
  );
};

export default SalariesPage;