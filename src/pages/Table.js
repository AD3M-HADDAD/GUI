import React from "react";

const preprocessData = (ipData) => {
    // Create a map to store unique port entries
    const uniquePorts = new Map();

    // Iterate over the IP data to find unique port entries
    ipData.forEach((entry) => {
        entry.ports.forEach((portEntry) => {
            const key = `${portEntry.port}/${portEntry.service}/${portEntry.state}`; // Removed version from the key
            // Check if the port entry already exists in the map
            if (!uniquePorts.has(key)) {
                uniquePorts.set(key, portEntry);
            } else {
                // If the entry already exists, update the version
                const existingEntry = uniquePorts.get(key);
                if (portEntry.version && portEntry.version !== 'syn-ack') {
                    existingEntry.version = portEntry.version;
                }
            }
        });
    });

    // Convert the map values to an array
    return Array.from(uniquePorts.values());
};

// Function to remove "ttl 63" from the service value if it exists
const removeTtl63 = (service) => {
    return service.replace(' ttl 63', '');
};

const Table = ({ ipData }) => {
    // Preprocess the data to remove duplicate entries
    const processedData = preprocessData(ipData);

    return (
        <table>
            <thead>
                <tr>
                    <th>Port</th>
                </tr>
            </thead>
            <tbody>
                {processedData.map((portEntry, index) => (
                    <tr key={index}>
                        <td>{portEntry.port}</td>
                        <td>{removeTtl63(portEntry.service)}</td> {/* Call the removeTtl63 function */}
                        <td>{portEntry.state}</td>
                        <td>{portEntry.version || ''}</td> {/* Display version or empty string */}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;
