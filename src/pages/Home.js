// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./Home.css";
// import io from "socket.io-client";

// const Home = () => {
//   const [ipAddress, setIpAddress] = useState("");
//   const [isValidIp, setIsValidIp] = useState(false);
//   const [action, setAction] = useState("");
//   const [socket, setSocket] = useState(null);
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setIpAddress(value);
//     const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
//     setIsValidIp(ipRegex.test(value));
//   };

//   const handleScanSubmit = async (e) => {
//     e.preventDefault();

//     if (!isValidIp) {
//       alert("Please enter a valid IP address!");
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:3002/api/startScan", {
//         ipAddress,
//       });

//       const { commands } = response.data;
//       console.log("Commands to execute:", commands);

//       // Save IP address in local storage
//       localStorage.setItem("latestIpAddress", ipAddress);

//       // Navigate to the dashboard
//       navigate("/dashboard");

//       // Handle commands in your UI as needed
//       if (commands && commands.length > 0) {
//         await processCommands(commands);
//       } else {
//         alert("No commands to execute.");
//       }
//     } catch (error) {
//       console.error("Error starting scan:", error);
//       alert("Failed to start scan. Please try again.");
//     }
//   };

//   const processCommands = async (commands) => {
//     for (const command of commands) {
//       const userChoice = prompt(
//         `Command to execute:\n${command}\nType "EXECUTE" to execute, or "SKIP" to skip.`
//       );

//       if (!userChoice || userChoice.toUpperCase() === "SKIP") {
//         console.log("Command skipped.");
//       } else if (userChoice.toUpperCase() === "EXECUTE") {
//         await executeCommand(command);
//       } else {
//         console.log("Invalid choice. Command skipped.");
//       }
//     }
//   };

//   const executeCommand = async (command) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:3002/api/executeCommand",
//         {
//           command,
//         }
//       );

//       const { nextCommand, output } = response.data;
//       console.log("Command executed successfully. Next command:", nextCommand);
//       console.log("Command output:", output);
//     } catch (error) {
//       console.error("Error executing command:", error);
//       alert("Failed to execute command. Please try again.");
//     }
//   };

//   const stripAnsiCodes = (text) => {
//     return text.replace(
//       /[\u001b\u009b][[()#;?]*(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\/#&.:=?%@~_]+)*)?\u0007|(?:\d{1,4}(?:;\d{0,4})*)?[a-zA-Z\d])/g,
//       ""
//     );
//   };

//   useEffect(() => {
//     const socket = io("http://localhost:3002");
//     setSocket(socket);
//     socket.on("connect", () => {
//       console.log("Socket connected");
//     });
//     socket.on("confirmationNeeded", (data) => {
//       console.log("Confirmation needed:", data);
//       const cleanData = stripAnsiCodes(data);
//       console.log("Cleaned data:", cleanData);

//       // Adjusted regex to be more flexible with whitespace
//       const regex =
//         /ReconEnhance wants to execute the following command:\s*([\s\S]*?)\s*Type\s*".*?"/;
//       const match = cleanData.match(regex);
//       console.log("Regex match result:", match);

//       if (match && match[1]) {
//         console.log("Extracted command:", match[1]);
//         setAction(match[1].trim());
//       } else {
//         console.log("No command extracted");
//       }
//     });
//   }, []);

//   const handleAction = (a) => {
//     socket.emit("userInput", a);
//   };

//   return (
//     <div className="row">
//       <div className="col-xs-12 col-sm-6" style={{ background: "#3b5a5e" }}>
//         <img src="/defensy.png" className="imgcenter"></img>
//       </div>
//       <div className="col-xs-12 col-sm-6">
//         <div className="dashboard-container">
//           <div className="input-container">
//             <form onSubmit={handleScanSubmit}>
//               <label className="input-label">Enter IP Address:</label>
//               <input
//                 type="text"
//                 value={ipAddress}
//                 onChange={handleInputChange}
//                 placeholder="Enter IP address..."
//                 className="input-field"
//               />
//               <button
//                 type="submit"
//                 className="submit-button"
//                 style={{
//                   backgroundColor: isValidIp ? "#4caf50" : "#f44336",
//                   cursor: isValidIp ? "pointer" : "not-allowed",
//                 }}
//                 disabled={!isValidIp}
//               >
//                 Start Scan
//               </button>
//             </form>
//           </div>
//           {action && (
//             <div className="confirmation-container">
//               <div className="confirmation-message">
//                 Command to execute: <code className="command-text">{action}</code>
//               </div>
//               <div className="confirmation-buttons">
//                 <button
//                   className="confirm-button accept"
//                   onClick={() => handleAction("EXECUTE")}
//                 >
//                   Accept
//                 </button>
//                 <button
//                   className="confirm-button refuse"
//                   onClick={() => handleAction("SKIP")}
//                 >
//                   Refuse
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

	












// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./Home.css";
// import io from "socket.io-client";

// const Home = () => {
//   const [ipAddress, setIpAddress] = useState("");
//   const [isValidIp, setIsValidIp] = useState(false);
//   const [action, setAction] = useState("");
//   const [socket, setSocket] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const socket = io("http://localhost:3002");
//     setSocket(socket);

//     socket.on("connect", () => {
//       console.log("Socket connected");
//     });

//     socket.on("confirmationNeeded", (data) => {
//       console.log("Confirmation needed:", data);
//       const cleanData = stripAnsiCodes(data);
//       console.log("Cleaned data:", cleanData);

//       const regex = /ReconEnhance wants to execute the following command:\s*([\s\S]*?)\s*Type\s*".*?"/;
//       const match = cleanData.match(regex);
//       console.log("Regex match result:", match);

//       if (match && match[1]) {
//         console.log("Extracted command:", match[1]);
//         setAction(match[1].trim());
//       } else {
//         console.log("No command extracted");
//       }
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const stripAnsiCodes = (text) => {
//     return text.replace(
//       /[\u001b\u009b][[()#;?]*(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\/#&.:=?%@~_]+)*)?\u0007|(?:\d{1,4}(?:;\d{0,4})*)?[a-zA-Z\d])/g,
//       ""
//     );
//   };

//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setIpAddress(value);
//     const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
//     setIsValidIp(ipRegex.test(value));
//   };

//   const handleScanSubmit = async (e) => {
//     e.preventDefault();

//     if (!isValidIp) {
//       alert("Please enter a valid IP address!");
//       return;
//     }

//     // Clear the previous action
//     setAction("");

//     try {
//       const response = await axios.post("http://localhost:3002/api/startScan", {
//         ipAddress,
//       });

//       const { commands } = response.data;
//       console.log("Commands to execute:", commands);

//       // Save IP address in local storage
//       localStorage.setItem("latestIpAddress", ipAddress);

//       // Navigate to the dashboard
//       navigate("/dashboard");

//       // Handle commands in your UI as needed
//       if (commands && commands.length > 0) {
//         await processCommands(commands);
//       } else {
//         alert("No commands to execute.");
//       }
//     } catch (error) {
//       console.error("Error starting scan:", error);
//       alert("Failed to start scan. Please try again.");
//     }
//   };

//   const processCommands = async (commands) => {
//     for (const command of commands) {
//       const userChoice = prompt(
//         `Command to execute:\n${command}\nType "EXECUTE" to execute, or "SKIP" to skip.`
//       );

//       if (!userChoice || userChoice.toUpperCase() === "SKIP") {
//         console.log("Command skipped.");
//       } else if (userChoice.toUpperCase() === "EXECUTE") {
//         await executeCommand(command);
//       } else {
//         console.log("Invalid choice. Command skipped.");
//       }
//     }
//   };

//   const executeCommand = async (command) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:3002/api/executeCommand",
//         {
//           command,
//         }
//       );

//       const { nextCommand, output } = response.data;
//       console.log("Command executed successfully. Next command:", nextCommand);
//       console.log("Command output:", output);
//     } catch (error) {
//       console.error("Error executing command:", error);
//       alert("Failed to execute command. Please try again.");
//     }
//   };

//   const handleAction = (a) => {
//     socket.emit("userInput", a);
//     // Clear the action after user input
//     setAction("");
//   };

//   return (
//     <div className="row">
//       <div className="col-xs-12 col-sm-6" style={{ background: "#3b5a5e" }}>
//         <img src="/defensy.png" className="imgcenter" alt="Defensy logo"></img>
//       </div>
//       <div className="col-xs-12 col-sm-6">
//         <div className="dashboard-container">
//           <div className="input-container">
//             <form onSubmit={handleScanSubmit}>
//               <label className="input-label">Enter IP Address:</label>
//               <input
//                 type="text"
//                 value={ipAddress}
//                 onChange={handleInputChange}
//                 placeholder="Enter IP address..."
//                 className="input-field"
//               />
//               <button
//                 type="submit"
//                 className="submit-button"
//                 style={{
//                   backgroundColor: isValidIp ? "#4caf50" : "#f44336",
//                   cursor: isValidIp ? "pointer" : "not-allowed",
//                 }}
//                 disabled={!isValidIp}
//               >
//                 Start Scan
//               </button>
//             </form>
//           </div>
//           {action && (
//             <div className="confirmation-container">
//               <div className="confirmation-message">
//                 Command to execute: <code className="command-text">{action}</code>
//               </div>
//               <div className="confirmation-buttons">
//                 <button
//                   className="confirm-button accept"
//                   onClick={() => handleAction("EXECUTE")}
//                 >
//                   Execute
//                 </button>
//                 <button
//                   className="confirm-button refuse"
//                   onClick={() => handleAction("SKIP")}
//                 >
//                   Skip
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;






import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import io from "socket.io-client";

const Home = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [isValidIp, setIsValidIp] = useState(false);
  const [isScanning, setIsScanning] = useState(false); // New state for scanning status
  const [action, setAction] = useState("");
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io("http://localhost:3002");
    setSocket(socket);

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("confirmationNeeded", (data) => {
      console.log("Confirmation needed:", data);
      const cleanData = stripAnsiCodes(data);
      console.log("Cleaned data:", cleanData);

      const regex = /ReconEnhance wants to execute the following command:\s*([\s\S]*?)\s*Type\s*".*?"/;
      const match = cleanData.match(regex);
      console.log("Regex match result:", match);

      if (match && match[1]) {
        console.log("Extracted command:", match[1]);
        setAction(match[1].trim());
      } else {
        console.log("No command extracted");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const stripAnsiCodes = (text) => {
    return text.replace(
      /[\u001b\u009b][[()#;?]*(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\/#&.:=?%@~_]+)*)?\u0007|(?:\d{1,4}(?:;\d{0,4})*)?[a-zA-Z\d])/g,
      ""
    );
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setIpAddress(value);
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    setIsValidIp(ipRegex.test(value));
  };

  const handleScanSubmit = async (e) => {
    e.preventDefault();

    if (!isValidIp) {
      alert("Please enter a valid IP address!");
      return;
    }

    // Clear the previous action
    setAction("");
    setIsScanning(true); // Set scanning status to true

    try {
      const response = await axios.post("http://localhost:3002/api/startScan", {
        ipAddress,
      });

      const { commands } = response.data;
      console.log("Commands to execute:", commands);

      // Save IP address in local storage
      localStorage.setItem("latestIpAddress", ipAddress);

      // Navigate to the dashboard
      navigate("/dashboard");

      // Handle commands in your UI as needed
      if (commands && commands.length > 0) {
        await processCommands(commands);
      } else {
        alert("No commands to execute.");
      }
    } catch (error) {
      console.error("Error starting scan:", error);
      alert("Failed to start scan. Please try again.");
    }
    //  finally {
    //   setIsScanning(false); // Reset scanning status after the scan is complete
    // }
  };

  const processCommands = async (commands) => {
    for (const command of commands) {
      const userChoice = prompt(
        `Command to execute:\n${command}\nType "EXECUTE" to execute, or "SKIP" to skip.`
      );
      setIsScanning(false);
      if (!userChoice || userChoice.toUpperCase() === "SKIP") {
        console.log("Command skipped.");
      } else if (userChoice.toUpperCase() === "EXECUTE") {
        await executeCommand(command);
      } else {
        console.log("Invalid choice. Command skipped.");
      }
    }
  };

  const executeCommand = async (command) => {
    try {
      const response = await axios.post(
        "http://localhost:3002/api/executeCommand",
        {
          command,
        }
      );

      const { nextCommand, output } = response.data;
      console.log("Command executed successfully. Next command:", nextCommand);
      console.log("Command output:", output);
    } catch (error) {
      console.error("Error executing command:", error);
      alert("Failed to execute command. Please try again.");
    }
  };

  const handleAction = (a) => {
    socket.emit("userInput", a);
    // Clear the action after user input
    setAction("");
    //setIsScanning(false);
    
  };

  return (
    <div className="row">
      <div className="col-xs-12 col-sm-6" style={{ background: "#3b5a5e" }}>
        <img src="/defensy.png" className="imgcenter" alt="Defensy logo"></img>
      </div>
      <div className="col-xs-12 col-sm-6">
        <div className="dashboard-container">
          <div className="input-container">
            <form onSubmit={handleScanSubmit}>
              <label className="input-label">Enter IP Address:</label>
              <input
                type="text"
                value={ipAddress}
                onChange={handleInputChange}
                placeholder="Enter IP address..."
                className="input-field"
              />
              <button
                type="submit"
                className="submit-button"
                style={{
                  backgroundColor: isValidIp ? "#4caf50" : "#f44336",
                  cursor: isValidIp ? "pointer" : "not-allowed",
                }}
                disabled={!isValidIp || isScanning} // Disable button while scanning
              >
                {isScanning ? "Scanning..." : "Start Scan"}
              </button>
            </form>
          </div>
          {action && (
            <div className="confirmation-container">
              <div className="confirmation-message">
                Command to execute: <code className="command-text">{action}</code>
              </div>
              <div className="confirmation-buttons">
                <button
                  className="confirm-button accept"
                  onClick={() => handleAction("EXECUTE")}
                >
                  Execute
                </button>
                <button
                  className="confirm-button refuse"
                  onClick={() => handleAction("SKIP")}
                >
                  Skip
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
