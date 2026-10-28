import React, { useState, useEffect } from 'react';
import { Activity, Shield, Calendar, DollarSign, Layers, FileText, User, Lock, Mail, LogOut, AlertTriangle, BarChart2, Users } from 'lucide-react';

const theme = {
  bg: '#0d111a',
  cardBg: '#151c28',
  cardBorder: '#1f293d',
  textPrimary: '#ffffff',
  textSecondary: '#8b949e',
  accentBlue: '#00d2ff',
  accentGreen: '#00e676',
  accentRed: '#ff5252',
  badgeBg: 'rgba(0, 230, 118, 0.15)',
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [activeTab, setActiveTab] = useState('Overview');
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/all-data')
      .then(res => res.json())
      .then(result => setData(result))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || (authMode === 'signup' && !name)) {
      alert('Please fill in all fields!');
      return;
    }
    setIsLoggedIn(true);
  };

  const handleApproveChange = async () => {
    try {
      await fetch('http://localhost:5000/api/approve-change', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      const allRes = await fetch('http://localhost:5000/api/all-data');
      const allResult = await allRes.json();
      setData(allResult);
    } catch (err) {
      console.error("Error updating change request:", err);
    }
  };

  if (!data) return <div style={{ color: '#fff', padding: '40px' }}>Loading Database from Multiple Collections...</div>;

  const { project, tasks, changeRequests, evm, defects } = data;
  const budget = project.approvedBudget;
  const durationWeeks = project.durationWeeks;
  const healthScore = project.healthScore;
  const cpi = evm.cpi;
  const spi = evm.spi;

  // --- LOGIN & SIGNUP SCREEN ---
  if (!isLoggedIn) {
    return (
      <div style={{ backgroundColor: theme.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: '20px' }}>
        <div style={{ backgroundColor: theme.cardBg, padding: '40px', borderRadius: '16px', border: `1px solid ${theme.cardBorder}`, width: '100%', maxWidth: '420px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', justifyContent: 'center' }}>
            <div style={{ width: '45px', height: '45px', backgroundColor: theme.accentBlue, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
              <Activity size={26} />
            </div>
            <div>
              <h2 style={{ color: theme.textPrimary, margin: 0, fontSize: '22px' }}>Smart Healthcare</h2>
              <p style={{ color: theme.textSecondary, margin: 0, fontSize: '12px' }}>Project Management Portal</p>
            </div>
          </div>

          <div style={{ display: 'flex', backgroundColor: '#090d14', padding: '4px', borderRadius: '8px', marginBottom: '24px' }}>
            <button
              onClick={() => setAuthMode('login')}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: authMode === 'login' ? theme.accentBlue : 'transparent', color: authMode === 'login' ? '#000' : theme.textSecondary, fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
            >
              Login
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: authMode === 'signup' ? theme.accentBlue : 'transparent', color: authMode === 'signup' ? '#000' : theme.textSecondary, fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {authMode === 'signup' && (
              <div>
                <label style={{ color: theme.textSecondary, fontSize: '12px', display: 'block', marginBottom: '6px' }}>Full Name</label>
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0d111a', border: `1px solid ${theme.cardBorder}`, borderRadius: '8px', padding: '0 12px' }}>
                  <User size={16} color={theme.textSecondary} />
                  <input type="text" placeholder="Hanan Farooq" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', padding: '12px', outline: 'none' }} />
                </div>
              </div>
            )}

            <div>
              <label style={{ color: theme.textSecondary, fontSize: '12px', display: 'block', marginBottom: '6px' }}>Email Address</label>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0d111a', border: `1px solid ${theme.cardBorder}`, borderRadius: '8px', padding: '0 12px' }}>
                <Mail size={16} color={theme.textSecondary} />
                <input type="email" placeholder="hanan@comsats.edu.pk" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', padding: '12px', outline: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ color: theme.textSecondary, fontSize: '12px', display: 'block', marginBottom: '6px' }}>Password</label>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0d111a', border: `1px solid ${theme.cardBorder}`, borderRadius: '8px', padding: '0 12px' }}>
                <Lock size={16} color={theme.textSecondary} />
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', padding: '12px', outline: 'none' }} />
              </div>
            </div>

            <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: theme.accentBlue, color: '#000', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginTop: '8px' }}>
              {authMode === 'login' ? 'Login to Dashboard' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- MAIN DASHBOARD SCREEN ---
  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh', padding: '24px', fontFamily: 'Inter, sans-serif' }}>
      {/* HEADER NAVBAR */}
      <header style={{
        backgroundColor: theme.cardBg, padding: '16px 24px', borderRadius: '12px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', border: `1px solid ${theme.cardBorder}`, flexWrap: 'wrap', gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', backgroundColor: theme.accentBlue, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
            <Activity size={24} />
          </div>
          <div>
            <h2 style={{ color: theme.textPrimary, margin: 0, fontSize: '20px' }}>Smart Healthcare</h2>
            <p style={{ color: theme.textSecondary, margin: 0, fontSize: '12px' }}>MERN Multi-Collection Database Dashboard</p>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '4px', backgroundColor: '#090d14', padding: '6px', borderRadius: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'Overview', label: 'Overview', icon: Activity },
            { id: 'Charter', label: '1. Initiation', icon: FileText },
            { id: 'Scope', label: '2. Scope', icon: Layers },
            { id: 'Schedule', label: '3. Gantt & Schedule', icon: Calendar },
            { id: 'EVM', label: '4. EVM Cost', icon: DollarSign },
            { id: 'Quality', label: '5. Quality', icon: Shield },
            { id: 'Risk', label: '6. Risk Register', icon: AlertTriangle },
            { id: 'Resources', label: '7. Resources', icon: Users },
            { id: 'About', label: 'About PM', icon: User }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px', padding: '7px 10px', borderRadius: '6px', border: 'none',
                  backgroundColor: isActive ? theme.accentBlue : 'transparent', color: isActive ? '#000' : theme.textSecondary,
                  fontWeight: isActive ? 'bold' : '500', cursor: 'pointer', fontSize: '12px'
                }}
              >
                <Icon size={12} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <div style={{ color: theme.accentGreen, fontWeight: 'bold', backgroundColor: theme.badgeBg, padding: '5px 10px', borderRadius: '20px', fontSize: '11px' }}>
              🟢 MULTI-DB CONNECTED
            </div>
            <span style={{ color: theme.textSecondary, fontSize: '11px', fontWeight: '500' }}>
              Project Manager: <strong style={{ color: theme.textPrimary }}>{name || 'Hanan Farooq'}</strong>
            </span>
          </div>

          <button
            onClick={() => setIsLoggedIn(false)}
            title="Logout"
            style={{ backgroundColor: 'rgba(255,82,82,0.15)', border: 'none', color: theme.accentRed, padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* OVERVIEW TAB */}
      {activeTab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
              <span style={{ backgroundColor: theme.badgeBg, color: theme.accentGreen, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>ON TRACK</span>
              <h3 style={{ color: theme.textPrimary, margin: '12px 0 4px 0', fontSize: '22px' }}>{project.title}</h3>
              <p style={{ color: theme.textSecondary, margin: '0 0 20px 0', fontSize: '14px' }}>Sprint 4 of {durationWeeks} Weeks</p>
              <div style={{ backgroundColor: '#0d111a', padding: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: theme.textSecondary, fontSize: '14px', fontWeight: '600' }}>HEALTH SCORE</span>
                <span style={{ color: theme.accentGreen, fontSize: '32px', fontWeight: 'bold' }}>{healthScore} /100</span>
              </div>
            </div>

            <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
              <h3 style={{ color: theme.textPrimary, margin: '0 0 8px 0' }}>📋 Scope Change Requests</h3>
              <p style={{ color: theme.textSecondary, margin: '0 0 16px 0', fontSize: '14px' }}>{changeRequests[0]?.title} (+PKR {changeRequests[0]?.costImpact}, {changeRequests[0]?.scheduleImpact}).</p>
              <button
                onClick={handleApproveChange}
                style={{
                  width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
                  backgroundColor: project.changeApproved ? theme.accentGreen : theme.accentBlue,
                  color: '#000', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer'
                }}
              >
                {project.changeApproved ? '✓ Change Approved & Saved in DB' : 'Approve Change Request (+PKR 800k)'}
              </button>
            </div>
          </div>

          <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
            <h3 style={{ color: theme.textPrimary, margin: '0 0 4px 0' }}>Earned Value Analysis (EVM)</h3>
            <p style={{ color: theme.textSecondary, margin: '0 0 20px 0', fontSize: '14px' }}>Active Budget: PKR {budget.toLocaleString()}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#0d111a', padding: '12px', borderRadius: '6px' }}>
                <span style={{ color: theme.textSecondary, fontSize: '11px' }}>PV</span>
                <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>{evm.pv}</div>
              </div>
              <div style={{ backgroundColor: '#0d111a', padding: '12px', borderRadius: '6px' }}>
                <span style={{ color: theme.textSecondary, fontSize: '11px' }}>EV</span>
                <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>{evm.ev}</div>
              </div>
              <div style={{ backgroundColor: '#0d111a', padding: '12px', borderRadius: '6px' }}>
                <span style={{ color: theme.textSecondary, fontSize: '11px' }}>AC</span>
                <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>{evm.ac}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ backgroundColor: '#0d111a', padding: '16px', borderRadius: '8px', borderLeft: `4px solid ${theme.accentGreen}` }}>
                <span style={{ color: theme.textSecondary, fontSize: '12px' }}>CPI INDEX</span>
                <h2 style={{ color: theme.textPrimary, margin: '8px 0 0 0', fontSize: '32px' }}>{cpi}</h2>
              </div>
              <div style={{ backgroundColor: '#0d111a', padding: '16px', borderRadius: '8px', borderLeft: `4px solid ${theme.accentBlue}` }}>
                <span style={{ color: theme.textSecondary, fontSize: '12px' }}>SPI INDEX</span>
                <h2 style={{ color: theme.textPrimary, margin: '8px 0 0 0', fontSize: '32px' }}>{spi}</h2>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. INITIATION TAB */}
      {activeTab === 'Charter' && (
        <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
          <h2 style={{ color: theme.textPrimary, marginBottom: '16px' }}>1. Project Initiation & Charter</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ backgroundColor: '#0d111a', padding: '20px', borderRadius: '8px' }}>
              <h4 style={{ color: theme.accentBlue, marginBottom: '10px' }}>Project Objectives</h4>
              <p style={{ color: theme.textSecondary, lineHeight: '1.6' }}>{project.description}</p>
            </div>
            <div style={{ backgroundColor: '#0d111a', padding: '20px', borderRadius: '8px' }}>
              <h4 style={{ color: theme.accentGreen, marginBottom: '10px' }}>Project Constraints & Budget</h4>
              <p style={{ color: theme.textSecondary, marginBottom: '8px' }}>Base Approved Budget: PKR {project.baseBudget?.toLocaleString()}</p>
              <p style={{ color: theme.textSecondary, marginBottom: '8px' }}>Current Active Budget: PKR {budget.toLocaleString()}</p>
              <p style={{ color: theme.textSecondary }}>Total Duration: {durationWeeks} Weeks</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. SCOPE TAB */}
      {activeTab === 'Scope' && (
        <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
          <h2 style={{ color: theme.textPrimary, marginBottom: '16px' }}>2. Scope Management & WBS Tasks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tasks.map((t, idx) => (
              <div key={idx} style={{ backgroundColor: '#0d111a', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ color: theme.textPrimary, fontWeight: '600', fontSize: '15px' }}>{t.taskName}</span>
                  <p style={{ color: theme.textSecondary, fontSize: '12px', margin: '4px 0 0 0' }}>Module: {t.moduleName} | Assigned: {t.assignedTo}</p>
                </div>
                <span style={{ color: t.status === 'Completed' ? theme.accentGreen : theme.accentBlue, fontSize: '13px', fontWeight: 'bold' }}>{t.status} ({t.progress}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SCHEDULE & GANTT TAB */}
      {activeTab === 'Schedule' && (
        <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
          <h2 style={{ color: theme.textPrimary, marginBottom: '16px' }}>3. Schedule, Gantt Chart & Milestone Timeline</h2>
          <p style={{ color: theme.textSecondary, marginBottom: '20px' }}>Visualizing critical path and sprint milestones across {durationWeeks} weeks.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { phase: 'Sprint 1: Requirement Analysis & Charter', weeks: 'Weeks 1 - 3', progress: 100, color: theme.accentGreen },
              { phase: 'Sprint 2: Core Patient & EHR Architecture', weeks: 'Weeks 4 - 8', progress: 85, color: theme.accentBlue },
              { phase: 'Sprint 3: AI Diagnostics & Integration', weeks: 'Weeks 9 - 13', progress: 40, color: '#ffb74d' },
              { phase: 'Sprint 4: Testing, QA & Deployment', weeks: 'Weeks 14 - 16', progress: 10, color: theme.accentRed }
            ].map((g, idx) => (
              <div key={idx} style={{ backgroundColor: '#0d111a', padding: '16px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: theme.textPrimary, fontWeight: 'bold', fontSize: '14px' }}>{g.phase}</span>
                  <span style={{ color: theme.textSecondary, fontSize: '12px' }}>{g.weeks}</span>
                </div>
                <div style={{ width: '100%', height: '10px', backgroundColor: '#1f293d', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${g.progress}%`, height: '100%', backgroundColor: g.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. EVM COST TAB */}
      {activeTab === 'EVM' && (
        <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
          <h2 style={{ color: theme.textPrimary, marginBottom: '16px' }}>4. Cost Management & EVM Analysis</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div style={{ backgroundColor: '#0d111a', padding: '20px', borderRadius: '8px' }}>
              <h4 style={{ color: theme.textSecondary }}>Planned Budget (BAC)</h4>
              <h2 style={{ color: theme.accentBlue, fontSize: '26px', margin: '8px 0' }}>PKR {budget.toLocaleString()}</h2>
            </div>
            <div style={{ backgroundColor: '#0d111a', padding: '20px', borderRadius: '8px' }}>
              <h4 style={{ color: theme.textSecondary }}>Cost Performance Index (CPI)</h4>
              <h2 style={{ color: theme.accentGreen, fontSize: '26px', margin: '8px 0' }}>{cpi}</h2>
            </div>
            <div style={{ backgroundColor: '#0d111a', padding: '20px', borderRadius: '8px' }}>
              <h4 style={{ color: theme.textSecondary }}>Schedule Performance Index (SPI)</h4>
              <h2 style={{ color: theme.accentBlue, fontSize: '26px', margin: '8px 0' }}>{spi}</h2>
            </div>
          </div>
        </div>
      )}

      {/* 5. QUALITY & DEFECTS TAB */}
      {activeTab === 'Quality' && (
        <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
          <h2 style={{ color: theme.textPrimary, marginBottom: '16px' }}>5. Quality Management & Defect Tracking</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {defects.map((d, idx) => (
              <div key={idx} style={{ backgroundColor: '#0d111a', padding: '16px', borderRadius: '8px', borderLeft: `4px solid ${theme.accentRed}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: theme.accentRed, fontSize: '15px' }}>{d.defectTitle}</strong>
                  <p style={{ color: theme.textSecondary, fontSize: '13px', margin: '4px 0 0 0' }}>Assigned to: {d.assignedPersonnel} | Status: {d.resolutionStatus}</p>
                </div>
                <span style={{ backgroundColor: 'rgba(255,82,82,0.2)', color: theme.accentRed, padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>{d.severity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. RISK REGISTER TAB */}
      {activeTab === 'Risk' && (
        <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
          <h2 style={{ color: theme.textPrimary, marginBottom: '16px' }}>6. Risk Register & Probability Matrix</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { risk: 'EHR API Rate Limit & Integration Failure', probability: 'High', impact: 'Critical', mitigation: 'Implement local caching layer and fallback endpoints.' },
              { risk: 'Database Overload during Peak Hours across 5 Hospitals', probability: 'Medium', impact: 'High', mitigation: 'Use database indexing and connection pooling.' },
              { risk: 'Resource Turnover / Developer Illness', probability: 'Low', impact: 'Medium', mitigation: 'Cross-train team members on modular MERN components.' }
            ].map((r, idx) => (
              <div key={idx} style={{ backgroundColor: '#0d111a', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #ffb74d' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong style={{ color: '#ffb74d', fontSize: '15px' }}>{r.risk}</strong>
                  <span style={{ fontSize: '12px', color: theme.textSecondary }}>Prob: {r.probability} | Impact: {r.impact}</span>
                </div>
                <p style={{ color: theme.textSecondary, fontSize: '13px', margin: 0 }}><strong>Mitigation Strategy:</strong> {r.mitigation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. RESOURCES TAB */}
      {activeTab === 'Resources' && (
        <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
          <h2 style={{ color: theme.textPrimary, marginBottom: '16px' }}>7. Resource Allocation & Workload Matrix</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { role: 'Project Manager', name: 'Hanan Farooq', allocation: '100%', tasks: 'EVM, Sprint Planning, Risk Management' },
              { role: 'Backend Developers (2)', name: 'Backend Team', allocation: '100%', tasks: 'Node.js, Express APIs, MongoDB' },
              { role: 'Frontend Developers (2)', name: 'Frontend Team', allocation: '100%', tasks: 'React, Tailwind/CSS, UI Dashboards' },
              { role: 'QA & Testing Engineer', name: 'QA Team', allocation: '80%', tasks: 'Jest Unit Testing, Defect Tracking' }
            ].map((res, idx) => (
              <div key={idx} style={{ backgroundColor: '#0d111a', padding: '18px', borderRadius: '8px' }}>
                <h4 style={{ color: theme.accentBlue, marginBottom: '6px' }}>{res.role}</h4>
                <p style={{ color: theme.textPrimary, fontWeight: 'bold', fontSize: '14px', margin: '0 0 4px 0' }}>{res.name} ({res.allocation})</p>
                <p style={{ color: theme.textSecondary, fontSize: '12px', margin: 0 }}>Core Duties: {res.tasks}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. ABOUT PM TAB */}
      {activeTab === 'About' && (
        <div style={{ backgroundColor: theme.cardBg, padding: '28px', borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: theme.accentBlue, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '24px', fontWeight: 'bold' }}>
              HF
            </div>
            <div>
              <h2 style={{ color: theme.textPrimary, margin: 0, fontSize: '24px' }}>{name || 'Hanan Farooq'}</h2>
              <p style={{ color: theme.accentBlue, margin: '4px 0 0 0', fontSize: '14px', fontWeight: '600' }}>Project Manager & Full Stack Software Engineer</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ backgroundColor: '#0d111a', padding: '20px', borderRadius: '8px' }}>
              <h4 style={{ color: theme.accentGreen, marginBottom: '10px' }}>Academic Background</h4>
              <p style={{ color: theme.textSecondary, lineHeight: '1.6', margin: 0 }}>
                Studying Computer Science and Software Engineering at <strong>COMSATS University Islamabad, Sahiwal Campus</strong>. Focused on Software Project Management, MERN Stack Engineering, and Automated Testing Pipelines.
              </p>
            </div>

            <div style={{ backgroundColor: '#0d111a', padding: '20px', borderRadius: '8px' }}>
              <h4 style={{ color: theme.accentBlue, marginBottom: '10px' }}>Core Responsibilities</h4>
              <p style={{ color: theme.textSecondary, lineHeight: '1.6', margin: 0 }}>
                Managing project scope, Earned Value Management (EVM) tracking, Work Breakdown Structure (WBS), risk mitigation, and full-stack API integration for enterprise healthcare solutions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}