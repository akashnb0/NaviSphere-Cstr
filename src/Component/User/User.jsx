import React from 'react';
import './User.css';

const User = () => {
  const sampleData = [
    {
      'Base Station': 'BS001',
      Users: ['John Doe', 'Gowrii'],
    },
    {
      'Base Station': 'BS002',
      Users: ['Alice Smith'],
    },
    {
      'Base Station': 'BS003',
      Users: ['Robert Johnson'],
    },
    {
      'Base Station': 'BS004',
      Users: ['Emily Brown'],
    },
    {
      'Base Station': 'BS005',
      Users: ['Michael Lee'],
    },
  ];

  const tableHeader = ['Base Station', 'Users']; // New column order

  return (
    <div>
      <center>
        <div>
          <table className="table mb-0" style={{ border: '2px solid lightgray', borderRadius: '20px', padding: '20px', boxShadow: 'rgba(149,157,165,0.2) 0px 8px 24px' }}>
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
                      {Array.isArray(data[header]) ? data[header].join(', ') : data[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </center>
    </div>
  );
};

export default User;
