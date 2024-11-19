import { ClipboardIcon, ExclamationTriangleIcon, EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { ReactNode, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

interface Column {
    header: string;
    accessor: string;
}

interface TableProps<T> {
    columns: Column[];
    data: T[];
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    onView?: (row: T) => void;
    onSearch?: (value: string) => void;
}

const Table = <T,>({ columns, data, onEdit, onDelete, onSearch, onView }: TableProps<T>): JSX.Element => {
    const [confirmDelete, setConfirmDelete] = useState<T | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [, setSearch] = useState<string>('');
    const [toggeled, setToggeled] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [selectedColumns, setSelectedColumns] = useState<string[]>(columns.map((col) => col.accessor));

    const totalPages = Math.ceil(data.length / rowsPerPage);

    const handleDelete = () => {
        if (confirmDelete && onDelete) {
            onDelete(confirmDelete);
            setConfirmDelete(null);
        }
    };

    const handleColumnToggle = (accessor: string) => {
        if (isMobile) {
          const newSelectedColumns = [...selectedColumns];
          const index = newSelectedColumns.indexOf(accessor);
          if (index !== -1) {
            newSelectedColumns.splice(index, 1); // Remove column if selected
          } else {
            // Only add if it's less than 3 columns selected
            if (newSelectedColumns.length < 3) {
              newSelectedColumns.push(accessor);
            }
          }
          setSelectedColumns(newSelectedColumns);
        } else {
          // Logic for non-mobile devices (unchanged)
          setSelectedColumns((prev) =>
            prev.includes(accessor) ? prev.filter((col) => col !== accessor) : [...prev, accessor]
          );
        }
      };   

    const getNestedValue = (obj: T, path: string): ReactNode => {
        const value = path.split('.').reduce<unknown>((acc, key) => {
            return typeof acc === 'object' && acc !== null && key in acc ? acc[key as keyof typeof acc] : undefined;
        }, obj);
        return typeof value === 'string' || typeof value === 'number'
            ? value
            : value === null || value === undefined
                ? null
                : React.isValidElement(value)
                    ? value
                    : JSON.stringify(value);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        onSearch?.(e.target.value);
    };

    const handleCopy = (token: string) => {
        navigator.clipboard.writeText(token)
            .then(() => {
                toast.info('Student Token copied!', { position: 'top-right', autoClose: 1000 });
            })
            .catch((err) => {
                toast.error('Failed to copy token: ', err);
            });
    };

    useEffect(() => {
        const checkMobileView = () => {
            const isMobileView = window.innerWidth <= 768; // Mobile threshold (adjust as needed)
            setIsMobile(isMobileView);
        };
    
        // Run check on mount
        checkMobileView();
    
        // Add event listener for window resize
        window.addEventListener('resize', checkMobileView);
        return () => window.removeEventListener('resize', checkMobileView);
    }, []);    

    useEffect(() => {
        if (isMobile) {
          setSelectedColumns(columns.slice(0, 2).map((col) => col.accessor));
        }
      }, [isMobile, columns]); 
        
    const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div className="border overflow-x-auto shadow rounded-lg divide-y outline-gray-100 divide-gray-200 w-full">
            {/* Column Selection Dropdown */}
            <div className="flex flex-col lg:justify-between sm:flex-row justify-between items-center p-4 space-y-4 sm:space-y-0 sm:space-x-4 w-auto">
                <div className="relative inline-block text-left w-full sm:w-auto">
                    <button onClick={() => setToggeled(!toggeled)} className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                        Select Columns
                    </button>
                    {toggeled && ( // Only show dropdown if isOpen is true
                        <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                {columns.map((column) => (
                                    <label
                                        key={column.accessor}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedColumns.includes(column.accessor)}
                                            onChange={() => handleColumnToggle(column.accessor)}
                                            className="mr-2"
                                        />
                                        {column.header}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative w-full sm:w-auto flex items-center space-x-2">
                        <label className="sr-only">Search</label>
                        <input
                            type="text"
                            name="hs-table-with-pagination-search"
                            id="hs-table-with-pagination-search"
                            className="py-2 px-3 ps-9 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Search for items"
                            onChange={handleSearchChange}
                        />
                </div>

                {/* Search and Rows per Page */}
                <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-4 sm:space-y-0 sm:space-x-4">
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
            </div>

            {/* Table */}
            <div className="overflow-x-auto w-full">
                <table className="min-w-full divide-y divide-gray-200 w-full">
                    <thead className="bg-stone-100">
                        <tr>
                            {columns
                                .filter((column) => selectedColumns.includes(column.accessor))
                                .map((column) => (
                                    <th key={column.accessor} className="px-4 py-2 text-left">
                                        {column.header}
                                    </th>
                                ))}
                            {(onEdit || onDelete || onView) && <th className="px-4 py-2">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {paginatedData.map((row, index) => (
                            <tr key={index} className="border-t">
                                {columns
                                    .filter((column) => selectedColumns.includes(column.accessor))
                                    .map((column) => (
                                        <td key={column.accessor} className="px-4 py-2">
                                            {typeof column.accessor === 'string' && column.accessor === 'studentToken' ? (
                                                <div className="flex items-center">
                                                    <span>{getNestedValue(row, column.accessor)}</span>
                                                    <button
                                                        onClick={() => handleCopy(String(getNestedValue(row, column.accessor)))}
                                                        className="text-blue-500 hover:underline ml-5 inline-flex items-center"
                                                    >
                                                        <ClipboardIcon className="h-8 w-7 mr-1" />
                                                    </button>
                                                </div>
                                            ) : (
                                                getNestedValue(row, column.accessor as string)
                                            )}
                                        </td>
                                    ))}
                                {(onEdit || onDelete || onView) && (
                                    <td className="px-4 py-2 flex space-x-2">
                                        {onEdit && (
                                            <button onClick={() => onEdit(row)} className="text-blue-500 hover:underline">
                                                <PencilSquareIcon className="h-5 w-5 mr-1" />
                                                <span>Edit</span>
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button onClick={() => setConfirmDelete(row)} className="text-red-500 hover:underline">
                                                <TrashIcon className="h-5 w-5 mr-1" />
                                                <span>Delete</span>
                                            </button>
                                        )}
                                        {onView && (
                                            <button onClick={() => onView(row)} className="text-green-500 hover:underline">
                                                <EyeIcon className="h-5 w-5 mr-1" />
                                                <span>View</span>
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
    );

};

export default Table;
