import { useEffect, useState } from 'react';
import AdminHeader from '../../Components/AdminHeaderComponent/AdminHeader';
import AdminReusableTable from '../../Components/AdminReusableTable/AdminReusableTable';
import './AdminPlayersList.css';
import axios from 'axios';

function AdminPlayersList() {
    const [players, setPlayers] = useState([]);

    // Fetch players data
    useEffect(() => {
        axios.get('http://localhost:8081/users')
            .then((response) => {
                setPlayers(response.data);
            })
            .catch((error) => {
                console.error('Error fetching players:', error);
            });
    }, []);

    // Define table columns
    const columns = [
        { Header: 'Player ID', accessor: 'user_id' },
        { Header: 'Player First Name', accessor: 'user_firstname' },
        { Header: 'Player Last Name', accessor: 'user_lastname' },
        { Header: 'Player Email', accessor: 'email' },
        { Header: 'Gender', accessor: 'user_gender' },
        { Header: 'Player Team ID', accessor: 'user_team' }
    ];

    return (
        <div>
            <AdminHeader />
            <main className="admin-players-page">
                <h1 className="admin-players-title">Players List</h1>
                <AdminReusableTable columns={columns} data={players} />
            </main>
        </div>
    );
}

export default AdminPlayersList;
