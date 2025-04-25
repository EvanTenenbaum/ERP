'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { RefreshCw, Plus, Trash, Edit } from 'lucide-react';

export default function LocationsPage() {
  const router = useRouter();
  const { showNotification } = useApp();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
    isActive: true,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);

  // Load locations from database
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        // Import database dynamically to avoid SSR issues
        const db = (await import('../../../../lib/database')).default;
        const fetchedLocations = await db.locations.findAll();
        setLocations(fetchedLocations);
      } catch (error) {
        console.error('Error fetching locations:', error);
        showNotification('Error loading locations', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [showNotification]);

  const handleInputChange = (e, field, addressField = null) => {
    const { value } = e.target;
    
    if (addressField) {
      setNewLocation(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setNewLocation(prev => ({
        ...prev,
        [field]: field === 'isActive' ? e.target.checked : value
      }));
    }
  };

  const handleEditInputChange = (e, field, addressField = null) => {
    const { value } = e.target;
    
    if (addressField) {
      setEditingLocation(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setEditingLocation(prev => ({
        ...prev,
        [field]: field === 'isActive' ? e.target.checked : value
      }));
    }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    
    try {
      // Import database dynamically to avoid SSR issues
      const db = (await import('../../../../lib/database')).default;
      
      const createdLocation = await db.locations.create(newLocation);
      
      setLocations(prev => [...prev, createdLocation]);
      setNewLocation({
        name: '',
        address: {
          street: '',
          city: '',
          state: '',
          zip: '',
          country: '',
        },
        isActive: true,
      });
      setShowAddForm(false);
      showNotification('Location added successfully', 'success');
    } catch (error) {
      console.error('Error adding location:', error);
      showNotification('Error adding location', 'error');
    }
  };

  const handleEditLocation = async (e) => {
    e.preventDefault();
    
    try {
      // Import database dynamically to avoid SSR issues
      const db = (await import('../../../../lib/database')).default;
      
      const updatedLocation = await db.locations.update(editingLocation.id, editingLocation);
      
      setLocations(prev => prev.map(loc => 
        loc.id === updatedLocation.id ? updatedLocation : loc
      ));
      setEditingLocation(null);
      showNotification('Location updated successfully', 'success');
    } catch (error) {
      console.error('Error updating location:', error);
      showNotification('Error updating location', 'error');
    }
  };

  const handleDeleteLocation = async (id) => {
    if (!confirm('Are you sure you want to delete this location?')) return;
    
    try {
      // Import database dynamically to avoid SSR issues
      const db = (await import('../../../../lib/database')).default;
      
      await db.locations.delete(id);
      
      setLocations(prev => prev.filter(loc => loc.id !== id));
      showNotification('Location deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting location:', error);
      showNotification('Error deleting location', 'error');
    }
  };

  const refreshLocations = async () => {
    try {
      setLoading(true);
      // Import database dynamically to avoid SSR issues
      const db = (await import('../../../../lib/database')).default;
      const fetchedLocations = await db.locations.findAll();
      setLocations(fetchedLocations);
      showNotification('Locations refreshed', 'success');
    } catch (error) {
      console.error('Error refreshing locations:', error);
      showNotification('Error refreshing locations', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Locations</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Location
          </button>
          <button
            onClick={refreshLocations}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Add Location Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Location</h2>
          <form onSubmit={handleAddLocation}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  value={newLocation.name}
                  onChange={(e) => handleInputChange(e, 'name')}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Status</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newLocation.isActive}
                    onChange={(e) => handleInputChange(e, 'isActive')}
                    className="mr-2"
                  />
                  <span>Active</span>
                </div>
              </div>
              <div>
                <label className="block mb-1">Street</label>
                <input
                  type="text"
                  value={newLocation.address.street}
                  onChange={(e) => handleInputChange(e, null, 'street')}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">City</label>
                <input
                  type="text"
                  value={newLocation.address.city}
                  onChange={(e) => handleInputChange(e, null, 'city')}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">State/Province</label>
                <input
                  type="text"
                  value={newLocation.address.state}
                  onChange={(e) => handleInputChange(e, null, 'state')}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">ZIP/Postal Code</label>
                <input
                  type="text"
                  value={newLocation.address.zip}
                  onChange={(e) => handleInputChange(e, null, 'zip')}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Country</label>
                <input
                  type="text"
                  value={newLocation.address.country}
                  onChange={(e) => handleInputChange(e, null, 'country')}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Save Location
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Location Form */}
      {editingLocation && (
        <div className="bg-white p-6 rounded shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Edit Location</h2>
          <form onSubmit={handleEditLocation}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  value={editingLocation.name}
                  onChange={(e) => handleEditInputChange(e, 'name')}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Status</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingLocation.isActive}
                    onChange={(e) => handleEditInputChange(e, 'isActive')}
                    className="mr-2"
                  />
                  <span>Active</span>
                </div>
              </div>
              <div>
                <label className="block mb-1">Street</label>
                <input
                  type="text"
                  value={editingLocation.address.street}
                  onChange={(e) => handleEditInputChange(e, null, 'street')}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">City</label>
                <input
                  type="text"
                  value={editingLocation.address.city}
                  onChange={(e) => handleEditInputChange(e, null, 'city')}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">State/Province</label>
                <input
                  type="text"
                  value={editingLocation.address.state}
                  onChange={(e) => handleEditInputChange(e, null, 'state')}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">ZIP/Postal Code</label>
                <input
                  type="text"
                  value={editingLocation.address.zip}
                  onChange={(e) => handleEditInputChange(e, null, 'zip')}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Country</label>
                <input
                  type="text"
                  value={editingLocation.address.country}
                  onChange={(e) => handleEditInputChange(e, null, 'country')}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                type="button"
                onClick={() => setEditingLocation(null)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Update Location
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Locations Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center">Loading locations...</td>
              </tr>
            ) : locations.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center">No locations found. Add a location to get started.</td>
              </tr>
            ) : (
              locations.map((location) => (
                <tr key={location.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{location.name}</td>
                  <td className="px-6 py-4">
                    <div>{location.address.street}</div>
                    <div>{location.address.city}, {location.address.state} {location.address.zip}</div>
                    <div>{location.address.country}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${location.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {location.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingLocation(location)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit className="w-4 h-4 inline" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLocation(location.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash className="w-4 h-4 inline" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
