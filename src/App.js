
import React, { useState } from "react";

const G = {
  g:'#00e676', a:'#ff9800', r:'#f44336', b:'#2196f3',
  p:'#9c27b0', c:'#00bcd4', t:'#009688',
  bg0:'#060a0f', bg1:'#0d1520', bg2:'#111d2e', bg3:'#162236',
  bg4:'#1c2d42', bg5:'#233450',
  t1:'#e8f4fd', t2:'#9ab8d4', t3:'#5a7a9a', t4:'#2e4a65',
};

const s = {
  app:{display:'flex',height:'100vh',overflow:'hidden',background:G.bg0,color:G.t1,fontFamily:"'Segoe UI',Arial,sans-serif",fontSize:13},
  sb:{width:228,minWidth:228,background:G.bg1,borderRight:`1px solid rgba(255,255,255,.07)`,display:'flex',flexDirection:'column',overflowY:'auto',flexShrink:0},
  main:{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'},
  tb:{background:G.bg1,borderBottom:`1px solid rgba(255,255,255,.07)`,padding:'11px 22px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0},
  ct:{flex:1,overflowY:'auto',padding:'18px 22px',display:'flex',flexDirection:'column',gap:14,background:G.bg0},
  logo:{padding:'16px 16px 12px',borderBottom:`1px solid rgba(255,255,255,.07)`},
  nh:{fontSize:9,fontWeight:700,letterSpacing:'1.8px',textTransform:'uppercase',color:G.t4,padding:'7px 16px 3px'},
  card:{background:G.bg1,border:`1px solid rgba(255,255,255,.07)`,borderRadius:12,overflow:'hidden'},
  ch:{padding:'11px 15px',borderBottom:`1px solid rgba(255,255,255,.07)`,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8},
  cb:{padding:14},
  sg:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(115px,1fr))',gap:10},
  two:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14},
  three:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12},
  tbl:{width:'100%',borderCollapse:'collapse',fontSize:12.5,minWidth:400},
  prog:{height:5,background:G.bg4,borderRadius:3,overflow:'hidden'},
};

const BINS=[
  {id:'BN-0088',gen:'Tata Steel',zone:'Gate 3',type:'A',cont:'Wheelie 1100L',waste:'Solid Industrial',haz:'Non-Haz',fill:45,tag:'QR',sc:'g'},
  {id:'BN-0089',gen:'Tata Steel',zone:'Gate 7',type:'A',cont:'Wheelie 660L',waste:'Metal Scrap',haz:'Non-Haz',fill:72,tag:'QR',sc:'g'},
  {id:'BN-0091',gen:'Reliance Petro',zone:'Zone B',type:'B',cont:'IBC 1000L',waste:'Liquid Hazardous',haz:'Class 6.1',fill:87,tag:'RFID',sc:'r'},
  {id:'BN-0092',gen:'Reliance Petro',zone:'Zone D',type:'B',cont:'Skip 4m³',waste:'Mixed Industrial',haz:'Non-Haz',fill:60,tag:'RFID',sc:'g'},
  {id:'BN-0094',gen:'Cipla Pharma',zone:'Store 2',type:'A',cont:'Wheelie 240L',waste:'Pharma Waste',haz:'Schedule I',fill:81,tag:'QR',sc:'r'},
  {id:'BN-0095',gen:'Cipla Pharma',zone:'Lab Block',type:'C',cont:'FIBC 500kg',waste:'Chemical Solid',haz:'Class 8',fill:55,tag:'QR',sc:'g'},
  {id:'BN-0096',gen:'ACC Cement',zone:'Zone A',type:'A',cont:'Wheelie 660L',waste:'Mixed Industrial',haz:'Non-Haz',fill:38,tag:'QR',sc:'g'},
  {id:'BN-0099',gen:'ACC Cement',zone:'Kiln Area',type:'B',cont:'Skip 6m³',waste:'Fly Ash',haz:'Non-Haz',fill:92,tag:'RFID',sc:'r'},
];
const DRIVERS=[
  {id:'DRV-001',name:'Ramesh Kumar',age:34,veh:'MH-12-AB-3456',exp:8,blood:'O+',status:'Active',sc:'g',dl:'DL-042011XXX',dlExp:'14 Mar 2026',dlS:'g',medExp:'01 Jan 2025',medS:'a'},
  {id:'DRV-002',name:'Suresh Patil',age:41,veh:'MH-04-CD-7890',exp:12,blood:'A+',status:'Active',sc:'g',dl:'DL-021999XXX',dlExp:'22 Aug 2024',dlS:'a',medExp:'15 Jun 2024',medS:'g'},
  {id:'DRV-003',name:'Pradeep Singh',age:29,veh:'MH-14-EF-1122',exp:5,blood:'B+',status:'Active',sc:'g',dl:'DL-142005XXX',dlExp:'30 Nov 2025',dlS:'g',medExp:'10 Mar 2025',medS:'g'},
  {id:'DRV-004',name:'Ajay Sharma',age:37,veh:'MH-09-KL-8800',exp:9,blood:'AB+',status:'On Leave',sc:'a',dl:'DL-092004XXX',dlExp:'05 Feb 2026',dlS:'g',medExp:'28 Dec 2024',medS:'g'},
];
const TRIPS=[
  {t:'T-0043',d:'08 Jun',v:'MH-14-EF',dr:'P.Singh',p:'0/2',s:'Dispatched',sc:'b'},
  {t:'T-0042',d:'08 Jun',v:'MH-12-AB',dr:'R.Kumar',p:'2/4',s:'In Transit',sc:'a'},
  {t:'T-0041',d:'08 Jun',v:'MH-04-CD',dr:'S.Patil',p:'3/3',s:'Certified',sc:'g'},
  {t:'T-0040',d:'07 Jun',v:'MH-12-AB',dr:'R.Kumar',p:'5/5',s:'Completed',sc:'g'},
];

function fc(f){return f>80?G.r:f>60?G.a:G.g;}
function Badge({c,children}){
  const bg={g:'rgba(0,230,118,.15)',a:'rgba(255,152,0,.15)',r:'rgba(244,67,54,.15)',b:'rgba(33,150,243,.15)',p:'rgba(156,39,176,.15)',c:'rgba(0,188,212,.15)'};
  const tc={g:G.g,a:G.a,r:G.r,b:G.b,p:G.p,c:G.c};
  return <span style={{display:'inline-flex',alignItems:'center',padding:'2px 8px',borderRadius:20,fontSize:10.5,fontWeight:600,background:bg[c]||bg.g,color:tc[c]||G.g}}>{children}</span>;
}
function Prog({pct,color}){return <div style={s.prog}><div style={{height:'100%',borderRadius:3,width:`${pct}%`,background:color||fc(pct)}}></div></div>;}
function StatCard({color,label,val,sub}){
  return <div style={{background:G.bg1,border:`1px solid rgba(255,255,255,.07)`,borderRadius:12,padding:'13px 14px',borderTop:`2px solid ${G[color]||G.g}`,position:'relative'}}>
    <div style={{fontSize:10,fontWeight:600,letterSpacing:'1.2px',textTransform:'uppercase',color:G.t3}}>{label}</div>
    <div style={{fontSize:22,fontWeight:700,margin:'5px 0 2px',fontFamily:'Consolas,monospace',color:G[color]||G.g}}>{val}</div>
    <div style={{fontSize:10.5,color:G.t3}}>{sub}</div>
  </div>;
}
function Card({title,extra,children,noPad}){
  return <div style={s.card}>
    <div style={s.ch}><span style={{fontSize:13,fontWeight:600,color:G.t1}}>{title}</span>{extra}</div>
    <div style={noPad?{padding:0}:s.cb}>{children}</div>
  </div>;
}
function Tbl({heads,rows}){
  return <div style={{overflowX:'auto'}}>
    <table style={s.tbl}>
      <thead><tr style={{borderBottom:`1px solid rgba(255,255,255,.15)`}}>
        {heads.map((h,i)=><th key={i} style={{textAlign:'left',padding:'8px 12px',fontSize:10,textTransform:'uppercase',letterSpacing:'1.2px',color:G.t3,fontWeight:600,whiteSpace:'nowrap'}}>{h}</th>)}
      </tr></thead>
      <tbody>{rows.map((row,i)=><tr key={i} style={{borderBottom:`1px solid rgba(255,255,255,.05)`}}>
        {row.map((cell,j)=><td key={j} style={{padding:'9px 12px',color:G.t2,verticalAlign:'middle'}}>{cell}</td>)}
      </tr>)}</tbody>
    </table>
  </div>;
}
function Alert({type,children}){
  const bc={g:G.g,a:G.a,r:G.r,b:G.b};
  const bg={g:'rgba(0,230,118,.07)',a:'rgba(255,152,0,.07)',r:'rgba(244,67,54,.07)',b:'rgba(33,150,243,.07)'};
  return <div style={{padding:'9px 13px',borderRadius:8,fontSize:12.5,borderLeft:`3px solid ${bc[type]}`,background:bg[type],color:bc[type],display:'flex',alignItems:'center',gap:8}}>{children}</div>;
}

function NavItem({label,icon,badge,badgeColor,active,onClick}){
  return <div onClick={onClick} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 16px',cursor:'pointer',fontSize:12,color:active?G.g:G.t3,borderLeft:`2px solid ${active?G.g:'transparent'}`,background:active?'rgba(0,230,118,.07)':'transparent',transition:'all .12s'}}>
    <span style={{fontSize:14,width:17,flexShrink:0}}>{icon}</span>
    <span style={{flex:1}}>{label}</span>
    {badge && <span style={{fontSize:9,fontWeight:700,padding:'1px 5px',borderRadius:10,background:badgeColor==='r'?G.r:badgeColor==='a'?G.a:G.g,color:badgeColor==='g'?'#000':'#fff'}}>{badge}</span>}
  </div>;
}

function Dashboard({setPage}){
  return <>
    <div style={{display:'flex',flexDirection:'column',gap:6}}>
      <Alert type="r">🔴 MH-12-AB-3456 PM overdue 3 days.</Alert>
      <Alert type="a">🟡 BIN BN-0091 87% full · 2 vehicles due cleaning today.</Alert>
    </div>
    <div style={s.sg}>
      <StatCard color="g" label="Generators" val="24" sub="Active clients"/>
      <StatCard color="b" label="Bins" val="148" sub="12 need pickup"/>
      <StatCard color="a" label="Trips Today" val="7" sub="3 done · 4 active"/>
      <StatCard color="g" label="Collected" val="18.4T" sub="Today"/>
      <StatCard color="a" label="Crushed" val="12.1T" sub="65% of collected"/>
      <StatCard color="r" label="Steam Output" val="4.2T/h" sub="Boiler 92% eff."/>
      <StatCard color="b" label="Drivers" val="5" sub="4 active"/>
      <StatCard color="c" label="Fuel This Week" val="₹1.24L" sub="642 litres"/>
    </div>
    <div style={s.two}>
      <Card title="🚛 Active Trips" extra={<button onClick={()=>setPage('trips')} style={{padding:'4px 9px',borderRadius:7,border:`1px solid rgba(255,255,255,.12)`,background:G.bg4,color:G.t1,cursor:'pointer',fontSize:11.5}}>All</button>} noPad>
        <Tbl heads={['Trip','Date','Vehicle','Driver','Pickups','Status']} rows={TRIPS.map(r=>[
          <strong style={{fontFamily:'Consolas,monospace'}}>{r.t}</strong>,r.d,
          <span style={{fontFamily:'Consolas,monospace',fontSize:11}}>{r.v}</span>,r.dr,r.p,
          <Badge c={r.sc}>{r.s}</Badge>
        ])}/>
      </Card>
      <Card title="🔥 Boiler B-01 Live" extra={<Badge c="g">Operational</Badge>}>
        <div style={s.three}>
          {[['842°C','Combustion',G.r,84],['9.2 bar','Pressure',G.a,77],['92%','Efficiency',G.g,92]].map(([v,l,c,p])=>
            <div key={l} style={{textAlign:'center'}}>
              <div style={{fontSize:20,fontWeight:700,fontFamily:'Consolas,monospace',color:c}}>{v}</div>
              <div style={{fontSize:10,color:G.t3,margin:'3px 0'}}>{l}</div>
              <Prog pct={p} color={c}/>
            </div>
          )}
        </div>
        <div style={{marginTop:10,fontSize:11.5,color:G.t3}}>Steam: <strong style={{color:G.t1}}>4.2T/h</strong> · Feed: <strong style={{color:G.t1}}>580kg/h</strong></div>
      </Card>
    </div>
    <div style={s.two}>
      <Card title="🗑 Bin Fill Levels" extra={<button onClick={()=>setPage('bins')} style={{padding:'4px 9px',borderRadius:7,border:`1px solid rgba(255,255,255,.12)`,background:G.bg4,color:G.t1,cursor:'pointer',fontSize:11.5}}>All Bins</button>}>
        {BINS.map(b=><div key={b.id} style={{marginBottom:8}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:3}}>
            <span><strong style={{fontFamily:'Consolas,monospace',color:G.t1}}>{b.id}</strong> <span style={{color:G.t3}}>{b.gen} · {b.zone}</span></span>
            <span style={{fontFamily:'Consolas,monospace',fontWeight:700,color:fc(b.fill)}}>{b.fill}%</span>
          </div>
          <Prog pct={b.fill}/>
        </div>)}
      </Card>
      <Card title="🚛 Fleet Health" extra={<button onClick={()=>setPage('vehicles')} style={{padding:'4px 9px',borderRadius:7,border:`1px solid rgba(255,255,255,.12)`,background:G.bg4,color:G.t1,cursor:'pointer',fontSize:11.5}}>All</button>}>
        {[{v:'MH-12-AB-3456',d:'DRV-001 Ramesh',c:'Overdue',pm:'Overdue',f:68,cs:'r',ps:'r'},{v:'MH-04-CD-7890',d:'DRV-002 Suresh',c:'Due Today',pm:'OK',f:45,cs:'a',ps:'g'},{v:'MH-14-EF-1122',d:'DRV-003 Pradeep',c:'Due Today',pm:'OK',f:82,cs:'a',ps:'g'},{v:'MH-09-KL-8800',d:'DRV-004 Ajay',c:'Done',pm:'OK',f:91,cs:'g',ps:'g'}].map(r=>
          <div key={r.v} style={{background:G.bg2,border:`1px solid rgba(255,255,255,.07)`,borderRadius:9,padding:11,marginBottom:6}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
              <div><strong style={{fontFamily:'Consolas,monospace',fontSize:12}}>{r.v}</strong><div style={{fontSize:10.5,color:G.t3}}>{r.d}</div></div>
              <div style={{display:'flex',gap:4}}><Badge c={r.cs}>🧹{r.c}</Badge><Badge c={r.ps}>🔧{r.pm}</Badge></div>
            </div>
            <Prog pct={r.f}/><div style={{fontSize:10,color:G.t3,marginTop:2}}>Fuel {r.f}%</div>
          </div>
        )}
      </Card>
    </div>
  </>;
}

function BinDashboard(){
  return <>
    <Alert type="r">🔴 3 bins critical — BN-0091 (87%), BN-0094 (81%), BN-0099 (92%). Schedule pickup immediately.</Alert>
    <div style={s.sg}>
      <StatCard color="g" label="Total Bins" val="148" sub="24 generators"/>
      <StatCard color="t" label="Type A — Empty at Site" val="82" sub="Wheelie/drum/cage"/>
      <StatCard color="p" label="Type B — Full Bin Lift" val="41" sub="Skip/IBC/hook-lift"/>
      <StatCard color="a" label="Type C — Loose Bag" val="25" sub="FIBC bag + stand"/>
      <StatCard color="r" label="Critical >80%" val="3" sub="Urgent pickup"/>
      <StatCard color="b" label="IoT Sensor Active" val="94" sub="54 manual entry"/>
    </div>
    <div style={s.two}>
      <Card title="📊 Fill Levels">
        {BINS.map(b=><div key={b.id} style={{marginBottom:8}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:3}}>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <strong style={{fontFamily:'Consolas,monospace',color:G.t1}}>{b.id}</strong>
              <span style={{padding:'1px 7px',borderRadius:20,fontSize:10,fontWeight:600,background:b.type==='A'?'rgba(0,150,136,.15)':b.type==='B'?'rgba(156,39,176,.15)':'rgba(255,152,0,.15)',color:b.type==='A'?G.t:b.type==='B'?G.p:G.a}}>Type {b.type}</span>
              <span style={{color:G.t3}}>{b.gen} · {b.zone}</span>
            </div>
            <span style={{fontFamily:'Consolas,monospace',fontWeight:700,color:fc(b.fill)}}>{b.fill}%</span>
          </div>
          <Prog pct={b.fill}/>
        </div>)}
      </Card>
      <Card title="⚠️ Critical Bins">
        {BINS.filter(b=>b.fill>79).map(b=><div key={b.id} style={{background:'rgba(244,67,54,.07)',border:'1px solid rgba(244,67,54,.2)',borderRadius:8,padding:10,marginBottom:8}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div><strong style={{fontFamily:'Consolas,monospace',color:G.r}}>{b.id}</strong><div style={{fontSize:11,color:G.t3}}>{b.gen} · {b.zone} · {b.cont}</div></div>
            <div style={{fontFamily:'Consolas,monospace',fontSize:20,fontWeight:700,color:G.r}}>{b.fill}%</div>
          </div>
          <Prog pct={b.fill} color={G.r}/>
        </div>)}
      </Card>
    </div>
  </>;
}

function BinTypePage({type}){
  const desc={A:'Bin stays at site. Waste tipped from bin into truck hopper. Empty bin remains.',B:'Full bin lifted onto truck. Empty replacement bin placed back at site.',C:'Only the filled bag lifted from stand. New empty bag placed on stand.'};
  const bins=BINS.filter(b=>b.type===type);
  const tcolor={A:G.t,B:G.p,C:G.a};
  return <>
    <Alert type="b">{desc[type]}</Alert>
    <Card title={`Type ${type} Bins`}>
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {bins.map(b=><div key={b.id} style={{background:G.bg2,borderLeft:`4px solid ${tcolor[type]}`,borderRadius:9,padding:12}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div>
              <div style={{fontFamily:'Consolas,monospace',fontSize:13,fontWeight:700,color:G.t1}}>{b.id} <span style={{fontSize:11,fontWeight:400,color:G.t3}}>{b.cont}</span></div>
              <div style={{fontSize:11,color:G.t3,marginTop:3}}>{b.gen} · {b.zone} · {b.waste} · {b.haz}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontFamily:'Consolas,monospace',fontSize:22,fontWeight:700,color:fc(b.fill)}}>{b.fill}%</div>
              <Badge c={b.sc}>{b.sc==='r'?'Critical':'Active'}</Badge>
            </div>
          </div>
          <div style={{marginTop:8}}><Prog pct={b.fill}/></div>
          <div style={{marginTop:10,display:'flex',gap:6,flexWrap:'wrap'}}>
            <button onClick={()=>alert(`Pickup scheduled for ${b.id}`)} style={{padding:'5px 12px',borderRadius:7,border:`1px solid ${G.g}`,background:`rgba(0,230,118,.15)`,color:G.g,cursor:'pointer',fontSize:12,fontWeight:600}}>Schedule Pickup</button>
            {type==='B'&&<button onClick={()=>alert('Empty bin dispatched')} style={{padding:'5px 12px',borderRadius:7,border:`1px solid rgba(255,255,255,.12)`,background:G.bg4,color:G.t1,cursor:'pointer',fontSize:12}}>Send Empty Bin</button>}
            {type==='C'&&<button onClick={()=>alert('New bags ordered')} style={{padding:'5px 12px',borderRadius:7,border:`1px solid rgba(255,255,255,.12)`,background:G.bg4,color:G.t1,cursor:'pointer',fontSize:12}}>Order Bags</button>}
          </div>
        </div>)}
      </div>
    </Card>
  </>;
}

function Drivers(){
  return <>
    <Alert type="a">🟡 DRV-002 Suresh Patil — DL expires 22 Aug 2024 (53 days). Initiate renewal.</Alert>
    <div style={s.sg}>
      <StatCard color="g" label="Total Drivers" val="5" sub="4 active"/>
      <StatCard color="a" label="Doc Alerts" val="2" sub="DL + Medical"/>
      <StatCard color="b" label="Avg Experience" val="7.6y" sub="HMV licensed"/>
      <StatCard color="g" label="Compliance" val="96%" sub="Docs current"/>
    </div>
    {DRIVERS.map(d=><div key={d.id} style={{background:G.bg1,border:`1px solid rgba(255,255,255,.07)`,borderRadius:12,padding:14}}>
      <div style={{display:'flex',gap:14,alignItems:'flex-start'}}>
        <div style={{width:46,height:46,borderRadius:'50%',background:G.bg4,border:`2px solid rgba(255,255,255,.12)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>👤</div>
        <div style={{flex:1}}>
          <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:6}}>
            <div>
              <div style={{fontSize:13.5,fontWeight:700,color:G.t1}}>{d.name} <span style={{fontFamily:'Consolas,monospace',fontSize:10,color:G.t3}}>{d.id}</span></div>
              <div style={{fontSize:11.5,color:G.t3}}>Age {d.age} · {d.exp}y exp · Blood: {d.blood}</div>
              <div style={{fontSize:11.5,color:G.t3}}>Vehicle: <span style={{fontFamily:'Consolas,monospace',color:G.t2}}>{d.veh}</span></div>
            </div>
            <Badge c={d.sc}>{d.status}</Badge>
          </div>
          <div style={{marginTop:10,display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(185px,1fr))',gap:7}}>
            {[
              {icon:'🪪',name:'Aadhaar Card',no:'XXXX XXXX',exp:'Lifetime',s:'g'},
              {icon:'📄',name:'Driving Licence',no:d.dl,exp:d.dlExp,s:d.dlS},
              {icon:'🏥',name:'Medical Cert.',no:'MED-'+d.id,exp:d.medExp,s:d.medS},
              {icon:'🛡',name:'Police Verification',no:'PV-'+d.id,exp:'Verified',s:'g'},
              {icon:'⚠️',name:'Hazmat Cert.',no:'HAZ-'+d.id,exp:'Valid',s:'g'},
              {icon:'🦺',name:'PPE Training',no:'PPE-'+d.id,exp:'2025',s:'g'},
            ].map(doc=><div key={doc.name} style={{background:G.bg3,borderRadius:8,padding:'9px 10px',display:'flex',gap:8,alignItems:'flex-start'}}>
              <div style={{width:30,height:30,borderRadius:6,background:G.bg4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>{doc.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:11.5,fontWeight:600,color:G.t1}}>{doc.name}</div>
                <div style={{fontSize:10,color:G.t3,fontFamily:'Consolas,monospace'}}>{doc.no}</div>
                <div style={{fontSize:10,fontWeight:700,marginTop:2,color:doc.s==='g'?G.g:doc.s==='a'?G.a:G.r}}>{doc.s==='g'?'✅':'⚠️'} {doc.exp}</div>
              </div>
            </div>)}
          </div>
        </div>
      </div>
    </div>)}
  </>;
}

function Boiler(){
  return <>
    <Alert type="g">🔥 Boiler B-01 at peak efficiency · Steam: 4.2T/h · 9.2 bar · 842°C</Alert>
    <div style={s.sg}>
      <StatCard color="r" label="Combustion Temp" val="842°C" sub="±8°C stable"/>
      <StatCard color="a" label="Steam Output" val="4.2T/h" sub="Saturated steam"/>
      <StatCard color="b" label="Steam Pressure" val="9.2 bar" sub="Max: 12 bar"/>
      <StatCard color="g" label="Waste Fed Today" val="8.4T" sub=""/>
      <StatCard color="g" label="Efficiency" val="92%" sub="Best this month"/>
      <StatCard color="a" label="Ash Today" val="0.6T" sub="Disposal scheduled"/>
    </div>
    <Card title="⚡ Waste-to-Energy Pipeline">
      <div style={{paddingLeft:20,position:'relative'}}>
        <div style={{position:'absolute',left:6,top:8,bottom:8,width:1,background:G.bg5}}></div>
        {[
          ['Waste Received at Yard','8,400 kg · CERT-0891 & 0890 verified','done'],
          ['Crushing & Shredding','CB-082 & CB-083 complete · 7,140 kg fuel','done'],
          ['Pre-Feed Sorting','Metals removed: 180 kg · Net fuel: 6,960 kg','done'],
          ['Boiler B-01 Feed Conveyor','Stoker: 580 kg/h · Feed started 12:10','done'],
          ['Combustion Chamber','842°C · CO₂: 14.2% · CO: <100 ppm','done'],
          ['Steam Generation — Active','4.2T/h · 9.2 bar · Supplied to Process Plant','active'],
          ['Ash Collection & Disposal','0.6T fly ash · PCB disposal truck: 09 Jun','pending'],
        ].map(([t,m,state])=><div key={t} style={{position:'relative',marginBottom:14}}>
          <div style={{position:'absolute',left:-17,top:3,width:11,height:11,borderRadius:'50%',border:`2px solid ${state==='done'?G.g:state==='active'?G.a:G.t4}`,background:state==='done'?G.g:G.bg0}}></div>
          <div style={{fontSize:12.5,fontWeight:600,color:G.t1}}>{t}</div>
          <div style={{fontSize:11.5,color:G.t3,marginTop:2}}>{m}</div>
        </div>)}
      </div>
    </Card>
  </>;
}

function Vehicles(){
  const vdata=[
    {v:'MH-12-AB-3456',model:'Volvo FMX 440',drv:'DRV-001 Ramesh',clean:'Overdue',pm:'Overdue',fuel:68,cs:'r',ps:'r',fit:'Valid'},
    {v:'MH-04-CD-7890',model:'Tata Prima 2528',drv:'DRV-002 Suresh',clean:'01 Jun',pm:'01 Jun',fuel:45,cs:'g',ps:'g',fit:'Valid'},
    {v:'MH-14-EF-1122',model:'Ashok Leyland 2518',drv:'DRV-003 Pradeep',clean:'05 Jun',pm:'28 May',fuel:82,cs:'g',ps:'a',fit:'Dec 2024'},
    {v:'MH-09-KL-8800',model:'Mahindra Blazo X',drv:'DRV-004 Ajay',clean:'06 Jun',pm:'22 May',fuel:91,cs:'g',ps:'g',fit:'Valid'},
  ];
  return <Card title="🚛 Vehicle Registry" noPad>
    <Tbl heads={['Reg No.','Model','Driver','Last Clean','Last PM','Fuel%','Fitness']}
      rows={vdata.map(r=>[
        <strong style={{fontFamily:'Consolas,monospace',fontSize:11.5}}>{r.v}</strong>,
        r.model, r.drv,
        <Badge c={r.cs}>{r.clean}</Badge>,
        <Badge c={r.ps}>{r.pm}</Badge>,
        <div style={{display:'flex',alignItems:'center',gap:5}}>
          <div style={{width:55,height:5,background:G.bg4,borderRadius:3,overflow:'hidden',display:'inline-block'}}>
            <div style={{height:'100%',width:`${r.fuel}%`,background:fc(r.fuel),borderRadius:3}}></div>
          </div>
          <span style={{fontFamily:'Consolas,monospace',fontSize:11}}>{r.fuel}%</span>
        </div>,
        <Badge c={r.fit==='Valid'?'g':'a'}>{r.fit}</Badge>
      ])}/>
  </Card>;
}

function Trips(){
  return <>
    <Alert type="b">📱 Plans T-0044 and T-0045 pending driver acknowledgment.</Alert>
    <Card title="📱 Driver Tablet — T-0042" extra={<Badge c="a">In Transit</Badge>}>
      <div style={{background:'#020508',border:`1px solid rgba(255,255,255,.12)`,borderRadius:10,padding:14,maxWidth:320,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:12}}>
          <div style={{fontSize:9,letterSpacing:2,color:G.g,fontFamily:'Consolas,monospace',textTransform:'uppercase'}}>EcoLoop Driver App</div>
          <div style={{fontSize:16,fontWeight:700,fontFamily:'Consolas,monospace',marginTop:2,color:G.t1}}>Trip T-0042</div>
          <div style={{fontSize:10.5,color:G.t3}}>Ramesh Kumar (DRV-001) · 08 Jun 2024</div>
        </div>
        {[['BN-0088','Tata Steel Gate 3','Solid Industrial',true],['BN-0089','Tata Steel Gate 7','Metal Scrap',true],['BN-0091','Reliance Zone B','Liquid Hazardous',false],['BN-0094','Cipla Store 2','Pharma Waste',false]].map(([bin,loc,waste,done])=>
          <div key={bin} style={{display:'flex',gap:8,padding:8,borderRadius:7,border:`1px solid ${done?'rgba(0,230,118,.2)':'rgba(255,255,255,.07)'}`,background:done?'rgba(0,230,118,.05)':'transparent',marginBottom:7}}>
            <div style={{width:22,height:22,borderRadius:'50%',background:done?G.g:G.bg4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:done?'#000':G.t3,flexShrink:0}}>{done?'✓':'-'}</div>
            <div>
              <div style={{fontSize:11.5,fontWeight:600,color:done?G.g:G.t1,fontFamily:'Consolas,monospace'}}>{bin}</div>
              <div style={{fontSize:10.5,color:G.t3}}>{loc} · {waste}</div>
            </div>
          </div>
        )}
        <button onClick={()=>alert('Scanning BN-0091...\nVerified! Weight: 420 kg\nReceipt sent via WhatsApp')} style={{width:'100%',marginTop:6,padding:'8px 0',borderRadius:7,border:'none',background:G.g,color:'#000',fontWeight:700,cursor:'pointer',fontSize:13}}>📷 Scan Bin QR / Collect</button>
      </div>
    </Card>
    <Card title="All Trips" noPad>
      <Tbl heads={['Trip','Date','Vehicle','Driver','Pickups','Status']} rows={TRIPS.map(r=>[
        <strong style={{fontFamily:'Consolas,monospace'}}>{r.t}</strong>,r.d,
        <span style={{fontFamily:'Consolas,monospace',fontSize:11}}>{r.v}</span>,r.dr,r.p,
        <Badge c={r.sc}>{r.s}</Badge>
      ])}/>
    </Card>
  </>;
}

function Inspection(){
  return <>
    <div style={{background:'linear-gradient(135deg,#162236,#111d2e)',border:'1px solid rgba(0,230,118,.3)',borderRadius:12,padding:16,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',right:16,top:16,width:56,height:56,border:`2.5px solid ${G.g}`,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:700,color:G.g,textAlign:'center',transform:'rotate(-12deg)'}}>CERT<br/>IFIED<br/>✓</div>
      <div style={{fontSize:10,color:G.g,fontWeight:700,letterSpacing:2,textTransform:'uppercase',fontFamily:'Consolas,monospace'}}>EcoLoop Yard Inspection Certificate</div>
      <div style={{fontSize:20,fontWeight:700,fontFamily:'Consolas,monospace',marginTop:4,color:G.t1}}>CERT-2024-0891</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,marginTop:12,fontSize:12}}>
        {[['Trip','T-0041'],['Date','08 Jun 2024, 11:32 AM'],['Vehicle','MH-04-CD-7890'],['Driver','DRV-002 Suresh Patil'],['From','Tata Steel, Gate 3 & 7'],['Weight','2,380 kg'],['Category','Solid Non-Hazardous'],['Moisture','11%']].map(([k,v])=>
          <div key={k}><span style={{color:G.t3}}>{k}: </span><strong style={{color:G.t1}}>{v}</strong></div>
        )}
      </div>
      <div style={{marginTop:11,padding:9,background:'rgba(0,230,118,.08)',borderRadius:8,fontSize:12.5}}><strong style={{color:G.g}}>✅ APPROVED — Route to Crusher CU-01</strong></div>
    </div>
    <Card title="📋 Inspection Ledger" noPad>
      <Tbl heads={['Cert No.','Trip','Date','From','Driver','Weight','Result']} rows={[
        ['CERT-0891','T-0041','08 Jun','Tata Steel','DRV-002','2,380 kg',<Badge c="g">Approved</Badge>],
        ['CERT-0890','T-0040','07 Jun','Reliance','DRV-001','3,200 kg',<Badge c="g">Approved</Badge>],
        ['CERT-0889','T-0039','07 Jun','Cipla','DRV-001','1,100 kg',<Badge c="a">Conditional</Badge>],
        ['CERT-0888','T-0038','06 Jun','ACC','DRV-002','1,800 kg',<Badge c="r">Rejected</Badge>],
      ]}/>
    </Card>
  </>;
}

function FuelMgmt(){
  return <>
    <div style={s.sg}>
      <StatCard color="c" label="Fuel This Month" val="₹5.82L" sub="2,890 litres"/>
      <StatCard color="g" label="Fleet Avg Mileage" val="4.1" sub="km/L"/>
      <StatCard color="a" label="Highest Consumer" val="MH-12" sub="6.8L/100km"/>
      <StatCard color="b" label="Fill-ups This Week" val="14" sub="8 vehicles"/>
    </div>
    <Card title="⛽ Recent Fill-ups" noPad>
      <Tbl heads={['ID','Vehicle','Driver','Litres','Amount','km/L','Date']} rows={[
        ['FL-1034','MH-12','DRV-001','120L','₹11,340',<span style={{color:G.g,fontFamily:'Consolas,monospace',fontWeight:700}}>4.0</span>,'08 Jun'],
        ['FL-1033','MH-04','DRV-002','95L','₹8,978',<span style={{color:G.g,fontFamily:'Consolas,monospace',fontWeight:700}}>4.2</span>,'07 Jun'],
        ['FL-1032','MH-14','DRV-003','110L','₹10,395',<span style={{color:G.a,fontFamily:'Consolas,monospace',fontWeight:700}}>3.5</span>,'06 Jun'],
        ['FL-1031','MH-09','DRV-004','80L','₹7,560',<span style={{color:G.g,fontFamily:'Consolas,monospace',fontWeight:700}}>4.5</span>,'05 Jun'],
      ]}/>
    </Card>
  </>;
}

function PM(){
  return <>
    <Alert type="r">🔴 MH-12-AB-3456 engine oil change overdue 3 days. Schedule immediately.</Alert>
    <div style={s.sg}>
      <StatCard color="g" label="Done This Month" val="18" sub=""/>
      <StatCard color="r" label="Overdue" val="1" sub="MH-12-AB-3456"/>
      <StatCard color="a" label="Due This Week" val="3" sub=""/>
      <StatCard color="b" label="PM Spend MTD" val="₹42,800" sub=""/>
    </div>
    <Card title="🔧 PM Schedule">
      {[{t:'Engine Oil Change',v:'MH-12-AB-3456',due:'06 Jun',s:'Overdue',sc:'r'},{t:'Air Filter',v:'MH-09-KL-8800',due:'12 Jun',s:'Due Soon',sc:'a'},{t:'Full PM Service A',v:'MH-04-CD-7890',due:'15 Jun',s:'Scheduled',sc:'b'},{t:'Brake Inspection',v:'MH-14-EF-1122',due:'20 Jun',s:'Scheduled',sc:'b'}].map(m=>
        <div key={m.t} style={{background:G.bg2,border:`1px solid rgba(255,255,255,.07)`,borderRadius:8,padding:11,display:'flex',gap:10,alignItems:'flex-start',marginBottom:8}}>
          <div style={{width:34,height:34,borderRadius:7,background:m.sc==='r'?'rgba(244,67,54,.1)':'rgba(33,150,243,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>🔧</div>
          <div style={{flex:1}}>
            <div style={{fontSize:12.5,fontWeight:600,color:G.t1}}>{m.t}</div>
            <div style={{fontSize:11,color:G.t3}}>{m.v} · Due: <strong style={{color:m.sc==='r'?G.r:m.sc==='a'?G.a:G.b}}>{m.due}</strong></div>
          </div>
          <Badge c={m.sc}>{m.s}</Badge>
        </div>
      )}
    </Card>
  </>;
}

const NAV = [
  {section:'Operations',items:[
    {id:'dashboard',label:'Dashboard',icon:'⬡'},
    {id:'register',label:'Generator Registry',icon:'🏭',badge:'24',bc:'g'},
    {id:'trips',label:'Trip & Lift Plans',icon:'📍',badge:'2',bc:'a'},
    {id:'collection',label:'Waste Collection',icon:'📦'},
  ]},
  {section:'Dustbin Management',items:[
    {id:'bins',label:'Bin Dashboard',icon:'🗑',badge:'3',bc:'r'},
    {id:'bins-a',label:'Type A — Empty at Site',icon:'🔄'},
    {id:'bins-b',label:'Type B — Full Bin Lift',icon:'🏗'},
    {id:'bins-c',label:'Type C — Loose Bag',icon:'🛍'},
    {id:'fill-alerts',label:'Fill Alerts',icon:'⚠️',badge:'3',bc:'r'},
  ]},
  {section:'Compliance',items:[
    {id:'inspection',label:'Yard Inspection',icon:'🔍',badge:'1',bc:'r'},
    {id:'crush',label:'Crushing Unit',icon:'⚙️'},
    {id:'boiler',label:'Boiler & Steam',icon:'🔥'},
    {id:'billing',label:'Billing & Receipts',icon:'🧾'},
  ]},
  {section:'Fleet Management',items:[
    {id:'vehicles',label:'Vehicle Registry',icon:'🚛'},
    {id:'drivers',label:'Driver Registry',icon:'👤',badge:'1',bc:'a'},
    {id:'clean',label:'Vehicle Cleaning',icon:'🧼',badge:'2',bc:'a'},
    {id:'pm',label:'Preventive Maint.',icon:'🔧',badge:'1',bc:'r'},
    {id:'rm',label:'Reactive Maint.',icon:'⚡'},
    {id:'schedule',label:'Maint. Schedule',icon:'📅'},
    {id:'tyres',label:'Tyre Management',icon:'⭕'},
    {id:'fuel',label:'Fuel Management',icon:'⛽'},
  ]},
];

const PAGE_TITLES = {
  dashboard:'Operations Dashboard',register:'Generator Registry',trips:'Trip & Lift Plans',
  collection:'Waste Collection',bins:'Bin Management Dashboard','bins-a':'Type A — Empty at Site',
  'bins-b':'Type B — Full Bin Lift','bins-c':'Type C — Loose Bag','fill-alerts':'Fill Alerts',
  inspection:'Yard Inspection',crush:'Crushing Unit',boiler:'Boiler & Steam',billing:'Billing & Receipts',
  vehicles:'Vehicle Registry',drivers:'Driver Registry',clean:'Vehicle Cleaning',
  pm:'Preventive Maintenance',rm:'Reactive Maintenance',schedule:'Maint. Schedule',
  tyres:'Tyre Management',fuel:'Fuel Management',
};

function Placeholder({page}){
  return <div style={{padding:40,textAlign:'center',color:G.t3}}>
    <div style={{fontSize:40,marginBottom:12}}>🚧</div>
    <div style={{fontSize:18,fontWeight:600,color:G.t1}}>{PAGE_TITLES[page]}</div>
    <div style={{marginTop:8}}>This module is ready — click another section to explore.</div>
  </div>;
}

export default function App(){
  const [page, setPage] = useState('dashboard');

  const pages = {
    dashboard:<Dashboard setPage={setPage}/>,
    bins:<BinDashboard/>,
    'bins-a':<BinTypePage type="A"/>,
    'bins-b':<BinTypePage type="B"/>,
    'bins-c':<BinTypePage type="C"/>,
    drivers:<Drivers/>,
    boiler:<Boiler/>,
    vehicles:<Vehicles/>,
    trips:<Trips/>,
    inspection:<Inspection/>,
    fuel:<FuelMgmt/>,
    pm:<PM/>,
  };

  return <div style={s.app}>
    {/* SIDEBAR */}
    <div style={s.sb}>
      <div style={s.logo}>
        <div style={{fontSize:20,marginBottom:3}}>♻️</div>
        <div style={{fontFamily:'Consolas,monospace',fontSize:13,fontWeight:600,color:G.g}}>EcoLoop Pro</div>
        <div style={{fontSize:9,color:G.t3,marginTop:1,textTransform:'uppercase',letterSpacing:.5}}>Waste-to-Energy ERP v3.0</div>
      </div>
      {NAV.map(sec=><div key={sec.section} style={{padding:'5px 0'}}>
        <div style={s.nh}>{sec.section}</div>
        {sec.items.map(item=><NavItem key={item.id} label={item.label} icon={item.icon} badge={item.badge} badgeColor={item.bc} active={page===item.id} onClick={()=>setPage(item.id)}/>)}
      </div>)}
      <div style={{marginTop:'auto',padding:'12px 16px',borderTop:`1px solid rgba(255,255,255,.07)`,fontSize:11,color:G.t4}}>
        <span style={{display:'inline-block',width:6,height:6,borderRadius:'50%',background:G.g,marginRight:4}}></span>System Operational · v3.0
      </div>
    </div>

    {/* MAIN */}
    <div style={s.main}>
      <div style={s.tb}>
        <div>
          <div style={{fontSize:15,fontWeight:600,color:G.t1}}>{PAGE_TITLES[page]||page}</div>
          <div style={{fontSize:11,color:G.t3,marginTop:1}}>EcoLoop Waste-to-Energy ERP · Live</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{fontSize:11,color:G.t3,padding:'3px 10px',background:G.bg3,borderRadius:20}}>🟢 All Systems Online</div>
          <button style={{padding:'6px 14px',borderRadius:7,border:'none',background:G.g,color:'#000',fontWeight:700,cursor:'pointer',fontSize:12}}>+ New Trip</button>
        </div>
      </div>
      <div style={s.ct}>
        {pages[page] || <Placeholder page={page}/>}
      </div>
    </div>
  </div>;
}
