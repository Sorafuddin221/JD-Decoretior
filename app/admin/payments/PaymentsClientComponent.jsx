'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function PaymentsClientComponent() {
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [shippingZones, setShippingZones] = useState([{ name: '', cost: 0 }]);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(10000);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/payment-settings');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setTaxPercentage(data.taxPercentage || 0);
            setShippingZones(data.shippingZones?.length > 0 ? data.shippingZones : [{ name: '', cost: 0 }]);
            setFreeShippingThreshold(data.freeShippingThreshold || 10000);
          }
        }
      } catch (error) {
        console.error('Error fetching payment settings:', error);
        toast.error('Error fetching payment settings.');
      }
    };

    fetchSettings();
  }, []);

  const handleAddZone = () => {
    setShippingZones([...shippingZones, { name: '', cost: 0 }]);
  };

  const handleRemoveZone = (index) => {
    const values = [...shippingZones];
    values.splice(index, 1);
    setShippingZones(values);
  };

  const handleZoneChange = (index, event) => {
    const values = [...shippingZones];
    if (event.target.name === 'name') {
      values[index].name = event.target.value;
    } else {
      values[index].cost = Number(event.target.value);
    }
    setShippingZones(values);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const newSettings = {
      taxPercentage: Number(taxPercentage),
      shippingZones,
      freeShippingThreshold: Number(freeShippingThreshold),
    };

    try {
      const response = await fetch('/api/payment-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });

      if (response.ok) {
        toast.success('Payment settings saved successfully!');
      } else {
        throw new Error('Failed to save payment settings');
      }
    } catch (error) {
      console.error('Error saving payment settings:', error);
      toast.error('Error saving payment settings.');
    }
  };

  return (
    <div className="admin-settings-container">
      <h3>Configure Payments</h3>
      <form onSubmit={handleSave} className="settings-form">
        <div className="form-group">
          <label htmlFor="taxPercentage">Tax Percentage (%):</label>
          <input
            type="number"
            id="taxPercentage"
            value={taxPercentage}
            onChange={(e) => setTaxPercentage(e.target.value)}
            placeholder="Enter tax percentage"
            min="0"
            max="100"
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label>Shipping Zones (Area Name & Cost):</label>
          {shippingZones.map((zone, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
              <input
                type="text"
                name="name"
                value={zone.name}
                onChange={(e) => handleZoneChange(index, e)}
                placeholder="Zone Name (e.g. Savar)"
                required
                style={{ flex: 2 }}
              />
              <input
                type="number"
                name="cost"
                value={zone.cost}
                onChange={(e) => handleZoneChange(index, e)}
                placeholder="Cost"
                required
                style={{ flex: 1 }}
              />
              <button 
                type="button" 
                onClick={() => handleRemoveZone(index)}
                style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
              >
                X
              </button>
            </div>
          ))}
          <button 
            type="button" 
            onClick={handleAddZone}
            style={{ background: '#52c41a', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', marginTop: '5px' }}
          >
            + Add New Zone
          </button>
        </div>
        <div className="form-group">
          <label htmlFor="freeShippingThreshold">Free Shipping Threshold Amount:</label>
          <input
            type="number"
            id="freeShippingThreshold"
            value={freeShippingThreshold}
            onChange={(e) => setFreeShippingThreshold(e.target.value)}
            placeholder="Enter amount for free shipping (e.g. 10000)"
            min="0"
            step="1"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Save Payment Settings</button>
      </form>
    </div>
  );
}

export default PaymentsClientComponent;
