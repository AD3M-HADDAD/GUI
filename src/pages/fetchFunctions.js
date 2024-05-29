// fetchFunctions.js
export const fetchIPAddresses = () => {
    return fetch('http://localhost:3001/api/scans')
        .then(response => response.json())
        .then(data => {
            const allIps = data.map(entry => entry.ip);
            const uniqueIps = [...new Set(allIps)]; // Remove duplicates
            return uniqueIps;
        })
        .catch(error => {
            console.error('Error fetching IP addresses:', error);
            throw error;
        });
};

export const fetchJSONContent = (selectedIp) => {
    return fetch(`http://localhost:3001/api/scans/${selectedIp}`)
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching JSON content:', error);
            throw error;
        });
};