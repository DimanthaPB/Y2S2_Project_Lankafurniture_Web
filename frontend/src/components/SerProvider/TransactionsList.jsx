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

    // compute totals
    const totalAmount = transactions.reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const totalCount = transactions.length;
    const generatedOn = new Date().toLocaleString();
    const logoUrl = `${window.location.origin}/src/assets/logo.jpg`; // put logo in public/assets/logo.jpg

    // build table rows html (safer to build from data rather than innerHTML)
    const rowsHtml = transactions.map(t => `
      <tr>
        <td>${t.date ? new Date(t.date).toLocaleString() : '-'}</td>
        <td>${t.type || '-'}</td>
        <td>${t.status || '-'}</td>
        <td style="text-align:right">${(t.amount == null || t.amount === '') ? '-' : Number(t.amount).toLocaleString()}</td>
        <td>${t.reference || '-'}</td>
      </tr>
    `).join('');

    const html = `
      <html>
        <head>
          <title>${title}</title>
          <meta charset="utf-8" />
          <style>
            @page { margin: 20mm; }
            body { font-family: Arial, Helvetica, sans-serif; color:#111; margin: 0; padding: 16px; }
            .header { display:flex; align-items:center; gap:12px; }
            .logo { width:60px; height:auto; }
            .company { flex:1; }
            .company h1 { margin:0; font-size:18px; color:#0b63d6; }
            .company p { margin:4px 0 0 0; font-size:12px; color:#666; }
            .meta { text-align:right; font-size:12px; color:#666; }
            .sep { height:1px; background:#e6e6e6; margin:12px 0; border-radius:1px; }
            .summary { display:flex; gap:12px; margin:12px 0; font-size:13px; color:#333; }
            .summary .item { background:#fbfdff; border:1px solid #eef6ff; padding:8px 10px; border-radius:6px; }
            table { width:100%; border-collapse:collapse; font-size:12px; margin-top:8px; }
            th, td { border: 1px solid #e9eef7; padding:8px; }
            th { background:#f3f4f8; text-align:left; color:#333; font-weight:700; }
            tbody tr:nth-child(odd) td { background: #fff; }
            tbody tr:nth-child(even) td { background: #fbfdff; }
            tfoot td { font-weight:700; background:#fff; }
            .right { text-align:right; }
            .no-print { display:inline-block; margin-left:8px; }
            @media print {
              .no-print { display:none !important; }
              body { padding:0; }
              .header, .summary { page-break-inside: avoid; }
              table { page-break-inside: auto; }
              tr { page-break-inside: avoid; page-break-after: auto; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logoUrl}" class="logo" alt="Company logo" onerror="this.style.display='none'"/>
            <div class="company">
              <h1>LankaFurniture Pvt Ltd</h1>
              <p>215/1, New Kandy Road, Malabe, Sri Lanka • Phone: +94703914047 • hr@lankafurniture.com</p>
            </div>
            <div class="meta">
              <div>${title}</div>
              <div>Generated: ${generatedOn}</div>
            </div>
          </div>

          <div class="sep"></div>

          <div class="summary" aria-hidden="true">
            <div class="item"><div style="font-size:12px;color:#666">Provider ID</div><div>${providerId}</div></div>
            <div class="item"><div style="font-size:12px;color:#666">Transactions</div><div>${totalCount}</div></div>
            <div class="item"><div style="font-size:12px;color:#666">Total Amount (Rs.)</div><div>${totalAmount.toLocaleString()}</div></div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width:20%;">Date</th>
                <th style="width:20%;">Type</th>
                <th style="width:15%;">Status</th>
                <th style="width:20%; text-align:right">Amount (Rs.)</th>
                <th style="width:25%;">Reference</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3">Totals</td>
                <td class="right">${totalAmount.toLocaleString()}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top:18px; font-size:11px; color:#666;">
            Note: This report is computer generated. For discrepancies contact HR/Finance.
          </div>

        </body>
      </html>
    `;

    const win = window.open("", "_blank", "width=1000,height=800");
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();

    // Wait for images to load before printing to ensure logo renders
    const tryPrint = () => {
      try {
        win.focus();
        win.print();
        // win.close(); // optional: don't auto-close so user can review
      } catch (e) {
        // if printing fails immediately, retry shortly
        setTimeout(tryPrint, 200);
      }
    };

    // give browser a moment to render (and load logo)
    setTimeout(tryPrint, 500);
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