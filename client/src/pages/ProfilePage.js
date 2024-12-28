import React, { useEffect, useState } from 'react'; 
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [classroomName, setClassroomName] = useState('');
    const [description, setDescription] = useState('');
    const [classroomsCreatedByMe, setClassroomsCreatedByMe] = useState([]);
    const [classroomsJoinedByMe, setClassroomsJoinedByMe] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/getuser`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                console.log(data)
                if (response.ok) {
                    setUser(data.data);
                } else {
                    toast.error(data.message || 'Failed to fetch user data');
                }

            }
            catch (error) {
                toast.error('An error occurred while fetching user data');
            } finally {
                setLoading(false);
            }
        }
        fetchUser();

    }, [])

    const fetchClassrooms = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/classroomscreatedbyme`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                setClassroomsCreatedByMe(data.data);
            } else {
                toast.error(data.message || 'Failed to fetch classrooms');
            }
        } catch (error) {
            toast.error('An error occurred while fetching classrooms');
        }
    }

    const fetchClassroomsJoinedByMe = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/classroomsforstudent`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();
            console.log(data)
            if (response.ok) {
                setClassroomsJoinedByMe(data.data);
            }
        }
        catch (error) {
            toast.error('An error occurred while fetching joined classrooms');
        }
    }

    useEffect(() => {
        if (user) {
            fetchClassrooms();
            fetchClassroomsJoinedByMe()
        }
    }, [user]);

    const handleCreateClassroom = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: classroomName,
                    description,
                }),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Classroom created successfully');
                setClassroomName('');
                setDescription('');
                setShowPopup(false);
                fetchClassrooms();
            } else {
                toast.error(data.message || 'Failed to create classroom');
            }
        }
        catch (error) {
            toast.error('An error occurred while creating classroom');
        }
    }

    const navigate = useNavigate();

    const handleRowClick = (classroomId) => {
        navigate(`/classes/${classroomId}`);  // Navigate to the class details page
    };
    
    return (
        <>
        <div className="profile-container flex bg-background">
            {user && (
                <div className="h-full w-20 md:w-64 flex items-center">
                    <div className='flex-none'>
                        <img
                            src={
                            "https://th.bing.com/th/id/OIP.OWHqt6GY5jrr7ETvJr8ZXwHaHa?w=160&h=180&c=7&r=0&o=5&pid=1.7" ||
                            "default-profile.png"
                            }
                            alt="Profile"
                            className="rounded-full w-12 h-12 ms-5 my-4"
                        />
                    </div>
                    <div className='text-txt flex-initial mb-2'>
                        <h2 className='text-xl px-3 '>{user.name} <sup>{user.role}</sup></h2>
                        <p className='text-xs px-3'>{user.email}</p>
                    </div>
                </div>
            )}
                <div className="profile-page flex-auto">
                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : user ? (
                        <>
                            <div className="profile-info">
                                <div className="profile-details">
                                    {/* <h2>{user.name}</h2>
                                    <p>Email: {user.email}</p>
                                    <p>Role: {user.role}</p> */}
                                    {user.role === 'teacher' && (
                                        <button className="create-classroom-btn" onClick={() => setShowPopup(true)}>
                                            Create Classroom
                                        </button>
                                    )}
                                </div>
                            </div>

                            {showPopup && (
                                <div className="popup-overlay">
                                    <div className="popup-content">
                                        <h3>Create Classroom</h3>
                                        <input
                                            type="text"
                                            placeholder="Classroom Name"
                                            value={classroomName}
                                            onChange={(e) => setClassroomName(e.target.value)}
                                        />
                                        <textarea
                                            placeholder="Description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />

                                        <div className="popup-buttons">
                                            <button onClick={handleCreateClassroom}>Submit</button>
                                            <button onClick={() => setShowPopup(false)}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {user.role === 'teacher' && (
                                <div className="classroom-list">
                                    <h3>Classrooms created by me</h3>
                                    <div className="card-container">
                                        {classroomsCreatedByMe.map((classroom) => (
                                            <div 
                                                className="classroom-card" 
                                                key={classroom._id} 
                                                onClick={() => handleRowClick(classroom._id)}
                                            >
                                                <h4>{classroom.name}</h4>
                                                <p>{classroom.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        <div className="classroom-list">
                                <h3>Classrooms joined by me</h3>
                                <div className="card-container">
                                    {classroomsJoinedByMe.map((classroom) => (
                                        <div 
                                            className="classroom-card" 
                                            key={classroom._id} 
                                            onClick={() => handleRowClick(classroom._id)}
                                        >
                                            <h4>{classroom.name}</h4>
                                            <p>{classroom.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <p>No user data found.</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default ProfilePage;