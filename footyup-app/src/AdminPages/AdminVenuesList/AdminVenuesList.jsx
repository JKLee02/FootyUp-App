import { useEffect, useState } from 'react';
import AdminHeader from '../../Components/AdminHeaderComponent/AdminHeader';
import AdminReusableTable from '../../Components/AdminReusableTable/AdminReusableTable';
import './AdminVenuesList.css';
import axios from 'axios';

function AdminVenuesList() {
    const [venues, setVenues] = useState([]);

    // Fetch venues data
    useEffect(() => {
        axios.get('http://localhost:8081/uservenue')
            .then((response) => {
                setVenues(response.data);
            })
            .catch((error) => {
                console.error('Error fetching venues:', error);
            });
    }, []);

    // Define table columns
    const columns = [
        { Header: 'ID', accessor: 'venue_id' },
        { Header: 'Name', accessor: 'venue_name' },
        { Header: 'Address', accessor: 'venue_address' },
        { Header: 'Description', accessor: 'venue_description' },
        { Header: 'Image URL', accessor: 'venue_image' },
    ];

    // Define actions (Edit and Delete)
    const actions = [
        {
            label: 'Edit',
            className: 'edit-btn',
            onClick: (row) => handleEdit(row)
        },
        {
            label: 'Delete',
            className: 'delete-btn',
            onClick: (row) => handleDelete(row)
        }
    ];

    // Handle Edit
    const handleEdit = (venue) => {
        const updatedName = prompt('Enter new name:', venue.venue_name);
        const updatedAddress = prompt('Enter new address:', venue.venue_address);
        const updatedDescription = prompt('Enter new description:', venue.venue_description);
        const updatedImage = prompt('Enter new image URL:', venue.venue_image);

        if (updatedName && updatedAddress && updatedDescription && updatedImage) {
            axios.put(`http://localhost:8081/venue/${venue.venue_id}`, {
                venue_name: updatedName,
                venue_address: updatedAddress,
                venue_description: updatedDescription,
                venue_image: updatedImage
            })
                .then(() => {
                    alert('Venue updated successfully!');
                    window.location.reload(); // Refresh data
                })
                .catch((error) => {
                    console.error('Error updating venue:', error);
                    alert('Failed to update venue');
                });
        }
    };

    // Handle Delete
    const handleDelete = (venue) => {
        if (window.confirm(`Are you sure you want to delete ${venue.venue_name}?`)) {
            axios.delete(`http://localhost:8081/venue/${venue.venue_id}`)
                .then(() => {
                    alert('Venue deleted successfully!');
                    setVenues(venues.filter((v) => v.venue_id !== venue.venue_id)); // Update table data
                })
                .catch((error) => {
                    console.error('Error deleting venue:', error);
                    alert('Failed to delete venue');
                });
        }
    };

    // Add new venue
    const handleAddVenue = () => {
        const name = prompt('Enter venue name:');
        const address = prompt('Enter venue address:');
        const description = prompt('Enter venue description:');
        const image = prompt('Enter venue image URL:');

        if (name && address && description && image) {
            axios.post('http://localhost:8081/venue', {
                venue_name: name,
                venue_address: address,
                venue_description: description,
                venue_image: image
            })
                .then(() => {
                    alert('Venue added successfully!');
                    window.location.reload(); // Refresh data
                })
                .catch((error) => {
                    console.error('Error adding venue:', error);
                    alert('Failed to add venue');
                });
        }
    };

    return (
        <div>
            <AdminHeader />
            <main className="admin-venues-page">
                <h1 className="admin-venues-title">Venues List</h1>
                <button className="add-venue-btn" onClick={handleAddVenue}>
                    Add Venue
                </button>
                <AdminReusableTable columns={columns} data={venues} actions={actions} />
            </main>
        </div>
    );
}

export default AdminVenuesList;
