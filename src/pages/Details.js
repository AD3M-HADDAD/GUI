import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./Details.css"; // Ensure this file is created and contains relevant styles
import "../App.css";
const Details = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const port = params.get("port");
  const portInfoString = params.get("portInfo");
  const portInfo = portInfoString ? JSON.parse(portInfoString) : []; // Parse portInfo string to array
  const ip = params.get("ip");

  const [visibleContent, setVisibleContent] = useState({});

  const toggleContentVisibility = (index) => {
    setVisibleContent((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <div className="details">
      
      <h1 style={{color:"rgba(63, 63, 233, 0.556)"}}>IP: {ip}</h1>
      <p style={{fontSize:"24px"}}>PORT: {port}</p>
      
      {port ? (
        <div>
          
          
          {portInfo.length > 0 ? (
            <div className="portInfo">
              {portInfo.map((info, index) => (
                <div key={index} className="accordion1">
                  {info.filename && (
                    <h4
                      onClick={() => toggleContentVisibility(index)}
                      className="clickable"
                    >
                      {info.filename}
                    </h4>
                  )}
                  {visibleContent[index] && info.content && (
                    <pre>{info.content}</pre>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No additional port info available.</p>
          )}
        </div>
      ) : (
        <p className="no-details">No details available.</p>
      )}
    </div>
  );
};

export default Details;
