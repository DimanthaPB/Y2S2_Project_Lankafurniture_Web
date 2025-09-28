import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const SalaryModal = ({ isOpen, onClose, employeeId, salary, onSuccess, token }) => {
  const [form, setForm] = useState({
    month: '',
    year: new Date().getFullYear(),
    basic: 0,
    allowances: { costOfLiving: 0, food: 0, conveyance: 0, medical: 0 },
    reimbursements: 0,
    bonus: 0,
    deductions: { noPayLeave: 0, salaryAdvance: 0, epfEmployer: 0 },
    attendance: { workingDays: 0, leaveTaken: 0, noPayLeave: 0 }
  });

  useEffect(() => {
    if (salary) setForm(salary);
  }, [salary]);

  const handleChange = (e, parent) => {
    const { name, value } = e.target;
    if (parent) {
      setForm(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [name]: Number(value) }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: isNaN(value) ? value : Number(value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, employeeId };
      if (salary) {
        await axios.put(`http://localhost:5001/api/salaries/${salary._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Salary updated successfully');
      } else {
        await axios.post(`http://localhost:5001/api/salaries`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Salary added successfully');
      }
      onSuccess();
      onClose();
    } catch {
      toast.error('Error saving salary');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{salary ? 'Edit Salary' : 'Add Salary'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Basic Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Month</label>
                  <select
                    name="month"
                    value={form.month}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    required
                  >
                    <option value="">Select Month</option>
                    {[
                      "January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"
                    ].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Year</label>
                  <input type="number" name="year" value={form.year}
                    onChange={handleChange} className="border p-2 rounded w-full"
                    min="2025" />
                </div>
                <div className="col-span-2">
                  <label className="block mb-1 font-medium">Basic Salary</label>
                  <input type="number" name="basic" value={form.basic}
                    onChange={handleChange} className="border p-2 rounded w-full"
                    min="0" />
                </div>
              </div>
            </div>

            {/* Allowances */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Allowances</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(form.allowances).map((key) => (
                  <div key={key}>
                    <label className="block mb-1 font-medium">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      type="number"
                      name={key}
                      value={form.allowances[key]}
                      onChange={(e) => handleChange(e, 'allowances')}
                      className="border p-2 rounded w-full"
                      min="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Reimbursements & Bonus */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Reimbursements</label>
                <input type="number" name="reimbursements" value={form.reimbursements}
                  onChange={handleChange} className="border p-2 rounded w-full"
                  min="0" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Bonus</label>
                <input type="number" name="bonus" value={form.bonus}
                  onChange={handleChange} className="border p-2 rounded w-full" 
                  min="0" />
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Deductions</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.keys(form.deductions).map((key) => (
                  <div key={key}>
                    <label className="block mb-1 font-medium">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      type="number"
                      name={key}
                      value={form.deductions[key]}
                      onChange={(e) => handleChange(e, 'deductions')}
                      className="border p-2 rounded w-full"
                      min="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Attendance</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.keys(form.attendance).map((key) => (
                  <div key={key}>
                    <label className="block mb-1 font-medium">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      type="number"
                      name={key}
                      value={form.attendance[key]}
                      onChange={(e) => handleChange(e, 'attendance')}
                      className="border p-2 rounded w-full"
                      min="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {salary ? 'Update Salary' : 'Save Salary'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SalaryModal;
