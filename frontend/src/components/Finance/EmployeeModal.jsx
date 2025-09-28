import React, { useState, useEffect } from 'react';

const EmployeeModal = ({ isOpen, onClose, onSave, employee }) => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    epfNo: '',
    bankName: '',
    accountNo: '',
    bankBranch: '',
  });

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    } else {
      setFormData({
        name: '',
        designation: '',
        epfNo: '',
        bankName: '',
        accountNo: '',
        bankBranch: '',
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-amber-50 rounded-lg shadow-xl w-full max-w-lg p-6 border border-amber-200">
        <h2 className="text-2xl font-semibold text-amber-900 mb-4">
          {employee ? 'Edit Employee' : 'Add Employee'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            pattern="[A-Za-z\s]+"
            title="Only letters and spaces allowed"
            className="w-full p-2 border border-amber-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Designation"
            required
            pattern="[A-Za-z\s]+"
            title="Only letters and spaces allowed"
            className="w-full p-2 border border-amber-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <input
            type="text"
            name="epfNo"
            value={formData.epfNo}
            onChange={handleChange}
            placeholder="EPF No"
            required
            pattern="[A-Za-z0-9\s]+"
            title="Only letters, numbers, and spaces allowed"
            className="w-full p-2 border border-amber-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            placeholder="Bank Name"
            required
            pattern="[A-Za-z\s]+"
            title="Only letters and spaces allowed"
            className="w-full p-2 border border-amber-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <input
            type="number"
            name="accountNo"
            value={formData.accountNo}
            onChange={handleChange}
            placeholder="Account No"
            required
            min="0"
            step="1"
            className="w-full p-2 border border-amber-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <input
            type="text"
            name="bankBranch"
            value={formData.bankBranch}
            onChange={handleChange}
            placeholder="Bank Branch"
            required
            pattern="[A-Za-z\s]+"
            title="Only letters and spaces allowed"
            className="w-full p-2 border border-amber-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;