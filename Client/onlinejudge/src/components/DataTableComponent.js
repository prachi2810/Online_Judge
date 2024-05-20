// DataTableComponent.jsx
import React from 'react';
import DataTable from 'react-data-table-component';

const data = [
  { id: 1, title: 'Conan the Barbarian', year: '1982' },
  { id: 2, title: 'The Terminator', year: '1984' },
  { id: 3, title: 'Commando', year: '1985' },
  // Add more data as needed
];

const columns = [
  {
    name: 'Title',
    selector: row => row.title,
    sortable: true,
  },
  {
    name: 'Year',
    selector: row => row.year,
    sortable: true,
  },
];

const DataTableComponent = () => {
  return (
    <div className="container mx-auto p-4">
      <DataTable
        title="Movies"
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        striped
        customStyles={{
          headCells: {
            style: {
              backgroundColor: '#4A5568',
              color: '#FFFFFF',
            },
          },
          rows: {
            style: {
              minHeight: '72px',
            },
          },
        }}
      />
    </div>
  );
};

export default DataTableComponent;
