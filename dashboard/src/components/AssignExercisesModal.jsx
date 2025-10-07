import React, { useEffect, useMemo, useState } from 'react';
import { API_URL } from '../config/api';

export default function AssignExercisesModal({ isOpen, onClose, patient, onSave }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [phase, setPhase] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError('');
    fetch(`${API_URL}/patients/exercises/library`)
      .then(r => r.json())
      .then(json => setExercises(Array.isArray(json.exercises) ? json.exercises : []))
      .catch(() => setError('Failed to load exercises'))
      .finally(() => setLoading(false));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setSummary(`Plan for ${patient?.name || 'patient'} — focus by phase/region`);
  }, [isOpen, patient]);

  const regions = useMemo(() => {
    const set = new Set(exercises.map(e => e.region).filter(Boolean));
    return Array.from(set);
  }, [exercises]);

  const phases = useMemo(() => {
    const set = new Set(exercises.map(e => e.phase).filter(Boolean));
    return Array.from(set);
  }, [exercises]);

  const difficulties = useMemo(() => {
    const set = new Set(exercises.map(e => e.difficulty).filter(Boolean));
    return Array.from(set);
  }, [exercises]);

  const filtered = useMemo(() => {
    let data = exercises;
    if (search) {
      const t = search.toLowerCase();
      data = data.filter((e) =>
        (e.name || '').toLowerCase().includes(t) ||
        (e.focus || '').toLowerCase().includes(t) ||
        (e.description || '').toLowerCase().includes(t)
      );
    }
    if (region) data = data.filter(e => e.region === region);
    if (phase) data = data.filter(e => e.phase === phase);
    if (difficulty) data = data.filter(e => e.difficulty === difficulty);
    return data;
  }, [exercises, search, region, phase, difficulty]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'white', width: 'min(1100px, 96vw)', maxHeight: '90vh', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg,#0ea5e9,#0369a1)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Assign Exercises</div>
          <button onClick={onClose} style={{ background: 'transparent', color: 'white', border: 'none', fontSize: 16, cursor: 'pointer' }}>✕</button>
        </div>

        {/* Controls */}
        <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb', display: 'grid', gridTemplateColumns: '1fr 180px 180px 180px', gap: 12 }}>
          <input placeholder="Search exercises..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}/>
          <select value={region} onChange={e => setRegion(e.target.value)} style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}>
            <option value="">All Regions</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={phase} onChange={e => setPhase(e.target.value)} style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}>
            <option value="">All Phases</option>
            {phases.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}>
            <option value="">All Levels</option>
            {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Body */}
        <div style={{ padding: 16, overflow: 'auto' }}>
          {loading && <div style={{ padding: 16 }}>Loading...</div>}
          {error && <div style={{ padding: 16, color: '#dc2626' }}>{error}</div>}
          {!loading && !error && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {filtered.map((ex) => (
                <label key={ex.id} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(ex.id)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSelectedIds(prev => checked ? [...prev, ex.id] : prev.filter(id => id !== ex.id));
                    }}
                    style={{ marginTop: 4 }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{ex.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{ex.region} • {ex.phase} • {ex.difficulty}</div>
                    {ex.duration && <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{ex.duration}</div>}
                    {ex.focus && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{ex.focus}</div>}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #e5e7eb', padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>Selected: {selectedIds.length}</div>
            <input placeholder="Treatment plan summary" value={summary} onChange={e => setSummary(e.target.value)} style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}/>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={{ padding: '10px 16px', background: 'white', border: '1px solid #d1d5db', borderRadius: 8, color: '#374151', fontWeight: 600 }}>Cancel</button>
            <button
              onClick={() => onSave({ summary, ids: selectedIds })}
              style={{ padding: '10px 16px', background: 'linear-gradient(135deg,#0ea5e9,#0369a1)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700 }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


