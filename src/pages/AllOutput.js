import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AllOutput.css"; // Import CSS file for styling

const AllOutput = () => {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3002/api/allData")
      .then((response) => response.json())
      .then((data) => {
        setScans(data);
      })
      .catch((err) => console.error("Error fetching scans:", err));
  }, []);

  const getOpenPorts = (ipAddress) => {
    const openPorts = {
      tcp: [],
      udp: [],
    };

    scans.forEach((scan) => {
      const ip = Object.keys(scan)[0];
      if (ip === ipAddress) {
        const portData = scan[ip][3]?.scans; // Use optional chaining (?.) to safely access scans array
        if (portData && Array.isArray(portData)) {
          const filteredPortInfo = portData.filter((port) => {
            const portNumber = Object.keys(port)[0];
            const portInfo = port[portNumber];
            return (
              portInfo &&
              typeof portInfo === "object" &&
              portInfo[0]?.filename && // Use optional chaining (?.) to safely access filename
              portInfo[0].filename.endsWith(".txt")
            );
          });
          filteredPortInfo.forEach((port) => {
            const portNumber = Object.keys(port)[0];
            const portInfo = port[portNumber];

            let filename = null;
            let content = null;
            let portInfoData = []; // Declare a variable to store PortInfo

            if (portInfo && Array.isArray(portInfo)) {
              portInfo.forEach((info) => {
                if (info.filename && info.filename.endsWith(".txt")) {
                  filename = info.filename;
                  content = info.content;
                  portInfoData.push(info); // Collect PortInfo data
                }
              });
            }

            const portInfoString = JSON.stringify(portInfoData); // Convert PortInfo array to JSON string
            console.log(portInfoString);
            if (portNumber.startsWith("tcp")) {
              openPorts.tcp.push({
                port: portNumber,
                ip: ip,
                filename,
                content,
                portInfo: portInfoString, // Add PortInfo as a JSON string
              });
            } else if (portNumber.startsWith("udp")) {
              openPorts.udp.push({
                port: portNumber,
                ip: ip,
                filename,
                content,
                portInfo: portInfoString, // Add PortInfo as a JSON string
              });
            }
          });
        }
      }
    });

    return openPorts;
  };

  return (
    <div className="allOutput">
      <h1 className="header">All Output Tool</h1>
      <section className="outputSection">
        {scans.map((scan, index) => {
          const ipAddress = Object.keys(scan)[0];
          const { tcp, udp } = getOpenPorts(ipAddress);
          return (
            <div className="entry" key={index}>
              <div className="entryHeader">
                <h3 style={{color:"#a16300" ,fontSize:"20px" }}>{ipAddress}</h3>
              </div>
              <div className="entryContent">
                <div className="portSection">
                  <p>TCP PORTS : <br></br><br></br></p>
                  {tcp.map((port, idx) => {
                    const portParams = new URLSearchParams({
                      port: port.port,
                      ip: port.ip,
                      filename: port.filename,
                      content: port.content,
                      portInfo: port.portInfo, // Add portInfo to URL parameters
                    }).toString();

                    return (
                      <Link
                        key={idx}
                        to={`/port/${port.port}?${portParams}`}
                        className="portBadge"
                      >
                        {port.port}
                      </Link>
                    );
                  })}
                </div>
                {udp.length > 0 && (
                  <div className="portSection">
                    <h4>UDP Ports:</h4>
                    {udp.map((port, idx) => {
                      const portParams = new URLSearchParams({
                        port: port.port,
                        ip: port.ip,
                        filename: port.filename,
                        content: port.content,
                        portInfo: port.portInfo, // Add portInfo to URL parameters
                      }).toString();

                      return (
                        <Link
                          key={idx}
                          to={`/port/${port.port}?${portParams}`}
                          className="portBadge"
                        >
                          {port.port}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default AllOutput;
