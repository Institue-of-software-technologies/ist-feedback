import { FaChartLine, FaChartPie, FaEye } from 'react-icons/fa';

const AnalyticsPage = () => {
    return (
        <div className="bg-white shadow-lg p-6 rounded-lg">
            <h2 className="text-3xl font-bold mb-6">Analytics</h2>

            {/* Key Analytics Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-100 p-4 rounded flex items-center">
                    <FaChartLine className="text-blue-500 text-3xl mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold">Feedback Trends</h3>
                        <p className="text-base">Analyze trends from student feedback over time.</p>
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded flex items-center">
                    <FaChartPie className="text-green-500 text-3xl mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold">Student Progress</h3>
                        <p className="text-base">Track and visualize student progress with performance metrics.</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons for Reports */}
            <div className="bg-gray-100 p-4 rounded mb-6">
                <h3 className="text-lg font-semibold mb-4">Generate Analytics Reports</h3>
                <div className="space-y-4">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center">
                        <FaEye className="mr-2" /> View Feedback Insights
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center">
                        <FaEye className="mr-2" /> View Progress Reports
                    </button>
                </div>
            </div>

            {/* Visualizations Placeholder */}
            <div className="bg-gray-100 p-4 rounded">
                <h3 className="text-lg font-semibold mb-4">Recent Analytics</h3>
                <div className="text-center text-gray-500">
                    {/* Placeholder for charts/graphs */}
                    <p>Charts and visualizations will appear here.</p>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
