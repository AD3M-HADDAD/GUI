// CVE.js
import React from 'react';

const CVE = ({ selectedIp, ipFiles }) => {
  return (
    <div className="dataCard manualCard" style={{ margin: '20px', padding: '20px', backgroundColor: 'rgba(173, 235, 167,0.5)', color: "black", border: '2px solid #ccc', borderRadius: '5px', overflow: 'auto' ,width:"90%", height:"80%"}}>
      {selectedIp && ipFiles[selectedIp]?.filter(scan => scan.fileName === 'scans/_patterns.log').map((scan, index) => (
        <div key={index}>
          {scan.content.trim() === '' ? 'Empty' : <pre style={{ whiteSpace: 'pre-wrap' }}>{scan.content}</pre>}
        </div>
      ))}
      {selectedIp && !ipFiles[selectedIp]?.some(scan => scan.fileName === 'scans/_patterns.log') && <div>Empty</div>}
    </div>
  );
};

export default CVE;

