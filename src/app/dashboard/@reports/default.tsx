import { FaFileDownload, FaChartBar, FaClipboard } from 'react-icons/fa';

const ReportsPage = () => {
    return (
        <div className="bg-white shadow-lg p-6 rounded-lg">
            <h2 className="text-3xl font-bold mb-6">Reports</h2>

            {/* Section for Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-100 p-4 rounded flex items-center">
                    <FaClipboard className="text-blue-500 text-3xl mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold">Feedback Reports</h3>
                        <p className="text-base">Generate and analyze feedback reports for different courses and trainers.</p>
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded flex items-center">
                    <FaChartBar className="text-green-500 text-3xl mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold">Performance Reports</h3>
                        <p className="text-base">View detailed reports on student performance and progression.</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons Section */}
            <div className="bg-gray-100 p-4 rounded mb-6">
                <h3 className="text-lg font-semibold mb-4">Generate Reports</h3>
                <div className="space-y-4">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center">
                        <FaFileDownload className="mr-2" /> Download Feedback Report
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center">
                        <FaFileDownload className="mr-2" /> Download Performance Report
                    </button>
                </div>
            </div>

            {/* Recent Reports Section */}
            <div className="bg-gray-100 p-4 rounded">
                <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
                <ul className="list-disc list-inside">
                    <li>September Feedback Report - <span className="text-blue-500 cursor-pointer">Download</span></li>
                    <li>August Student Performance Report - <span className="text-blue-500 cursor-pointer">Download</span></li>
                </ul>
            </div>
        </div>
    );
};

export default ReportsPage;
