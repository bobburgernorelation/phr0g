import { useEffect, useState } from 'react';

export default function ApplicationStatus() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/applications/status', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            setApplications(data.applications);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Application Status</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul className="space-y-2">
                    {applications.map((app, index) => (
                        <li key={index} className="p-2 border rounded">
                            <p>{app.jobTitle} at {app.company}</p>
                            <p>Status: {app.status}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
} 