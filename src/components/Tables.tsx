import React, { useState, useCallback } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

interface TableProps<T> {
    columns: TableColumn<T>[]; // Columns passed from parent component
    data: T[]; // Data passed from parent component
    onEdit?: (row: T) => void; // Edit function
    onDelete?: (row: T) => void; // Delete function
    onView?: (row: T) => void; // View function
    onSearch?: (value: string) => void; // Search handler
}

const Table = <T,>({ columns, data, onEdit, onDelete, onSearch, onView }: TableProps<T>): JSX.Element => {
    const [search, setSearch] = useState<string>(''); // Search value state
    const [confirmDelete, setConfirmDelete] = useState<T | null>(null); // Confirm delete state
    const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>(
        columns.reduce((acc, col) => {
            acc[col.name as string] = true; // Default to showing all columns
            return acc;
        }, {} as { [key: string]: boolean })
    ); // Manage visibility of columns

    // Debounce search input to optimize performance
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        if (onSearch) {
            onSearch(value); // Call parent search handler (if provided)
        }
    }, [onSearch]);

    const handleDelete = () => {
        if (confirmDelete && onDelete) {
            onDelete(confirmDelete); // Call parent delete handler (if provided)
            setConfirmDelete(null); // Reset confirm delete state
        }
    };

    const handleDeleteClick = (row: T) => {
        setConfirmDelete(row); // Set the item to delete
    };

    const handleColumnToggle = (columnName: string) => {
        setVisibleColumns(prevState => ({
            ...prevState,
            [columnName]: !prevState[columnName], // Toggle visibility of column
        }));
    };

    const actionColumn: TableColumn<T> = {
        name: 'Actions',
        button: true,
        cell: (row: T) => (
            <div className="flex justify-end space-x-2">
                {(onEdit || onDelete || onView) && (
                    { onEdit && (
                        <button
                            onClick={() => onEdit(row)}
                            className="text-blue-500 hover:underline inline-flex items-center"
                        >
                            <PencilSquareIcon className="h-5 w-5 mr-1" />
                            Edit
                        </button>
                    )},
                {onDelete && (
                    <button
                        onClick={() => setConfirmDelete(row)}
                        className="text-red-500 hover:underline inline-flex items-center ml-4"
                    >
                        <TrashIcon className="h-5 w-5 mr-1" />
                        Delete
                    </button>
                )}
                {onView && (
                    <button
                        onClick={() => onView(row)}
                        className="text-green-500 hover:underline inline-flex items-center ml-4"
                    >
                        <EyeIcon className="h-5 w-5 mr-1" />
                        View
                    </button>
                )}
            )}
            </div>

        ),
    };

    const columnsWithActions = [...columns, actionColumn];

    // Filter columns based on visibility state
    const filteredColumns = columnsWithActions.filter(col => visibleColumns[(col.name || '') as string]);

    return (
        <div className="border shadow rounded-lg divide-y outline-gray-100 divide-gray-200 w-full">
            {/* Search */}
            <div className="flex justify-between p-4">
                <input
                    type="text"
                    value={search}
                    placeholder="Search for items"
                    className="py-2 px-3 border border-gray-300 rounded-md"
                    onChange={handleSearchChange}
                />
            </div>

            {/* Column Visibility Controls */}
            <div className="flex p-4 space-x-4">
                {columnsWithActions.map((column, index) => (
                    <label
                        key={column.name ? column.name.toString() : index.toString()} // Ensuring the key is a string or number
                        className="flex items-center space-x-2"
                    >
                        <input
                            type="checkbox"
                            checked={visibleColumns[(column.name || '') as string]}
                            onChange={() => handleColumnToggle(column.name as string)}
                            className="h-4 w-4"
                        />
                        <span>{column.name}</span>
                    </label>
                ))}
            </div>


            {/* Table with scrollable wrapper */}
            <div className="overflow-x-auto overflow-scroll">
                <DataTable
                    columns={filteredColumns} // Use filtered columns based on visibility
                    data={data}
                    pagination
                    noDataComponent="No data available"
                    customStyles={{
                        rows: {
                            highlightOnHoverStyle: {
                                backgroundColor: '#f0f0f0',
                                cursor: 'pointer',
                            },
                        },
                    }}
                />
            </div>

            {/* Confirm Delete Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                        <p className="text-gray-600 text-center mb-4">Are you sure you want to delete this item?</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;
