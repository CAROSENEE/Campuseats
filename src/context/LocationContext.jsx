import { createContext, useContext, useEffect, useState } from 'react';
import { customerApi } from '../services/api';
import { useAuth } from './AuthContext';
const LocationContext = createContext(null);
export function LocationProvider({ children }) {
  const { user } = useAuth(); const [locations, setLocations] = useState([]); const [activeLocation, setActiveLocation] = useState(null); const [loading, setLoading] = useState(false);
  const refreshLocations = async () => { if (!user || user.role !== 'customer') { setLocations([]); setActiveLocation(null); return; } setLoading(true); try { const list = await customerApi.locations(); setLocations(list); setActiveLocation((current) => list.find((item) => String(item.id) === String(current?.id)) || list.find((item) => item.is_default) || list[0] || null); } finally { setLoading(false); } };
  useEffect(() => { refreshLocations(); }, [user?.id, user?.role]);
  const addLocation = async (loc) => { const response = await customerApi.addLocation({ label: loc.label, address: loc.address, latitude: loc.latitude, longitude: loc.longitude, deliveryInstructions: loc.deliveryInstructions, isDefault: loc.isDefault }); await refreshLocations(); return { ...loc, id: response.id }; };
  const updateLocation = async (id, data) => { await customerApi.updateLocation(id, { label: data.label, address: data.address, latitude: data.latitude, longitude: data.longitude, deliveryInstructions: data.deliveryInstructions, isDefault: data.isDefault }); await refreshLocations(); };
  const deleteLocation = async (id) => { await customerApi.deleteLocation(id); await refreshLocations(); };
  const setDefault = async (id) => { const item = locations.find((location) => String(location.id) === String(id)); if (item) await updateLocation(id, { ...item, isDefault: true }); };
  return <LocationContext.Provider value={{ locations, activeLocation, setActiveLocation, loading, refreshLocations, addLocation, updateLocation, deleteLocation, setDefault }}>{children}</LocationContext.Provider>;
}
export function useLocations() { const ctx = useContext(LocationContext); if (!ctx) throw new Error('useLocations must be used within LocationProvider'); return ctx; }
