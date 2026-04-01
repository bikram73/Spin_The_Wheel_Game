import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EntriesPanel({
  entries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onToggleEntry,
  onShuffle,
  onSort,
  onAddImage
}) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newEntryName, setNewEntryName] = useState('');

  const startEdit = (id, name) => {
    setEditingId(id);
    setEditText(name);
  };

  const saveEdit = (id) => {
    if (editText.trim()) {
      onUpdateEntry(id, { name: editText.trim() });
    }
    setEditingId(null);
  };

  const handleImageUpload = (e, id) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onAddImage(id, event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const activeCount = entries.filter(e => e.checked).length;

  const openAddPopup = () => {
    setNewEntryName('');
    setShowAddPopup(true);
  };

  const closeAddPopup = () => {
    setShowAddPopup(false);
    setNewEntryName('');
  };

  const submitAddEntry = () => {
    if (!newEntryName.trim()) {
      return;
    }
    onAddEntry(newEntryName.trim());
    closeAddPopup();
  };

  const copyEntryText = async (text) => {
    if (!text) return;

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch {
        // Fallback for browsers that block clipboard API.
      }
    }

    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  };

  return (
    <motion.section 
      className="panel entries-panel"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="panel-header">
        <h3>📋 Entries</h3>
        <span className="count-badge">{activeCount}/{entries.length}</span>
      </div>

      <div className="panel-controls">
        <motion.button
          className="btn-small"
          onClick={openAddPopup}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Add new entry"
        >
          ➕ Add
        </motion.button>
        <motion.button
          className="btn-small"
          onClick={onShuffle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Shuffle entries"
        >
          🔀 Shuffle
        </motion.button>
        <motion.button
          className="btn-small"
          onClick={() => {
            onSort(sortOrder);
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Sort entries"
        >
          🔤 Sort {sortOrder === 'asc' ? '↑' : '↓'}
        </motion.button>
      </div>

      <div className="entries-list">
        <AnimatePresence>
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              className="entry-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              layout
            >
              <div className="entry-content">
                <input
                  type="checkbox"
                  checked={entry.checked}
                  onChange={() => onToggleEntry(entry.id)}
                  className="entry-checkbox"
                />

                {editingId === entry.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => saveEdit(entry.id)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit(entry.id)}
                    autoFocus
                    className="entry-edit-input"
                  />
                ) : (
                  <span
                    className="entry-name"
                    onClick={() => startEdit(entry.id, entry.name)}
                    style={{ textDecoration: entry.checked ? 'none' : 'line-through', opacity: entry.checked ? 1 : 0.5 }}
                  >
                    {entry.name}
                  </span>
                )}

                {entry.image && (
                  <span className="image-indicator" title="Image attached">
                    🖼️
                  </span>
                )}
              </div>

              <div className="entry-actions">
                <label className="btn-icon" title="Add image">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, entry.id)}
                    style={{ display: 'none' }}
                  />
                  🖼️
                </label>
                <motion.button
                  className="btn-icon"
                  onClick={() => copyEntryText(entry.name)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Copy entry text"
                >
                  📋
                </motion.button>
                <motion.button
                  className="btn-icon delete"
                  onClick={() => onDeleteEntry(entry.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Delete entry"
                >
                  🗑️
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {entries.length === 0 && (
        <div className="empty-state">
          <p>No entries yet. Click "Add" to create one!</p>
        </div>
      )}

      <AnimatePresence>
        {showAddPopup && (
          <div className="entry-popup-overlay" onClick={closeAddPopup}>
            <motion.div
              className="entry-popup"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h4>Add Entry</h4>
              <input
                type="text"
                value={newEntryName}
                onChange={(e) => setNewEntryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    submitAddEntry();
                  }
                  if (e.key === 'Escape') {
                    closeAddPopup();
                  }
                }}
                placeholder="Enter name"
                autoFocus
                className="entry-popup-input"
              />
              <div className="entry-popup-actions">
                <button className="entry-popup-btn cancel" onClick={closeAddPopup}>
                  Cancel
                </button>
                <button className="entry-popup-btn add" onClick={submitAddEntry}>
                  Add
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
