import React, { useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Wheel from './components/Wheel';
import EntriesPanel from './components/EntriesPanel';
import ResultsPanel from './components/ResultsPanel';
import { motion } from 'framer-motion';

const createWheel = (name = 'Wheel') => ({
  id: uuidv4(),
  title: name,
  description: 'Tap the wheel to spin',
  entries: [
    { id: uuidv4(), name: 'Ali', checked: true, image: null },
    { id: uuidv4(), name: 'Beatriz', checked: true, image: null },
    { id: uuidv4(), name: 'Charles', checked: true, image: null },
    { id: uuidv4(), name: 'Diya', checked: true, image: null },
  ],
  results: [],
  isSpinning: false,
  selectedResult: null,
});

export default function App() {
  const [wheels, setWheels] = useState([createWheel('My Wheel')]);
  const [activeWheelId, setActiveWheelId] = useState(null);
  const [panelTab, setPanelTab] = useState('entries');
  const [recentSpinWinners, setRecentSpinWinners] = useState([]);
  const [winnerPopup, setWinnerPopup] = useState(null);
  const [combinedPopup, setCombinedPopup] = useState(null);
  const [editingTitleWheelId, setEditingTitleWheelId] = useState(null);
  const [editingDescWheelId, setEditingDescWheelId] = useState(null);
  const wheelRefs = useRef({});

  const resolvedActiveWheelId = activeWheelId || wheels[0]?.id || null;

  const activeWheel = useMemo(
    () => wheels.find((wheel) => wheel.id === resolvedActiveWheelId) || null,
    [wheels, resolvedActiveWheelId]
  );

  const allResults = useMemo(
    () =>
      wheels
        .flatMap((wheel) =>
          wheel.results.map((result) => ({ ...result, wheelId: wheel.id, wheelTitle: wheel.title }))
        )
        .sort((a, b) => b.timestamp - a.timestamp),
    [wheels]
  );

  const updateWheel = (wheelId, updater) => {
    setWheels((prev) =>
      prev.map((wheel) => (wheel.id === wheelId ? updater(wheel) : wheel))
    );
  };

  const addEntry = () => {
    if (!activeWheel) return;
    updateWheel(activeWheel.id, (wheel) => ({
      ...wheel,
      entries: [
        ...wheel.entries,
        { id: uuidv4(), name: `Entry ${wheel.entries.length + 1}`, checked: true, image: null },
      ],
    }));
  };

  const updateEntry = (id, updates) => {
    if (!activeWheel) return;
    updateWheel(activeWheel.id, (wheel) => ({
      ...wheel,
      entries: wheel.entries.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry)),
    }));
  };

  const deleteEntry = (id) => {
    if (!activeWheel) return;
    updateWheel(activeWheel.id, (wheel) => {
      if (wheel.entries.length <= 1) {
        return wheel;
      }
      return { ...wheel, entries: wheel.entries.filter((entry) => entry.id !== id) };
    });
  };

  const duplicateEntry = (id) => {
    if (!activeWheel) return;
    const source = activeWheel.entries.find((entry) => entry.id === id);
    if (!source) return;
    updateWheel(activeWheel.id, (wheel) => ({
      ...wheel,
      entries: [...wheel.entries, { ...source, id: uuidv4() }],
    }));
  };

  const shuffleEntries = () => {
    if (!activeWheel) return;
    updateWheel(activeWheel.id, (wheel) => ({
      ...wheel,
      entries: [...wheel.entries].sort(() => Math.random() - 0.5),
    }));
  };

  const sortEntries = (order = 'asc') => {
    if (!activeWheel) return;
    updateWheel(activeWheel.id, (wheel) => ({
      ...wheel,
      entries: [...wheel.entries].sort((a, b) => {
        const compare = a.name.localeCompare(b.name);
        return order === 'asc' ? compare : -compare;
      }),
    }));
  };

  const toggleEntry = (id) => {
    if (!activeWheel) return;
    updateWheel(activeWheel.id, (wheel) => ({
      ...wheel,
      entries: wheel.entries.map((entry) =>
        entry.id === id ? { ...entry, checked: !entry.checked } : entry
      ),
    }));
  };

  const spinWheel = (wheelId) => {
    if (winnerPopup || combinedPopup) return;

    const wheel = wheels.find((item) => item.id === wheelId);
    if (!wheel || wheel.isSpinning) return;

    const activeEntries = wheel.entries.filter((entry) => entry.checked);
    if (activeEntries.length === 0) return;

    updateWheel(wheelId, (current) => ({ ...current, isSpinning: true }));

    const spinDuration = 5;
    const rotations = 5 + Math.random() * 5;
    const randomAngle = Math.random() * 360;
    const finalAngle = randomAngle + 360 * rotations;

    const wheelRef = wheelRefs.current[wheelId];
    if (!wheelRef) {
      updateWheel(wheelId, (current) => ({ ...current, isSpinning: false }));
      return;
    }

    wheelRef.spin(finalAngle, spinDuration, () => {
      const segmentAngle = 360 / activeEntries.length;
      const normalizedAngle = finalAngle % 360;
      const pointerAngle = 0;
      const wheelAngleAtPointer = (pointerAngle - normalizedAngle + 360) % 360;
      const selectedIndex = Math.floor(wheelAngleAtPointer / segmentAngle) % activeEntries.length;
      const selectedEntry = activeEntries[selectedIndex];

      updateWheel(wheelId, (current) => ({
        ...current,
        selectedResult: selectedEntry,
        isSpinning: false,
      }));

      setWinnerPopup({ wheelId, entry: selectedEntry });

      setRecentSpinWinners((prev) => {
        const next = [...prev.filter((item) => item.wheelId !== wheelId), {
          wheelId,
          wheelName: wheel.title,
          winner: selectedEntry.name,
        }];

        if (next.length >= 2) {
          const lastTwo = next.slice(-2);
          setCombinedPopup(lastTwo);
          return [];
        }
        return next;
      });
    });
  };

  const addWheel = () => {
    if (wheels.length >= 2) {
      return;
    }

    const newWheel = createWheel('Wheel 2');
    setWheels((prev) => {
      if (prev.length === 1) {
        return [
          { ...prev[0], title: 'Wheel 1' },
          { ...newWheel, title: 'Wheel 2' },
        ];
      }
      return prev;
    });

    setActiveWheelId(newWheel.id);
    setPanelTab('entries');
  };

  const removeActiveWheel = () => {
    if (!activeWheel || wheels.length <= 1) {
      return;
    }

    const remainingWheels = wheels.filter((wheel) => wheel.id !== activeWheel.id);
    if (remainingWheels.length === 1) {
      remainingWheels[0] = { ...remainingWheels[0], title: 'My Wheel' };
    }

    setWheels(remainingWheels);

    const fallbackWheel = remainingWheels[0];
    if (fallbackWheel) {
      setActiveWheelId(fallbackWheel.id);
    }
    setPanelTab('entries');
  };

  const closeWinnerPopup = () => {
    setWinnerPopup(null);
  };

  const removeWinner = () => {
    if (!winnerPopup) return;

    const { wheelId, entry } = winnerPopup;
    updateWheel(wheelId, (wheel) => ({
      ...wheel,
      results: [...wheel.results, { id: uuidv4(), name: entry.name, timestamp: new Date() }],
      entries: wheel.entries.length <= 1 ? wheel.entries : wheel.entries.filter((item) => item.id !== entry.id),
    }));
    setWinnerPopup(null);
  };

  const clearResults = () => {
    if (!activeWheel) return;
    updateWheel(activeWheel.id, (wheel) => ({ ...wheel, results: [], selectedResult: null }));
  };

  const addImageToEntry = (id, imageData) => {
    updateEntry(id, { image: imageData });
  };

  const closeCombinedPopup = () => {
    setCombinedPopup(null);
  };

  return (
    <div className="app-container">
      <motion.header 
        className="app-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <h1>🎡 Spin The Wheel</h1>
          <p className="tagline">Create and customize your own spinning wheel game</p>
        </div>
      </motion.header>

      <div className="main-content">
        {/* Wheel Section */}
        <motion.section 
          className="wheel-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className={`wheels-row ${wheels.length === 1 ? 'single-wheel' : ''}`}>
            {wheels.map((wheel) => {
              const isActive = wheel.id === resolvedActiveWheelId;
              const activeEntries = wheel.entries.filter((entry) => entry.checked);

              return (
                <div
                  key={wheel.id}
                  className={`wheel-card ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveWheelId(wheel.id)}
                >
                  <div className="wheel-header">
                    <div
                      className="wheel-title-section"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTitleWheelId(wheel.id);
                      }}
                    >
                      {editingTitleWheelId === wheel.id ? (
                        <input
                          type="text"
                          value={wheel.title}
                          onChange={(e) => updateWheel(wheel.id, (current) => ({ ...current, title: e.target.value }))}
                          onBlur={() => setEditingTitleWheelId(null)}
                          onKeyPress={(e) => e.key === 'Enter' && setEditingTitleWheelId(null)}
                          autoFocus
                          className="title-input"
                        />
                      ) : (
                        <h2 className="wheel-title">{wheel.title}</h2>
                      )}
                    </div>
                    <div
                      className="description-section"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingDescWheelId(wheel.id);
                      }}
                    >
                      {editingDescWheelId === wheel.id ? (
                        <input
                          type="text"
                          value={wheel.description}
                          onChange={(e) => updateWheel(wheel.id, (current) => ({ ...current, description: e.target.value }))}
                          onBlur={() => setEditingDescWheelId(null)}
                          onKeyPress={(e) => e.key === 'Enter' && setEditingDescWheelId(null)}
                          autoFocus
                          className="description-input"
                        />
                      ) : (
                        <p className="description">{wheel.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="wheel-container">
                    <Wheel
                      ref={(node) => {
                        if (node) {
                          wheelRefs.current[wheel.id] = node;
                        }
                      }}
                      entries={activeEntries}
                      selectedResult={wheel.selectedResult}
                      isSpinning={wheel.isSpinning}
                      onSpin={() => spinWheel(wheel.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Side Panels */}
        <div className="side-panels">
          <div className="panel-tabs">
            {wheels.map((wheel) => (
              <button
                key={wheel.id}
                className={`panel-tab ${panelTab === 'entries' && resolvedActiveWheelId === wheel.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveWheelId(wheel.id);
                  setPanelTab('entries');
                }}
              >
                {wheel.title} <span className="count-badge">{wheel.entries.length}</span>
              </button>
            ))}
            <button
              className={`panel-tab ${panelTab === 'results' ? 'active' : ''}`}
              onClick={() => setPanelTab('results')}
            >
              Results <span className="count-badge">{allResults.length}</span>
            </button>
          </div>

          {activeWheel && panelTab === 'entries' && (
            <>
              <EntriesPanel
                entries={activeWheel.entries}
                onAddEntry={addEntry}
                onUpdateEntry={updateEntry}
                onDeleteEntry={deleteEntry}
                onDuplicateEntry={duplicateEntry}
                onToggleEntry={toggleEntry}
                onShuffle={shuffleEntries}
                onSort={sortEntries}
                onAddImage={addImageToEntry}
              />

              <div className="panel-bottom-actions">
                <button
                  className="add-wheel-button"
                  onClick={addWheel}
                  disabled={wheels.length >= 2}
                >
                  ➕ Add wheel
                </button>
              </div>

              {wheels.length > 1 && (
                <div className="panel-bottom-actions">
                  <button className="remove-wheel-button" onClick={removeActiveWheel}>🗑 Remove active wheel</button>
                </div>
              )}
            </>
          )}

          {activeWheel && panelTab === 'results' && (
            <ResultsPanel
              results={allResults}
              onClearResults={() => {
                setWheels((prev) => prev.map((wheel) => ({ ...wheel, results: [] })));
              }}
            />
          )}
        </div>
      </div>

      {winnerPopup && (
        <div className="winner-popup-overlay" onClick={closeWinnerPopup}>
          <motion.div
            className="winner-popup"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="winner-popup-header">We have a winner!</div>
            <div className="winner-popup-body">{winnerPopup.entry.name}</div>
            <div className="winner-popup-actions">
              <button className="winner-btn close" onClick={closeWinnerPopup}>Close</button>
              <button className="winner-btn remove" onClick={removeWinner}>Remove</button>
            </div>
          </motion.div>
        </div>
      )}

      {combinedPopup && (
        <div className="winner-popup-overlay" onClick={closeCombinedPopup}>
          <motion.div
            className="winner-popup combined"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="winner-popup-header">Combined Winners</div>
            <div className="winner-popup-body">
              {combinedPopup.map((item) => (
                <div key={item.wheelId} className="combined-row">
                  <span className="combined-wheel">{item.wheelName}:</span>
                  <span className="combined-name"> {item.winner}</span>
                </div>
              ))}
            </div>
            <div className="winner-popup-actions">
              <button className="winner-btn remove" onClick={closeCombinedPopup}>OK</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
