import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Spin, Alert } from "antd";

function TransactionsList() {
  const { id: providerId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const tableRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5001/api/transactions/${providerId}`);
        setTransactions(res.data || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [providerId]);

  const handleExportPDF = () => {
    if (!tableRef.current) return;
    const title = `Transactions - Provider ${providerId}`;
    const printContents = tableRef.current.innerHTML;
    const win = window.open("", "printWindow", "width=900,height=700");
    if (!win) return;

    win.document.open();
    win.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 16px; color: #111; }
            h1 { font-size: 18px; margin: 0 0 12px 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
            th { background: #f3f4f6; text-align: left; }
            .meta { margin-bottom: 12px; color: #555; font-size: 12px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="meta">Generated on: ${new Date().toLocaleString()}</div>
          ${printContents}
        </body>
      </html>
    `);
    win.document.close();

    // ✅ Wait for window to finish loading before printing
    win.onload = () => {
      win.focus();
      win.print();
      win.close();
    };
  };

  if (loading) return <div style={{ padding: 20 }}><Spin /></div>;
  if (error) return <div style={{ padding: 20 }}><Alert type="error" message={error} /></div>;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
        <ul>
          <li><Link to={`/serviceproviderdashboard/${providerId}`}>🏠 Dashboard</Link></li>
          <li><Link to={`/provider/${providerId}/projects`}>📁 Projects</Link></li>
          <li><Link to={`/provider/${providerId}/transactions`}>💳 Transactions</Link></li>
          <li><Link to={`/provider/${providerId}/ratings`}>⭐ Ratings</Link></li>
          <li><Link to={`/newArrivals`}>📦 New Arrivals</Link></li>
          <li><Link to={`/adminDashboard`}>📁 Admin Dashboard</Link></li>
        </ul>
      </aside>
      <div className="dashboard-content">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 12 }}>
          <h1 style={{ margin: 0 }}>Transactions</h1>
          <button className="btn-primary" onClick={handleExportPDF}>
            ⬇️ Export PDF
          </button>
        </div>
        <div className="card">
          {transactions.length === 0 ? (
            <p>No transactions found for this provider.</p>
          ) : (
            <div ref={tableRef}>
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Amount (Rs.)</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t._id}>
                      <td>{t.date ? new Date(t.date).toLocaleString() : '-'}</td>
                      <td>{t.type}</td>
                      <td>{t.status}</td>
                      <td>{t.amount}</td>
                      <td>{t.reference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionsList;