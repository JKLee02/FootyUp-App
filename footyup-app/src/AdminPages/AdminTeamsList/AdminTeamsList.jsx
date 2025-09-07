import { useEffect, useState } from 'react';
import AdminHeader from '../../Components/AdminHeaderComponent/AdminHeader';
import AdminReusableTable from '../../Components/AdminReusableTable/AdminReusableTable';
import './AdminTeamsList.css';
import axios from 'axios';

function AdminTeamsList() {
    const [teams, setTeams] = useState([]);

    // Fetch teams data
    useEffect(() => {
        axios.get('http://localhost:8081/teams')
            .then((response) => {
                setTeams(response.data);
            })
            .catch((error) => {
                console.error('Error fetching teams:', error);
            });
    }, []);

    // Define table columns
    const columns = [
        { Header: 'ID', accessor: 'team_id' },
        { Header: 'Team Name', accessor: 'team_name' },
        { Header: 'Members Amount', accessor: 'members_amount' },
        { Header: 'Team Captain', accessor: 'team_captain' },
    ];

    return (
        <div>
            <AdminHeader />
            <main className="admin-teams-page">
                <h1 className="admin-teams-title">Teams List</h1>
                <AdminReusableTable columns={columns} data={teams} />
            </main>
        </div>
    );
}

export default AdminTeamsList;
