// src/data/CMconstellationSVG.tsx
import React from 'react';

// 星座のslug（ID）をキーにして、SVGのパスデータを管理するオブジェクト
// viewBoxは "0 0 100 100" を想定して描画（0〜100のパーセンテージ感覚で配置できます）
export const ConstellationSVGs: Record<string, React.ReactNode> = {
"And": (
  <>
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">
  <circle cx="15" cy="15" r="0.4" fill="currentColor" opacity="0.3"/><circle cx="80" cy="80" r="0.3" fill="currentColor" opacity="0.4"/><circle cx="85" cy="20" r="0.5" fill="currentColor" opacity="0.3"/>
  <ellipse cx="70" cy="35" rx="4" ry="1.5" fill="currentColor" opacity="0.4" transform="rotate(-45 70 35)"/>
  <ellipse cx="70" cy="35" rx="2" ry="0.8" fill="currentColor" opacity="0.7" transform="rotate(-45 70 35)"/>
  <polyline points="20,70 45,50 65,30 85,20" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.8" />
  <polyline points="45,50 30,30 25,15" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.8" />
  <line x1="65" y1="30" x2="60" y2="15" stroke="currentColor" strokeWidth="0.6" opacity="0.8" />
  <polyline points="25,15 10,5" stroke="currentColor" strokeWidth="0.3" fill="none" opacity="0.5" strokeDasharray="1 1.5" />
  <polyline points="85,20 95,10" stroke="currentColor" strokeWidth="0.3" fill="none" opacity="0.5" strokeDasharray="1 1.5" />
  <circle cx="20" cy="70" r="1.4" fill="currentColor" /> <circle cx="45" cy="50" r="1.2" fill="currentColor" /> <circle cx="65" cy="30" r="1.2" fill="currentColor" /> <circle cx="85" cy="20" r="0.8" fill="currentColor" />
  <circle cx="30" cy="30" r="0.9" fill="currentColor" />
  <circle cx="25" cy="15" r="0.8" fill="currentColor" />
  <circle cx="60" cy="15" r="0.8" fill="currentColor" />
</svg>
  </>
),
"Mon": (
  <>
  
  </>
),
"Sgr": (
  <>
  
  </>
),
"Del": (
  <>
  
  </>
),
"Ind": (
  <>
  
  </>
),
"Psc": (
  <>
  
  </>
),
"Lep": (
  <>
  
  </>
),
"Boo": (
  <>
  
  </>
),
"Hya": (
  <>
  
  </>
),
"Eri": (
  <>
  
  </>
),
"Tau": (
  <>
  
  </>
),
"CMa": (
  <>
  
  </>
),
"Lup": (
  <>
  
  </>
),
"UMa": (
  <>
  
  </>
),
"Vir": (
  <>
  
  </>
),
"Ari": (
  <>
  
  </>
),
  "Ori": (
    <>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">
        <circle cx="10" cy="20" r="0.3" fill="currentColor" opacity="0.3" />
        <circle cx="80" cy="15" r="0.4" fill="currentColor" opacity="0.4" />
        <circle cx="25" cy="85" r="0.3" fill="currentColor" opacity="0.3" />
        <circle cx="85" cy="90" r="0.5" fill="currentColor" opacity="0.4" />
        <circle cx="5" cy="50" r="0.4" fill="currentColor" opacity="0.2" />
        <circle cx="90" cy="45" r="0.3" fill="currentColor" opacity="0.3" />
        <circle cx="50" cy="5" r="0.4" fill="currentColor" opacity="0.4" />
        <circle cx="15" cy="70" r="0.3" fill="currentColor" opacity="0.2" />

        <line x1="50" y1="20" x2="35" y2="30" stroke="currentColor" strokeWidth="0.6" opacity="0.7" />
        <line x1="50" y1="20" x2="65" y2="26" stroke="currentColor" strokeWidth="0.6" opacity="0.7" />
        <line x1="35" y1="30" x2="42" y2="50" stroke="currentColor" strokeWidth="0.6" opacity="0.7" />
        <line x1="65" y1="26" x2="58" y2="46" stroke="currentColor" strokeWidth="0.6" opacity="0.7" />
        <polyline points="42,50 50,48 58,46" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.8" /> <line x1="42" y1="50" x2="40" y2="80" stroke="currentColor" strokeWidth="0.6" opacity="0.7" />
        <line x1="58" y1="46" x2="70" y2="75" stroke="currentColor" strokeWidth="0.6" opacity="0.7" />

        <polyline points="35,30 20,25 18,35 15,45 17,55 22,65" stroke="currentColor" strokeWidth="0.3" fill="none" opacity="0.4" strokeDasharray="1 1.5" />
        <polyline points="65,26 75,15 85,10 90,12" stroke="currentColor" strokeWidth="0.3" fill="none" opacity="0.4" strokeDasharray="1 1.5" />
        <line x1="50" y1="48" x2="48" y2="60" stroke="currentColor" strokeWidth="0.4" opacity="0.5" />

        <circle cx="50" cy="20" r="1.2" fill="currentColor" /> <circle cx="35" cy="30" r="1.8" fill="currentColor" /> <circle cx="65" cy="26" r="1.4" fill="currentColor" /> <circle cx="42" cy="50" r="1.2" fill="currentColor" /> <circle cx="50" cy="48" r="1.2" fill="currentColor" /> <circle cx="58" cy="46" r="1.2" fill="currentColor" /> <circle cx="40" cy="80" r="1.4" fill="currentColor" /> <circle cx="70" cy="75" r="1.8" fill="currentColor" /> <circle cx="49" cy="54" r="0.8" fill="currentColor" opacity="0.8" />
        <circle cx="48" cy="60" r="1" fill="currentColor" opacity="0.9" /> <circle cx="20" cy="25" r="0.7" fill="currentColor" opacity="0.6" />
        <circle cx="18" cy="35" r="0.7" fill="currentColor" opacity="0.6" />
        <circle cx="15" cy="45" r="0.7" fill="currentColor" opacity="0.6" />
        <circle cx="17" cy="55" r="0.7" fill="currentColor" opacity="0.6" />
        <circle cx="22" cy="65" r="0.7" fill="currentColor" opacity="0.6" />

        <circle cx="75" cy="15" r="0.7" fill="currentColor" opacity="0.6" />
        <circle cx="85" cy="10" r="0.7" fill="currentColor" opacity="0.6" />
        <circle cx="90" cy="12" r="0.7" fill="currentColor" opacity="0.6" />

      </svg>
    </>
    ),
    "Pic": (
  <>
  
  </>
),
"Cas": (
  <>
  
  </>
),
"Dor": (
  <>
  
  </>
),
"Cnc": (
  <>
  
  </>
),
"Com": (
  <>
  
  </>
),
"Cha": (
  <>
  
  </>
),
"Crv": (
  <>
  
  </>
),
"CrB": (
  <>
  
  </>
),
"Tuc": (
  <>
  
  </>
),
"Aur": (
  <>
  
  </>
),
"Cam": (
  <>
  
  </>
),
"Pav": (
  <>
  
  </>
),
"Cet": (
  <>
  
  </>
),
"Cep": (
  <>
  
  </>
),
"Cen": (
  <>
  
  </>
),
"Mic": (
  <>
  
  </>
),
"CMi": (
  <>
  
  </>
),
"Equ": (
  <>
  
  </>
),
"Vul": (
  <>
  
  </>
),
"UMi": (
  <>
  
  </>
),
"LMi": (
  <>
  
  </>
),
"Crt": (
  <>
  
  </>
),
"Lyr": (
  <>
  
  </>
),
"Cir": (
  <>
  
  </>
),
"Ara": (
  <>
  
  </>
),
"Sco": (
  <>
  
  </>
),
"Tri": (
  <>
  
  </>
),
"Leo": (
  <>
  
  </>
),
"Nor": (
  <>
  
  </>
),
"Sct": (
  <>
  
  </>
),
"Cae": (
  <>
  
  </>
),
"Scl": (
  <>
  
  </>
),
"Gru": (
  <>
  
  </>
),
"Men": (
  <>
  
  </>
),
"Lib": (
  <>
  
  </>
),
"Lac": (
  <>
  
  </>
),
"Hor": (
  <>
  
  </>
),
"Vol": (
  <>
  
  </>
),
"Pup": (
  <>
  
  </>
),
"Mus": (
  <>
  
  </>
),
"Cyg": (
  <>
  
  </>
),
"Oct": (
  <>
  
  </>
),
"Col": (
  <>
  
  </>
),
"Aps": (
  <>
  
  </>
),
"Gem": (
  <>
  
  </>
),
"Peg": (
  <>
  
  </>
),
"Oph": (
  <>
  
  </>
),
"Ser": (
  <>
  
  </>
),
"Her": (
  <>
  
  </>
),
"Per": (
  <>
  
  </>
),
"Tel": (
  <>
  
  </>
),
"Phe": (
  <>
  
  </>
),
"Ant": (
  <>
  
  </>
),
"Vel": (
  <>
  
  </>
),
"Aqr": (
  <>
  
  </>
),
"Hyi": (
  <>
  
  </>
),
"PsA": (
  <>
  
  </>
),
"CrA": (
  <>
  
  </>
),
"TrA": (
  <>
  
  </>
),
"Cru": (
  <>
  
  </>
),
"Cap": (
  <>
  
  </>
),
"Lyn": (
  <>
  
  </>
),
"Sge": (
  <>
  
  </>
),
"Pyx": (
  <>
  
  </>
),
"Car": (
  <>
  
  </>
),
"Dra": (
  <>
  
  </>
),
"CVn": (
  <>
  
  </>
),
"Ret": (
  <>
  
  </>
),
"Sex": (
  <>
  
  </>
),
"For": (
  <>
  
  </>
),
"Aql": (
  <>
  
  </>
)
};