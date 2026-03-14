'use client';

import React from 'react';
import CampaignIcon from '@mui/icons-material/Campaign';
import '../componentStyles/Notice.css';

const Notice = ({ text, show }) => {
  if (!show || !text) return null;

  return (
    <div className="notice-section">
      <div className="notice-badge">
        <CampaignIcon className="notice-icon" />
        <span>NOTICE</span>
      </div>
      <div className="notice-container">
        <div className="notice-content">
          <span>{text}</span>
          <span className="notice-divider">✦</span>
          <span>{text}</span>
          <span className="notice-divider">✦</span>
        </div>
      </div>
    </div>
  );
};

export default Notice;
