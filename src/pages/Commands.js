// Commands.js
import React from 'react';

const Commands = ({ selectedIp, ipFiles }) => {
  return (
    <div className="dataCard manualCard" style={{ margin: '20px', padding: '20px', backgroundColor: 'rgba(173, 235, 167,0.5)', color: "black", border: '2px solid #ccc', borderRadius: '5px', overflow: 'auto' ,width:"95%"}}>
      {selectedIp && ipFiles[selectedIp]?.filter(scan => scan.fileName === 'scans/_commands.log').map((scan, index) => (
        <div key={index}>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{scan.content}</pre>
        </div>
      ))}
    </div>
  );
};

export default Commands;

