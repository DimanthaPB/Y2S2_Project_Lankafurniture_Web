// Inventory.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Inventory.css";
import Sidebar from "./Sidebar";
import Footer from "./InvFooter";

import DashboardLayout from '../Finance/DashboardLayout';

function Inventory() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    itemNo: "",
    name: "",
    description: "",
    quantity: "",
    unitPrice: "",
    category: "",
    reorderLevel: "",
  });
  const [lowStock, setLowStock] = useState([]);
  const [search, setSearch] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemData, setEditingItemData] = useState({
    itemNo: "",
    name: "",
    description: "",
    quantity: "",
    unitPrice: "",
    category: "",
    reorderLevel: "",
  });

  const API_URL = "http://localhost:5001/api/items";

  // ====== Fetch items ======
  const fetchItems = async () => {
    try {
      const res = await axios.get(API_URL);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLowStock = async () => {
    try {
      const res = await axios.get(`${API_URL}/low-stock`);
      setLowStock(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchLowStock();
  }, []);

  // ====== Add new item ======
  const addItem = async (e) => {
    e.preventDefault();

    // JS validation
    /*if (newItem.quantity < newItem.reorderLevel) {
      alert("⚠️ Quantity should not be less than the reorder level!");
      return;
    }*/
    if (newItem.unitPrice <= 0) {
      alert("⚠️ Unit Price must be greater than 0!");
      return;
    }

    try {
      await axios.post(API_URL, newItem);
      fetchItems();
      fetchLowStock();

      // Reset form
      setNewItem({
        itemNo: "",
        name: "",
        description: "",
        quantity: "",
        unitPrice: "",
        category: "",
        reorderLevel: "",
      });
      setShowForm(false);
    } catch (err) {
      console.error("❌ Error adding item:", err);
      alert("Failed to save item. Check server logs.");
    }
  };

  // ====== Delete ======
  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchItems();
      fetchLowStock();
    } catch (err) {
      console.error(err);
    }
  };

  // ====== Edit ======
  const startEditing = (item) => {
    setEditingItemId(item._id);
    setEditingItemData({ ...item });
  };

  const saveEdit = async (id) => {
    /*if (editingItemData.quantity < editingItemData.reorderLevel) {
      alert("⚠️ Quantity should not be less than the reorder level!");
      return;
    }*/
    if (editingItemData.unitPrice <= 0) {
      alert("⚠️ Unit Price must be greater than 0!");
      return;
    }

    try {
      await axios.put(`${API_URL}/${id}`, editingItemData);
      setEditingItemId(null);
      setEditingItemData({
        itemNo: "",
        name: "",
        description: "",
        quantity: "",
        unitPrice: "",
        category: "",
        reorderLevel: "",
      });
      fetchItems();
      fetchLowStock();
    } catch (err) {
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setEditingItemData({
      itemNo: "",
      name: "",
      description: "",
      quantity: "",
      unitPrice: "",
      category: "",
      reorderLevel: "",
    });
  };

  // ====== Search filter ======
  const filteredItems = items
    .sort((a, b) => {
      // Low stock items on top
      if (a.quantity < a.reorderLevel && b.quantity >= b.reorderLevel) return -1;
      if (b.quantity < b.reorderLevel && a.quantity >= a.reorderLevel) return 1;
      return 0;
    })
    .filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
    );

  // ====== Dashboard ======
  const totalRevenue = items.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0
  );
  const totalProducts = items.length;
  const totalCategories = [...new Set(items.map((i) => i.category))].length;
  const topStock = items.length
    ? items.reduce((max, i) => (i.quantity > max.quantity ? i : max))
    : null;

  return (
    <DashboardLayout>
    <div className="inventory-layout">

      <div className="inventory-container">
        <Sidebar />
        <h1>Inventory Management</h1>

        {/* Dashboard */}
        <div className="overall-inventory">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Rs. {totalRevenue.toLocaleString()}</h3>
              <p>Total Value</p>
            </div>
            <div className="stat-card">
              <h3>{totalProducts}</h3>
              <p>Total Products</p>
            </div>
            <div className="stat-card">
              <h3>{totalCategories}</h3>
              <p>Total Categories</p>
            </div>
            <div className="stat-card">
              <h3>{topStock ? topStock.name : "N/A"}</h3>
              <p>Top Stock Item</p>
            </div>
            <div className="stat-card low">
              <h3>{lowStock.length}</h3>
              <p>Low Stock Items</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        {/* Toggle Add Form */}
        <button onClick={() => setShowForm(!showForm)} className="toggle-btn">
          {showForm ? "Cancel" : "Add New Item"}
        </button>

        {/* Add Form */}
        {showForm && (
          <form className="form-section" onSubmit={addItem}>
            <input
              type="text"
              placeholder="Item No"
              value={newItem.itemNo}
              onChange={(e) =>
                setNewItem({ ...newItem, itemNo: e.target.value })
              }
              required
              pattern="^[A-Za-z0-9_-]+$"
              title="Item No can only contain letters, numbers, underscores, or dashes"
            />

            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) =>
                setNewItem({ ...newItem, name: e.target.value })
              }
              required
              minLength={3}
              maxLength={50}
              pattern="^[A-Za-z0-9\s]+$"
              title="Item Name can only contain letters, numbers, and spaces"
            />

            <input
              type="text"
              placeholder="Description"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              maxLength={200}
            />

            <input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: Number(e.target.value) })
              }
              required
              min={1}
            />

            <input
              type="number"
              placeholder="Unit Price"
              value={newItem.unitPrice}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  unitPrice: Number(e.target.value),
                })
              }
              required
              min={0.01}
              step="0.01"
            />

            {/* Category dropdown */}
            <select
              value={newItem.category}
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
              required
            >
              <option value="" disabled>
                -- Select Category --
              </option>
              <option value="RAW Materials">RAW Materials</option>
              <option value="Furniture">Furniture</option>
              <option value="Accessories">Accessories</option>
              <option value="Tools">Tools</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="number"
              placeholder="Reorder Level"
              value={newItem.reorderLevel}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  reorderLevel: Number(e.target.value),
                })
              }
              required
              min={1}
            />

            <button type="submit">Save Item</button>
          </form>
        )}

        {/* Items List */}
        <h2>📦 Current Stock</h2>
        <ul className="item-list">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li
                key={item._id}
                className={`item-card ${
                  item.quantity < item.reorderLevel ? "low" : ""
                }`}
              >
                {editingItemId === item._id ? (
  <div className="edit-item-container">
    <input type="text" value={editingItemData.itemNo} onChange={(e) =>
      setEditingItemData({...editingItemData, itemNo: e.target.value})} />

    <input type="text" value={editingItemData.name} onChange={(e) =>
      setEditingItemData({...editingItemData, name: e.target.value})} />

    <input type="text" value={editingItemData.description} onChange={(e) =>
      setEditingItemData({...editingItemData, description: e.target.value})} />

    <input type="number" value={editingItemData.quantity} onChange={(e) =>
      setEditingItemData({...editingItemData, quantity: Number(e.target.value)})} />

    <input type="number" value={editingItemData.unitPrice} onChange={(e) =>
      setEditingItemData({...editingItemData, unitPrice: Number(e.target.value)})} />

    <select value={editingItemData.category} onChange={(e) =>
      setEditingItemData({...editingItemData, category: e.target.value})}>
      <option value="" disabled>-- Select Category --</option>
      <option value="Electronics">Electronics</option>
      <option value="Furniture">Furniture</option>
      <option value="Stationery">Stationery</option>
      <option value="Clothing">Clothing</option>
      <option value="Food">Food</option>
    </select>

    <input type="number" placeholder="Re Order Level" value={editingItemData.reorderLevel} onChange={(e) =>
      setEditingItemData({...editingItemData, reorderLevel: Number(e.target.value)})} />

    <div className="edit-buttons">
      <button onClick={() => saveEdit(item._id)}>💾 Save</button>
      <button onClick={cancelEdit}>✖ Cancel</button>
    </div>
  </div>
) : (
                  <>
                    <span>
                      <strong>{item.itemNo}</strong> - {item.name} ({item.category})
                      {item.quantity < item.reorderLevel && (
                        <span style={{ color: "red", marginLeft: "6px" }}>
                          🔴 Low Stock
                        </span>
                      )}
                      <br />
                      {item.description && <em>{item.description}</em>}
                      <br />
                      Qty: {item.quantity} | Rs.{item.unitPrice} | Reorder:{" "}
                      {item.reorderLevel}
                    </span>
                    <span className="item-actions">
                      <button onClick={() => startEditing(item)}>✏ Edit</button>
                      <button onClick={() => deleteItem(item._id)}>🗑 Delete</button>
                    </span>
                  </>
                )}
              </li>
            ))
          ) : (
            <p>No items available.</p>
          )}
        </ul>
        <Footer />
      </div>
    </div>
    </DashboardLayout>
  );
}

export default Inventory;
