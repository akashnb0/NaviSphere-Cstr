import React from 'react';
import '../Table/Table.css';
const Admin = () => {
  const sampleData = [
    {
      mountPoint: 'BaseStation1',
      status: 'Active',
      lastUpdated: '2023-12-18 15:30',
      lat: 40.7128,
      long: -74.0060,
    },
    {
      mountPoint: 'BaseStation2',
      status: 'Inactive',
      lastUpdated: '2023-12-17 12:45', 
      lat: 34.0522,
      long: -118.2437,
    },
    
  ];

  const handleCreate = (mountPoint) => {
    
    console.log(`Creating base station with Mount Point: ${mountPoint}`);
  };

  const handleTerminate = (mountPoint) => {
    
    console.log(`Terminating base station with Mount Point: ${mountPoint}`);
  };

  const getStatusIndicator = (status) => {
    return status === 'Active' ? (
      <span className="status-indicator status-active">🟢</span>
    ) : (
      <span className="status-indicator status-inactive">🔴</span>
    );
  };

  const tableHeader = ['Mount Point', 'Status', 'Last Updated', 'Latitude', 'Longitude']; // New column order

  return (
    <>
      <div>
        <center>
          <div>
            <table className="table mb-0" style={{ border: '2px solid lightgray', borderRadius: '20px', paddingLeft: '50px', paddingRight: '20px', boxShadow: 'rgba(149,157,165,0.2) 0px 8px 24px' }}>
              <thead>
                <tr>
                  {tableHeader.map((header, index) => (
                    <th key={index} className="border-gray-200" style={{ padding: '15px', borderBottom: '1px solid #ddd', minWidth: '100px' }}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleData.map((data, dataIndex) => (
                  <tr key={dataIndex}>
                    {tableHeader.map((header, headerIndex) => (
                      <td key={headerIndex} style={{ padding: '15px', borderBottom: '1px solid #ddd', width: 'auto' }}>
                        {header === 'Latitude' ? data.lat.toFixed(4) :
                          header === 'Longitude' ? data.long.toFixed(4) :
                            header === 'Mount Point' ? data.mountPoint :
                              header === 'Last Updated' ? data.lastUpdated :
                                header === 'Status' ? (
                                  <>
                                    {getStatusIndicator(data.status)}
                                    {data.status}
                                  </>
                                ) : (
                                  data[header.toLowerCase()]
                                )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </center>
      </div>
    </>
  );
};

export default Admin;
