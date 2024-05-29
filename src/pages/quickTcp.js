// qucikTcp.js
import React from 'react';

const QucikTcp = ({ selectedIp, ipFiles }) => {
  // Function to remove lines starting with "adjust_timeout"
  const removeAdjustTimeoutLines = (content) => {
    return content
      .split('\n')
      .filter(line => !line.trim().startsWith('adjust_timeout'))
      .join('\n');
  };

  return (
    <div style={{ margin: '20px', padding: '20px', backgroundColor: 'white', color: "black", border: '2px solid #ccc', borderRadius: '5px', overflow: 'auto', width: "1050px", height: "300px" }}>
      {selectedIp && ipFiles[selectedIp]?.filter(scan => scan.fileName === 'scans/_quick_tcp_nmap.txt').map((scan, index) => (
        <div key={index}>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{removeAdjustTimeoutLines(scan.content)}</pre>
        </div>
      ))}
    </div>
  );
};

export default QucikTcp;