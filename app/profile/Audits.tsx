import React, { useState } from 'react';

// Type definitions for the audit data structure
export interface AuditsData {
  nodes: Audits[];
}

export interface Audits {
  id: string;
  grade: number | null;
  group: AuditGroup;
}

export interface AuditGroup {
  object: {
    name: string;
  };
  captainLogin: string;
}

export interface DisplayAuditsProps {
  audits: AuditsData;
}

const DisplayAudits: React.FC<DisplayAuditsProps> = ({ audits }) => {
  // Filter completed audits where grade is not null
  const completedAudits = audits.nodes.filter((audit) => audit.grade !== null);

  const [showAuditDetails, setShowAuditDetails] = useState(false);

  return (
    <div id="audits">
      <h3>Your Audits</h3>
    
      <button onClick={() => setShowAuditDetails(prev => !prev)} className="toggle-button">
        {showAuditDetails ? 'Hide Audits' : 'Show Audits'}
      </button>
      {showAuditDetails && (
        <div>
          {completedAudits.length === 0 ? (
            <p>No completed audits yet.</p>
          ) : (
            completedAudits.map((audit) => (
              <div key={audit.id} className="audit-item">
                <p><strong>{audit.group.object.name}<br></br>{audit.group.captainLogin}</strong></p>
                <p className={audit.grade >= 1 ? 'pass' : 'fail'}>
                  {audit.grade >= 1 ? 'PASS' : 'FAIL'}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DisplayAudits;
