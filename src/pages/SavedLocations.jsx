import { useState } from 'react';
import { FiMapPin, FiPlus, FiEdit2, FiTrash2, FiCheckCircle, FiCrosshair } from 'react-icons/fi';
import { useLocations } from '../context/LocationContext';
import { useToast } from '../context/ToastContext';
import './savedlocations.css';

export default function SavedLocations() {
  const { locations, addLocation, updateLocation, deleteLocation, setDefault } = useLocations();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ label: '', address: '' });

  const startAdd = () => {
    setEditingId(null);
    setForm({ label: '', address: '' });
    setShowForm(true);
  };

  const startEdit = (loc) => {
    setEditingId(loc.id);
    setForm({ label: loc.label, address: loc.address });
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.label || !form.address) {
      showToast('Please fill in both fields', 'error');
      return;
    }
    if (editingId) {
      await updateLocation(editingId, form);
      showToast('Location updated', 'success');
    } else {
      await addLocation(form);
      showToast('Location added', 'success');
    }
    setShowForm(false);
  };

  const useGPS = () => {
    if (!navigator.geolocation) return showToast('Geolocation is not available', 'error');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm({
          label: form.label || 'Current Location',
          address: `Lat ${pos.coords.latitude.toFixed(3)}, Lng ${pos.coords.longitude.toFixed(3)}`,
        });
        showToast('GPS location filled in', 'success');
      },
      () => showToast('Could not access location', 'error')
    );
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header flex-between">
          <div>
            <span className="eyebrow">Delivery Addresses</span>
            <h1>Saved Locations</h1>
          </div>
          <button className="btn btn-primary" onClick={startAdd}><FiPlus /> Add Location</button>
        </div>

        {showForm && (
          <form className="card card-pad mt-16 saved-loc-form" onSubmit={submit}>
            <h3 style={{ fontSize: 15 }}>{editingId ? 'Edit Location' : 'Add New Location'}</h3>
            <div className="field"><label>Label (e.g. Home, Hostel, Mess)</label><input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} /></div>
            <div className="field"><label>Address</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div className="flex gap-8">
              <button type="button" className="btn btn-outline btn-sm" onClick={useGPS}><FiCrosshair /> Use Current GPS Location</button>
            </div>
            <div className="flex gap-8 mt-16">
              <button className="btn btn-primary" type="submit">Save Location</button>
              <button className="btn btn-ghost" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        )}

        {locations.length === 0 ? (
          <div className="state-block">
            <FiMapPin className="state-icon" />
            <h3>No saved locations</h3>
            <p className="muted">Add a location like Home, Hostel or Mess for faster checkout.</p>
          </div>
        ) : (
          <div className="grid mt-24">
            {locations.map((l) => (
              <div className="card card-pad saved-loc-card" key={l.id}>
                <div className="flex-between">
                  <strong>{l.label}</strong>
                  {l.isDefault && <span className="badge badge-primary"><FiCheckCircle size={11} /> Default</span>}
                </div>
                <p className="muted mt-8">{l.address}</p>
                <div className="flex gap-8 mt-16" style={{ flexWrap: 'wrap' }}>
                  {!l.isDefault && (
                    <button className="btn btn-outline btn-sm" onClick={async () => { await setDefault(l.id); showToast('Default location updated', 'success'); }}>
                      Set Default
                    </button>
                  )}
                  <button className="btn btn-outline btn-sm" onClick={() => startEdit(l)}><FiEdit2 /> Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={async () => { await deleteLocation(l.id); showToast('Location removed', 'info'); }}>
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
