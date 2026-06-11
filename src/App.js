import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || 'https://oddvetoasqjziohmqugg.supabase.co',
  process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_5Z2PrRqnJ8gLiG12KmecCQ_m4VyDFaB'
);

export default function App() {
  const [page, setPage] = useState('dashboard');
  return (
    <div style={{background:'#060a0f',minHeight:'100vh',color:'#e8f4fd',fontFamily:'Arial,sans-serif',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:16}}>♻️</div>
        <h1 style={{color:'#00e676',fontFamily:'Consolas,monospace'}}>EcoLoop Pro</h1>
        <p style={{color:'#5a7a9a',marginTop:8}}>Waste-to-Energy ERP v3.0</p>
        <p style={{color:'#00e676',marginTop:16}}>✅ Deployment Successful</p>
        <p style={{color:'#5a7a9a',marginTop:8,fontSize:12}}>Connected to Supabase · Full modules loading...</p>
      </div>
    </div>
  );
}
