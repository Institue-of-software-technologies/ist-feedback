import { FaChartLine, FaClipboardList } from 'react-icons/fa';

const OverviewPage = () => {
    return (
        <div className="bg-white shadow-lg p-6 rounded-lg">
            <h2 className="text-3xl font-bold mb-6">Overview</h2>

            {/* Key Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-100 p-4 rounded flex items-center">
                    <FaChartLine className="text-blue-500 text-3xl mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold">Total Users</h3>
                        <p className="text-xl font-bold">1,245</p>
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded flex items-center">
                    <FaChartLine className="text-green-500 text-3xl mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold">Courses Available</h3>
                        <p className="text-xl font-bold">57</p>
                    </div>
                </div>
            </div>

            {/* Recent Activities Section */}
            <div className="bg-gray-100 p-4 rounded">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <FaClipboardList className="text-orange-500 text-2xl mr-2" />
                    Recent Activities
                </h3>
                <ul className="list-disc list-inside">
                    <li>User John Doe enrolled in Web3 Course</li>
                    <li>New course &quot;AI for Beginners &quot; added</li>
                    <li>Feedback report submitted for July intake</li>
                </ul>
            </div>
        </div>
    );
};

export default OverviewPage;
