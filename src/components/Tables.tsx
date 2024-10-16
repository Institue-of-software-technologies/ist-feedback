import { ExclamationTriangleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { ReactNode, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

interface Column<T> {
    header: string;
    accessor: keyof T | string;
}


interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    onSearch?: (value: string) => void;
}

const Table = <T,>({ columns, data, onEdit, onDelete,onSearch }: TableProps<T>): JSX.Element => {
    const [confirmDelete, setConfirmDelete] = useState<T | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState<string>('');

    const totalPages = Math.ceil(data.length / rowsPerPage);


    const handleDelete = () => {
        if (confirmDelete && onDelete) {
            onDelete(confirmDelete);
            setConfirmDelete(null);
        }
    };

    const getNestedValue = (obj: T, path: string): ReactNode => {
        const value = path.split('.').reduce<unknown>((acc, key) => { // Explicitly set accumulator type to unknown
            return typeof acc === 'object' && acc !== null && key in acc ? acc[key as keyof typeof acc] : undefined;
        }, obj);
        // Handle the value based on its type
        if (typeof value === 'string' || typeof value === 'number') {
            return value;
        } else if (value === null || value === undefined) {
            return null;
        } else if (React.isValidElement(value)) {
            return value;
        } else {
            return JSON.stringify(value); // Or a custom string representation
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(1); // Reset to page 1 when rows per page changes
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        onSearch?.(e.target.value);  // Trigger search on input change
        console.log(search);
      };
    // Pagination logic: get the rows for the current page
    const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <>
            <div className="border shadow rounded-lg divide-y outline-gray-100 divide-gray-200 w-full">
                {/* Search and Rows per Page Selection */}
                <div className="flex flex-col sm:flex-row justify-between items-center p-4 space-y-2 sm:space-y-0 w-full">
                    <div className="relative w-full max-w-xs flex items-center space-x-2">
                        <label className="sr-only">Search</label>
                        <input
                            type="text"
                            name="hs-table-with-pagination-search"
                            id="hs-table-with-pagination-search"
                            className="py-2 px-3 ps-9 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Search for items"
                            onChange={handleSearchChange}
                        />
                        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-2">
                            <svg
                                className="size-4 text-gray-400 dark:text-neutral-500"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </svg>
                        </div>
                    </div>
                    <div className="w-full sm:w-auto">
                        <label htmlFor="rowsPerPage" className="mr-2">
                            Rows per page:
                        </label>
                        <select
                            id="rowsPerPage"
                            value={rowsPerPage}
                            onChange={handleRowsPerPageChange}
                            className="py-1 px-2 border border-gray-300 rounded-md"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
                {/* Responsive Table */}
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full divide-y divide-gray-200 w-full">
                        <thead className="bg-stone-100">
                            <tr>
                                {columns.map((column) => (
                                    <th key={column.accessor.toString()} className="px-4 py-2 text-left">
                                        {column.header}
                                    </th>
                                ))}
                                {(onEdit || onDelete) && <th className="px-4 py-2">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedData.map((row, index) => (
                                <tr key={index} className="border-t">
                                    {columns.map((column) => (
                                        <td key={column.accessor.toString()} className="px-4 py-2">
                                            {typeof column.accessor === 'string' && column.accessor.includes('.')
                                                ? getNestedValue(row, column.accessor)
                                                : getNestedValue(row, column.accessor as string)}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <td className="px-4 py-2 flex space-x-2">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(row)}
                                                    className="text-blue-500 hover:underline inline-flex items-center"
                                                >
                                                    <PencilSquareIcon className="h-5 w-5 mr-1" />
                                                    Edit
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => setConfirmDelete(row)}
                                                    className="text-red-500 hover:underline inline-flex items-center ml-4"
                                                >
                                                    <TrashIcon className="h-5 w-5 mr-1" />
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="border py-1 px-4 flex justify-between items-center">
                        <button
                            type="button"
                            className="p-2 text-sm text-gray-800 hover:bg-gray-100"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            « Previous
                        </button>

                        <span className="text-sm">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            type="button"
                            className="p-2 text-sm text-gray-800 hover:bg-gray-100"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next »
                        </button>
                    </div>
                </div>

                {/* Confirmation Modal */}
                {confirmDelete && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
                            <div className="flex items-center justify-center mb-4">
                                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 mr-2" />
                                <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                            </div>
                            <p className="text-gray-600 text-center mb-4">
                                Are you sure you want to delete this item? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-2">
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                    onClick={() => setConfirmDelete(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>

    );
};

export default Table;