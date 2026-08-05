import { useState } from 'react';
import { FiMapPin, FiChevronDown, FiCrosshair } from 'react-icons/fi';
import { useLocations } from '../context/LocationContext';
import { useToast } from '../context/ToastContext';
import './locationselector.css';

export default function LocationSelector({ compact = false }) {
  const { locations, activeLocation, setActiveLocation, addLocation } = useLocations();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [locating, setLocating] = useState(false);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not available in this browser', 'error');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          id: 'gps-' + Date.now(),
          label: 'Current Location',
          address: `Lat ${pos.coords.latitude.toFixed(3)}, Lng ${pos.coords.longitude.toFixed(3)}`,
        };
        setActiveLocation(loc);
        setLocating(false);
        setOpen(false);
        showToast('Using your current location', 'success');
      },
      () => {
        setLocating(false);
        showToast('Could not access location — check browser permissions', 'error');
      }
    );
  };

  return (
    <div className={`location-selector ${compact ? 'compact' : ''}`}>
      <button className="location-selector-trigger" onClick={() => setOpen((o) => !o)}>
        <FiMapPin />
        <span>{activeLocation?.address || activeLocation?.label || 'Select delivery location'}</span>
        <FiChevronDown size={14} />
      </button>

      {open && (
        <div className="location-selector-panel card">
          <button className="location-selector-gps" onClick={useCurrentLocation} disabled={locating}>
            <FiCrosshair /> {locating ? 'Locating…' : 'Use Current Location'}
          </button>
          <div className="location-selector-list">
            {locations.map((l) => (
              <button
                key={l.id}
                className={`location-selector-item ${activeLocation?.id === l.id ? 'active' : ''}`}
                onClick={() => { setActiveLocation(l); setOpen(false); }}
              >
                <strong>{l.label}</strong>
                <span className="muted">{l.address}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
