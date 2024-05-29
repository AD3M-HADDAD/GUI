import React, { useState, useEffect } from "react";
import "../App.css";
import { Doughnut, Pie } from "react-chartjs-2";
import 'chart.js/auto';
import ManualCommands from './ManualCommands';
import Commands from './Commands';
import CVE from './CVE';
import Error from "./error";
import QucikTcp from "./quickTcp";
import FullTcp from "./fullTcp";
import axios from "axios";

const Dashboard = () => {
 const [ips, setIps] = useState([]);
 const [selectedIp, setSelectedIp] = useState("");
 const [portPercentage, setPortPercentage] = useState({ open: 0, filtered: 0 });
 const [serviceData, setServiceData] = useState([]);
 const [serviceLabels, setServiceLabels] = useState([]);
 const [dropdownVisible, setDropdownVisible] = useState(false);
 const [chartKey, setChartKey] = useState(0);
 const [startingTime, setStartingTime] = useState("");
 const [showPopup, setShowPopup] = useState(false);
 const [nmapQuickScanContent, setNmapQuickScanContent] = useState("");
 const [nmapFullScanContent, setNmapFullScanContent] = useState("");
 const [formattedServices, setFormattedServices] = useState("");
 const [scans, setScans] = useState([]);
 const [ipFiles, setIpFiles] = useState({});
 const [activeAccordion, setActiveAccordion] = useState(false);
 const [servicePorts, setServicePorts] = useState({});

 const toggleAccordion = () => {
   setActiveAccordion(!activeAccordion);
 };
 const [latestIp, setLatestIp] = useState("");

  useEffect(() => {
    // Fetch the latest submitted IP from the backend
    axios.get("http://localhost:3002/api/latestIp")
      .then(response => {
        const latestIp = response.data.ip;
        setLatestIp(latestIp);
      })
      .catch(error => {
        console.error("Error fetching latest IP:", error);
      });
  }, []);

 useEffect(() => {
   fetch('http://localhost:3001/api/scans')
     .then(response => response.json())
     .then(data => {
       const allIps = data.map(entry => entry.ip);
       const uniqueIps = [...new Set(allIps)];
       setIps(uniqueIps);
       setScans(data);
       const ipFilesMap = data.reduce((acc, scan) => {
         if (!acc[scan.ip]) {
           acc[scan.ip] = [];
         }
         acc[scan.ip].push(scan);
         return acc;
       }, {});
       setIpFiles(ipFilesMap);
     })
     .catch(error => console.error('Error fetching data:', error));
 }, []);

 useEffect(() => {
   fetchServices();
 }, [selectedIp]);

 const deduplicatePorts = (quickTcpPorts, fullTcpPorts) => {
   const portMap = new Map();
   quickTcpPorts.concat(fullTcpPorts).forEach(port => {
     const key = `${port.port}/${port.state}`;
     if (!portMap.has(key)) {
       portMap.set(key, port);
     }
   });
   return Array.from(portMap.values());
 };

 const calculatePortPercentage = (ports) => {
   if (!ports.length) {
     return { open: 0, filtered: 0 };
   }

   const openPortsCount = ports.filter(port => port.state === 'open').length;
   const filteredPortsCount = ports.filter(port => port.state === 'filtered').length;
   const totalPorts = ports.length;

   const openPercentage = (openPortsCount / totalPorts) * 100;
   const filteredPercentage = (filteredPortsCount / totalPorts) * 100;

   return { open: openPercentage, filtered: filteredPercentage };
 };

 const fetchServices = () => {
   if (selectedIp) {
     fetch(`http://localhost:3001/api/scans/${selectedIp}`)
       .then(response => response.json())
       .then(data => {
         const { startingTimeQuick, quickTcp, fullTcp } = data;
         setStartingTime(startingTimeQuick);

         const quickTcpPorts = quickTcp[0]?.ports || [];
         const fullTcpPorts = fullTcp[0]?.ports || [];

         const deduplicatedPorts = deduplicatePorts(quickTcpPorts, fullTcpPorts);

         const services = deduplicatedPorts.reduce((serviceCounts, port) => {
           const service = port.service;
           serviceCounts[service] = (serviceCounts[service] || 0) + 1;
           return serviceCounts;
         }, {});

         const portsByService = deduplicatedPorts.reduce((acc, port) => {
           const service = port.service;
           if (!acc[service]) {
             acc[service] = [];
           }
           acc[service].push(port.port);
           return acc;
         }, {});

         const serviceLabels = Object.keys(services);
         const serviceData = serviceLabels.map(service => services[service]);

         const formattedServices = serviceLabels.map((service, index) => `${service}(${serviceData[index]})`).join(', ');

         setServiceData(serviceData);
         setServiceLabels(serviceLabels);
         setFormattedServices(formattedServices);
         setServicePorts(portsByService);

         const percentage = calculatePortPercentage(deduplicatedPorts);
         setPortPercentage(percentage);
       })
       .catch(error => console.error('Error fetching service data:', error));
   }
 };

 const handleIpChange = (ip) => {
   setSelectedIp(ip);
   setDropdownVisible(false);
   setChartKey(prevKey => prevKey + 1);
 };

 const toggleDropdown = () => {
   setDropdownVisible(!dropdownVisible);
 };

 const togglePopup = () => {
   setShowPopup(!showPopup);
   if (selectedIp) {
     fetch(`http://localhost:3001/api/scans/${selectedIp}/_quick_tcp_nmap.txt`)
       .then(response => response.text())
       .then(data => {
         setNmapQuickScanContent(data);
       })
       .catch(error => console.error('Error fetching quick Nmap scan content:', error));

     fetch(`http://localhost:3001/api/scans/${selectedIp}/full_tcp_nmap.txt`)
       .then(response => response.text())
       .then(data => {
         setNmapFullScanContent(data);
       })
       .catch(error => console.error('Error fetching full Nmap scan content:', error));
   }
 };

 return (
   <div className="dashboard">
    
     <div className="wrapper">
      
     <div className="ip" style={{width:"50%",height:"70px"}}> 
     <div className="row">
     <div className="col-xs-12 col-sm-3" style={{position:"relative" ,textAlign:"start", fontSize:"15px"}}><b>HISTORY</b></div>
     
     <div className="dropdown col-xs-12 col-sm-8" style={{position:"relative" ,textAlign:"center"}}>
        <select onChange={(e) => handleIpChange(e.target.value)} value={selectedIp}>
        <option value="" disabled>Select IP</option>
        {ips.map((ip, index) => (
        <option key={index} value={ip}>{ip}</option>
        ))}
        </select>
      </div>
      </div>
 </div>
       <div className="time" style={{width:"400px",height:"400px"}}><b>SCAN INFORMATION</b>
         <div>
           <br></br>
           
           <h4 style={{ color: '#b76800' ,fontSize:"15px" }}>Starting Time : </h4>
           <h4 style={{fontSize:"15px" }}>{startingTime}4</h4>
           <h3 style={{fontSize:"15px" }}>_____________________________________________</h3> 
           <h4 style={{ color: '#b76800' , fontSize:"15px"}}>Scan type : </h4>
           <h4 style={{fontSize:"15px" }}>connect</h4>
           <h3 style={{fontSize:"15px" }}>_____________________________________________</h3> 
           <h4 style={{ color: '#b76800' ,fontSize:"15px" }}>Scan protocol : </h4>
           <h4 style={{fontSize:"15px" }}>tcp</h4>
           <h3 style={{fontSize:"15px" }}>_____________________________________________</h3> 
           <h4 style={{ color: '#b76800' , fontSize:"15px"}}>Nmap commands :</h4>
           <div className="btn-group" style={{fontSize:"15px"}}>
             <button className="button" onClick={togglePopup}>More Details</button>
           </div>
           {showPopup && (
             <div className="overlay" style={{border: '2px solid black', borderRadius: '5px', overflow: 'auto'}}>
               <div className="popup">
                 <h2>Quick TCP Nmap Scan</h2>
                 <button className="close" onClick={togglePopup}>X</button>
                 <div className="content">
                   <QucikTcp selectedIp={selectedIp} ipFiles={ipFiles} />
                 </div>
                 <h2>Full TCP Nmap Scan</h2>
                 <button className="close" onClick={togglePopup}>X</button>
                 <div className="content">
                   <FullTcp selectedIp={selectedIp} ipFiles={ipFiles} />
                 </div>
               </div>
             </div>
           )}
         </div>
       </div>
       <div className="ports" style={{width:"400px",height:"400px"}}><b>PORTS</b> <br />

 {selectedIp && (
 <div>
 <br></br>
 <div style={{width:"440px", height:"440px" ,display:"flex", justifyContent:"center",alignItems:"center"}}>
 <Pie
 key={`pie-${chartKey}`}
 data={{
    labels: ["open", "filtered", "closed"],
 datasets: [
 {
    label: "percentage",
    data: [portPercentage.open, portPercentage.filtered, portPercentage.closed],
    backgroundColor: [
    "rgba(43, 63, 229, 0.8)",
    "rgba(250, 192, 19, 0.8)",
    "#ba2545",
    ],
    borderColor: [
    "rgba(43, 63, 229, 0.8)",
    "rgba(250, 192, 19, 0.8)",
    "#ba2545",
    ],
},
],
}}
 options={{
 plugins: {
 legend: {
 position: 'bottom',
 },
 },
 layout: {
 padding: {
 right: 118,
 left: 30,
 top: 0,
 bottom: 180,
 },
 },
 }}
 />
 </div>
 </div>
 )}
 </div>
 <div className="ServicesChart" style={{width:"715px",height:"400px"}}><b>SERVICES</b>
 <div style={{width:"600px", height:"600px"}}>
 <Doughnut
 key={`doughnut-${chartKey}`}
 data={{
 labels: serviceLabels,
 datasets: [
 {
 data: serviceData,
 label: "Ports",
 backgroundColor: [
 "#ff006e",
 "#3a86ff",
 "#7678ed",
 "#2ec4b6",
 "#ce4257",
 "#f7b801",
 "#eaac8b",
 "#e01e37",
 "#a5ffd6",
 "#4ba3c3",
 "#880d1e",
 "#a2d2ff",
 "#ffd6ff",
 "#c8b6ff",
 "#f1faee",
 "#6a994e",
 ],
 borderColor: [
 "#ff006e",
 "#3a86ff",
 "#7678ed",
 "#2ec4b6",
 "#ce4257",
 "#f7b801",
 "#eaac8b",
 "#e01e37",
 "#a5ffd6",
 "#4ba3c3",
 "#880d1e",
 "#a2d2ff",
 "#ffd6ff",
 "#c8b6ff",
 "#f1faee",
 "#6a994e",
 ],
 },
 ],
 }}
 options={{
 plugins: {
 legend: {
 position: 'left',
 },
 },
 layout: {
 padding: {
 right: 0, // Add padding to the right side of the chart area
 left: 10,
 top: 7,
 bottom: 300, // Lift up the chart slightly
 },
 },
 aspectRatio: 1, // Maintain aspect ratio
 }}
 />
 </div>
 </div>
       <div className="commands"><b>COMMANDS</b><br></br>
         <Commands selectedIp={selectedIp} ipFiles={ipFiles} />
       </div>
       <div className="manual"><b>MANUAL COMMANDS</b><br></br>
         <ManualCommands selectedIp={selectedIp} ipFiles={ipFiles} />
       </div>
       <div className="cve" style={{width:"400px",height:"400px"}}><b>CVE</b>
         <CVE selectedIp={selectedIp} ipFiles={ipFiles} />
       </div>
       <div className="ServiceName">
         <h3 style={{ color: 'orange' , fontSize:"18px"  }}><b>OVERVIEW :</b></h3>
         <br></br>
         <div>
           {formattedServices.split(',').map((service, index) => {
             const serviceName = service.split('(')[0].trim();
             const ports = servicePorts[serviceName] || [];
             return (
               <div key={index}>
                 <button className="accordion" onClick={() => togglePanel(index)}>
                   {service.trim()}
                 </button>
                 <div className="panel" id={`panel-${index}`}>
                   <br /><br />Ports: {ports.join(' , ')}<br /><br />{/* Add any content you want to display in the panel */}
                 </div>
               </div>
             );
           })}
         </div>
       </div>
       <div className="error" style={{width:"715px",height:"400px"}}><b>ERRORS</b>
         <Error selectedIp={selectedIp} ipFiles={ipFiles} />
       </div>
     </div>
   </div>
 );
};

export default Dashboard;

function togglePanel(index) {
 const panel = document.getElementById(`panel-${index}`);
 panel.classList.toggle('active');
 const isActive = panel.classList.contains('active');
 if (isActive) {
   panel.style.maxHeight = panel.scrollHeight + 'px';
 } else {
   panel.style.maxHeight = null;
 }
}

	
