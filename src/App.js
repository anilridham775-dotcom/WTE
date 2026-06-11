bash

cat /home/claude/ecoloop-full/src/App.js
Output

import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import Generators from './components/generators/Generators';
import BinManagement from './components/bins/BinManagement';
import Drivers from './components/drivers/Drivers';
import Vehicles from './components/vehicles/Vehicles';
import { Trips, YardInspection, Billing } from './components/trips/Trips';
import { C } from './components/ui';

const NAV = [
  { section: 'Operations', items: [
    { id: 'dashboard',   label: 'Dashboard',          icon: '⬡' },
    { id: 'generators',  label: 'Generator Registry', icon: '🏭', badge: null },
    { id: 'trips',       label: 'Trip & Lift Plans',  icon: '📍' },
    { id: 'collection',  label: 'Waste Collection',   icon: '📦' },
  ]},
  { section: 'Dustbin Management', items: [
    { id: 'bins',        label: 'Bin Management',     icon: '🗑' },
  ]},
  { section: 'Compliance', items: [
    { id: 'inspection',  label: 'Yard Inspection',    icon: '🔍' },
    { id: 'billing',     label: 'Billing & Receipts', icon: '🧾' },
  ]},
  { section: 'Fleet Management', items: [
    { id: 'vehicles',    label: 'Vehicle Management', icon: '🚛' },
    { id: 'drivers',     label: 'Driver Registry',    icon: '👤' },
  ]},
];

const PAGE_TITLES = {
  dashboard: 'Operations Dashboard',
  generators: 'Waste Generator Registry',
  trips: 'Trip & Lift Plans',
  collection: 'Waste Collection',
  bins: 'Bin Management',
  inspection: 'Yard Inspection',
  billing: 'Billing & Receipts',
  vehicles: 'Vehicle Management',
  drivers: 'Driver Registry',
};

export default function App() {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage]     = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  if (loading) {
    return (
      <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background: C.bg0 }}>
        <div style={{ textAlign:'center', color: C.t3 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>♻️</div>
          <div style={{ fontFamily:'Consolas,monospace', fontSize:16, color: C.g }}>EcoLoop Pro</div>
          <div style={{ marginTop:8, fontSize:12 }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) return <Login onLogin={setUser} />;

  const renderPage = () => {
    switch (page) {
      case 'dashboard':   return <Dashboard setPage={setPage} />;
      case 'generators':  return <Generators />;
      case 'trips':       return <Trips />;
      case 'collection':  return <Billing />;
      case 'bins':        return <BinManagement />;
      case 'inspection':  return <YardInspection />;
      case 'billing':     return <Billing />;
      case 'vehicles':    return <Vehicles />;
      case 'drivers':     return <Drivers />;
      default:            return <Dashboard setPage={setPage} />;
    }
  };

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background: C.bg0, color: C.t1, fontFamily:"'Segoe UI',Arial,sans-serif", fontSize:13 }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width: sidebarOpen ? 232 : 0, minWidth: sidebarOpen ? 232 : 0, background: C.bg1, borderRight:`1px solid ${C.bdr}`, display:'flex', flexDirection:'column', overflowY:'auto', flexShrink:0, transition:'all .2s', overflow:'hidden' }}>

        {/* Logo */}
        <div style={{ padding:'16px 16px 12px', borderBottom:`1px solid ${C.bdr}`, flexShrink:0 }}>
          <div style={{ fontSize:22, marginBottom:4 }}>♻️</div>
          <div style={{ fontFamily:'Consolas,monospace', fontSize:13, fontWeight:700, color: C.g }}>EcoLoop Pro</div>
          <div style={{ fontSize:9, color: C.t3, marginTop:2, textTransform:'uppercase', letterSpacing:.5 }}>Waste-to-Energy ERP v3.0</div>
        </div>

        {/* Nav */}
        <div style={{ flex:1, padding:'6px 0' }}>
          {NAV.map(sec => (
            <div key={sec.section}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:'1.8px', textTransform:'uppercase', color: C.t4, padding:'8px 16px 3px' }}>
                {sec.section}
              </div>
              {sec.items.map(item => (
                <div key={item.id} onClick={() => setPage(item.id)}
                  style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 16px', cursor:'pointer', fontSize:12, color: page===item.id ? C.g : C.t3, borderLeft:`2px solid ${page===item.id ? C.g : 'transparent'}`, background: page===item.id ? 'rgba(0,230,118,.07)' : 'transparent', transition:'all .12s' }}>
                  <span style={{ fontSize:15, width:18, flexShrink:0, textAlign:'center' }}>{item.icon}</span>
                  <span style={{ flex:1 }}>{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* User / Logout */}
        <div style={{ padding:'10px 14px', borderTop:`1px solid ${C.bdr}`, flexShrink:0 }}>
          <div style={{ fontSize:11, color: C.t3, marginBottom:6, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            <span style={{ display:'inline-block', width:6, height:6, borderRadius:'50%', background: C.g, marginRight:5 }}></span>
            {user.email}
          </div>
          <button onClick={handleLogout}
            style={{ width:'100%', padding:'5px 0', borderRadius:6, border:`1px solid ${C.bdr2}`, background: C.bg4, color: C.t3, cursor:'pointer', fontSize:11, fontFamily:'inherit' }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>

        {/* Topbar */}
        <div style={{ background: C.bg1, borderBottom:`1px solid ${C.bdr}`, padding:'10px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => setSidebarOpen(s=>!s)}
              style={{ background:'none', border:'none', color: C.t3, cursor:'pointer', fontSize:18, lineHeight:1, padding:4 }}>
              ☰
            </button>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color: C.t1 }}>{PAGE_TITLES[page] || page}</div>
              <div style={{ fontSize:11, color: C.t3, marginTop:1 }}>EcoLoop Waste-to-Energy ERP · Live</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ fontSize:11, color: C.t3, padding:'3px 10px', background: C.bg3, borderRadius:20 }}>
              🟢 All Systems Online
            </div>
            <button onClick={() => setPage('trips')}
              style={{ padding:'6px 14px', borderRadius:8, border:'none', background: C.g, color:'#000', fontWeight:700, cursor:'pointer', fontSize:12, fontFamily:'inherit' }}>
              + New Trip
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px 20px', display:'flex', flexDirection:'column', gap:14, background: C.bg0 }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
Done
