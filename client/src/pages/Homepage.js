import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState("");  // Track user role
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No authentication token found");
                }

                const response = await fetch("http://localhost:5000/class/stats/teacher", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch classroom stats");
                }

                const data = await response.json();
                setStats(data.data || []);
                setUserRole(localStorage.getItem("role"));  // Assuming role is stored in localStorage
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Loading state
    if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;

    // Error state
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Welcome Banner */}
            <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold">Welcome Back!</h1>
                <p className="mt-2 text-lg">
                    {userRole === "teacher"
                        ? "Here are your classroom stats."
                        : "Join a classroom and start learning!"}
                </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex justify-center gap-4 mt-6">
                {userRole === "teacher" ? (
                    <button
                        onClick={() => navigate("/create-classroom")}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                        + Create Classroom
                    </button>
                ) : (
                    <button
                        onClick={() => navigate("/join-classroom")}
                        className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                    >
                        🔑 Join Classroom
                    </button>
                )}
            </div>

            {/* Classroom Stats */}
            <h2 className="text-2xl font-bold text-center mt-8 mb-4">Your Classrooms</h2>
            {stats.length === 0 ? (
                <p className="text-center text-gray-600">No classrooms found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats.map((classroom) => (
                        <div
                            key={classroom.classId}
                            className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <h2 className="text-xl font-semibold text-blue-600">{classroom.name}</h2>
                            <p className="text-gray-700">{classroom.description}</p>
                            <div className="mt-4 flex justify-between text-gray-800 font-medium">
                                <p>👨‍🎓 Students: {classroom.studentsCount}</p>
                                <p>📝 Posts: {classroom.postsCount}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
