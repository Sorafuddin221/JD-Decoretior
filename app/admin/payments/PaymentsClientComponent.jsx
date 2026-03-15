'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function PaymentsClientComponent() {
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [shippingZones, setShippingZones] = useState([{ name: '', cost: 0 }]);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(10000);
  const [activeDivisions, setActiveDivisions] = useState(["Rajshahi"]);
  const [activeDistricts, setActiveDistricts] = useState(["Naogaon"]);
  const [bkashNumber, setBkashNumber] = useState('');
  const [bkashInstructions, setBkashInstructions] = useState('');
  const [rocketNumber, setRocketNumber] = useState('');
  const [rocketInstructions, setRocketInstructions] = useState('');
  const [nagadNumber, setNagadNumber] = useState('');
  const [nagadInstructions, setNagadInstructions] = useState('');
  const [securityDepositPercentage, setSecurityDepositPercentage] = useState(0);

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
            setActiveDivisions(data.activeDivisions?.length > 0 ? data.activeDivisions : ["Rajshahi"]);
            setActiveDistricts(data.activeDistricts?.length > 0 ? data.activeDistricts : ["Naogaon"]);
            setBkashNumber(data.bkashNumber || '');
            setBkashInstructions(data.bkashInstructions || '');
            setRocketNumber(data.rocketNumber || '');
            setRocketInstructions(data.rocketInstructions || '');
            setNagadNumber(data.nagadNumber || '');
            setNagadInstructions(data.nagadInstructions || '');
            setSecurityDepositPercentage(data.securityDepositPercentage || 0);
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
      activeDivisions,
      activeDistricts,
      bkashNumber,
      bkashInstructions,
      rocketNumber,
      rocketInstructions,
      nagadNumber,
      nagadInstructions,
      securityDepositPercentage: Number(securityDepositPercentage),
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
        <div className="form-group" style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '15px' }}>Service Area Control</h4>
          
          <div style={{ marginBottom: '20px' }}>
            <label>Active Divisions:</label>
            {activeDivisions.map((div, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                <input 
                  type="text" 
                  value={div} 
                  onChange={(e) => {
                    const newDivs = [...activeDivisions];
                    newDivs[index] = e.target.value;
                    setActiveDivisions(newDivs);
                  }}
                  placeholder="e.g. Rajshahi"
                />
                <button type="button" onClick={() => setActiveDivisions(activeDivisions.filter((_, i) => i !== index))} style={{ padding: '5px 10px', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px' }}>X</button>
              </div>
            ))}
            <button type="button" onClick={() => setActiveDivisions([...activeDivisions, ""])} style={{ fontSize: '12px', background: '#eee', border: '1px solid #ccc', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}>+ Add Division</button>
          </div>

          <div>
            <label>Active Districts:</label>
            {activeDistricts.map((dist, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                <input 
                  type="text" 
                  value={dist} 
                  onChange={(e) => {
                    const newDists = [...activeDistricts];
                    newDists[index] = e.target.value;
                    setActiveDistricts(newDists);
                  }}
                  placeholder="e.g. Naogaon"
                />
                <button type="button" onClick={() => setActiveDistricts(activeDistricts.filter((_, i) => i !== index))} style={{ padding: '5px 10px', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px' }}>X</button>
              </div>
            ))}
            <button type="button" onClick={() => setActiveDistricts([...activeDistricts, ""])} style={{ fontSize: '12px', background: '#eee', border: '1px solid #ccc', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}>+ Add District</button>
          </div>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>* Customers will only see these options on the shipping page.</p>
        </div>

        <div className="form-group" style={{ background: '#fff0f6', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffd6e7' }}>
          <h4 style={{ marginBottom: '15px', color: '#d12053' }}>bKash Payment Settings</h4>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="bkashNumber">bKash Number (Personal/Merchant):</label>
            <input
              type="text"
              id="bkashNumber"
              value={bkashNumber}
              onChange={(e) => setBkashNumber(e.target.value)}
              placeholder="e.g. 017XXXXXXXX"
              style={{ border: '1px solid #ffadd2' }}
            />
          </div>
          <div>
            <label htmlFor="bkashInstructions">Instructions for Customers:</label>
            <textarea
              id="bkashInstructions"
              value={bkashInstructions}
              onChange={(e) => setBkashInstructions(e.target.value)}
              placeholder="Instructions like: Please Send Money to this number..."
              rows="3"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ffadd2', outline: 'none' }}
            />
          </div>
        </div>

        <div className="form-group" style={{ background: '#f9f0ff', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #d3adf7' }}>
          <h4 style={{ marginBottom: '15px', color: '#722ed1' }}>Rocket Payment Settings</h4>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="rocketNumber">Rocket Number (Personal/Merchant):</label>
            <input
              type="text"
              id="rocketNumber"
              value={rocketNumber}
              onChange={(e) => setRocketNumber(e.target.value)}
              placeholder="e.g. 017XXXXXXXXX"
              style={{ border: '1px solid #d3adf7' }}
            />
          </div>
          <div>
            <label htmlFor="rocketInstructions">Instructions for Customers:</label>
            <textarea
              id="rocketInstructions"
              value={rocketInstructions}
              onChange={(e) => setRocketInstructions(e.target.value)}
              placeholder="Instructions like: Please Send Money to this number..."
              rows="3"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d3adf7', outline: 'none' }}
            />
          </div>
        </div>

        <div className="form-group" style={{ background: '#fff2e8', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffbb96' }}>
          <h4 style={{ marginBottom: '15px', color: '#d4380d' }}>Nagad Payment Settings</h4>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="nagadNumber">Nagad Number (Personal/Merchant):</label>
            <input
              type="text"
              id="nagadNumber"
              value={nagadNumber}
              onChange={(e) => setNagadNumber(e.target.value)}
              placeholder="e.g. 017XXXXXXXX"
              style={{ border: '1px solid #ffbb96' }}
            />
          </div>
          <div>
            <label htmlFor="nagadInstructions">Instructions for Customers:</label>
            <textarea
              id="nagadInstructions"
              value={nagadInstructions}
              onChange={(e) => setNagadInstructions(e.target.value)}
              placeholder="Instructions like: Please Send Money to this number..."
              rows="3"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ffbb96', outline: 'none' }}
            />
          </div>
        </div>

        <div className="form-group" style={{ background: '#e6f7ff', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #91d5ff' }}>
          <h4 style={{ marginBottom: '15px', color: '#0050b3' }}>Security Deposit Settings</h4>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="securityDepositPercentage">Security Deposit Percentage (%):</label>
            <input
              type="number"
              id="securityDepositPercentage"
              value={securityDepositPercentage}
              onChange={(e) => setSecurityDepositPercentage(e.target.value)}
              placeholder="e.g. 20"
              min="0"
              max="100"
              step="1"
              style={{ border: '1px solid #69c0ff' }}
            />
          </div>
          <p style={{ fontSize: '12px', color: '#666' }}>* This percentage will be calculated from the total rental price and added as a refundable deposit.</p>
        </div>

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
