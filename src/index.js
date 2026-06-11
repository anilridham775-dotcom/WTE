import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://oddvetoasqjziohmqugg.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_5Z2PrRqnJ8gLiG12KmecCQ_m4VyDFaB';
const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { autoRefreshToken:true, persistSession:true, detectSessionInUrl:true }});


// ── DESIGN TOKENS ──────────────────────────────────────────
const C = {
  g:'#00e676', g2:'#00c853', a:'#ff9800', r:'#f44336',
  b:'#2196f3', p:'#9c27b0', c:'#00bcd4', t:'#009688',
  bg0:'#060a0f', bg1:'#0d1520', bg2:'#111d2e', bg3:'#162236',
  bg4:'#1c2d42', bg5:'#233450',
  t1:'#e8f4fd', t2:'#9ab8d4', t3:'#5a7a9a', t4:'#2e4a65',
  bdr:'rgba(255,255,255,.07)', bdr2:'rgba(255,255,255,.12)',
};

const FONT = "font-family:'Segoe UI',Arial,sans-serif";
const MONO = "font-family:Consolas,'Courier New',monospace";

// ── BADGE ───────────────────────────────────────────────────
function Badge({ color = 'g', children, small }) {
  const bg = { g:'rgba(0,230,118,.15)',a:'rgba(255,152,0,.15)',r:'rgba(244,67,54,.15)',b:'rgba(33,150,243,.15)',p:'rgba(156,39,176,.15)',c:'rgba(0,188,212,.15)',t:'rgba(0,150,136,.15)',gr:'rgba(255,255,255,.08)' };
  const tc = { g:C.g,a:C.a,r:C.r,b:C.b,p:C.p,c:C.c,t:C.t,gr:C.t3 };
  return (
    <span style={{ display:'inline-flex',alignItems:'center',padding:small?'1px 6px':'2px 8px',borderRadius:20,fontSize:small?10:10.5,fontWeight:600,background:bg[color]||bg.g,color:tc[color]||C.g,whiteSpace:'nowrap' }}>
      {children}
    </span>
  );
}

// ── BUTTON ──────────────────────────────────────────────────
function Btn({ onClick, color='default', size='md', children, type='button', disabled, full, icon }) {
  const bg = { default:C.bg4,primary:C.g,danger:C.r,warning:C.a,info:C.b };
  const tc = { default:C.t1,primary:'#000',danger:'#fff',warning:'#000',info:'#fff' };
  const pad = { sm:'4px 10px',md:'7px 14px',lg:'10px 20px' };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ display:'inline-flex',alignItems:'center',gap:5,padding:pad[size],borderRadius:8,border:`1px solid ${color==='default'?C.bdr2:bg[color]}`,background:bg[color]||C.bg4,color:tc[color]||C.t1,fontFamily:'inherit',fontSize:size==='sm'?11.5:13,fontWeight:color==='primary'?700:500,cursor:disabled?'not-allowed':'pointer',opacity:disabled?.6:1,width:full?'100%':undefined,justifyContent:full?'center':undefined,transition:'all .12s' }}>
      {icon && <span>{icon}</span>}{children}
    </button>
  );
}

// ── CARD ────────────────────────────────────────────────────
function Card({ title, extra, children, noPad, accent }) {
  return (
    <div style={{ background:C.bg1,border:`1px solid ${C.bdr}`,borderRadius:12,overflow:'hidden',borderTop:accent?`2px solid ${accent}`:undefined }}>
      {title && (
        <div style={{ padding:'11px 15px',borderBottom:`1px solid ${C.bdr}`,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8 }}>
          <span style={{ fontSize:13,fontWeight:600,color:C.t1 }}>{title}</span>
          {extra && <div style={{ display:'flex',gap:8,alignItems:'center' }}>{extra}</div>}
        </div>
      )}
      <div style={{ padding:noPad?0:14 }}>{children}</div>
    </div>
  );
}

// ── STAT CARD ───────────────────────────────────────────────
function StatCard({ color='g', label, value, sub, icon }) {
  return (
    <div style={{ background:C.bg1,border:`1px solid ${C.bdr}`,borderRadius:12,padding:'13px 14px',borderTop:`2px solid ${C[color]||C.g}`,position:'relative',overflow:'hidden' }}>
      {icon && <div style={{ position:'absolute',right:12,top:12,fontSize:22,opacity:.15 }}>{icon}</div>}
      <div style={{ fontSize:10,fontWeight:600,letterSpacing:'1.2px',textTransform:'uppercase',color:C.t3 }}>{label}</div>
      <div style={{ fontSize:22,fontWeight:700,margin:'5px 0 2px',fontFamily:'Consolas,monospace',color:C[color]||C.g }}>{value}</div>
      <div style={{ fontSize:10.5,color:C.t3 }}>{sub}</div>
    </div>
  );
}

// ── PROGRESS BAR ────────────────────────────────────────────
function ProgBar({ pct, color, height=5 }) {
  const c = color || (pct>80?C.r:pct>60?C.a:C.g);
  return (
    <div style={{ height,background:C.bg4,borderRadius:3,overflow:'hidden' }}>
      <div style={{ height:'100%',width:`${Math.min(pct,100)}%`,background:c,borderRadius:3,transition:'width .4s' }}></div>
    </div>
  );
}

// ── ALERT ───────────────────────────────────────────────────
function Alert({ type='a', children }) {
  const bc = { g:C.g,a:C.a,r:C.r,b:C.b };
  const bg = { g:'rgba(0,230,118,.07)',a:'rgba(255,152,0,.07)',r:'rgba(244,67,54,.07)',b:'rgba(33,150,243,.07)' };
  return (
    <div style={{ padding:'9px 13px',borderRadius:8,fontSize:12.5,borderLeft:`3px solid ${bc[type]}`,background:bg[type],color:bc[type],display:'flex',alignItems:'center',gap:8 }}>
      {children}
    </div>
  );
}

// ── TABLE ───────────────────────────────────────────────────
function Table({ heads, rows, loading }) {
  if (loading) return <Loading text="Loading data..."/>;
  return (
    <div style={{ overflowX:'auto' }}>
      <table style={{ width:'100%',borderCollapse:'collapse',fontSize:12.5,minWidth:480 }}>
        <thead>
          <tr style={{ borderBottom:`1px solid ${C.bdr2}` }}>
            {heads.map((h,i) => (
              <th key={i} style={{ textAlign:'left',padding:'8px 12px',fontSize:10,textTransform:'uppercase',letterSpacing:'1.2px',color:C.t3,fontWeight:600,whiteSpace:'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={heads.length} style={{ padding:'24px 12px',textAlign:'center',color:C.t3,fontSize:13 }}>No records found</td></tr>
          ) : rows.map((row,i) => (
            <tr key={i} style={{ borderBottom:`1px solid ${C.bdr}` }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.02)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              {row.map((cell,j) => (
                <td key={j} style={{ padding:'9px 12px',color:C.t2,verticalAlign:'middle' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── FORM FIELD ──────────────────────────────────────────────
function Field({ label, required, children, hint, error, half, third }) {
  const gridCol = third ? '1' : half ? '1' : undefined;
  return (
    <div style={{ display:'flex',flexDirection:'column',gap:5,gridColumn:gridCol }}>
      {label && (
        <label style={{ fontSize:11.5,color:C.t2,fontWeight:500 }}>
          {label}{required && <span style={{ color:C.r,marginLeft:2,fontSize:10 }}>*</span>}
        </label>
      )}
      {children}
      {hint && <div style={{ fontSize:11,color:C.t3 }}>{hint}</div>}
      {error && <div style={{ fontSize:11,color:C.r }}>{error}</div>}
    </div>
  );
}

const inputStyle = {
  background:C.bg3, border:`1px solid ${C.bdr2}`, borderRadius:8,
  color:C.t1, padding:'7px 10px', fontSize:12.5, width:'100%',
  fontFamily:'inherit', outline:'none',
};

function Input({ value, onChange, placeholder, type='text', required, disabled, style:extra }) {
  return (
    <input value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      type={type} required={required} disabled={disabled}
      style={{ ...inputStyle,...extra,opacity:disabled?.6:1 }}
      onFocus={e=>e.target.style.borderColor=C.g}
      onBlur={e=>e.target.style.borderColor=C.bdr2}
    />
  );
}

function Select({ value, onChange, options, required, disabled }) {
  return (
    <select value={value||''} onChange={e=>onChange(e.target.value)} required={required} disabled={disabled}
      style={{ ...inputStyle,cursor:'pointer' }}>
      <option value="">— Select —</option>
      {options.map(o => typeof o === 'string'
        ? <option key={o} value={o}>{o}</option>
        : <option key={o.value} value={o.value}>{o.label}</option>
      )}
    </select>
  );
}

function Textarea({ value, onChange, placeholder, rows=3, required }) {
  return (
    <textarea value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      rows={rows} required={required}
      style={{ ...inputStyle,resize:'vertical',minHeight:64 }}
      onFocus={e=>e.target.style.borderColor=C.g}
      onBlur={e=>e.target.style.borderColor=C.bdr2}
    />
  );
}

// ── MODAL ───────────────────────────────────────────────────
function Modal({ open, onClose, title, children, footer, wide }) {
  if (!open) return null;
  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}}
      style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:16 }}>
      <div style={{ background:C.bg1,border:`1px solid ${C.bdr2}`,borderRadius:16,width:wide?720:580,maxWidth:'96vw',maxHeight:'90vh',overflow:'hidden',display:'flex',flexDirection:'column' }}>
        <div style={{ padding:'15px 18px',borderBottom:`1px solid ${C.bdr}`,display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0,background:C.bg1 }}>
          <span style={{ fontSize:14,fontWeight:600,color:C.t1 }}>{title}</span>
          <button onClick={onClose} style={{ background:'none',border:'none',color:C.t3,cursor:'pointer',fontSize:18,lineHeight:1,padding:4 }}>✕</button>
        </div>
        <div style={{ padding:18,overflowY:'auto',flex:1 }}>{children}</div>
        {footer && (
          <div style={{ padding:'12px 18px',borderTop:`1px solid ${C.bdr}`,display:'flex',justifyContent:'flex-end',gap:10,flexShrink:0,background:C.bg1 }}>{footer}</div>
        )}
      </div>
    </div>
  );
}

// ── FORM GRID ───────────────────────────────────────────────
function FormGrid({ children, cols=2 }) {
  return (
    <div style={{ display:'grid',gridTemplateColumns:`repeat(${cols},1fr)`,gap:12 }}>
      {children}
    </div>
  );
}
function FullCol({ children }) {
  return <div style={{ gridColumn:'1/-1' }}>{children}</div>;
}

// ── SECTION DIVIDER ─────────────────────────────────────────
function SectionDiv({ children }) {
  return (
    <div style={{ fontSize:10,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:C.t3,padding:'4px 0 8px',borderBottom:`1px solid ${C.bdr}`,margin:'14px 0 12px',gridColumn:'1/-1' }}>
      {children}
    </div>
  );
}

// ── LOADING ─────────────────────────────────────────────────
function Loading({ text='Loading...' }) {
  return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:10,padding:40,color:C.t3,fontSize:13 }}>
      <div style={{ width:20,height:20,border:`2px solid ${C.bdr2}`,borderTop:`2px solid ${C.g}`,borderRadius:'50%',animation:'spin 1s linear infinite' }}></div>
      {text}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ── EMPTY STATE ─────────────────────────────────────────────
function Empty({ icon='📭', title, desc, action }) {
  return (
    <div style={{ textAlign:'center',padding:'40px 20px',color:C.t3 }}>
      <div style={{ fontSize:40,marginBottom:12 }}>{icon}</div>
      <div style={{ fontSize:15,fontWeight:600,color:C.t2,marginBottom:6 }}>{title}</div>
      <div style={{ fontSize:13,marginBottom:action?16:0 }}>{desc}</div>
      {action}
    </div>
  );
}

// ── PHOTO UPLOAD ZONE ───────────────────────────────────────
function PhotoZone({ label, onCapture, count=0, required }) {
  return (
    <div style={{ border:`1.5px dashed ${count>0?C.g:C.bdr2}`,borderRadius:8,padding:14,textAlign:'center',cursor:'pointer',transition:'.15s',background:count>0?'rgba(0,230,118,.04)':'transparent' }}
      onClick={()=>onCapture && onCapture()}>
      <div style={{ fontSize:22,marginBottom:6 }}>📷</div>
      <div style={{ fontSize:12,color:count>0?C.g:C.t3 }}>{label}</div>
      {required && count===0 && <div style={{ fontSize:10,color:C.a,marginTop:4 }}>Required</div>}
      {count>0 && <div style={{ fontSize:10,color:C.g,marginTop:4 }}>{count} photo(s) attached ✓</div>}
    </div>
  );
}

// ── TABS ────────────────────────────────────────────────────
function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display:'flex',borderBottom:`1px solid ${C.bdr}`,overflowX:'auto',flexShrink:0,marginBottom:16 }}>
      {tabs.map(tab => (
        <div key={tab.id} onClick={()=>onChange(tab.id)}
          style={{ padding:'8px 16px',cursor:'pointer',fontSize:12.5,whiteSpace:'nowrap',borderBottom:`2px solid ${active===tab.id?C.g:'transparent'}`,color:active===tab.id?C.g:C.t3,transition:'.12s',marginBottom:-1 }}>
          {tab.label}{tab.count!==undefined && <span style={{ marginLeft:6,fontSize:10,background:C.bg3,padding:'1px 5px',borderRadius:10,color:C.t3 }}>{tab.count}</span>}
        </div>
      ))}
    </div>
  );
}

// ── PIN INPUT ───────────────────────────────────────────────
function PinInput({ value, onChange, label='Supervisor PIN' }) {
  return (
    <Field label={label} hint="4-digit approval PIN">
      <Input type="password" value={value} onChange={onChange} placeholder="••••" style={{ letterSpacing:8,fontSize:18,textAlign:'center',width:100 }}/>
    </Field>
  );
}

// ── SEARCH INPUT ────────────────────────────────────────────
function SearchInput({ value, onChange, placeholder='Search...' }) {
  return (
    <div style={{ position:'relative' }}>
      <span style={{ position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:C.t3,fontSize:14 }}>🔍</span>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{ ...inputStyle,paddingLeft:32,width:200,fontSize:12 }}/>
    </div>
  );
}



function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else onLogin(data.user);
    setLoading(false);
  }

  return (
    <div style={{ minHeight:'100vh',background:C.bg0,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Segoe UI',Arial,sans-serif" }}>
      <div style={{ width:380,background:C.bg1,border:`1px solid ${C.bdr2}`,borderRadius:16,padding:32 }}>
        {/* Logo */}
        <div style={{ textAlign:'center',marginBottom:28 }}>
          <div style={{ fontSize:40,marginBottom:8 }}>♻️</div>
          <div style={{ fontFamily:'Consolas,monospace',fontSize:20,fontWeight:700,color:C.g }}>EcoLoop Pro</div>
          <div style={{ fontSize:11,color:C.t3,marginTop:4,textTransform:'uppercase',letterSpacing:1 }}>Waste-to-Energy ERP</div>
        </div>

        {error && <div style={{ marginBottom:16 }}><Alert type="r">{error}</Alert></div>}

        <form onSubmit={handleLogin} style={{ display:'flex',flexDirection:'column',gap:14 }}>
          <Field label="Email Address" required>
            <Input type="email" value={email} onChange={setEmail} placeholder="you@company.com" required/>
          </Field>
          <Field label="Password" required>
            <Input type="password" value={password} onChange={setPassword} placeholder="••••••••" required/>
          </Field>
          <Btn type="submit" color="primary" full disabled={loading} size="lg">
            {loading ? 'Signing in...' : 'Sign In'}
          </Btn>
        </form>

        <div style={{ marginTop:20,padding:14,background:C.bg3,borderRadius:8,fontSize:11.5,color:C.t3 }}>
          <div style={{ fontWeight:600,color:C.t2,marginBottom:6 }}>Demo Credentials:</div>
          <div>Admin: admin@ecoloop.com / admin123</div>
          <div>Driver: driver@ecoloop.com / driver123</div>
          <div>Inspector: inspector@ecoloop.com / inspect123</div>
        </div>
      </div>
    </div>
  );
}



function Dashboard({ setPage }) {
  const [stats, setStats] = useState(null);
  const [trips, setTrips] = useState([]);
  const [criticalBins, setCriticalBins] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    try {
      const [genRes, binRes, tripRes, vehicleRes, invoiceRes] = await Promise.all([
        supabase.from('generators').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('bins').select('id,bin_code,current_fill_pct,status,operation_type,generators(company_name),zone'),
        supabase.from('trips').select('*,vehicles(reg_no),drivers(full_name)').order('created_at', { ascending: false }).limit(5),
        supabase.from('vehicles').select('*,drivers(full_name)').eq('status', 'Active'),
        supabase.from('invoices').select('total_amount,payment_status').gte('invoice_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]),
      ]);

      const bins = binRes.data || [];
      const critical = bins.filter(b => b.current_fill_pct >= 80);
      const monthlyTotal = (invoiceRes.data || []).reduce((s, i) => s + (i.total_amount || 0), 0);

      setStats({
        generators: genRes.count || 0,
        bins: bins.length,
        criticalBins: critical.length,
        activeTrips: (tripRes.data || []).filter(t => t.status === 'In Transit').length,
        monthlyRevenue: monthlyTotal,
      });
      setCriticalBins(critical.slice(0, 5));
      setTrips(tripRes.data || []);
      setFleet((vehicleRes.data || []).slice(0, 4));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  if (loading) return <Loading text="Loading dashboard..."/>;

  return (
    <>
      {/* Alerts */}
      {stats?.criticalBins > 0 && (
        <Alert type="r">🔴 {stats.criticalBins} bin(s) above 80% fill — immediate pickup required.
          <button onClick={() => setPage('fill-alerts')} style={{ marginLeft:'auto',background:'none',border:`1px solid ${C.r}`,color:C.r,padding:'2px 10px',borderRadius:6,cursor:'pointer',fontSize:11,fontWeight:600 }}>View Alerts</button>
        </Alert>
      )}

      {/* KPI Stats */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(115px,1fr))',gap:10 }}>
        <StatCard color="g" label="Active Generators" value={stats?.generators||0} sub="Registered clients" icon="🏭"/>
        <StatCard color="b" label="Total Bins" value={stats?.bins||0} sub={`${stats?.criticalBins||0} critical`} icon="🗑"/>
        <StatCard color="a" label="Active Trips" value={stats?.activeTrips||0} sub="In transit" icon="🚛"/>
        <StatCard color="g" label="Monthly Revenue" value={`₹${((stats?.monthlyRevenue||0)/100000).toFixed(1)}L`} sub="This month" icon="💰"/>
        <StatCard color="r" label="Critical Bins" value={stats?.criticalBins||0} sub=">80% fill" icon="⚠️"/>
        <StatCard color="c" label="Fleet Active" value={fleet.length} sub="Vehicles online" icon="🚚"/>
      </div>

      {/* Two column layout */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
        {/* Active Trips */}
        <Card title="🚛 Active Trips" extra={
          <button onClick={() => setPage('trips')} style={{ padding:'3px 10px',borderRadius:6,border:`1px solid ${C.bdr2}`,background:C.bg4,color:C.t1,cursor:'pointer',fontSize:11.5 }}>All Trips</button>
        } noPad>
          <Table
            heads={['Trip','Vehicle','Driver','Status']}
            rows={(trips||[]).map(t => [
              <strong style={{ fontFamily:'Consolas,monospace',color:C.t1 }}>{t.trip_code}</strong>,
              <span style={{ fontFamily:'Consolas,monospace',fontSize:11 }}>{t.vehicles?.reg_no}</span>,
              t.drivers?.full_name,
              <Badge color={t.status==='In Transit'?'a':t.status==='Completed'?'g':t.status==='Dispatched'?'b':'gr'}>{t.status}</Badge>
            ])}
          />
        </Card>

        {/* Critical Bins */}
        <Card title="⚠️ Critical Bins" extra={<Badge color="r">{stats?.criticalBins||0} Critical</Badge>}>
          {criticalBins.length === 0 ? (
            <div style={{ textAlign:'center',padding:20,color:C.t3 }}>✅ All bins within normal levels</div>
          ) : criticalBins.map(b => (
            <div key={b.id} style={{ marginBottom:10 }}>
              <div style={{ display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:3 }}>
                <span>
                  <strong style={{ fontFamily:'Consolas,monospace',color:C.t1 }}>{b.bin_code}</strong>
                  <span style={{ color:C.t3,marginLeft:6 }}>{b.generators?.company_name} · {b.zone}</span>
                </span>
                <span style={{ fontFamily:'Consolas,monospace',fontWeight:700,color:b.current_fill_pct>=80?C.r:C.a }}>{b.current_fill_pct}%</span>
              </div>
              <ProgBar pct={b.current_fill_pct}/>
            </div>
          ))}
        </Card>
      </div>

      {/* Boiler + Fleet */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
        {/* Boiler Gauges */}
        <Card title="🔥 Boiler B-01 Live" extra={<Badge color="g">Operational</Badge>} accent={C.r}>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:12 }}>
            {[['842°C','Combustion',C.r,84],['9.2 bar','Pressure',C.a,77],['92%','Efficiency',C.g,92]].map(([v,l,c,p]) => (
              <div key={l} style={{ textAlign:'center',background:C.bg2,borderRadius:8,padding:10 }}>
                <div style={{ fontSize:18,fontWeight:700,fontFamily:'Consolas,monospace',color:c }}>{v}</div>
                <div style={{ fontSize:10,color:C.t3,margin:'3px 0' }}>{l}</div>
                <ProgBar pct={p} color={c}/>
              </div>
            ))}
          </div>
          <div style={{ fontSize:11.5,color:C.t3 }}>
            Steam: <strong style={{ color:C.t1 }}>4.2T/h</strong> &nbsp;·&nbsp;
            Feed: <strong style={{ color:C.t1 }}>580 kg/h</strong> &nbsp;·&nbsp;
            Today: <strong style={{ color:C.t1 }}>8.4T</strong>
          </div>
        </Card>

        {/* Waste Flow Pipeline */}
        <Card title="⬡ Waste Flow Pipeline" extra={<Badge color="g">Live</Badge>}>
          <div style={{ display:'flex',flexWrap:'wrap',gap:4,alignItems:'center',marginBottom:12 }}>
            {['Generator','Smart Bin','Vehicle Lift','Yard Insp.','Crusher','Boiler'].map((step,i) => (
              <React.Fragment key={step}>
                <div style={{ padding:'4px 10px',borderRadius:7,fontSize:11.5,background:i<4?'rgba(0,230,118,.08)':'rgba(255,255,255,.05)',border:`1px solid ${i<4?'rgba(0,230,118,.25)':'rgba(255,255,255,.07)'}`,color:i<4?C.g:C.t3 }}>{step}</div>
                {i < 5 && <span style={{ color:C.t4 }}>→</span>}
              </React.Fragment>
            ))}
          </div>
          <div style={{ fontSize:11,color:C.t3,marginBottom:4,display:'flex',justifyContent:'space-between' }}>
            <span>Today throughput</span><span style={{ color:C.t1 }}>18.4 / 23.6 T (78%)</span>
          </div>
          <ProgBar pct={78} color={C.g}/>
          <div style={{ marginTop:12,display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,fontSize:11.5 }}>
            {[['Collected','18.4T',C.g],['Crushed','12.1T',C.a],['Steam Output','4.2T/h',C.r],['Ash Today','0.6T',C.t3]].map(([l,v,c]) => (
              <div key={l} style={{ background:C.bg2,borderRadius:6,padding:'6px 10px' }}>
                <div style={{ color:C.t3,fontSize:10 }}>{l}</div>
                <div style={{ color:c,fontFamily:'Consolas,monospace',fontWeight:700 }}>{v}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Fleet Health */}
      <Card title="🚛 Fleet Health Overview" extra={
        <button onClick={() => setPage('vehicles')} style={{ padding:'3px 10px',borderRadius:6,border:`1px solid ${C.bdr2}`,background:C.bg4,color:C.t1,cursor:'pointer',fontSize:11.5 }}>All Vehicles</button>
      }>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:10 }}>
          {fleet.map(v => (
            <div key={v.id} style={{ background:C.bg2,border:`1px solid ${C.bdr}`,borderRadius:9,padding:12 }}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8 }}>
                <div>
                  <div style={{ fontFamily:'Consolas,monospace',fontSize:12,fontWeight:700,color:C.t1 }}>{v.reg_no}</div>
                  <div style={{ fontSize:10.5,color:C.t3 }}>{v.drivers?.full_name || 'Unassigned'}</div>
                </div>
                <Badge color={v.status==='Active'?'g':v.status==='In Maintenance'?'a':'r'}>{v.status}</Badge>
              </div>
              <div style={{ fontSize:11,color:C.t3,marginBottom:4 }}>Fuel Level</div>
              <ProgBar pct={v.current_fuel_pct||0}/>
              <div style={{ fontSize:10,color:C.t3,marginTop:3 }}>{v.current_fuel_pct||0}%</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}



const INDUSTRY_TYPES = ['Chemical','Petrochemical','Textile','Pharmaceutical','Metal/Foundry','Food Processing','Plastic','Cement','Refinery','Power Plant','Other'];
const WASTE_CATEGORIES = ['Hazardous','Non-Hazardous','Mixed','Biomedical'];

const EMPTY_FORM = {
  company_name:'', industry_type:'', contact_person:'', mobile:'', email:'',
  gstin:'', pcb_auth_no:'', pcb_expiry:'', address:'', city:'', state:'',
  pincode:'', gps_lat:'', gps_lng:'', avg_waste_per_day:'', waste_category:'',
};

function Generators() {
  const [generators, setGenerators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { loadGenerators(); }, []);

  async function loadGenerators() {
    setLoading(true);
    const { data, error } = await supabase
      .from('generators')
      .select('*, bins(id)')
      .order('created_at', { ascending: false });
    if (!error) setGenerators(data || []);
    setLoading(false);
  }

  function openNew() {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(true);
  }

  function openEdit(gen) {
    setEditItem(gen);
    setForm({
      company_name: gen.company_name, industry_type: gen.industry_type,
      contact_person: gen.contact_person, mobile: gen.mobile, email: gen.email||'',
      gstin: gen.gstin||'', pcb_auth_no: gen.pcb_auth_no||'', pcb_expiry: gen.pcb_expiry||'',
      address: gen.address, city: gen.city||'', state: gen.state||'', pincode: gen.pincode||'',
      gps_lat: gen.gps_lat||'', gps_lng: gen.gps_lng||'',
      avg_waste_per_day: gen.avg_waste_per_day||'', waste_category: gen.waste_category||'',
    });
    setError('');
    setModalOpen(true);
  }

  function setField(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSave() {
    if (!form.company_name || !form.contact_person || !form.mobile || !form.address) {
      setError('Please fill all required fields.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editItem) {
        const { error } = await supabase.from('generators').update({ ...form, updated_at: new Date() }).eq('id', editItem.id);
        if (error) throw error;
        setSuccess('Generator updated successfully.');
      } else {
        const { data: codeData } = await supabase.rpc('next_gen_code');
        const { error } = await supabase.from('generators').insert({ ...form, gen_code: codeData });
        if (error) throw error;
        setSuccess(`Generator ${codeData} registered successfully.`);
      }
      setModalOpen(false);
      loadGenerators();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  }

  async function toggleActive(gen) {
    await supabase.from('generators').update({ is_active: !gen.is_active }).eq('id', gen.id);
    loadGenerators();
  }

  const filtered = generators.filter(g => {
    const matchSearch = !search || g.company_name.toLowerCase().includes(search.toLowerCase()) || g.gen_code.toLowerCase().includes(search.toLowerCase()) || g.city?.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === 'all' || (tab === 'active' && g.is_active) || (tab === 'inactive' && !g.is_active) || (tab === 'pcb-due' && g.pcb_expiry && new Date(g.pcb_expiry) < new Date(Date.now() + 30*24*60*60*1000));
    return matchSearch && matchTab;
  });

  const pcbDue = generators.filter(g => g.pcb_expiry && new Date(g.pcb_expiry) < new Date(Date.now() + 30*24*60*60*1000)).length;

  function pcbStatus(expiry) {
    if (!expiry) return { label: 'No PCB', color: 'gr' };
    const days = Math.ceil((new Date(expiry) - new Date()) / (1000*60*60*24));
    if (days < 0) return { label: 'Expired', color: 'r' };
    if (days < 30) return { label: `Due in ${days}d`, color: 'a' };
    return { label: 'Valid', color: 'g' };
  }

  return (
    <>
      {success && <Alert type="g">{success}</Alert>}
      {pcbDue > 0 && <Alert type="a">⚠️ {pcbDue} generator(s) have PCB authorization expiring within 30 days.</Alert>}

      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(115px,1fr))',gap:10 }}>
        <StatCard color="g" label="Total Generators" value={generators.length} sub="Registered" icon="🏭"/>
        <StatCard color="g" label="Active" value={generators.filter(g=>g.is_active).length} sub="Currently active" icon="✅"/>
        <StatCard color="a" label="PCB Due" value={pcbDue} sub="Within 30 days" icon="⚠️"/>
        <StatCard color="b" label="Total Bins" value={generators.reduce((s,g)=>s+(g.bins?.length||0),0)} sub="Deployed bins" icon="🗑"/>
      </div>

      <Card title="🏭 Waste Generator Registry"
        extra={
          <div style={{ display:'flex',gap:8,flexWrap:'wrap',alignItems:'center' }}>
            <SearchInput value={search} onChange={setSearch} placeholder="Search company, city..."/>
            <Btn color="primary" onClick={openNew} size="sm">+ Register Generator</Btn>
          </div>
        }
        noPad>
        <Tabs
          tabs={[{id:'all',label:'All',count:generators.length},{id:'active',label:'Active',count:generators.filter(g=>g.is_active).length},{id:'pcb-due',label:'PCB Due',count:pcbDue},{id:'inactive',label:'Inactive'}]}
          active={tab} onChange={setTab}/>
        <div style={{ padding:'0 0 0 0' }}>
          <Table
            loading={loading}
            heads={['Gen ID','Company','Industry','Contact','Mobile','City','Waste/Day','Waste Cat.','PCB Status','Bins','Status','']}
            rows={filtered.map(g => {
              const pcb = pcbStatus(g.pcb_expiry);
              return [
                <strong style={{ fontFamily:'Consolas,monospace',color:C.g }}>{g.gen_code}</strong>,
                <div><div style={{ fontWeight:600,color:C.t1 }}>{g.company_name}</div><div style={{ fontSize:10,color:C.t3 }}>{g.gstin||'No GSTIN'}</div></div>,
                g.industry_type,
                g.contact_person,
                <span style={{ fontFamily:'Consolas,monospace',fontSize:11 }}>{g.mobile}</span>,
                g.city||'-',
                <span style={{ fontFamily:'Consolas,monospace' }}>{g.avg_waste_per_day||'-'} kg</span>,
                <Badge color={g.waste_category==='Hazardous'?'r':g.waste_category==='Non-Hazardous'?'g':'a'}>{g.waste_category||'-'}</Badge>,
                <Badge color={pcb.color}>{pcb.label}</Badge>,
                <span style={{ fontFamily:'Consolas,monospace' }}>{g.bins?.length||0}</span>,
                <Badge color={g.is_active?'g':'gr'}>{g.is_active?'Active':'Inactive'}</Badge>,
                <div style={{ display:'flex',gap:5 }}>
                  <Btn size="sm" onClick={()=>openEdit(g)}>Edit</Btn>
                  <Btn size="sm" color={g.is_active?'danger':'primary'} onClick={()=>toggleActive(g)}>{g.is_active?'Deactivate':'Activate'}</Btn>
                </div>
              ];
            })}
          />
        </div>
      </Card>

      {/* Register/Edit Modal */}
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)}
        title={editItem ? `Edit — ${editItem.gen_code}` : '🏭 Register Waste Generator'}
        wide
        footer={<>
          <Btn onClick={()=>setModalOpen(false)}>Cancel</Btn>
          <Btn color="primary" onClick={handleSave} disabled={saving}>{saving?'Saving...':editItem?'Save Changes':'Register & Generate ID'}</Btn>
        </>}>

        {error && <div style={{ marginBottom:12 }}><Alert type="r">{error}</Alert></div>}

        <FormGrid>
          <SectionDiv>Company Information</SectionDiv>
          <Field label="Company Name" required><Input value={form.company_name} onChange={v=>setField('company_name',v)} placeholder="e.g. Tata Steel Ltd." required/></Field>
          <Field label="Industry Type" required><Select value={form.industry_type} onChange={v=>setField('industry_type',v)} options={INDUSTRY_TYPES} required/></Field>
          <Field label="Contact Person" required><Input value={form.contact_person} onChange={v=>setField('contact_person',v)} placeholder="Full name" required/></Field>
          <Field label="Mobile Number" required><Input value={form.mobile} onChange={v=>setField('mobile',v)} placeholder="+91 XXXXXXXXXX" required/></Field>
          <Field label="Email Address"><Input type="email" value={form.email} onChange={v=>setField('email',v)} placeholder="contact@company.com"/></Field>
          <Field label="GSTIN"><Input value={form.gstin} onChange={v=>setField('gstin',v)} placeholder="22AAAAA0000A1Z5"/></Field>

          <SectionDiv>PCB Authorization</SectionDiv>
          <Field label="PCB Authorization Number"><Input value={form.pcb_auth_no} onChange={v=>setField('pcb_auth_no',v)} placeholder="PCB/2024/XXXX"/></Field>
          <Field label="PCB Expiry Date"><Input type="date" value={form.pcb_expiry} onChange={v=>setField('pcb_expiry',v)}/></Field>

          <SectionDiv>Address & Location</SectionDiv>
          <FullCol><Field label="Plant Address" required><Textarea value={form.address} onChange={v=>setField('address',v)} placeholder="Full address with PIN code" required/></Field></FullCol>
          <Field label="City"><Input value={form.city} onChange={v=>setField('city',v)} placeholder="City"/></Field>
          <Field label="State"><Input value={form.state} onChange={v=>setField('state',v)} placeholder="State"/></Field>
          <Field label="PIN Code"><Input value={form.pincode} onChange={v=>setField('pincode',v)} placeholder="400001"/></Field>
          <Field label="GPS Latitude"><Input value={form.gps_lat} onChange={v=>setField('gps_lat',v)} placeholder="18.9220"/></Field>
          <Field label="GPS Longitude"><Input value={form.gps_lng} onChange={v=>setField('gps_lng',v)} placeholder="72.8347"/></Field>

          <SectionDiv>Waste Details</SectionDiv>
          <Field label="Average Waste per Day (kg)" hint="Estimated daily waste generation">
            <Input type="number" value={form.avg_waste_per_day} onChange={v=>setField('avg_waste_per_day',v)} placeholder="500"/>
          </Field>
          <Field label="Waste Category" required><Select value={form.waste_category} onChange={v=>setField('waste_category',v)} options={WASTE_CATEGORIES} required/></Field>
        </FormGrid>
      </Modal>
    </>
  );
}



const OP_TYPES = [{value:'A',label:'Type A — Emptied at site (bin stays)'},{value:'B',label:'Type B — Full bin lifted onto truck'},{value:'C',label:'Type C — Loose bag on stand'}];
const CONTAINER_CATEGORIES = {
  A:['Wheelie Bin — 120L','Wheelie Bin — 240L','Wheelie Bin — 660L','Wheelie Bin — 1100L','Open-top Steel Drum — 200L','Closed Steel Drum — 200L','Cage / Pallet Bin — 1000L','Static Compactor Unit','Bulk Fixed Container'],
  B:['Skip Bin — 2m³','Skip Bin — 4m³','Skip Bin — 6m³','Skip Bin — 8m³','Skip Bin — 12m³','IBC (Intermediate Bulk Container) — 1000L','Roll-on Roll-off Container','Hook-lift Container','Swap Body / Demountable'],
  C:['Big Bag (FIBC) — 500kg','Big Bag (FIBC) — 1000kg','Woven Polypropylene Bag + Stand','Hazmat-rated Bag — UN certified'],
};
const WASTE_CATEGORIES = ['Hazardous Solid','Hazardous Liquid','Hazardous Sludge','Chemical Waste','Acid/Alkali Waste','Solvent Waste','Flammable Waste','Industrial Non-Hazardous Solid','Mixed Industrial Solid','Metal Scrap','Plastic Waste','Pharmaceutical Waste','Biomedical Waste','ETP Sludge','Fly Ash','Oil Contaminated Waste'];
const HAZARD_CLASSES = ['Not applicable','Class 3 — Flammable liquid','Class 4.1 — Flammable solid','Class 5.1 — Oxidising','Class 6.1 — Toxic','Class 8 — Corrosive','Class 9 — Misc. hazardous','Schedule I — CPCB','Schedule II — CPCB'];
const TAG_TYPES = ['QR Code (printed label)','QR Code (metal plate)','RFID UHF 915MHz (passive)','RFID HF 13.56MHz (NFC)','QR + RFID (dual tag)'];
const SENSOR_TYPES = ['None — manual entry only','Ultrasonic sensor (ToF)','Infrared fill sensor','Load cell (weight-based)','Pressure sensor (liquid)'];
const MATERIALS = ['HDPE Plastic','Galvanised Steel','Stainless Steel (SS 304)','Stainless Steel (SS 316)','FRP','Mild Steel (painted)','Aluminium','Woven Polypropylene (bag)','UN-certified Plastic (hazmat)'];
const COLOURS = ['🔴 Red — Hazardous','🟡 Yellow — Caution','🟢 Green — Non-Hazardous','🔵 Blue — Recyclable','⚫ Black — General','🟠 Orange — Biomedical','⬜ White — Chemical'];

const EMPTY_BIN = {
  generator_id:'',operation_type:'A',container_category:'',body_material:'',capacity_litres:'',capacity_kg:'',tare_weight_kg:'',dimensions:'',lid_type:'',mobility:'',colour_code:'',liner_type:'',
  stand_type:'',stand_capacity_kg:'',stand_material:'',stand_asset_tag:'',
  waste_category:'',waste_form:'',hazard_class:'',calorific_value:'',density:'',moisture_pct:'',
  zone:'',specific_location:'',gps_lat:'',gps_lng:'',floor_level:'',access_route:'',site_contact:'',
  tag_technology:'',tag_placement:'',fill_sensor_type:'',fill_alert_threshold:80,sensor_fallback:'',alert_channel:'WhatsApp+SMS',
  collection_frequency:'',preferred_time:'',gate_restriction:'',receipt_type:'WhatsApp receipt',rate_per_kg:'',billing_basis:'Per kg (weighed)',
};

function BinManagement() {
  const [bins, setBins] = useState([]);
  const [generators, setGenerators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [fillModalOpen, setFillModalOpen] = useState(false);
  const [selectedBin, setSelectedBin] = useState(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_BIN);
  const [fillForm, setFillForm] = useState({ fill_pct:'', fill_kg:'', data_source:'MANUAL', notes:'', supervisor_pin:'' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const [binRes, genRes] = await Promise.all([
      supabase.from('bins').select('*,generators(company_name,city)').order('created_at',{ascending:false}),
      supabase.from('generators').select('id,gen_code,company_name').eq('is_active',true).order('company_name'),
    ]);
    setBins(binRes.data||[]);
    setGenerators(genRes.data||[]);
    setLoading(false);
  }

  function setField(k,v) { setForm(f=>({...f,[k]:v})); }

  function openDeploy() { setForm(EMPTY_BIN); setStep(1); setError(''); setModalOpen(true); }

  async function handleDeploy() {
    if (!form.generator_id||!form.container_category||!form.waste_category) {
      setError('Please complete all required fields.'); return;
    }
    setSaving(true);
    try {
      const { data:code } = await supabase.rpc('next_bin_code');
      const { error } = await supabase.from('bins').insert({ ...form, bin_code:code });
      if (error) throw error;
      setSuccess(`Bin ${code} deployed successfully!`);
      setModalOpen(false);
      loadData();
      setTimeout(()=>setSuccess(''),5000);
    } catch(err) { setError(err.message); }
    setSaving(false);
  }

  async function updateFill() {
    if (!fillForm.fill_pct) { setError('Fill percentage required.'); return; }
    setSaving(true);
    try {
      await supabase.from('bins').update({ current_fill_pct:Number(fillForm.fill_pct), current_fill_kg:fillForm.fill_kg||null, updated_at:new Date() }).eq('id',selectedBin.id);
      await supabase.from('bin_fill_readings').insert({ bin_id:selectedBin.id, fill_pct:Number(fillForm.fill_pct), fill_kg:fillForm.fill_kg||null, data_source:fillForm.data_source, supervisor_pin_verified:fillForm.supervisor_pin.length===4, notes:fillForm.notes });
      setSuccess('Fill level updated.');
      setFillModalOpen(false);
      loadData();
      setTimeout(()=>setSuccess(''),4000);
    } catch(err) { setError(err.message); }
    setSaving(false);
  }

  const filtered = bins.filter(b => {
    const matchSearch = !search || b.bin_code.toLowerCase().includes(search.toLowerCase()) || b.generators?.company_name.toLowerCase().includes(search.toLowerCase()) || b.zone?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter==='all' || b.operation_type===typeFilter;
    return matchSearch && matchType;
  });

  const critical = bins.filter(b=>b.current_fill_pct>=80);
  const typeCount = (t) => bins.filter(b=>b.operation_type===t).length;

  const opColor = {A:C.t,B:C.p,C:C.a};

  return (
    <>
      {success&&<Alert type="g">{success}</Alert>}
      {critical.length>0&&<Alert type="r">🔴 {critical.length} bin(s) critical (≥80% fill) — schedule pickup immediately.</Alert>}

      <Tabs tabs={[{id:'dashboard',label:'Bin Dashboard'},{id:'all',label:'All Bins',count:bins.length},{id:'typeA',label:'Type A',count:typeCount('A')},{id:'typeB',label:'Type B',count:typeCount('B')},{id:'typeC',label:'Type C',count:typeCount('C')},{id:'alerts',label:'Fill Alerts',count:critical.length}]} active={tab} onChange={setTab}/>

      {/* ── DASHBOARD TAB ── */}
      {tab==='dashboard' && (
        <>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(115px,1fr))',gap:10}}>
            <StatCard color="g" label="Total Bins" value={bins.length} sub="Deployed" icon="🗑"/>
            <StatCard color="t" label="Type A" value={typeCount('A')} sub="Wheelie/drum/cage" icon="🔄"/>
            <StatCard color="p" label="Type B" value={typeCount('B')} sub="Skip/IBC/hook-lift" icon="🏗"/>
            <StatCard color="a" label="Type C" value={typeCount('C')} sub="FIBC bag + stand" icon="🛍"/>
            <StatCard color="r" label="Critical >80%" value={critical.length} sub="Urgent pickup" icon="⚠️"/>
            <StatCard color="b" label="With Sensor" value={bins.filter(b=>b.fill_sensor_type&&b.fill_sensor_type!=='None — manual entry only').length} sub="IoT enabled" icon="📡"/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <Card title="📊 Fill Levels — All Bins">
              {bins.slice(0,10).map(b=>(
                <div key={b.id} style={{marginBottom:9}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:3}}>
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <strong style={{fontFamily:'Consolas,monospace',color:C.t1}}>{b.bin_code}</strong>
                      <span style={{padding:'1px 6px',borderRadius:10,fontSize:9,fontWeight:600,background:b.operation_type==='A'?'rgba(0,150,136,.15)':b.operation_type==='B'?'rgba(156,39,176,.15)':'rgba(255,152,0,.15)',color:opColor[b.operation_type]}}>Type {b.operation_type}</span>
                      <span style={{color:C.t3}}>{b.generators?.company_name} · {b.zone}</span>
                    </div>
                    <span style={{fontFamily:'Consolas,monospace',fontWeight:700,color:b.current_fill_pct>=80?C.r:b.current_fill_pct>=60?C.a:C.g}}>{b.current_fill_pct||0}%</span>
                  </div>
                  <ProgBar pct={b.current_fill_pct||0}/>
                </div>
              ))}
            </Card>
            <Card title="⚠️ Critical Bins">
              {critical.length===0
                ? <div style={{textAlign:'center',padding:20,color:C.t3}}>✅ All bins within normal levels</div>
                : critical.map(b=>(
                  <div key={b.id} style={{background:'rgba(244,67,54,.07)',border:'1px solid rgba(244,67,54,.2)',borderRadius:8,padding:10,marginBottom:8}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                      <div>
                        <strong style={{fontFamily:'Consolas,monospace',color:C.r}}>{b.bin_code}</strong>
                        <div style={{fontSize:11,color:C.t3}}>{b.generators?.company_name} · {b.zone} · {b.container_category}</div>
                      </div>
                      <div style={{fontFamily:'Consolas,monospace',fontSize:20,fontWeight:700,color:C.r}}>{b.current_fill_pct}%</div>
                    </div>
                    <div style={{marginTop:8,display:'flex',gap:6}}>
                      <Btn size="sm" color="primary" onClick={()=>{setSelectedBin(b);setFillForm({fill_pct:'',fill_kg:'',data_source:'MANUAL',notes:'',supervisor_pin:''});setFillModalOpen(true);}}>Schedule Pickup</Btn>
                      <Btn size="sm" onClick={()=>{setSelectedBin(b);setFillForm({fill_pct:'',fill_kg:'',data_source:'MANUAL',notes:'',supervisor_pin:''});setFillModalOpen(true);}}>Update Fill</Btn>
                    </div>
                  </div>
                ))
              }
            </Card>
          </div>
        </>
      )}

      {/* ── ALL BINS / TYPE TABS ── */}
      {['all','typeA','typeB','typeC'].includes(tab) && (
        <Card title={tab==='all'?'All Bins':`Type ${tab.replace('type','')} Bins`}
          extra={<div style={{display:'flex',gap:8}}>
            <SearchInput value={search} onChange={setSearch} placeholder="Search bin, generator..."/>
            <Select value={typeFilter} onChange={setTypeFilter} options={[{value:'all',label:'All Types'},{value:'A',label:'Type A'},{value:'B',label:'Type B'},{value:'C',label:'Type C'}]}/>
            <Btn color="primary" size="sm" onClick={openDeploy}>+ Deploy Bin</Btn>
          </div>}
          noPad>
          <Table loading={loading}
            heads={['Bin ID','Type','Container','Material','Generator','Zone','Waste Cat.','Hazard','Fill%','Tag','Sensor','Status','']}
            rows={filtered.filter(b=>typeFilter==='all'||b.operation_type===typeFilter).map(b=>[
              <strong style={{fontFamily:'Consolas,monospace',color:C.g,fontSize:12}}>{b.bin_code}</strong>,
              <span style={{padding:'2px 8px',borderRadius:10,fontSize:10,fontWeight:600,background:b.operation_type==='A'?'rgba(0,150,136,.15)':b.operation_type==='B'?'rgba(156,39,176,.15)':'rgba(255,152,0,.15)',color:opColor[b.operation_type]}}>Type {b.operation_type}</span>,
              b.container_category,b.body_material,
              b.generators?.company_name,b.zone||'-',
              <Badge color={b.waste_category?.toLowerCase().includes('hazardous')||b.waste_category?.toLowerCase().includes('chemical')?'r':b.waste_category?.toLowerCase().includes('pharma')?'a':'g'}>{b.waste_category}</Badge>,
              b.hazard_class||'-',
              <div>
                <span style={{fontFamily:'Consolas,monospace',fontWeight:700,color:b.current_fill_pct>=80?C.r:b.current_fill_pct>=60?C.a:C.g}}>{b.current_fill_pct||0}%</span>
                <ProgBar pct={b.current_fill_pct||0} height={3}/>
              </div>,
              <Badge color={b.tag_technology?.includes('RFID')?'b':b.tag_technology?.includes('dual')?'p':'g'}>{b.tag_technology?.split(' ')[0]||'QR'}</Badge>,
              <Badge color={b.fill_sensor_type&&b.fill_sensor_type!=='None — manual entry only'?'c':'gr'}>{b.fill_sensor_type&&b.fill_sensor_type!=='None — manual entry only'?'Sensor':'Manual'}</Badge>,
              <Badge color={b.status==='Critical'?'r':b.status==='Active'?'g':'a'}>{b.status}</Badge>,
              <div style={{display:'flex',gap:4}}>
                <Btn size="sm" onClick={()=>{setSelectedBin(b);setFillForm({fill_pct:'',fill_kg:'',data_source:'MANUAL',notes:'',supervisor_pin:''});setFillModalOpen(true);}}>Update Fill</Btn>
              </div>
            ])}/>
        </Card>
      )}

      {/* ── ALERTS TAB ── */}
      {tab==='alerts' && (
        <>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(115px,1fr))',gap:10}}>
            <StatCard color="r" label="Critical (≥80%)" value={bins.filter(b=>b.current_fill_pct>=80).length} sub="Urgent" icon="🔴"/>
            <StatCard color="a" label="Warning (60-79%)" value={bins.filter(b=>b.current_fill_pct>=60&&b.current_fill_pct<80).length} sub="Plan soon" icon="🟡"/>
            <StatCard color="b" label="No Sensor" value={bins.filter(b=>!b.fill_sensor_type||b.fill_sensor_type==='None — manual entry only').length} sub="Manual entry" icon="📋"/>
          </div>
          <Card title="⚠️ Active Fill Alerts"
            extra={<Btn size="sm" color="primary" onClick={()=>{setSelectedBin(null);setFillModalOpen(true);}}>📊 Manual Update</Btn>}
            noPad>
            <Table loading={loading}
              heads={['Bin ID','Type','Container','Generator','Zone','Fill%','Data Source','Action']}
              rows={bins.filter(b=>b.current_fill_pct>=60).sort((a,b)=>b.current_fill_pct-a.current_fill_pct).map(b=>[
                <strong style={{fontFamily:'Consolas,monospace',color:b.current_fill_pct>=80?C.r:C.t1}}>{b.bin_code}</strong>,
                `Type ${b.operation_type}`,b.container_category,
                b.generators?.company_name,b.zone||'-',
                <span style={{fontFamily:'Consolas,monospace',fontWeight:700,fontSize:14,color:b.current_fill_pct>=80?C.r:C.a}}>{b.current_fill_pct}%</span>,
                <Badge color={b.fill_sensor_type&&b.fill_sensor_type!=='None — manual entry only'?'b':'a'}>{b.fill_sensor_type&&b.fill_sensor_type!=='None — manual entry only'?'✅ Sensor':'⚠ Manual'}</Badge>,
                <Btn size="sm" color="primary" onClick={()=>{setSelectedBin(b);setFillModalOpen(true);}}>Update & Schedule</Btn>
              ])}/>
          </Card>
        </>
      )}

      {/* ── DEPLOY BIN MODAL (7-step form) ── */}
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title="🗑 Deploy Dustbin — Full Configuration" wide
        footer={<>
          {step>1&&<Btn onClick={()=>setStep(s=>s-1)}>← Back</Btn>}
          <Btn onClick={()=>setModalOpen(false)}>Cancel</Btn>
          {step<7
            ? <Btn color="primary" onClick={()=>{setError('');setStep(s=>s+1);}}>Next Step →</Btn>
            : <Btn color="primary" onClick={handleDeploy} disabled={saving}>{saving?'Deploying...':'Deploy Bin & Generate Tag'}</Btn>
          }
        </>}>
        {error&&<div style={{marginBottom:12}}><Alert type="r">{error}</Alert></div>}

        {/* Step indicator */}
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:20,paddingBottom:12,borderBottom:`1px solid ${C.bdr}`}}>
          {['Op. Type','Container','Stand','Waste','Location','Sensor/Tag','Schedule'].map((label,i)=>(
            <div key={label} style={{display:'flex',alignItems:'center',gap:4}}>
              <div style={{width:22,height:22,borderRadius:'50%',background:step===i+1?C.g:step>i+1?'rgba(0,230,118,.2)':C.bg3,border:`1px solid ${step>i?C.g:C.bdr2}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:step===i+1?'#000':step>i+1?C.g:C.t3,flexShrink:0}}>{step>i+1?'✓':i+1}</div>
              <span style={{fontSize:10,color:step===i+1?C.t1:C.t3,display:i<2?'inline':'none'}}>{label}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Operation Type */}
        {step===1&&<>
          <div style={{fontSize:13,fontWeight:600,color:C.t1,marginBottom:12}}>Step 1 — Select Operation Type</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:16}}>
            {[{t:'A',icon:'🔄',name:'Type A',sub:'Bin stays at site.\nWaste emptied into truck hopper.\nEmpty bin remains.'},{t:'B',icon:'🏗',name:'Type B',sub:'Full bin lifted onto truck.\nEmpty replacement bin placed back.\nHook-lift / skip / IBC.'},{t:'C',icon:'🛍',name:'Type C',sub:'Loose bag on stand.\nBag lifted into truck.\nNew empty bag placed on stand.'}].map(opt=>(
              <div key={opt.t} onClick={()=>setField('operation_type',opt.t)}
                style={{background:form.operation_type===opt.t?'rgba(0,230,118,.06)':C.bg2,border:`2px solid ${form.operation_type===opt.t?C.g:C.bdr}`,borderRadius:10,padding:14,cursor:'pointer',textAlign:'center',transition:'.15s'}}>
                <div style={{fontSize:28,marginBottom:6}}>{opt.icon}</div>
                <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:4}}>{opt.name}</div>
                <div style={{fontSize:11,color:C.t3,whiteSpace:'pre-line'}}>{opt.sub}</div>
              </div>
            ))}
          </div>
          <FormGrid><Field label="Generator" required><Select value={form.generator_id} onChange={v=>setField('generator_id',v)} options={generators.map(g=>({value:g.id,label:`${g.gen_code} — ${g.company_name}`}))} required/></Field></FormGrid>
        </>}

        {/* Step 2: Container Details */}
        {step===2&&<>
          <div style={{fontSize:13,fontWeight:600,color:C.t1,marginBottom:12}}>Step 2 — Container / Receptacle Details</div>
          <FormGrid>
            <Field label="Container Category" required><Select value={form.container_category} onChange={v=>setField('container_category',v)} options={(CONTAINER_CATEGORIES[form.operation_type]||CONTAINER_CATEGORIES.A)} required/></Field>
            <Field label="Body Material" required><Select value={form.body_material} onChange={v=>setField('body_material',v)} options={MATERIALS} required/></Field>
            <Field label="Capacity (Litres)"><Input type="number" value={form.capacity_litres} onChange={v=>setField('capacity_litres',v)} placeholder="240"/></Field>
            <Field label="Safe Working Load (kg)" required><Input type="number" value={form.capacity_kg} onChange={v=>setField('capacity_kg',v)} placeholder="220" required/></Field>
            <Field label="Dimensions (L × W × H cm)"><Input value={form.dimensions} onChange={v=>setField('dimensions',v)} placeholder="60 × 55 × 108"/></Field>
            <Field label="Tare Weight (kg)"><Input type="number" value={form.tare_weight_kg} onChange={v=>setField('tare_weight_kg',v)} placeholder="24"/></Field>
            <Field label="Lid / Cover Type"><Select value={form.lid_type} onChange={v=>setField('lid_type',v)} options={['Hinged Lid (single)','Hinged Lid (split)','Flip Top Lid','Lockable Lid','No Lid (open top)','Drawstring / Tie Top (bag)','UN-sealed Lid']}/></Field>
            <Field label="Mobility"><Select value={form.mobility} onChange={v=>setField('mobility',v)} options={['2 Wheels','4 Wheels (swivel)','No Wheels (static)','Pallet / Forklift pockets','Hook-lift eyes','Crane lifting eyes','None (bag)']}/></Field>
            <Field label="Colour Code" required><Select value={form.colour_code} onChange={v=>setField('colour_code',v)} options={COLOURS} required/></Field>
            <Field label="Liner Required"><Select value={form.liner_type} onChange={v=>setField('liner_type',v)} options={['No Liner','HDPE Liner','UN-certified Plastic Liner','Acid-resistant Liner','Flame-retardant Liner']}/></Field>
          </FormGrid>
        </>}

        {/* Step 3: Stand (Type C only) */}
        {step===3&&<>
          <div style={{fontSize:13,fontWeight:600,color:C.t1,marginBottom:12}}>Step 3 — Stand / Frame Details {form.operation_type!=='C'&&'(Not applicable for this type)'}</div>
          {form.operation_type==='C'
            ? <FormGrid>
                <Field label="Stand Type"><Select value={form.stand_type} onChange={v=>setField('stand_type',v)} options={['Square Frame Stand (steel)','Collapsible A-Frame','Pallet-mounted Frame','Wall-bracket Frame','Free-standing Ring Stand']}/></Field>
                <Field label="Stand Capacity (kg)"><Input type="number" value={form.stand_capacity_kg} onChange={v=>setField('stand_capacity_kg',v)} placeholder="1000"/></Field>
                <Field label="Stand Material"><Select value={form.stand_material} onChange={v=>setField('stand_material',v)} options={['Mild Steel (painted)','Galvanised Steel','Stainless Steel','Aluminium']}/></Field>
                <Field label="Stand Asset Tag / ID"><Input value={form.stand_asset_tag} onChange={v=>setField('stand_asset_tag',v)} placeholder="Stand will get separate QR tag"/></Field>
              </FormGrid>
            : <Alert type="b">Stand details only apply to Type C (Loose Bag) bins. Click Next to continue.</Alert>
          }
        </>}

        {/* Step 4: Waste Classification */}
        {step===4&&<>
          <div style={{fontSize:13,fontWeight:600,color:C.t1,marginBottom:12}}>Step 4 — Waste Classification</div>
          <FormGrid>
            <Field label="Waste Category" required><Select value={form.waste_category} onChange={v=>setField('waste_category',v)} options={WASTE_CATEGORIES} required/></Field>
            <Field label="Waste Form"><Select value={form.waste_form} onChange={v=>setField('waste_form',v)} options={['Solid (dry)','Solid (wet/moist)','Semi-solid / Paste','Sludge','Liquid','Powder / Dust','Granular','Mixed forms']}/></Field>
            <Field label="Hazard Class (UN/CPCB)"><Select value={form.hazard_class} onChange={v=>setField('hazard_class',v)} options={HAZARD_CLASSES}/></Field>
            <Field label="Calorific Value (kcal/kg)"><Input type="number" value={form.calorific_value} onChange={v=>setField('calorific_value',v)} placeholder="3200"/></Field>
            <Field label="Avg. Density (kg/L)"><Input type="number" value={form.density} onChange={v=>setField('density',v)} placeholder="0.4" step="0.01"/></Field>
            <Field label="Moisture Content %"><Input type="number" value={form.moisture_pct} onChange={v=>setField('moisture_pct',v)} placeholder="12"/></Field>
          </FormGrid>
        </>}

        {/* Step 5: Location */}
        {step===5&&<>
          <div style={{fontSize:13,fontWeight:600,color:C.t1,marginBottom:12}}>Step 5 — Placement & Location</div>
          <FormGrid>
            <Field label="Zone / Area" required><Input value={form.zone} onChange={v=>setField('zone',v)} placeholder="Zone B / Gate 3 / Store 2" required/></Field>
            <Field label="Specific Location"><Input value={form.specific_location} onChange={v=>setField('specific_location',v)} placeholder="Near ETP outlet, left of pump house"/></Field>
            <Field label="GPS Latitude"><Input value={form.gps_lat} onChange={v=>setField('gps_lat',v)} placeholder="18.9220"/></Field>
            <Field label="GPS Longitude"><Input value={form.gps_lng} onChange={v=>setField('gps_lng',v)} placeholder="72.8347"/></Field>
            <Field label="Floor / Level"><Input value={form.floor_level} onChange={v=>setField('floor_level',v)} placeholder="Ground / 1st Floor / Basement"/></Field>
            <Field label="Access Route"><Select value={form.access_route} onChange={v=>setField('access_route',v)} options={['Direct road access','Gate access — schedule needed','Narrow lane — small vehicle only','Manual trolley only','Fork-lift required','Crane required']}/></Field>
            <Field label="Site Contact"><Input value={form.site_contact} onChange={v=>setField('site_contact',v)} placeholder="Name + mobile no."/></Field>
            <FullCol><PhotoZone label="📷 Upload site / placement photo — helps driver locate on first visit" count={0}/></FullCol>
          </FormGrid>
        </>}

        {/* Step 6: Sensor & Tag */}
        {step===6&&<>
          <div style={{fontSize:13,fontWeight:600,color:C.t1,marginBottom:12}}>Step 6 — IoT Sensor & ID Tag</div>
          <FormGrid>
            <Field label="ID Tag Technology" required><Select value={form.tag_technology} onChange={v=>setField('tag_technology',v)} options={TAG_TYPES} required/></Field>
            <Field label="Tag Placement"><Select value={form.tag_placement} onChange={v=>setField('tag_placement',v)} options={['Front face of bin','Side panel','Lid / top','Bottom (for hook-lift scan)','Stand frame (for bag bins)']}/></Field>
            <Field label="Fill Level Sensor"><Select value={form.fill_sensor_type} onChange={v=>setField('fill_sensor_type',v)} options={SENSOR_TYPES}/></Field>
            <Field label="Fill Alert Threshold %" hint="Alert sent when fill reaches this level"><Input type="number" value={form.fill_alert_threshold} onChange={v=>setField('fill_alert_threshold',v)} min="50" max="95"/></Field>
            <Field label="Sensor Fallback"><Select value={form.sensor_fallback} onChange={v=>setField('sensor_fallback',v)} options={['Manual entry by driver','Manual entry by generator staff','Manual entry by supervisor']}/></Field>
            <Field label="Alert Channel"><Select value={form.alert_channel} onChange={v=>setField('alert_channel',v)} options={['WhatsApp+SMS','SMS only','Email+SMS','All Channels']}/></Field>
          </FormGrid>
        </>}

        {/* Step 7: Schedule */}
        {step===7&&<>
          <div style={{fontSize:13,fontWeight:600,color:C.t1,marginBottom:12}}>Step 7 — Collection Schedule</div>
          <FormGrid>
            <Field label="Collection Frequency"><Select value={form.collection_frequency} onChange={v=>setField('collection_frequency',v)} options={['On alert only (fill-based)','Daily','Every 2 days','Every 3 days','Twice a week','Weekly','Fortnightly']}/></Field>
            <Field label="Preferred Collection Time"><Input type="time" value={form.preferred_time} onChange={v=>setField('preferred_time',v)}/></Field>
            <Field label="Gate / Access Restriction"><Input value={form.gate_restriction} onChange={v=>setField('gate_restriction',v)} placeholder="e.g. Gate 3 opens 8–11 AM only"/></Field>
            <Field label="Receipt / Acknowledgement"><Select value={form.receipt_type} onChange={v=>setField('receipt_type',v)} options={['WhatsApp receipt to generator','Printed receipt by driver','Both','None']}/></Field>
            <Field label="Rate (₹/kg)"><Input type="number" value={form.rate_per_kg} onChange={v=>setField('rate_per_kg',v)} placeholder="2.80" step="0.01"/></Field>
            <Field label="Billing Basis"><Select value={form.billing_basis} onChange={v=>setField('billing_basis',v)} options={['Per kg (weighed)','Per trip (fixed)','Per m³ (volumetric)','Monthly contract']}/></Field>
          </FormGrid>
        </>}
      </Modal>

      {/* ── FILL UPDATE MODAL ── */}
      <Modal open={fillModalOpen} onClose={()=>setFillModalOpen(false)} title={selectedBin?`📊 Update Fill — ${selectedBin.bin_code}`:'📊 Manual Fill Update'}
        footer={<><Btn onClick={()=>setFillModalOpen(false)}>Cancel</Btn><Btn color="primary" onClick={updateFill} disabled={saving}>{saving?'Saving...':'Save Update'}</Btn></>}>
        <Alert type="b">Use this when IoT sensor data is unavailable or needs correction.</Alert>
        <div style={{marginTop:14}}>
          <FormGrid>
            {!selectedBin&&<FullCol><Field label="Bin ID (scan or type)"><Input value={fillForm.bin_code} onChange={v=>setFillForm(f=>({...f,bin_code:v}))} placeholder="BN-XXXX"/></Field></FullCol>}
            <Field label="Fill Level %" required><Input type="number" min="0" max="100" value={fillForm.fill_pct} onChange={v=>setFillForm(f=>({...f,fill_pct:v}))} placeholder="75" required/></Field>
            <Field label="Estimated Weight (kg)"><Input type="number" value={fillForm.fill_kg} onChange={v=>setFillForm(f=>({...f,fill_kg:v}))} placeholder="Optional"/></Field>
            <Field label="Data Source"><Select value={fillForm.data_source} onChange={v=>setFillForm(f=>({...f,data_source:v}))} options={['MANUAL','ESTIMATED','SENSOR — Corrected']}/></Field>
            <FullCol><Field label="Reason for Manual Entry"><Textarea value={fillForm.notes} onChange={v=>setFillForm(f=>({...f,notes:v}))} placeholder="Sensor offline, first entry, correction..."/></Field></FullCol>
            <FullCol><PhotoZone label="📷 Upload photo as evidence for manual entry" count={0}/></FullCol>
            <FullCol><PinInput value={fillForm.supervisor_pin} onChange={v=>setFillForm(f=>({...f,supervisor_pin:v}))}/></FullCol>
          </FormGrid>
        </div>
      </Modal>
    </>
  );
}



const BLOOD_GROUPS = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];
const VEHICLE_CLASSES = ['LMV','HMV','HGMV','HPMV','MGV'];
const EMPLOYMENT_TYPES = ['Permanent','Contract','Outsourced'];
const ALERT_CHANNELS = ['WhatsApp+SMS','SMS only','Email+SMS','All Channels'];

const EMPTY_FORM = {
  full_name:'', dob:'', gender:'', blood_group:'', mobile:'', emergency_contact:'', address:'',
  aadhaar_no:'', pan_no:'', dl_no:'', dl_rto:'', dl_issue_date:'', dl_expiry:'',
  dl_vehicle_classes:[], dl_hazmat_endorsed:false, dl_renewal_alert_days:60, dl_alert_channel:'WhatsApp+SMS',
  medical_cert_issue:'', medical_cert_expiry:'', police_verified:false, police_verified_date:'',
  ppe_trained:false, hazmat_certified:false, hazmat_expiry:'',
  joining_date:'', employment_type:'Permanent', shift:'', bank_account:'', ifsc:'',
  assigned_vehicle_id:'', supervisor_pin:'',
};

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [photoCount, setPhotoCount] = useState({ aadhaar:0, dl:0, docs:0 });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const [driverRes, vehicleRes] = await Promise.all([
      supabase.from('drivers').select('*').order('created_at', { ascending: false }),
      supabase.from('vehicles').select('id,reg_no').eq('status','Active'),
    ]);
    setDrivers(driverRes.data || []);
    setVehicles(vehicleRes.data || []);
    setLoading(false);
  }

  function openNew() { setEditItem(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true); }
  function openEdit(d) {
    setEditItem(d);
    setForm({ ...EMPTY_FORM, ...d, supervisor_pin:'' });
    setError('');
    setModalOpen(true);
  }

  function setField(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function dlStatus(expiry) {
    if (!expiry) return { label:'No DL', color:'gr' };
    const days = Math.ceil((new Date(expiry) - new Date()) / (1000*60*60*24));
    if (days < 0) return { label:'Expired', color:'r' };
    if (days < 60) return { label:`${days}d left`, color:'a' };
    return { label:'Valid', color:'g' };
  }

  function medStatus(expiry) {
    if (!expiry) return { label:'No Medical', color:'gr' };
    const days = Math.ceil((new Date(expiry) - new Date()) / (1000*60*60*24));
    if (days < 0) return { label:'Expired', color:'r' };
    if (days < 30) return { label:`${days}d left`, color:'a' };
    return { label:'Valid', color:'g' };
  }

  async function handleSave() {
    if (!form.full_name || !form.mobile || !form.dl_no || !form.dl_expiry) {
      setError('Please fill all required fields (Name, Mobile, DL Number, DL Expiry).');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = { ...form };
      delete payload.supervisor_pin;
      delete payload.id;
      delete payload.driver_code;
      delete payload.created_at;
      delete payload.updated_at;

      if (editItem) {
        const { error } = await supabase.from('drivers').update({ ...payload, updated_at: new Date() }).eq('id', editItem.id);
        if (error) throw error;
        setSuccess('Driver profile updated successfully.');
      } else {
        const { data: codeData } = await supabase.rpc('next_driver_code');
        const { error } = await supabase.from('drivers').insert({ ...payload, driver_code: codeData });
        if (error) throw error;
        setSuccess(`Driver ${codeData} registered successfully.`);
      }
      setModalOpen(false);
      loadData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  }

  const filtered = drivers.filter(d => {
    const matchSearch = !search || d.full_name.toLowerCase().includes(search.toLowerCase()) || d.driver_code?.toLowerCase().includes(search.toLowerCase()) || d.mobile?.includes(search);
    const matchTab = tab === 'all' || (tab === 'active' && d.status === 'Active') || (tab === 'dl-due' && d.dl_expiry && new Date(d.dl_expiry) < new Date(Date.now() + 60*24*60*60*1000)) || (tab === 'leave' && d.status === 'On Leave');
    return matchSearch && matchTab;
  });

  const dlDue = drivers.filter(d => d.dl_expiry && new Date(d.dl_expiry) < new Date(Date.now() + 60*24*60*60*1000)).length;

  return (
    <>
      {success && <Alert type="g">{success}</Alert>}
      {dlDue > 0 && <Alert type="a">⚠️ {dlDue} driver(s) have DL expiring within 60 days. Schedule renewal immediately.</Alert>}

      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(115px,1fr))',gap:10 }}>
        <StatCard color="g" label="Total Drivers" value={drivers.length} sub="Registered" icon="👤"/>
        <StatCard color="g" label="Active" value={drivers.filter(d=>d.status==='Active').length} sub="On duty" icon="✅"/>
        <StatCard color="a" label="DL Due" value={dlDue} sub="Within 60 days" icon="📄"/>
        <StatCard color="b" label="On Leave" value={drivers.filter(d=>d.status==='On Leave').length} sub="Currently" icon="🏖"/>
      </div>

      <Card title="👤 Driver Registry"
        extra={<div style={{ display:'flex',gap:8 }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search name, code..."/>
          <Btn color="primary" onClick={openNew} size="sm">+ Register Driver</Btn>
        </div>}
        noPad>
        <Tabs tabs={[{id:'all',label:'All',count:drivers.length},{id:'active',label:'Active',count:drivers.filter(d=>d.status==='Active').length},{id:'dl-due',label:'DL Due',count:dlDue},{id:'leave',label:'On Leave'}]} active={tab} onChange={setTab}/>
        <Table
          loading={loading}
          heads={['Driver ID','Name','Mobile','Vehicle','DL Number','DL Status','Medical','Police Verif.','Status','']}
          rows={filtered.map(d => {
            const dl = dlStatus(d.dl_expiry);
            const med = medStatus(d.medical_cert_expiry);
            return [
              <strong style={{ fontFamily:'Consolas,monospace',color:C.g }}>{d.driver_code}</strong>,
              <div style={{ cursor:'pointer' }} onClick={()=>setViewModal(d)}>
                <div style={{ fontWeight:600,color:C.t1 }}>{d.full_name}</div>
                <div style={{ fontSize:10,color:C.t3 }}>Age {d.dob?Math.floor((new Date()-new Date(d.dob))/31557600000):'-'} · {d.blood_group||'-'}</div>
              </div>,
              <span style={{ fontFamily:'Consolas,monospace',fontSize:11 }}>{d.mobile}</span>,
              d.assigned_vehicle_id ? vehicles.find(v=>v.id===d.assigned_vehicle_id)?.reg_no||'-' : 'Unassigned',
              <span style={{ fontFamily:'Consolas,monospace',fontSize:11 }}>{d.dl_no}</span>,
              <Badge color={dl.color}>{dl.label}</Badge>,
              <Badge color={med.color}>{med.label}</Badge>,
              <Badge color={d.police_verified?'g':'a'}>{d.police_verified?'Verified':'Pending'}</Badge>,
              <Badge color={d.status==='Active'?'g':d.status==='On Leave'?'a':'r'}>{d.status}</Badge>,
              <div style={{ display:'flex',gap:5 }}>
                <Btn size="sm" onClick={()=>setViewModal(d)}>View</Btn>
                <Btn size="sm" onClick={()=>openEdit(d)}>Edit</Btn>
              </div>
            ];
          })}
        />
      </Card>

      {/* View Driver Modal */}
      {viewModal && (
        <Modal open={!!viewModal} onClose={()=>setViewModal(null)} title={`${viewModal.driver_code} — ${viewModal.full_name}`} wide
          footer={<><Btn onClick={()=>setViewModal(null)}>Close</Btn><Btn color="primary" onClick={()=>{setViewModal(null);openEdit(viewModal);}}>Edit Profile</Btn></>}>
          <div style={{ display:'grid',gridTemplateColumns:'auto 1fr',gap:16,alignItems:'flex-start',marginBottom:20 }}>
            <div style={{ width:60,height:60,borderRadius:'50%',background:C.bg4,border:`2px solid ${C.bdr2}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28 }}>👤</div>
            <div>
              <div style={{ fontSize:18,fontWeight:700,color:C.t1 }}>{viewModal.full_name}</div>
              <div style={{ fontSize:12,color:C.t3 }}>{viewModal.driver_code} · Age {viewModal.dob?Math.floor((new Date()-new Date(viewModal.dob))/31557600000):'-'} · {viewModal.blood_group} · {viewModal.mobile}</div>
              <div style={{ marginTop:6,display:'flex',gap:6 }}>
                <Badge color={viewModal.status==='Active'?'g':viewModal.status==='On Leave'?'a':'r'}>{viewModal.status}</Badge>
                {viewModal.dl_hazmat_endorsed && <Badge color="r">Hazmat Endorsed</Badge>}
                {viewModal.ppe_trained && <Badge color="g">PPE Trained</Badge>}
              </div>
            </div>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:10 }}>
            {[
              { icon:'🪪', title:'Aadhaar Card', sub:viewModal.aadhaar_no?`${viewModal.aadhaar_no} · Lifetime`:'Not uploaded', valid:!!viewModal.aadhaar_no },
              { icon:'📄', title:'Driving Licence', sub:`${viewModal.dl_no} · Exp: ${viewModal.dl_expiry||'N/A'}`, valid:viewModal.dl_expiry&&new Date(viewModal.dl_expiry)>new Date() },
              { icon:'🏥', title:'Medical Certificate', sub:`Exp: ${viewModal.medical_cert_expiry||'N/A'}`, valid:viewModal.medical_cert_expiry&&new Date(viewModal.medical_cert_expiry)>new Date() },
              { icon:'🛡', title:'Police Verification', sub:viewModal.police_verified?`Verified ${viewModal.police_verified_date||''}`:'Pending', valid:viewModal.police_verified },
              { icon:'⚠️', title:'Hazmat Certificate', sub:viewModal.hazmat_certified?`Valid · Exp: ${viewModal.hazmat_expiry||'N/A'}`:'Not certified', valid:viewModal.hazmat_certified },
              { icon:'🦺', title:'PPE Training', sub:viewModal.ppe_trained?'Completed':'Not done', valid:viewModal.ppe_trained },
            ].map(doc => (
              <div key={doc.title} style={{ background:C.bg2,border:`1px solid ${doc.valid?'rgba(0,230,118,.2)':'rgba(255,255,255,.07)'}`,borderRadius:9,padding:10,display:'flex',gap:8,alignItems:'flex-start' }}>
                <div style={{ width:32,height:32,borderRadius:6,background:C.bg4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0 }}>{doc.icon}</div>
                <div>
                  <div style={{ fontSize:12,fontWeight:600,color:C.t1 }}>{doc.title}</div>
                  <div style={{ fontSize:10,color:C.t3,fontFamily:'Consolas,monospace',marginTop:2 }}>{doc.sub}</div>
                  <Badge color={doc.valid?'g':'a'} small>{doc.valid?'✓ Valid':'⚠ Check'}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Register/Edit Modal */}
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)}
        title={editItem?`Edit — ${editItem.driver_code}`:'👤 Register Driver'}
        wide
        footer={<><Btn onClick={()=>setModalOpen(false)}>Cancel</Btn><Btn color="primary" onClick={handleSave} disabled={saving}>{saving?'Saving...':editItem?'Save Changes':'Register Driver'}</Btn></>}>
        {error && <div style={{ marginBottom:12 }}><Alert type="r">{error}</Alert></div>}
        <FormGrid>
          <SectionDiv>Personal Information</SectionDiv>
          <Field label="Full Name (as per Aadhaar)" required><Input value={form.full_name} onChange={v=>setField('full_name',v)} placeholder="Legal full name" required/></Field>
          <Field label="Date of Birth" required><Input type="date" value={form.dob} onChange={v=>setField('dob',v)} required/></Field>
          <Field label="Gender"><Select value={form.gender} onChange={v=>setField('gender',v)} options={['Male','Female','Other']}/></Field>
          <Field label="Blood Group"><Select value={form.blood_group} onChange={v=>setField('blood_group',v)} options={BLOOD_GROUPS}/></Field>
          <Field label="Mobile Number" required><Input value={form.mobile} onChange={v=>setField('mobile',v)} placeholder="+91 XXXXXXXXXX" required/></Field>
          <Field label="Emergency Contact"><Input value={form.emergency_contact} onChange={v=>setField('emergency_contact',v)} placeholder="+91 XXXXXXXXXX"/></Field>
          <FullCol><Field label="Permanent Address"><Textarea value={form.address} onChange={v=>setField('address',v)} placeholder="Full address with PIN code"/></Field></FullCol>
          <FullCol><Field label="Driver Photo">
            <PhotoZone label="Upload passport photo" count={photoCount.photo} onCapture={()=>setPhotoCount(p=>({...p,photo:1}))}/>
          </Field></FullCol>

          <SectionDiv>Aadhaar & PAN</SectionDiv>
          <Field label="Aadhaar Number"><Input value={form.aadhaar_no} onChange={v=>setField('aadhaar_no',v)} placeholder="XXXX XXXX XXXX"/></Field>
          <Field label="PAN Number"><Input value={form.pan_no} onChange={v=>setField('pan_no',v)} placeholder="ABCDE1234F"/></Field>
          <FullCol>
            <div style={{ display:'flex',gap:10 }}>
              <PhotoZone label="Aadhaar Front" count={photoCount.aadhaar_f} onCapture={()=>setPhotoCount(p=>({...p,aadhaar_f:1}))}/>
              <PhotoZone label="Aadhaar Back" count={photoCount.aadhaar_b} onCapture={()=>setPhotoCount(p=>({...p,aadhaar_b:1}))}/>
              <PhotoZone label="PAN Card" count={photoCount.pan} onCapture={()=>setPhotoCount(p=>({...p,pan:1}))}/>
            </div>
          </FullCol>

          <SectionDiv>Driving Licence</SectionDiv>
          <Field label="DL Number" required><Input value={form.dl_no} onChange={v=>setField('dl_no',v)} placeholder="DL-XXXXXXXXXXXXX" required/></Field>
          <Field label="Issuing RTO"><Input value={form.dl_rto} onChange={v=>setField('dl_rto',v)} placeholder="RTO Name / City"/></Field>
          <Field label="DL Issue Date"><Input type="date" value={form.dl_issue_date} onChange={v=>setField('dl_issue_date',v)}/></Field>
          <Field label="DL Expiry Date" required><Input type="date" value={form.dl_expiry} onChange={v=>setField('dl_expiry',v)} required/></Field>
          <Field label="Hazardous Goods Endorsed"><Select value={form.dl_hazmat_endorsed?'Yes':'No'} onChange={v=>setField('dl_hazmat_endorsed',v==='Yes')} options={['Yes','No']}/></Field>
          <Field label="Renewal Alert (days before)"><Select value={String(form.dl_renewal_alert_days)} onChange={v=>setField('dl_renewal_alert_days',Number(v))} options={['30','60','90']}/></Field>
          <Field label="Alert Channel"><Select value={form.dl_alert_channel} onChange={v=>setField('dl_alert_channel',v)} options={ALERT_CHANNELS}/></Field>
          <FullCol>
            <div style={{ display:'flex',gap:10 }}>
              <PhotoZone label="DL Front" count={photoCount.dl_f} onCapture={()=>setPhotoCount(p=>({...p,dl_f:1}))}/>
              <PhotoZone label="DL Back" count={photoCount.dl_b} onCapture={()=>setPhotoCount(p=>({...p,dl_b:1}))}/>
            </div>
          </FullCol>

          <SectionDiv>Compliance Documents</SectionDiv>
          <Field label="Medical Cert. Issue Date"><Input type="date" value={form.medical_cert_issue} onChange={v=>setField('medical_cert_issue',v)}/></Field>
          <Field label="Medical Cert. Expiry" required><Input type="date" value={form.medical_cert_expiry} onChange={v=>setField('medical_cert_expiry',v)}/></Field>
          <Field label="Police Verification"><Select value={form.police_verified?'Verified':'Pending'} onChange={v=>setField('police_verified',v==='Verified')} options={['Verified','Pending']}/></Field>
          <Field label="Police Verified Date"><Input type="date" value={form.police_verified_date} onChange={v=>setField('police_verified_date',v)}/></Field>
          <Field label="PPE Training"><Select value={form.ppe_trained?'Yes':'No'} onChange={v=>setField('ppe_trained',v==='Yes')} options={['Yes','No']}/></Field>
          <Field label="Hazmat Certificate"><Select value={form.hazmat_certified?'Valid':'No'} onChange={v=>setField('hazmat_certified',v==='Valid')} options={['Valid','No','Expired']}/></Field>
          <Field label="Hazmat Expiry"><Input type="date" value={form.hazmat_expiry} onChange={v=>setField('hazmat_expiry',v)}/></Field>
          <FullCol><PhotoZone label="Upload Medical, Police, PPE, Hazmat certificates" count={photoCount.docs} onCapture={()=>setPhotoCount(p=>({...p,docs:p.docs+1}))}/></FullCol>

          <SectionDiv>Employment Details</SectionDiv>
          <Field label="Date of Joining"><Input type="date" value={form.joining_date} onChange={v=>setField('joining_date',v)}/></Field>
          <Field label="Employment Type"><Select value={form.employment_type} onChange={v=>setField('employment_type',v)} options={EMPLOYMENT_TYPES}/></Field>
          <Field label="Assigned Vehicle"><Select value={form.assigned_vehicle_id} onChange={v=>setField('assigned_vehicle_id',v)} options={vehicles.map(v=>({value:v.id,label:v.reg_no}))}/></Field>
          <Field label="Shift / Route"><Input value={form.shift} onChange={v=>setField('shift',v)} placeholder="e.g. Morning / North Zone"/></Field>
          <Field label="Bank Account No."><Input value={form.bank_account} onChange={v=>setField('bank_account',v)} placeholder="For salary"/></Field>
          <Field label="IFSC Code"><Input value={form.ifsc} onChange={v=>setField('ifsc',v)} placeholder="XXXX0000000"/></Field>

          <SectionDiv>Supervisor Approval</SectionDiv>
          <FullCol><PinInput value={form.supervisor_pin} onChange={v=>setField('supervisor_pin',v)}/></FullCol>
        </FormGrid>
      </Modal>
    </>
  );
}



// ── VEHICLE REGISTRY ──────────────────────────────────────
function VehicleRegistry({ vehicles, drivers, loading, onRefresh }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const EMPTY = { reg_no:'',make:'',model:'',year:'',vehicle_type:'',capacity_tonnes:'',fuel_type:'Diesel',engine_no:'',chassis_no:'',fitness_expiry:'',insurance_expiry:'',puc_expiry:'',permit_expiry:'',assigned_driver_id:'',fuel_tank_capacity:'',current_fuel_pct:'' };
  const [form, setForm] = useState(EMPTY);

  function openNew() { setEditItem(null); setForm(EMPTY); setError(''); setModalOpen(true); }
  function openEdit(v) { setEditItem(v); setForm({ ...EMPTY, ...v }); setError(''); setModalOpen(true); }
  function setField(k,v) { setForm(f=>({...f,[k]:v})); }

  function docStatus(expiry) {
    if (!expiry) return { label:'N/A', color:'gr' };
    const days = Math.ceil((new Date(expiry)-new Date())/(1000*60*60*24));
    if (days<0) return { label:'Expired', color:'r' };
    if (days<30) return { label:`${days}d`, color:'a' };
    return { label:'Valid', color:'g' };
  }

  async function handleSave() {
    if (!form.reg_no||!form.make||!form.model) { setError('Registration number, make and model are required.'); return; }
    setSaving(true);
    try {
      if (editItem) {
        const { error } = await supabase.from('vehicles').update({ ...form, updated_at:new Date() }).eq('id',editItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('vehicles').insert(form);
        if (error) throw error;
      }
      setModalOpen(false);
      onRefresh();
    } catch(err) { setError(err.message); }
    setSaving(false);
  }

  return (
    <>
      <Card title="🚛 Vehicle Registry" extra={<Btn color="primary" size="sm" onClick={openNew}>+ Add Vehicle</Btn>} noPad>
        <Table loading={loading}
          heads={['Reg No.','Make/Model','Driver','Fitness','Insurance','PUC','Fuel%','Status','']}
          rows={vehicles.map(v=>{
            const fit=docStatus(v.fitness_expiry), ins=docStatus(v.insurance_expiry), puc=docStatus(v.puc_expiry);
            return [
              <strong style={{fontFamily:'Consolas,monospace',color:C.g}}>{v.reg_no}</strong>,
              <div><div style={{fontWeight:600,color:C.t1}}>{v.make} {v.model}</div><div style={{fontSize:10,color:C.t3}}>{v.year} · {v.vehicle_type}</div></div>,
              <span style={{fontSize:11.5}}>{drivers.find(d=>d.id===v.assigned_driver_id)?.full_name||'Unassigned'}</span>,
              <Badge color={fit.color}>{fit.label}</Badge>,
              <Badge color={ins.color}>{ins.label}</Badge>,
              <Badge color={puc.color}>{puc.label}</Badge>,
              <div style={{width:80}}><ProgBar pct={v.current_fuel_pct||0}/><div style={{fontSize:10,color:C.t3,marginTop:2}}>{v.current_fuel_pct||0}%</div></div>,
              <Badge color={v.status==='Active'?'g':v.status==='In Maintenance'?'a':'r'}>{v.status}</Badge>,
              <div style={{display:'flex',gap:4}}>
                <Btn size="sm" onClick={()=>openEdit(v)}>Edit</Btn>
              </div>
            ];
          })}/>
      </Card>

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title={editItem?`Edit — ${editItem.reg_no}`:'🚛 Add Vehicle'} wide
        footer={<><Btn onClick={()=>setModalOpen(false)}>Cancel</Btn><Btn color="primary" onClick={handleSave} disabled={saving}>{saving?'Saving...':'Save Vehicle'}</Btn></>}>
        {error&&<div style={{marginBottom:12}}><Alert type="r">{error}</Alert></div>}
        <FormGrid>
          <SectionDiv>Vehicle Details</SectionDiv>
          <Field label="Registration Number" required><Input value={form.reg_no} onChange={v=>setField('reg_no',v)} placeholder="MH-12-AB-3456" required/></Field>
          <Field label="Make" required><Input value={form.make} onChange={v=>setField('make',v)} placeholder="Volvo" required/></Field>
          <Field label="Model" required><Input value={form.model} onChange={v=>setField('model',v)} placeholder="FMX 440" required/></Field>
          <Field label="Year"><Input type="number" value={form.year} onChange={v=>setField('year',v)} placeholder="2022"/></Field>
          <Field label="Vehicle Type"><Select value={form.vehicle_type} onChange={v=>setField('vehicle_type',v)} options={['Compactor Truck','Hook-lift Truck','Tipper','Tanker','Pickup']}/></Field>
          <Field label="Capacity (Tonnes)"><Input type="number" value={form.capacity_tonnes} onChange={v=>setField('capacity_tonnes',v)} placeholder="10"/></Field>
          <Field label="Fuel Type"><Select value={form.fuel_type} onChange={v=>setField('fuel_type',v)} options={['Diesel','CNG','Electric']}/></Field>
          <Field label="Engine Number"><Input value={form.engine_no} onChange={v=>setField('engine_no',v)} placeholder="Engine no."/></Field>
          <Field label="Chassis Number"><Input value={form.chassis_no} onChange={v=>setField('chassis_no',v)} placeholder="Chassis no."/></Field>
          <Field label="Assigned Driver"><Select value={form.assigned_driver_id} onChange={v=>setField('assigned_driver_id',v)} options={drivers.map(d=>({value:d.id,label:`${d.driver_code} — ${d.full_name}`}))}/></Field>
          <Field label="Fuel Tank Capacity (L)"><Input type="number" value={form.fuel_tank_capacity} onChange={v=>setField('fuel_tank_capacity',v)} placeholder="200"/></Field>
          <Field label="Current Fuel %"><Input type="number" value={form.current_fuel_pct} onChange={v=>setField('current_fuel_pct',v)} min="0" max="100" placeholder="75"/></Field>
          <SectionDiv>Document Expiry Dates</SectionDiv>
          <Field label="Fitness Certificate Expiry"><Input type="date" value={form.fitness_expiry} onChange={v=>setField('fitness_expiry',v)}/></Field>
          <Field label="Insurance Expiry"><Input type="date" value={form.insurance_expiry} onChange={v=>setField('insurance_expiry',v)}/></Field>
          <Field label="PUC Expiry"><Input type="date" value={form.puc_expiry} onChange={v=>setField('puc_expiry',v)}/></Field>
          <Field label="Permit Expiry"><Input type="date" value={form.permit_expiry} onChange={v=>setField('permit_expiry',v)}/></Field>
        </FormGrid>
      </Modal>
    </>
  );
}

// ── VEHICLE CLEANING ──────────────────────────────────────
function VehicleCleaning({ vehicles, drivers, loading }) {
  const [records, setRecords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [photoCount, setPhotoCount] = useState(0);
  const EMPTY = { vehicle_id:'',driver_id:'',cleaning_date:new Date().toISOString().split('T')[0],cleaning_type:'Weekly Full Wash',cleaned_by:'',time_taken_mins:'',exterior_washed:false,interior_vacuumed:false,hopper_flushed:false,windscreen_cleaned:false,mirrors_cleaned:false,wheels_washed:false,underbody_washed:false,sanitizer_applied:false,remarks:'',next_cleaning_due:'',supervisor_pin:'' };
  const [form, setForm] = useState(EMPTY);

  useEffect(() => { loadRecords(); }, []);
  async function loadRecords() {
    const { data } = await supabase.from('vehicle_cleaning').select('*,vehicles(reg_no),drivers(full_name)').order('cleaning_date',{ascending:false}).limit(50);
    setRecords(data||[]);
  }

  function setField(k,v) { setForm(f=>({...f,[k]:v})); }

  async function handleSave() {
    if (!form.vehicle_id||!form.cleaning_date) { setError('Vehicle and cleaning date are required.'); return; }
    if (photoCount < 4) { setError('Minimum 4 photos required (Front, Rear, Interior, Hopper).'); return; }
    setSaving(true);
    try {
      const { data:code } = await supabase.rpc('next_cleaning_code');
      const payload = { ...form, cleaning_code:code||`CLN-${Date.now()}`, supervisor_pin_verified:form.supervisor_pin.length===4 };
      delete payload.supervisor_pin;
      const { error } = await supabase.from('vehicle_cleaning').insert(payload);
      if (error) throw error;
      setSuccess('Cleaning record saved successfully.');
      setModalOpen(false);
      setPhotoCount(0);
      loadRecords();
      setTimeout(()=>setSuccess(''),4000);
    } catch(err) { setError(err.message); }
    setSaving(false);
  }

  const daysSince = (date) => date ? Math.floor((new Date()-new Date(date))/(1000*60*60*24)) : 99;

  return (
    <>
      {success&&<Alert type="g">{success}</Alert>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(115px,1fr))',gap:10}}>
        <StatCard color="g" label="Cleaned This Week" value={records.filter(r=>daysSince(r.cleaning_date)<=7).length} sub="Out of vehicles" icon="🧹"/>
        <StatCard color="a" label="Due Today" value={vehicles.filter(v=>{const last=records.find(r=>r.vehicle_id===v.id); return !last||daysSince(last.cleaning_date)>=7;}).length} sub="Overdue 7+ days" icon="⚠️"/>
        <StatCard color="b" label="This Month" value={records.filter(r=>new Date(r.cleaning_date).getMonth()===new Date().getMonth()).length} sub="Cleaning records" icon="📋"/>
      </div>
      <Card title="🧹 Vehicle Cleaning Log" extra={<Btn color="primary" size="sm" onClick={()=>{setForm(EMPTY);setError('');setPhotoCount(0);setModalOpen(true);}}>+ Log Cleaning</Btn>} noPad>
        <Table loading={loading}
          heads={['Vehicle','Driver','Date','Type','Score','Photos','Supervisor','Status','']}
          rows={records.map(r=>[
            <strong style={{fontFamily:'Consolas,monospace'}}>{r.vehicles?.reg_no}</strong>,
            r.drivers?.full_name||'-',
            r.cleaning_date,
            r.cleaning_type,
            r.cleanliness_score?`${r.cleanliness_score}/10`:'-',
            <Badge color="b">{[r.photo_front_url,r.photo_rear_url,r.photo_interior_url,r.photo_hopper_url].filter(Boolean).length} 📷</Badge>,
            <Badge color={r.supervisor_pin_verified?'g':'a'}>{r.supervisor_pin_verified?'Approved':'Pending'}</Badge>,
            <Badge color="g">Done</Badge>,
            <Btn size="sm">View</Btn>
          ])}/>
      </Card>

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title="🧹 Log Vehicle Cleaning"
        footer={<><Btn onClick={()=>setModalOpen(false)}>Cancel</Btn><Btn color="primary" onClick={handleSave} disabled={saving}>{saving?'Saving...':'Save Cleaning Record'}</Btn></>}>
        {error&&<div style={{marginBottom:12}}><Alert type="r">{error}</Alert></div>}
        <FormGrid>
          <Field label="Vehicle" required><Select value={form.vehicle_id} onChange={v=>setField('vehicle_id',v)} options={vehicles.map(v=>({value:v.id,label:v.reg_no}))} required/></Field>
          <Field label="Driver"><Select value={form.driver_id} onChange={v=>setField('driver_id',v)} options={drivers.map(d=>({value:d.id,label:d.full_name}))}/></Field>
          <Field label="Cleaning Date" required><Input type="date" value={form.cleaning_date} onChange={v=>setField('cleaning_date',v)} required/></Field>
          <Field label="Cleaning Type"><Select value={form.cleaning_type} onChange={v=>setField('cleaning_type',v)} options={['Weekly Full Wash','Interior Deep Clean','Waste Compartment Sanitize','Engine Bay Degrease']}/></Field>
          <Field label="Cleaned By"><Input value={form.cleaned_by} onChange={v=>setField('cleaned_by',v)} placeholder="Staff name / vendor"/></Field>
          <Field label="Time Taken (mins)"><Input type="number" value={form.time_taken_mins} onChange={v=>setField('time_taken_mins',v)} placeholder="45"/></Field>
          <FullCol>
            <div style={{marginBottom:8,fontSize:11.5,fontWeight:600,color:C.t2}}>Cleaning Checklist</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
              {[['exterior_washed','Exterior body washed'],['interior_vacuumed','Cab interior vacuumed'],['hopper_flushed','Waste hopper flushed'],['windscreen_cleaned','Windscreen cleaned'],['mirrors_cleaned','Mirrors cleaned'],['wheels_washed','Wheels & tyres washed'],['underbody_washed','Underbody pressure-washed'],['sanitizer_applied','Sanitizer applied to cab']].map(([k,label])=>(
                <label key={k} style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:12,color:C.t2}}>
                  <input type="checkbox" checked={form[k]||false} onChange={e=>setField(k,e.target.checked)} style={{accentColor:C.g}}/>
                  {label}
                </label>
              ))}
            </div>
          </FullCol>
          <FullCol>
            <Field label="Photos (minimum 4 required)" required>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
                {['Front','Rear','Interior','Hopper'].map(pos=>(
                  <PhotoZone key={pos} label={pos} count={0} required onCapture={()=>setPhotoCount(c=>c+1)}/>
                ))}
              </div>
              {photoCount<4&&<div style={{fontSize:11,color:C.a,marginTop:4}}>⚠️ {photoCount}/4 photos — 4 minimum required</div>}
              {photoCount>=4&&<div style={{fontSize:11,color:C.g,marginTop:4}}>✅ {photoCount} photos attached</div>}
            </Field>
          </FullCol>
          <Field label="Cleanliness Score (1-10)"><Input type="number" min="1" max="10" step="0.5" value={form.cleanliness_score} onChange={v=>setField('cleanliness_score',v)} placeholder="8.5"/></Field>
          <Field label="Next Cleaning Due"><Input type="date" value={form.next_cleaning_due} onChange={v=>setField('next_cleaning_due',v)}/></Field>
          <FullCol><Field label="Remarks"><Textarea value={form.remarks} onChange={v=>setField('remarks',v)} placeholder="Damage, leaks, concerns..."/></Field></FullCol>
          <FullCol><PinInput value={form.supervisor_pin} onChange={v=>setField('supervisor_pin',v)}/></FullCol>
        </FormGrid>
      </Modal>
    </>
  );
}

// ── PREVENTIVE MAINTENANCE ────────────────────────────────
function PreventiveMaintenance({ vehicles, drivers, loading }) {
  const [records, setRecords] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const EMPTY = { vehicle_id:'',pm_type:'',service_date:new Date().toISOString().split('T')[0],odometer_km:'',technician:'',workshop:'',parts_cost:0,labour_cost:0,next_service_km:'',next_service_date:'',data_source:'MANUAL',notes:'',supervisor_pin:'' };
  const [form, setForm] = useState(EMPTY);

  const PM_TYPES = ['Engine Oil Change','Oil Filter','Air Filter','Fuel Filter','Brake Inspection','Coolant Flush','Full PM Service A','Full PM Service B','Tyre Rotation','Battery Check'];

  useEffect(() => { loadRecords(); }, []);
  async function loadRecords() {
    const { data } = await supabase.from('preventive_maintenance').select('*,vehicles(reg_no)').order('service_date',{ascending:false}).limit(50);
    setRecords(data||[]);
  }
  function setField(k,v) { setForm(f=>({...f,[k]:v})); }

  async function handleSave() {
    if (!form.vehicle_id||!form.pm_type||!form.service_date) { setError('Vehicle, PM type and date are required.'); return; }
    setSaving(true);
    try {
      const { data:code } = await supabase.rpc('next_pm_code');
      const payload = { ...form, pm_code:code||`PM-${Date.now()}`, supervisor_pin_verified:form.supervisor_pin.length===4 };
      delete payload.supervisor_pin;
      const { error } = await supabase.from('preventive_maintenance').insert(payload);
      if (error) throw error;
      setSuccess('PM record saved successfully.');
      setModalOpen(false);
      loadRecords();
      setTimeout(()=>setSuccess(''),4000);
    } catch(err) { setError(err.message); }
    setSaving(false);
  }

  return (
    <>
      {success&&<Alert type="g">{success}</Alert>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(115px,1fr))',gap:10}}>
        <StatCard color="g" label="Done This Month" value={records.filter(r=>new Date(r.service_date).getMonth()===new Date().getMonth()).length} sub="PM services" icon="🔧"/>
        <StatCard color="b" label="Total Cost MTD" value={`₹${(records.filter(r=>new Date(r.service_date).getMonth()===new Date().getMonth()).reduce((s,r)=>s+(r.total_cost||0),0)).toLocaleString('en-IN')}`} sub="Parts + Labour" icon="💰"/>
      </div>
      <Card title="🔧 Preventive Maintenance Records" extra={<Btn color="primary" size="sm" onClick={()=>{setForm(EMPTY);setError('');setModalOpen(true);}}>+ Log PM Service</Btn>} noPad>
        <Table loading={loading}
          heads={['PM ID','Vehicle','PM Type','Date','Odometer','Cost','Next Service','Source','']}
          rows={records.map(r=>[
            <strong style={{fontFamily:'Consolas,monospace',fontSize:11}}>{r.pm_code}</strong>,
            <span style={{fontFamily:'Consolas,monospace',fontSize:11}}>{r.vehicles?.reg_no}</span>,
            r.pm_type,r.service_date,
            r.odometer_km?`${r.odometer_km.toLocaleString()} km`:'-',
            `₹${(r.total_cost||0).toLocaleString('en-IN')}`,
            r.next_service_date||'-',
            <Badge color={r.data_source==='SENSOR'?'b':'a'}>{r.data_source}</Badge>,
            <Btn size="sm">View</Btn>
          ])}/>
      </Card>

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title="🔧 Log Preventive Maintenance"
        footer={<><Btn onClick={()=>setModalOpen(false)}>Cancel</Btn><Btn color="primary" onClick={handleSave} disabled={saving}>{saving?'Saving...':'Save PM Record'}</Btn></>}>
        {error&&<div style={{marginBottom:12}}><Alert type="r">{error}</Alert></div>}
        <FormGrid>
          <Field label="Vehicle" required><Select value={form.vehicle_id} onChange={v=>setField('vehicle_id',v)} options={vehicles.map(v=>({value:v.id,label:v.reg_no}))} required/></Field>
          <Field label="PM Type" required><Select value={form.pm_type} onChange={v=>setField('pm_type',v)} options={PM_TYPES} required/></Field>
          <Field label="Service Date" required><Input type="date" value={form.service_date} onChange={v=>setField('service_date',v)} required/></Field>
          <Field label="Odometer (km)"><Input type="number" value={form.odometer_km} onChange={v=>setField('odometer_km',v)} placeholder="84320"/></Field>
          <Field label="Technician"><Input value={form.technician} onChange={v=>setField('technician',v)} placeholder="Name"/></Field>
          <Field label="Workshop"><Input value={form.workshop} onChange={v=>setField('workshop',v)} placeholder="Workshop name"/></Field>
          <Field label="Parts Cost (₹)"><Input type="number" value={form.parts_cost} onChange={v=>setField('parts_cost',v)} placeholder="2800"/></Field>
          <Field label="Labour Cost (₹)"><Input type="number" value={form.labour_cost} onChange={v=>setField('labour_cost',v)} placeholder="500"/></Field>
          <Field label="Next Service (km)"><Input type="number" value={form.next_service_km} onChange={v=>setField('next_service_km',v)} placeholder="94320"/></Field>
          <Field label="Next Service Date"><Input type="date" value={form.next_service_date} onChange={v=>setField('next_service_date',v)}/></Field>
          <Field label="Data Source"><Select value={form.data_source} onChange={v=>setField('data_source',v)} options={['MANUAL','SENSOR','OBD']}/></Field>
          <FullCol><PhotoZone label="Upload photos (before, after, invoice, parts)" count={0}/></FullCol>
          <FullCol><Field label="Technician Notes"><Textarea value={form.notes} onChange={v=>setField('notes',v)} placeholder="Parts condition, additional work..."/></Field></FullCol>
          <FullCol><PinInput value={form.supervisor_pin} onChange={v=>setField('supervisor_pin',v)}/></FullCol>
        </FormGrid>
      </Modal>
    </>
  );
}

// ── FUEL MANAGEMENT ───────────────────────────────────────
function FuelManagement({ vehicles, drivers, loading }) {
  const [records, setRecords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const EMPTY = { vehicle_id:'',driver_id:'',fill_datetime:new Date().toISOString().slice(0,16),fuel_station:'',quantity_litres:'',rate_per_litre:'',odometer_km:'',data_source:'MANUAL',payment_mode:'Fleet Card' };
  const [form, setForm] = useState(EMPTY);

  useEffect(() => { loadRecords(); }, []);
  async function loadRecords() {
    const { data } = await supabase.from('fuel_records').select('*,vehicles(reg_no),drivers(full_name)').order('fill_datetime',{ascending:false}).limit(50);
    setRecords(data||[]);
  }
  function setField(k,v) { setForm(f=>({...f,[k]:v})); }

  async function handleSave() {
    if (!form.vehicle_id||!form.driver_id||!form.quantity_litres||!form.rate_per_litre) { setError('Vehicle, driver, quantity and rate are required.'); return; }
    setSaving(true);
    try {
      const { data:code } = await supabase.rpc('next_fuel_code');
      const { error } = await supabase.from('fuel_records').insert({ ...form, fuel_code:code||`FL-${Date.now()}` });
      if (error) throw error;
      setSuccess('Fuel record saved.');
      setModalOpen(false);
      loadRecords();
      setTimeout(()=>setSuccess(''),4000);
    } catch(err) { setError(err.message); }
    setSaving(false);
  }

  const mtdSpend = records.filter(r=>new Date(r.fill_datetime).getMonth()===new Date().getMonth()).reduce((s,r)=>s+(r.total_amount||0),0);
  const mtdLitres = records.filter(r=>new Date(r.fill_datetime).getMonth()===new Date().getMonth()).reduce((s,r)=>s+(r.quantity_litres||0),0);

  return (
    <>
      {success&&<Alert type="g">{success}</Alert>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(115px,1fr))',gap:10}}>
        <StatCard color="c" label="MTD Spend" value={`₹${(mtdSpend/100000).toFixed(2)}L`} sub={`${Math.round(mtdLitres)} litres`} icon="⛽"/>
        <StatCard color="g" label="Fill-ups MTD" value={records.filter(r=>new Date(r.fill_datetime).getMonth()===new Date().getMonth()).length} sub="This month" icon="📋"/>
      </div>
      <Card title="⛽ Fuel Management" extra={<Btn color="primary" size="sm" onClick={()=>{setForm(EMPTY);setError('');setModalOpen(true);}}>+ Log Fill-up</Btn>} noPad>
        <Table loading={loading}
          heads={['Fuel ID','Vehicle','Driver','Date','Litres','Rate','Amount','km/L','Source','']}
          rows={records.map(r=>[
            <strong style={{fontFamily:'Consolas,monospace',fontSize:11}}>{r.fuel_code}</strong>,
            <span style={{fontFamily:'Consolas,monospace',fontSize:11}}>{r.vehicles?.reg_no}</span>,
            r.drivers?.full_name,
            new Date(r.fill_datetime).toLocaleDateString('en-IN'),
            `${r.quantity_litres}L`,
            `₹${r.rate_per_litre}/L`,
            `₹${(r.total_amount||0).toLocaleString('en-IN')}`,
            r.mileage_kmpl?<span style={{color:r.mileage_kmpl<3.5?C.a:C.g,fontFamily:'Consolas,monospace',fontWeight:700}}>{r.mileage_kmpl}</span>:'-',
            <Badge color={r.data_source==='SENSOR'?'b':'a'}>{r.data_source}</Badge>,
            <Btn size="sm">View</Btn>
          ])}/>
      </Card>

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title="⛽ Log Fuel Fill-up"
        footer={<><Btn onClick={()=>setModalOpen(false)}>Cancel</Btn><Btn color="primary" onClick={handleSave} disabled={saving}>{saving?'Saving...':'Save Fuel Record'}</Btn></>}>
        {error&&<div style={{marginBottom:12}}><Alert type="r">{error}</Alert></div>}
        <FormGrid>
          <Field label="Vehicle" required><Select value={form.vehicle_id} onChange={v=>setField('vehicle_id',v)} options={vehicles.map(v=>({value:v.id,label:v.reg_no}))} required/></Field>
          <Field label="Driver" required><Select value={form.driver_id} onChange={v=>setField('driver_id',v)} options={drivers.map(d=>({value:d.id,label:d.full_name}))} required/></Field>
          <Field label="Fill Date & Time" required><Input type="datetime-local" value={form.fill_datetime} onChange={v=>setField('fill_datetime',v)} required/></Field>
          <Field label="Fuel Station"><Input value={form.fuel_station} onChange={v=>setField('fuel_station',v)} placeholder="Station name / location"/></Field>
          <Field label="Quantity (Litres)" required><Input type="number" value={form.quantity_litres} onChange={v=>setField('quantity_litres',v)} placeholder="120" required/></Field>
          <Field label="Rate per Litre (₹)" required><Input type="number" value={form.rate_per_litre} onChange={v=>setField('rate_per_litre',v)} placeholder="94.50" required/></Field>
          <Field label="Odometer (km)"><Input type="number" value={form.odometer_km} onChange={v=>setField('odometer_km',v)} placeholder="84320"/></Field>
          <Field label="Payment Mode"><Select value={form.payment_mode} onChange={v=>setField('payment_mode',v)} options={['Fleet Card','Company Account','Cash']}/></Field>
          <Field label="Data Source"><Select value={form.data_source} onChange={v=>setField('data_source',v)} options={['MANUAL','Fleet Card Auto','Sensor']}/></Field>
          <FullCol><PhotoZone label="Upload receipt / meter photo" count={0}/></FullCol>
        </FormGrid>
      </Modal>
    </>
  );
}

// ── TYRE MANAGEMENT ───────────────────────────────────────
function TyreManagement({ vehicles, loading }) {
  const [records, setRecords] = useState([]);
  const [currentStatus, setCurrentStatus] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const POSITIONS = ['FL','FR','RLO','RLI','RRO','RRI','SPARE'];
  const EMPTY = { vehicle_id:'',record_date:new Date().toISOString().split('T')[0],position:'FL',action:'Pressure Check & Inflate',pressure_before_psi:'',pressure_after_psi:'',tread_depth_mm:'',cost:'',data_source:'MANUAL',notes:'' };
  const [form, setForm] = useState(EMPTY);

  useEffect(() => { loadRecords(); }, []);
  async function loadRecords() {
    const { data } = await supabase.from('tyre_records').select('*,vehicles(reg_no)').order('record_date',{ascending:false}).limit(50);
    setRecords(data||[]);
    const { data:status } = await supabase.from('tyre_current_status').select('*,vehicles(reg_no)');
    setCurrentStatus(status||[]);
  }
  function setField(k,v) { setForm(f=>({...f,[k]:v})); }

  async function handleSave() {
    if (!form.vehicle_id||!form.position) { setError('Vehicle and position required.'); return; }
    setSaving(true);
    try {
      const { data:code } = await supabase.rpc('next_tyre_code');
      const { error } = await supabase.from('tyre_records').insert({ ...form, tyre_code:code||`TYR-${Date.now()}` });
      if (error) throw error;
      setModalOpen(false);
      loadRecords();
    } catch(err) { setError(err.message); }
    setSaving(false);
  }

  // Get tyre status for selected vehicle
  const vehicleTypres = currentStatus.filter(t => t.vehicle_id === selectedVehicle);
  function tyreColor(t) {
    if (!t) return C.t4;
    if (t.status==='Critical'||t.current_pressure_psi<t.min_pressure_psi||t.current_tread_mm<t.min_tread_mm) return C.r;
    if (t.status==='Warning') return C.a;
    return C.g;
  }

  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(115px,1fr))',gap:10}}>
        <StatCard color="g" label="Tyres Tracked" value={currentStatus.length} sub="Positions" icon="⭕"/>
        <StatCard color="r" label="Low Pressure" value={currentStatus.filter(t=>t.current_pressure_psi<t.min_pressure_psi).length} sub="Below minimum" icon="⚠️"/>
        <StatCard color="a" label="Low Tread" value={currentStatus.filter(t=>t.current_tread_mm<t.min_tread_mm).length} sub="<3mm" icon="⚠️"/>
      </div>

      {/* Visual Tyre Map */}
      {vehicles.length > 0 && (
        <Card title="⭕ Tyre Position Map" extra={
          <Select value={selectedVehicle} onChange={setSelectedVehicle} options={vehicles.map(v=>({value:v.id,label:v.reg_no}))}/>
        }>
          {selectedVehicle ? (
            <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:12,maxWidth:320,margin:'0 auto'}}>
              {['FL','FR'].map((pos,i) => {
                const t = vehicleTypres.find(t=>t.position===pos);
                return (
                  <div key={pos} style={{background:C.bg2,border:`2px solid ${tyreColor(t)}`,borderRadius:8,padding:'8px 10px',textAlign:'center',cursor:'pointer',gridColumn:i===0?1:3}}>
                    <div style={{fontSize:9,color:C.t3}}>{pos}</div>
                    <div style={{fontFamily:'Consolas,monospace',fontSize:14,fontWeight:700,color:tyreColor(t)}}>{t?.current_pressure_psi||'-'}</div>
                    <div style={{fontSize:9,color:C.t3}}>PSI</div>
                  </div>
                );
              })}
              <div style={{background:C.bg3,border:`1px solid ${C.bdr}`,borderRadius:8,padding:8,gridColumn:2,gridRow:'1/4',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:C.t3,textAlign:'center',minWidth:80}}>
                {vehicles.find(v=>v.id===selectedVehicle)?.reg_no||'Vehicle'}
              </div>
              {['RLO','RLI'].map((pos,i) => {
                const t = vehicleTypres.find(t=>t.position===pos);
                return (
                  <div key={pos} style={{background:C.bg2,border:`2px solid ${tyreColor(t)}`,borderRadius:8,padding:'8px 10px',textAlign:'center',cursor:'pointer',gridColumn:i===0?1:3}}>
                    <div style={{fontSize:9,color:C.t3}}>{pos}</div>
                    <div style={{fontFamily:'Consolas,monospace',fontSize:14,fontWeight:700,color:tyreColor(t)}}>{t?.current_tread_mm||'-'}</div>
                    <div style={{fontSize:9,color:C.t3}}>mm tread</div>
                  </div>
                );
              })}
              {['RRO','RRI'].map((pos,i) => {
                const t = vehicleTypres.find(t=>t.position===pos);
                return (
                  <div key={pos} style={{background:C.bg2,border:`2px solid ${tyreColor(t)}`,borderRadius:8,padding:'8px 10px',textAlign:'center',cursor:'pointer',gridColumn:i===0?1:3}}>
                    <div style={{fontSize:9,color:C.t3}}>{pos}</div>
                    <div style={{fontFamily:'Consolas,monospace',fontSize:14,fontWeight:700,color:tyreColor(t)}}>{t?.current_pressure_psi||'-'}</div>
                    <div style={{fontSize:9,color:C.t3}}>PSI</div>
                  </div>
                );
              })}
            </div>
          ) : <div style={{textAlign:'center',padding:20,color:C.t3}}>Select a vehicle to view tyre map</div>}
          <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:12,fontSize:10.5}}>
            <span style={{color:C.g}}>● OK</span><span style={{color:C.a}}>● Warning</span><span style={{color:C.r}}>● Critical</span>
          </div>
        </Card>
      )}

      <Card title="⭕ Tyre Records" extra={<Btn color="primary" size="sm" onClick={()=>{setForm(EMPTY);setError('');setModalOpen(true);}}>+ Log Tyre Check</Btn>} noPad>
        <Table loading={loading}
          heads={['Tyre ID','Vehicle','Date','Position','Action','PSI Before','PSI After','Tread','Cost','']}
          rows={records.map(r=>[
            <strong style={{fontFamily:'Consolas,monospace',fontSize:11}}>{r.tyre_code}</strong>,
            <span style={{fontFamily:'Consolas,monospace',fontSize:11}}>{r.vehicles?.reg_no}</span>,
            r.record_date,r.position,r.action,
            r.pressure_before_psi?`${r.pressure_before_psi} PSI`:'-',
            r.pressure_after_psi?<span style={{color:r.pressure_after_psi>=32?C.g:C.a,fontWeight:700}}>{r.pressure_after_psi} PSI</span>:'-',
            r.tread_depth_mm?`${r.tread_depth_mm}mm`:'-',
            r.cost?`₹${r.cost.toLocaleString('en-IN')}`:'-',
            <Btn size="sm">View</Btn>
          ])}/>
      </Card>

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title="⭕ Log Tyre Check / Replacement"
        footer={<><Btn onClick={()=>setModalOpen(false)}>Cancel</Btn><Btn color="primary" onClick={handleSave} disabled={saving}>{saving?'Saving...':'Save Tyre Record'}</Btn></>}>
        {error&&<div style={{marginBottom:12}}><Alert type="r">{error}</Alert></div>}
        <FormGrid>
          <Field label="Vehicle" required><Select value={form.vehicle_id} onChange={v=>setField('vehicle_id',v)} options={vehicles.map(v=>({value:v.id,label:v.reg_no}))} required/></Field>
          <Field label="Record Date" required><Input type="date" value={form.record_date} onChange={v=>setField('record_date',v)} required/></Field>
          <Field label="Tyre Position" required><Select value={form.position} onChange={v=>setField('position',v)} options={POSITIONS} required/></Field>
          <Field label="Action"><Select value={form.action} onChange={v=>setField('action',v)} options={['Pressure Check & Inflate','Tread Depth Check','Tyre Rotation','Tyre Replacement','Puncture Repair','Balancing']}/></Field>
          <Field label="Pressure Before (PSI)" hint="Min recommended: 32 PSI"><Input type="number" value={form.pressure_before_psi} onChange={v=>setField('pressure_before_psi',v)} placeholder="28"/></Field>
          <Field label="Pressure After (PSI)"><Input type="number" value={form.pressure_after_psi} onChange={v=>setField('pressure_after_psi',v)} placeholder="36"/></Field>
          <Field label="Tread Depth (mm)" hint="Min safe: 3mm"><Input type="number" value={form.tread_depth_mm} onChange={v=>setField('tread_depth_mm',v)} placeholder="6.2" step="0.1"/></Field>
          <Field label="Cost (₹)"><Input type="number" value={form.cost} onChange={v=>setField('cost',v)} placeholder="12500"/></Field>
          <Field label="Data Source"><Select value={form.data_source} onChange={v=>setField('data_source',v)} options={['MANUAL','TPMS Sensor','TPMS Offline - Manual Override']}/></Field>
          <FullCol><PhotoZone label="Upload photos (before, tread gauge, replaced, completion)" count={0}/></FullCol>
          <FullCol><Field label="Notes"><Textarea value={form.notes} onChange={v=>setField('notes',v)} placeholder="Additional notes..."/></Field></FullCol>
        </FormGrid>
      </Modal>
    </>
  );
}

// ── MAINTENANCE SCHEDULE ──────────────────────────────────
function MaintenanceSchedule({ vehicles, drivers, loading }) {
  const [schedules, setSchedules] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const EMPTY = { entity_type:'vehicle',vehicle_id:'',driver_id:'',service_type:'',scheduled_date:'',alert_days_before:3,alert_recipients:[],alert_channel:'WhatsApp+SMS',notes:'' };
  const [form, setForm] = useState(EMPTY);

  const SERVICE_TYPES = ['Weekly Cleaning','Engine Oil Change','Full PM Service A','Full PM Service B','Tyre Rotation','Brake Inspection','Annual Fitness Test','DL Renewal Alert','Medical Cert Renewal','Police Verification Renewal','Insurance Renewal','PUC Renewal'];

  useEffect(() => { loadSchedules(); }, []);
  async function loadSchedules() {
    const { data } = await supabase.from('maintenance_schedule').select('*,vehicles(reg_no),drivers(full_name)').order('scheduled_date',{ascending:true});
    setSchedules(data||[]);
  }
  function setField(k,v) { setForm(f=>({...f,[k]:v})); }

  async function handleSave() {
    if (!form.service_type||!form.scheduled_date) { setError('Service type and date are required.'); return; }
    setSaving(true);
    try {
      const { data:code } = await supabase.rpc('next_schedule_code');
      const { error } = await supabase.from('maintenance_schedule').insert({ ...form, schedule_code:code||`SCH-${Date.now()}` });
      if (error) throw error;
      setModalOpen(false);
      loadSchedules();
    } catch(err) { setError(err.message); }
    setSaving(false);
  }

  function daysTill(date) { return Math.ceil((new Date(date)-new Date())/(1000*60*60*24)); }
  function scheduleColor(date) { const d=daysTill(date); return d<0?C.r:d<3?C.r:d<7?C.a:C.g; }

  return (
    <>
      <Card title="📅 Maintenance Schedule & Alerts" extra={<Btn color="primary" size="sm" onClick={()=>{setForm(EMPTY);setError('');setModalOpen(true);}}>+ Schedule Service</Btn>}>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {schedules.length===0&&!loading&&<div style={{textAlign:'center',padding:20,color:C.t3}}>No schedules yet. Add your first service schedule.</div>}
          {schedules.map(s=>{
            const days=daysTill(s.scheduled_date);
            const color=scheduleColor(s.scheduled_date);
            return (
              <div key={s.id} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',background:C.bg2,borderRadius:8,border:`1px solid ${C.bdr}`}}>
                <div style={{width:46,height:46,background:C.bg3,borderRadius:7,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <div style={{fontSize:9,textTransform:'uppercase',fontWeight:600,color:C.t3}}>{new Date(s.scheduled_date).toLocaleDateString('en-IN',{month:'short'})}</div>
                  <div style={{fontSize:17,fontWeight:700,fontFamily:'Consolas,monospace',color:C.t1}}>{new Date(s.scheduled_date).getDate()}</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12.5,fontWeight:600,color:C.t1}}>{s.service_type}</div>
                  <div style={{fontSize:11,color:C.t3}}>{s.vehicles?.reg_no||s.drivers?.full_name||''} · {s.alert_channel}</div>
                  <div style={{fontSize:10.5,marginTop:2,color}}>{days<0?'OVERDUE':days===0?'TODAY':days===1?'Tomorrow':`In ${days} days`} · 🔔 Alert {s.alert_days_before}d before</div>
                </div>
                <Badge color={days<0?'r':days<3?'r':days<7?'a':'g'}>{s.status}</Badge>
                <Btn size="sm" onClick={async()=>{ await supabase.from('maintenance_schedule').update({status:'Completed'}).eq('id',s.id); loadSchedules(); }}>✓ Done</Btn>
              </div>
            );
          })}
        </div>
      </Card>

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title="📅 Schedule Service / Alert"
        footer={<><Btn onClick={()=>setModalOpen(false)}>Cancel</Btn><Btn color="primary" onClick={handleSave} disabled={saving}>{saving?'Saving...':'Schedule & Set Alert'}</Btn></>}>
        {error&&<div style={{marginBottom:12}}><Alert type="r">{error}</Alert></div>}
        <FormGrid>
          <Field label="Schedule For"><Select value={form.entity_type} onChange={v=>setField('entity_type',v)} options={[{value:'vehicle',label:'Vehicle'},{value:'driver',label:'Driver'}]}/></Field>
          {form.entity_type==='vehicle'
            ? <Field label="Vehicle"><Select value={form.vehicle_id} onChange={v=>setField('vehicle_id',v)} options={vehicles.map(v=>({value:v.id,label:v.reg_no}))}/></Field>
            : <Field label="Driver"><Select value={form.driver_id} onChange={v=>setField('driver_id',v)} options={drivers.map(d=>({value:d.id,label:d.full_name}))}/></Field>
          }
          <Field label="Service Type" required><Select value={form.service_type} onChange={v=>setField('service_type',v)} options={SERVICE_TYPES} required/></Field>
          <Field label="Scheduled Date" required><Input type="date" value={form.scheduled_date} onChange={v=>setField('scheduled_date',v)} required/></Field>
          <Field label="Alert Before (days)"><Select value={String(form.alert_days_before)} onChange={v=>setField('alert_days_before',Number(v))} options={['1','2','3','7','14','30']}/></Field>
          <Field label="Alert Channel"><Select value={form.alert_channel} onChange={v=>setField('alert_channel',v)} options={['WhatsApp+SMS','SMS only','Email+SMS','All Channels']}/></Field>
          <FullCol><Field label="Notes"><Textarea value={form.notes} onChange={v=>setField('notes',v)} placeholder="Instructions, parts to arrange..."/></Field></FullCol>
        </FormGrid>
      </Modal>
    </>
  );
}

// ── REACTIVE MAINTENANCE ──────────────────────────────────
function ReactiveMaintenance({ vehicles, drivers, loading }) {
  const [records, setRecords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const EMPTY = { vehicle_id:'',driver_id:'',breakdown_at:new Date().toISOString().slice(0,16),location:'',fault_description:'',fault_category:'Engine',severity:'Critical',downtime_hours:'',repair_cost:'',root_cause:'' };
  const [form, setForm] = useState(EMPTY);

  useEffect(()=>{ loadRecords(); },[]);
  async function loadRecords() {
    const { data } = await supabase.from('reactive_maintenance').select('*,vehicles(reg_no),drivers(full_name)').order('breakdown_at',{ascending:false}).limit(50);
    setRecords(data||[]);
  }
  function setField(k,v) { setForm(f=>({...f,[k]:v})); }

  async function handleSave() {
    if (!form.vehicle_id||!form.fault_description) { setError('Vehicle and fault description required.'); return; }
    setSaving(true);
    try {
      const { data:code } = await supabase.rpc('next_rm_code');
      const { error } = await supabase.from('reactive_maintenance').insert({ ...form, rm_code:code||`RM-${Date.now()}` });
      if (error) throw error;
      setModalOpen(false);
      loadRecords();
    } catch(err) { setError(err.message); }
    setSaving(false);
  }

  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(115px,1fr))',gap:10}}>
        <StatCard color="r" label="Open Breakdowns" value={records.filter(r=>r.status==='Open').length} sub="Active" icon="⚡"/>
        <StatCard color="g" label="Resolved" value={records.filter(r=>r.status==='Resolved').length} sub="This month" icon="✅"/>
        <StatCard color="b" label="Total Repair Cost" value={`₹${records.reduce((s,r)=>s+(r.repair_cost||0),0).toLocaleString('en-IN')}`} sub="All time" icon="💰"/>
      </div>
      <Card title="⚡ Breakdown / Reactive Maintenance" extra={<Btn color="danger" size="sm" onClick={()=>{setForm(EMPTY);setError('');setModalOpen(true);}}>+ Log Breakdown</Btn>} noPad>
        <Table loading={loading}
          heads={['RM ID','Vehicle','Driver','Date','Fault','Severity','Downtime','Cost','Status','']}
          rows={records.map(r=>[
            <strong style={{fontFamily:'Consolas,monospace',fontSize:11}}>{r.rm_code}</strong>,
            <span style={{fontFamily:'Consolas,monospace',fontSize:11}}>{r.vehicles?.reg_no}</span>,
            r.drivers?.full_name||'-',
            new Date(r.breakdown_at).toLocaleDateString('en-IN'),
            r.fault_description,
            <Badge color={r.severity==='Critical'?'r':r.severity==='High'?'a':'b'}>{r.severity}</Badge>,
            r.downtime_hours?`${r.downtime_hours}h`:'-',
            r.repair_cost?`₹${r.repair_cost.toLocaleString('en-IN')}`:'-',
            <Badge color={r.status==='Open'?'r':r.status==='In Progress'?'a':'g'}>{r.status}</Badge>,
            <div style={{display:'flex',gap:4}}>
              <Btn size="sm" onClick={async()=>{ await supabase.from('reactive_maintenance').update({status:'Resolved',resolved_at:new Date()}).eq('id',r.id); loadRecords(); }}>Resolve</Btn>
            </div>
          ])}/>
      </Card>

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title="⚡ Log Breakdown"
        footer={<><Btn onClick={()=>setModalOpen(false)}>Cancel</Btn><Btn color="danger" onClick={handleSave} disabled={saving}>{saving?'Saving...':'Save Breakdown'}</Btn></>}>
        {error&&<div style={{marginBottom:12}}><Alert type="r">{error}</Alert></div>}
        <FormGrid>
          <Field label="Vehicle" required><Select value={form.vehicle_id} onChange={v=>setField('vehicle_id',v)} options={vehicles.map(v=>({value:v.id,label:v.reg_no}))} required/></Field>
          <Field label="Driver"><Select value={form.driver_id} onChange={v=>setField('driver_id',v)} options={drivers.map(d=>({value:d.id,label:d.full_name}))}/></Field>
          <Field label="Breakdown Date & Time" required><Input type="datetime-local" value={form.breakdown_at} onChange={v=>setField('breakdown_at',v)} required/></Field>
          <Field label="Location"><Input value={form.location} onChange={v=>setField('location',v)} placeholder="Road / GPS / landmark"/></Field>
          <Field label="Fault Category"><Select value={form.fault_category} onChange={v=>setField('fault_category',v)} options={['Engine','Gearbox','Brakes','Electrical','Tyre/Wheel','Hydraulics','Body/Hopper']}/></Field>
          <Field label="Severity"><Select value={form.severity} onChange={v=>setField('severity',v)} options={['Critical','High','Medium','Low']}/></Field>
          <FullCol><Field label="Fault Description" required><Textarea value={form.fault_description} onChange={v=>setField('fault_description',v)} placeholder="Symptoms, warning lights, sounds..." required/></Field></FullCol>
          <Field label="Downtime (hours)"><Input type="number" value={form.downtime_hours} onChange={v=>setField('downtime_hours',v)} placeholder="6" step="0.5"/></Field>
          <Field label="Repair Cost (₹)"><Input type="number" value={form.repair_cost} onChange={v=>setField('repair_cost',v)} placeholder="8500"/></Field>
          <FullCol><Field label="Root Cause Analysis"><Textarea value={form.root_cause} onChange={v=>setField('root_cause',v)} placeholder="Why did this happen? Missed PM? Overload? External damage?"/></Field></FullCol>
          <FullCol><PhotoZone label="Upload breakdown photos" count={0}/></FullCol>
        </FormGrid>
      </Modal>
    </>
  );
}

// ── FLEET DASHBOARD ───────────────────────────────────────
function FleetDashboard({ vehicles, drivers, loading }) {
  const upcoming = []; // Would pull from maintenance_schedule

  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(115px,1fr))',gap:10}}>
        <StatCard color="g" label="Total Vehicles" value={vehicles.length} sub="In fleet" icon="🚛"/>
        <StatCard color="g" label="Active" value={vehicles.filter(v=>v.status==='Active').length} sub="On road" icon="✅"/>
        <StatCard color="a" label="In Maintenance" value={vehicles.filter(v=>v.status==='In Maintenance').length} sub="Off road" icon="🔧"/>
        <StatCard color="r" label="Off Road" value={vehicles.filter(v=>v.status==='Off Road').length} sub="" icon="⛔"/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
        {vehicles.map(v => (
          <div key={v.id} style={{background:C.bg1,border:`1px solid ${C.bdr}`,borderRadius:12,padding:14}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
              <div>
                <div style={{fontFamily:'Consolas,monospace',fontSize:13,fontWeight:700,color:C.t1}}>{v.reg_no}</div>
                <div style={{fontSize:11,color:C.t3}}>{v.make} {v.model}</div>
                <div style={{fontSize:11,color:C.t3}}>{drivers.find(d=>d.id===v.assigned_driver_id)?.full_name||'Unassigned'}</div>
              </div>
              <Badge color={v.status==='Active'?'g':v.status==='In Maintenance'?'a':'r'}>{v.status}</Badge>
            </div>
            <div style={{fontSize:11,color:C.t3,marginBottom:3}}>Fuel Level</div>
            <ProgBar pct={v.current_fuel_pct||0}/>
            <div style={{fontSize:10,color:C.t3,marginTop:3}}>{v.current_fuel_pct||0}%</div>
            <div style={{marginTop:10,display:'flex',gap:6,flexWrap:'wrap'}}>
              {[['Fitness',v.fitness_expiry],['Insurance',v.insurance_expiry],['PUC',v.puc_expiry]].map(([l,d])=>{
                const days=d?Math.ceil((new Date(d)-new Date())/(1000*60*60*24)):null;
                const color=!d?'gr':days<0?'r':days<30?'a':'g';
                return <Badge key={l} color={color}>{l}: {d?`${days}d`:'N/A'}</Badge>;
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── MAIN VEHICLES MODULE ──────────────────────────────────
function Vehicles() {
  const [tab, setTab] = useState('fleet');
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);
  async function loadData() {
    setLoading(true);
    const [vRes, dRes] = await Promise.all([
      supabase.from('vehicles').select('*').order('reg_no'),
      supabase.from('drivers').select('id,driver_code,full_name').eq('status','Active'),
    ]);
    setVehicles(vRes.data||[]);
    setDrivers(dRes.data||[]);
    setLoading(false);
  }

  const tabs = [
    {id:'fleet',label:'Fleet Dashboard'},{id:'registry',label:'Vehicle Registry'},{id:'cleaning',label:'Cleaning Log'},
    {id:'pm',label:'Preventive Maint.'},{id:'rm',label:'Reactive Maint.'},{id:'schedule',label:'Schedule & Alerts'},
    {id:'tyres',label:'Tyre Management'},{id:'fuel',label:'Fuel Management'},
  ];

  const props = { vehicles, drivers, loading, onRefresh:loadData };

  return (
    <>
      <Tabs tabs={tabs} active={tab} onChange={setTab}/>
      {tab==='fleet' && <FleetDashboard {...props}/>}
      {tab==='registry' && <VehicleRegistry {...props}/>}
      {tab==='cleaning' && <VehicleCleaning {...props}/>}
      {tab==='pm' && <PreventiveMaintenance {...props}/>}
      {tab==='rm' && <ReactiveMaintenance {...props}/>}
      {tab==='schedule' && <MaintenanceSchedule {...props}/>}
      {tab==='tyres' && <TyreManagement {...props}/>}
      {tab==='fuel' && <FuelManagement {...props}/>}
    </>
  );
}



// ── TRIPS MODULE ────────────────────────────────────────────
function Trips() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tab, setTab] = useState('active');
  const EMPTY = { vehicle_id:'',driver_id:'',trip_date:new Date().toISOString().split('T')[0],start_time:'',route_priority:'Urgent Fill First',instructions:'',bin_ids:[] };
  const [form, setForm] = useState(EMPTY);

  useEffect(() => { loadData(); }, []);
  async function loadData() {
    setLoading(true);
    const [tRes,vRes,dRes,bRes] = await Promise.all([
      supabase.from('trips').select('*,vehicles(reg_no),drivers(full_name),trip_pickups(id,bin_id,status,bins(bin_code,current_fill_pct,zone,generators(company_name)))').order('created_at',{ascending:false}),
      supabase.from('vehicles').select('id,reg_no').eq('status','Active'),
      supabase.from('drivers').select('id,driver_code,full_name').eq('status','Active'),
      supabase.from('bins').select('id,bin_code,current_fill_pct,zone,operation_type,generators(company_name)').gte('current_fill_pct',60).order('current_fill_pct',{ascending:false}),
    ]);
    setTrips(tRes.data||[]); setVehicles(vRes.data||[]); setDrivers(dRes.data||[]); setBins(bRes.data||[]);
    setLoading(false);
  }
  function setField(k,v){setForm(f=>({...f,[k]:v}));}

  async function handleCreate() {
    if (!form.vehicle_id||!form.driver_id||!form.trip_date) { setError('Vehicle, driver and date required.'); return; }
    setSaving(true);
    try {
      const { data:code } = await supabase.rpc('next_trip_code');
      const { data:trip, error } = await supabase.from('trips').insert({ vehicle_id:form.vehicle_id,driver_id:form.driver_id,trip_date:form.trip_date,start_time:form.start_time||null,route_priority:form.route_priority,instructions:form.instructions,status:'Planned',trip_code:code }).select().single();
      if (error) throw error;
      if (form.bin_ids?.length>0) {
        const pickups = form.bin_ids.map((bid,i)=>({ trip_id:trip.id,bin_id:bid,sequence_no:i+1,status:'Pending' }));
        await supabase.from('trip_pickups').insert(pickups);
      }
      setSuccess(`Trip ${code} created and pushed to driver.`);
      setModalOpen(false);
      loadData();
      setTimeout(()=>setSuccess(''),5000);
    } catch(err){setError(err.message);}
    setSaving(false);
  }

  async function updateStatus(id, status) {
    await supabase.from('trips').update({status,updated_at:new Date()}).eq('id',id);
    loadData();
  }

  const filtered = trips.filter(t => tab==='all'||(tab==='active'&&['Planned','Dispatched','In Transit'].includes(t.status))||(tab==='completed'&&['Completed','Certified'].includes(t.status)));

  return (
    <>
      {success&&<Alert type="g">{success}</Alert>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(115px,1fr))',gap:10}}>
        <StatCard color="b" label="Planned" value={trips.filter(t=>t.status==='Planned').length} sub="" icon="📋"/>
        <StatCard color="a" label="In Transit" value={trips.filter(t=>t.status==='In Transit').length} sub="Active" icon="🚛"/>
        <StatCard color="g" label="Completed Today" value={trips.filter(t=>t.status==='Completed'&&t.trip_date===new Date().toISOString().split('T')[0]).length} sub="" icon="✅"/>
        <StatCard color="p" label="Pending Pickup Bins" value={bins.length} sub="≥60% fill" icon="⚠️"/>
      </div>
      <Card title="📍 Trip & Lift Plans"
        extra={<div style={{display:'flex',gap:8}}>
          <Tabs tabs={[{id:'active',label:'Active'},{id:'completed',label:'Completed'},{id:'all',label:'All'}]} active={tab} onChange={setTab}/>
          <Btn color="primary" size="sm" onClick={()=>{setForm(EMPTY);setError('');setModalOpen(true);}}>+ Create Lift Plan</Btn>
        </div>}
        noPad>
        <Table loading={loading}
          heads={['Trip','Date','Vehicle','Driver','Pickups','Weight','Status','']}
          rows={filtered.map(t=>[
            <strong style={{fontFamily:'Consolas,monospace',color:C.g}}>{t.trip_code}</strong>,
            t.trip_date,
            <span style={{fontFamily:'Consolas,monospace',fontSize:11}}>{t.vehicles?.reg_no}</span>,
            t.drivers?.full_name,
            `${t.trip_pickups?.filter(p=>p.status==='Collected').length||0}/${t.trip_pickups?.length||0}`,
            t.total_weight_kg?`${t.total_weight_kg} kg`:'-',
            <Badge color={t.status==='In Transit'?'a':t.status==='Completed'||t.status==='Certified'?'g':t.status==='Dispatched'?'b':'gr'}>{t.status}</Badge>,
            <div style={{display:'flex',gap:4}}>
              {t.status==='Planned'&&<Btn size="sm" color="primary" onClick={()=>updateStatus(t.id,'Dispatched')}>Dispatch</Btn>}
              {t.status==='Dispatched'&&<Btn size="sm" color="info" onClick={()=>updateStatus(t.id,'In Transit')}>Start</Btn>}
              {t.status==='In Transit'&&<Btn size="sm" color="primary" onClick={()=>updateStatus(t.id,'Completed')}>Complete</Btn>}
            </div>
          ])}/>
      </Card>

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title="📍 Create Lift Plan" wide
        footer={<><Btn onClick={()=>setModalOpen(false)}>Cancel</Btn><Btn color="primary" onClick={handleCreate} disabled={saving}>{saving?'Creating...':'Push Plan to Driver'}</Btn></>}>
        {error&&<div style={{marginBottom:12}}><Alert type="r">{error}</Alert></div>}
        <FormGrid>
          <Field label="Vehicle" required><Select value={form.vehicle_id} onChange={v=>setField('vehicle_id',v)} options={vehicles.map(v=>({value:v.id,label:v.reg_no}))} required/></Field>
          <Field label="Driver" required><Select value={form.driver_id} onChange={v=>setField('driver_id',v)} options={drivers.map(d=>({value:d.id,label:`${d.driver_code} — ${d.full_name}`}))} required/></Field>
          <Field label="Trip Date" required><Input type="date" value={form.trip_date} onChange={v=>setField('trip_date',v)} required/></Field>
          <Field label="Start Time"><Input type="time" value={form.start_time} onChange={v=>setField('start_time',v)}/></Field>
          <Field label="Route Priority"><Select value={form.route_priority} onChange={v=>setField('route_priority',v)} options={['Urgent Fill First','Shortest Distance','Manual Order']}/></Field>
          <FullCol>
            <Field label="Bins to Pick Up (select — bins ≥60% fill shown first)" hint="Select one or more bins">
              <div style={{display:'flex',flexDirection:'column',gap:6,maxHeight:200,overflowY:'auto',padding:8,background:C.bg3,borderRadius:8,border:`1px solid ${C.bdr2}`}}>
                {bins.map(b=>(
                  <label key={b.id} style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:12,color:C.t2,padding:'4px 6px',borderRadius:6,background:form.bin_ids?.includes(b.id)?'rgba(0,230,118,.08)':'transparent',border:`1px solid ${form.bin_ids?.includes(b.id)?'rgba(0,230,118,.2)':'transparent'}`}}>
                    <input type="checkbox" checked={form.bin_ids?.includes(b.id)||false} onChange={e=>{const ids=form.bin_ids||[];setField('bin_ids',e.target.checked?[...ids,b.id]:ids.filter(i=>i!==b.id));}} style={{accentColor:C.g}}/>
                    <span style={{fontFamily:'Consolas,monospace',fontWeight:700,color:C.t1}}>{b.bin_code}</span>
                    <span>— {b.generators?.company_name} · {b.zone}</span>
                    <span style={{marginLeft:'auto',fontFamily:'Consolas,monospace',fontWeight:700,color:b.current_fill_pct>=80?C.r:C.a}}>{b.current_fill_pct}%</span>
                  </label>
                ))}
                {bins.length===0&&<div style={{color:C.t3,fontSize:12,padding:8}}>No bins above 60% fill</div>}
              </div>
            </Field>
          </FullCol>
          <FullCol><Field label="Driver Instructions"><Textarea value={form.instructions} onChange={v=>setField('instructions',v)} placeholder="PPE mandatory, gate open times, weigh-bridge sequence..."/></Field></FullCol>
        </FormGrid>
      </Modal>
    </>
  );
}

// ── YARD INSPECTION MODULE ──────────────────────────────────
function YardInspection() {
  const [inspections, setInspections] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const EMPTY = { trip_id:'',arrival_time:new Date().toISOString().slice(0,16),weigh_bridge_kg:'',moisture_pct:'',data_source:'MANUAL',manifest_status:'Matches Manifest',visual_check:'Acceptable — Route to Crusher',remarks:'',decision:'APPROVED',inspector_pin:'' };
  const [form, setForm] = useState(EMPTY);

  useEffect(()=>{loadData();},[]);
  async function loadData() {
    setLoading(true);
    const [iRes,tRes] = await Promise.all([
      supabase.from('yard_inspections').select('*,trips(trip_code,vehicles(reg_no),drivers(full_name))').order('created_at',{ascending:false}).limit(50),
      supabase.from('trips').select('id,trip_code,vehicles(reg_no),drivers(full_name)').in('status',['In Transit','Completed']).order('trip_date',{ascending:false}).limit(20),
    ]);
    setInspections(iRes.data||[]); setTrips(tRes.data||[]);
    setLoading(false);
  }
  function setField(k,v){setForm(f=>({...f,[k]:v}));}

  async function handleIssue() {
    if (!form.trip_id||!form.weigh_bridge_kg||form.inspector_pin.length!==4) { setError('Trip, weight and inspector PIN required.'); return; }
    setSaving(true);
    try {
      const { data:code } = await supabase.rpc('next_inspection_code');
      const certNo = code||`CERT-${new Date().getFullYear()}-${Date.now()}`;
      const hash = `0x${Math.random().toString(16).slice(2,10)}`;
      const payload = { ...form, cert_no:certNo, blockchain_hash:hash, inspector_pin_verified:true };
      delete payload.inspector_pin;
      const { error } = await supabase.from('yard_inspections').insert(payload);
      if (error) throw error;
      if (form.decision==='APPROVED') await supabase.from('trips').update({status:'Certified'}).eq('id',form.trip_id);
      setSuccess(`Certificate ${certNo} issued. ${form.decision==='APPROVED'?'Waste cleared for crusher.':''}`);
      setModalOpen(false);
      loadData();
      setTimeout(()=>setSuccess(''),5000);
    } catch(err){setError(err.message);}
    setSaving(false);
  }

  return (
    <>
      {success&&<Alert type="g">{success}</Alert>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(115px,1fr))',gap:10}}>
        <StatCard color="g" label="Approved Today" value={inspections.filter(i=>i.decision==='APPROVED'&&i.created_at?.startsWith(new Date().toISOString().split('T')[0])).length} sub="Certificates issued" icon="✅"/>
        <StatCard color="a" label="Conditional" value={inspections.filter(i=>i.decision==='CONDITIONAL').length} sub="All time" icon="⚠️"/>
        <StatCard color="r" label="Rejected" value={inspections.filter(i=>i.decision==='REJECTED').length} sub="All time" icon="❌"/>
      </div>

      {/* Latest Certificate */}
      {inspections.length>0&&(
        <div style={{background:'linear-gradient(135deg,#162236,#111d2e)',border:'1px solid rgba(0,230,118,.3)',borderRadius:12,padding:16,position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',right:16,top:16,width:56,height:56,border:`2.5px solid ${C.g}`,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:700,color:C.g,textAlign:'center',transform:'rotate(-12deg)'}}>CERT<br/>IFIED<br/>✓</div>
          <div style={{fontSize:10,color:C.g,fontWeight:700,letterSpacing:2,textTransform:'uppercase',fontFamily:'Consolas,monospace'}}>Latest — EcoLoop Yard Inspection Certificate</div>
          <div style={{fontSize:20,fontWeight:700,fontFamily:'Consolas,monospace',marginTop:4,color:C.t1}}>{inspections[0].cert_no}</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginTop:10,fontSize:12}}>
            {[['Trip',inspections[0].trips?.trip_code],['Vehicle',inspections[0].trips?.vehicles?.reg_no],['Driver',inspections[0].trips?.drivers?.full_name],['Weight',`${inspections[0].weigh_bridge_kg} kg`],['Moisture',`${inspections[0].moisture_pct||'-'}%`],['Decision',inspections[0].decision]].map(([k,v])=>(
              <div key={k}><span style={{color:C.t3}}>{k}: </span><strong style={{color:C.t1}}>{v}</strong></div>
            ))}
          </div>
          <div style={{marginTop:10,padding:9,background:`rgba(${inspections[0].decision==='APPROVED'?'0,230,118':'244,67,54'},.08)`,borderRadius:8,fontSize:12.5}}>
            <strong style={{color:inspections[0].decision==='APPROVED'?C.g:C.r}}>{inspections[0].decision==='APPROVED'?'✅ APPROVED — Route to Crusher CU-01':inspections[0].decision==='CONDITIONAL'?'⚠️ CONDITIONAL':'❌ REJECTED'}</strong>
          </div>
          <div style={{fontSize:10,color:C.t3,marginTop:6}}>Blockchain: {inspections[0].blockchain_hash||'N/A'}</div>
        </div>
      )}

      <Card title="📋 Inspection Ledger" extra={<Btn color="primary" size="sm" onClick={()=>{setForm(EMPTY);setError('');setModalOpen(true);}}>+ New Inspection</Btn>} noPad>
        <Table loading={loading}
          heads={['Cert No.','Trip','Date','Vehicle','Driver','Weight','Moisture','Decision','']}
          rows={inspections.map(i=>[
            <strong style={{fontFamily:'Consolas,monospace',fontSize:11,color:C.g}}>{i.cert_no}</strong>,
            <span style={{fontFamily:'Consolas,monospace'}}>{i.trips?.trip_code}</span>,
            new Date(i.created_at).toLocaleDateString('en-IN'),
            i.trips?.vehicles?.reg_no,
            i.trips?.drivers?.full_name,
            `${i.weigh_bridge_kg} kg`,
            `${i.moisture_pct||'-'}%`,
            <Badge color={i.decision==='APPROVED'?'g':i.decision==='CONDITIONAL'?'a':'r'}>{i.decision}</Badge>,
            <Btn size="sm">Print</Btn>
          ])}/>
      </Card>

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title="🔍 Yard Inspection & Certificate"
        footer={<><Btn onClick={()=>setModalOpen(false)}>Cancel</Btn><Btn color="primary" onClick={handleIssue} disabled={saving}>{saving?'Issuing...':'Issue Certificate'}</Btn></>}>
        {error&&<div style={{marginBottom:12}}><Alert type="r">{error}</Alert></div>}
        <FormGrid>
          <Field label="Trip No." required><Select value={form.trip_id} onChange={v=>setField('trip_id',v)} options={trips.map(t=>({value:t.id,label:`${t.trip_code} — ${t.vehicles?.reg_no} — ${t.drivers?.full_name}`}))} required/></Field>
          <Field label="Arrival Time"><Input type="datetime-local" value={form.arrival_time} onChange={v=>setField('arrival_time',v)}/></Field>
          <Field label="Manifest Verification"><Select value={form.manifest_status} onChange={v=>setField('manifest_status',v)} options={['Matches Manifest','Minor Mismatch','Reject']}/></Field>
          <Field label="Weigh Bridge (kg)" required><Input type="number" value={form.weigh_bridge_kg} onChange={v=>setField('weigh_bridge_kg',v)} placeholder="2380" required/></Field>
          <Field label="Moisture Content %"><Input type="number" value={form.moisture_pct} onChange={v=>setField('moisture_pct',v)} placeholder="12"/></Field>
          <Field label="Sensor Data Source"><Select value={form.data_source} onChange={v=>setField('data_source',v)} options={['MANUAL','Auto — Weigh Bridge Sensor','Manual Override — sensor offline']}/></Field>
          <Field label="Visual Check"><Select value={form.visual_check} onChange={v=>setField('visual_check',v)} options={['Acceptable — Route to Crusher','Needs Sorting','Hazardous — Quarantine']}/></Field>
          <FullCol><PhotoZone label="Upload photos (Vehicle · Load · Seal · Weigh Ticket) — required" count={0} required/></FullCol>
          <FullCol><Field label="Inspector Remarks"><Textarea value={form.remarks} onChange={v=>setField('remarks',v)} placeholder="Condition, contamination, notes..."/></Field></FullCol>
          <Field label="Certificate Decision" required><Select value={form.decision} onChange={v=>setField('decision',v)} options={['APPROVED','CONDITIONAL','REJECTED']} required/></Field>
          <FullCol><PinInput value={form.inspector_pin} onChange={v=>setField('inspector_pin',v)} label="Inspector Digital Signature PIN"/></FullCol>
        </FormGrid>
      </Modal>
    </>
  );
}

// ── BILLING MODULE ──────────────────────────────────────────
function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [generators, setGenerators] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewInv, setPreviewInv] = useState(null);
  const EMPTY = { generator_id:'',trip_id:'',invoice_date:new Date().toISOString().split('T')[0],net_weight_kg:'',rate_per_kg:'2.80',gst_pct:'18',payment_mode:'NEFT/RTGS',due_date:'',notes:'' };
  const [form, setForm] = useState(EMPTY);

  useEffect(()=>{loadData();},[]);
  async function loadData() {
    setLoading(true);
    const [iRes,gRes,tRes] = await Promise.all([
      supabase.from('invoices').select('*,generators(company_name),trips(trip_code)').order('created_at',{ascending:false}).limit(100),
      supabase.from('generators').select('id,gen_code,company_name').eq('is_active',true),
      supabase.from('trips').select('id,trip_code').in('status',['Completed','Certified']).order('trip_date',{ascending:false}).limit(50),
    ]);
    setInvoices(iRes.data||[]); setGenerators(gRes.data||[]); setTrips(tRes.data||[]);
    setLoading(false);
  }
  function setField(k,v){setForm(f=>({...f,[k]:v}));}

  const base = form.net_weight_kg&&form.rate_per_kg ? (Number(form.net_weight_kg)*Number(form.rate_per_kg)) : 0;
  const gst = base * (Number(form.gst_pct)/100);
  const total = base + gst;

  async function handleGenerate() {
    if (!form.generator_id||!form.net_weight_kg||!form.rate_per_kg) { setError('Generator, weight and rate required.'); return; }
    setSaving(true);
    try {
      const { data:code } = await supabase.rpc('next_invoice_no');
      const { data:inv, error } = await supabase.from('invoices').insert({ ...form, invoice_no:code, gst_amount:gst, total_amount:total, payment_status:'Pending' }).select().single();
      if (error) throw error;
      setSuccess(`Invoice ${code} generated successfully.`);
      setPreviewInv({ ...inv, invoice_no:code, gst_amount:gst, total_amount:total, generators:generators.find(g=>g.id===form.generator_id) });
      setModalOpen(false);
      loadData();
      setTimeout(()=>setSuccess(''),5000);
    } catch(err){setError(err.message);}
    setSaving(false);
  }

  async function updatePayment(id, status) {
    await supabase.from('invoices').update({payment_status:status,paid_at:status==='Paid'?new Date():null}).eq('id',id);
    loadData();
  }

  const mtdTotal = invoices.filter(i=>new Date(i.invoice_date).getMonth()===new Date().getMonth()).reduce((s,i)=>s+(i.total_amount||0),0);
  const pending = invoices.filter(i=>i.payment_status==='Pending').reduce((s,i)=>s+(i.total_amount||0),0);
  const overdue = invoices.filter(i=>i.payment_status==='Overdue').reduce((s,i)=>s+(i.total_amount||0),0);

  return (
    <>
      {success&&<Alert type="g">{success}</Alert>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(115px,1fr))',gap:10}}>
        <StatCard color="g" label="This Month" value={`₹${(mtdTotal/100000).toFixed(2)}L`} sub={`${invoices.filter(i=>new Date(i.invoice_date).getMonth()===new Date().getMonth()).length} invoices`} icon="💰"/>
        <StatCard color="a" label="Pending" value={`₹${(pending/1000).toFixed(0)}K`} sub="Awaiting payment" icon="⏳"/>
        <StatCard color="r" label="Overdue" value={`₹${(overdue/1000).toFixed(0)}K`} sub="Past due date" icon="⚠️"/>
        <StatCard color="b" label="Collection Rate" value={`${invoices.length>0?Math.round(invoices.filter(i=>i.payment_status==='Paid').length/invoices.length*100):0}%`} sub="Paid invoices" icon="📊"/>
      </div>

      {/* Receipt Preview */}
      {previewInv&&(
        <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
          <div style={{background:'#fff',color:'#111',borderRadius:9,padding:18,fontFamily:'Consolas,monospace',fontSize:11.5,maxWidth:280,flex:'0 0 auto'}}>
            <div style={{textAlign:'center',marginBottom:8}}>
              <div style={{fontSize:13,fontWeight:700}}>EcoLoop Waste Pvt. Ltd.</div>
              <div style={{fontSize:9.5,color:'#555'}}>GSTIN: 27AABCE1234F1Z5</div>
            </div>
            <hr style={{border:'none',borderTop:'1px dashed #bbb',margin:'6px 0'}}/>
            <div style={{textAlign:'center',fontWeight:700,fontSize:11}}>WASTE COLLECTION RECEIPT</div>
            <div style={{textAlign:'center',fontSize:10,color:'#777'}}>{previewInv.invoice_no}</div>
            <hr style={{border:'none',borderTop:'1px dashed #bbb',margin:'6px 0'}}/>
            {[['Date',new Date(previewInv.invoice_date).toLocaleDateString('en-IN')],['Generator',previewInv.generators?.company_name],['Net Weight',`${previewInv.net_weight_kg} kg`],['Rate',`₹${previewInv.rate_per_kg}/kg`]].map(([k,v])=>(
              <div key={k} style={{display:'flex',justifyContent:'space-between',margin:'2px 0'}}><span>{k}:</span><span>{v}</span></div>
            ))}
            <hr style={{border:'none',borderTop:'1px dashed #bbb',margin:'6px 0'}}/>
            <div style={{display:'flex',justifyContent:'space-between',margin:'2px 0'}}><span>Base Amt:</span><span>₹{base.toFixed(2)}</span></div>
            <div style={{display:'flex',justifyContent:'space-between',margin:'2px 0'}}><span>GST {previewInv.gst_pct}%:</span><span>₹{gst.toFixed(2)}</span></div>
            <hr style={{border:'none',borderTop:'1px dashed #bbb',margin:'6px 0'}}/>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:14,fontWeight:700}}><span>TOTAL:</span><span>₹{total.toFixed(2)}</span></div>
            <hr style={{border:'none',borderTop:'1px dashed #bbb',margin:'6px 0'}}/>
            <div style={{fontSize:9,textAlign:'center',color:'#777'}}>Digital Sig ✓ · Auto-generated · EcoLoop Pro</div>
          </div>
          <Btn onClick={()=>setPreviewInv(null)} size="sm">✕ Close Preview</Btn>
        </div>
      )}

      <Card title="🧾 Invoice Register" extra={<div style={{display:'flex',gap:8}}><SearchInput value="" onChange={()=>{}}/><Btn color="primary" size="sm" onClick={()=>{setForm(EMPTY);setError('');setModalOpen(true);}}>+ Generate Invoice</Btn></div>} noPad>
        <Table loading={loading}
          heads={['Invoice No.','Date','Generator','Trip','Weight','GST','Total','Payment Mode','Status','']}
          rows={invoices.map(i=>[
            <strong style={{fontFamily:'Consolas,monospace',fontSize:11,color:C.g}}>{i.invoice_no}</strong>,
            new Date(i.invoice_date).toLocaleDateString('en-IN'),
            i.generators?.company_name,
            i.trips?.trip_code||'-',
            `${i.net_weight_kg} kg`,
            `₹${(i.gst_amount||0).toFixed(0)}`,
            <strong style={{color:C.t1}}>₹{(i.total_amount||0).toLocaleString('en-IN')}</strong>,
            i.payment_mode,
            <Badge color={i.payment_status==='Paid'?'g':i.payment_status==='Overdue'?'r':'a'}>{i.payment_status}</Badge>,
            <div style={{display:'flex',gap:4}}>
              {i.payment_status!=='Paid'&&<Btn size="sm" color="primary" onClick={()=>updatePayment(i.id,'Paid')}>Mark Paid</Btn>}
              <Btn size="sm" onClick={()=>setPreviewInv(i)}>Preview</Btn>
            </div>
          ])}/>
      </Card>

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title="🧾 Generate Invoice / Receipt"
        footer={<><Btn onClick={()=>setModalOpen(false)}>Cancel</Btn><Btn color="primary" onClick={handleGenerate} disabled={saving}>{saving?'Generating...':'Generate Receipt'}</Btn></>}>
        {error&&<div style={{marginBottom:12}}><Alert type="r">{error}</Alert></div>}
        <FormGrid>
          <Field label="Generator" required><Select value={form.generator_id} onChange={v=>setField('generator_id',v)} options={generators.map(g=>({value:g.id,label:`${g.gen_code} — ${g.company_name}`}))} required/></Field>
          <Field label="Trip No."><Select value={form.trip_id} onChange={v=>setField('trip_id',v)} options={trips.map(t=>({value:t.id,label:t.trip_code}))}/></Field>
          <Field label="Invoice Date" required><Input type="date" value={form.invoice_date} onChange={v=>setField('invoice_date',v)} required/></Field>
          <Field label="Due Date"><Input type="date" value={form.due_date} onChange={v=>setField('due_date',v)}/></Field>
          <Field label="Net Weight (kg)" required><Input type="number" value={form.net_weight_kg} onChange={v=>setField('net_weight_kg',v)} placeholder="2380" required/></Field>
          <Field label="Rate (₹/kg)" required><Input type="number" value={form.rate_per_kg} onChange={v=>setField('rate_per_kg',v)} step="0.01" placeholder="2.80" required/></Field>
          <Field label="GST %"><Select value={form.gst_pct} onChange={v=>setField('gst_pct',v)} options={['18','12','5','0']}/></Field>
          <Field label="Payment Mode"><Select value={form.payment_mode} onChange={v=>setField('payment_mode',v)} options={['NEFT/RTGS','UPI/QR','Cash','Credit 30 days']}/></Field>
          <FullCol><Field label="Notes"><Textarea value={form.notes} onChange={v=>setField('notes',v)} placeholder="Additional notes..."/></Field></FullCol>
        </FormGrid>
        {form.net_weight_kg&&form.rate_per_kg&&(
          <div style={{marginTop:14,padding:12,background:C.bg2,borderRadius:8,fontSize:12}}>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:C.t3}}>Base Amount:</span><span>₹{base.toFixed(2)}</span></div>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:C.t3}}>GST {form.gst_pct}%:</span><span>₹{gst.toFixed(2)}</span></div>
            <div style={{display:'flex',justifyContent:'space-between',fontWeight:700,marginTop:6,fontSize:14}}><span>Total:</span><span style={{color:C.g}}>₹{total.toFixed(2)}</span></div>
          </div>
        )}
      </Modal>
    </>
  );
}



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