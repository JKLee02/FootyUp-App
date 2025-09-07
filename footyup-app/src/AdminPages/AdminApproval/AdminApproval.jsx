import { useState, useEffect } from 'react';
import AdminHeader from '../../Components/AdminHeaderComponent/AdminHeader';
import AdminReusableTable from '../../Components/AdminReusableTable/AdminReusableTable';
import './AdminApproval.css';

function AdminApproval() {
  const [tournaments, setTournaments] = useState([]);
  const [message, setMessage] = useState(''); // NEW: State for success message

  // Fetch tournaments from server
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch('http://localhost:8081/tournaments');
        if (!response.ok) {
          throw new Error('Failed to fetch tournaments');
        }
        const data = await response.json();
        setTournaments(data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      }
    };

    fetchTournaments();
  }, []);

  // Approve Tournament
  const handleApprove = async (row) => {
    try {
      const response = await fetch(`http://localhost:8081/tournaments/${row.tournament_id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json(); // Capture server response
      if (!response.ok) {
        throw new Error(result.error || 'Failed to approve tournament');
      }

      // Update status in UI
      setTournaments(tournaments.map(t =>
        t.tournament_id === row.tournament_id ? { ...t, tournament_status: 'Approved' } : t
      ));
      setMessage(result.message); // NEW: Set success message
    } catch (error) {
      console.error('Error approving tournament:', error);
      setMessage('Failed to approve tournament'); // NEW: Error message
    }
  };

  // Deny Tournament
  const handleDeny = async (row) => {
    try {
      const response = await fetch(`http://localhost:8081/tournaments/${row.tournament_id}/deny`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json(); // Capture server response
      if (!response.ok) {
        throw new Error(result.error || 'Failed to deny tournament');
      }

      // Update status in UI
      setTournaments(tournaments.map(t =>
        t.tournament_id === row.tournament_id ? { ...t, tournament_status: 'Denied' } : t
      ));
      setMessage(result.message); // NEW: Set success message
    } catch (error) {
      console.error('Error denying tournament:', error);
      setMessage('Failed to deny tournament'); // NEW: Error message
    }
  };

  const columns = [
    { Header: 'Tournament ID', accessor: 'tournament_id' },
    { Header: 'Title', accessor: 'tournament_title' },
    { Header: 'Date', accessor: 'tournament_date' },
    { Header: 'Status', accessor: 'tournament_status' },
  ];

  const actions = [
    {
      label: 'Approve',
      onClick: handleApprove,
      className: 'approve',
    },
    {
      label: 'Deny',
      onClick: handleDeny,
      className: 'deny',
    },
  ];

  const filteredTournaments = tournaments.filter(tournament =>
    tournament.tournament_status === 'Pending Approval'
  );

  return (
    <>
      <AdminHeader />
      <div className="admin-approval-page">
        <main>
          <h1 className="admin-approval-title">Admin Approval List</h1>
          {message && <p className="success-message">{message}</p>} {/* NEW: Display message */}
          <AdminReusableTable columns={columns} data={filteredTournaments} actions={actions} />
        </main>
      </div>
    </>
  );
}

export default AdminApproval;
