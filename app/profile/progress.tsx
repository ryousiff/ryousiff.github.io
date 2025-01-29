import React, { useState } from 'react';

// Define TypeScript types for the props
export interface Progress {
  id: number;
  grade: number;
  createdAt: string;
  updatedAt: string;
  object: {
    name: string;
  };
}

export interface ProgressProps {
  progresses: Progress[];
}

const DisplayProgress: React.FC<ProgressProps> = ({ progresses }) => {
  // Filter progresses with a grade >= 1
  const visibleProgresses = progresses.filter(p => p.grade >= 1);
  
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div id="progress">
      <h3>Projects Completion</h3>
      <button onClick={() => setShowDetails(prev => !prev)} className="toggle-button">
        {showDetails ? 'Hide Projects' : 'Show Projects'}
      </button>
      {showDetails && (
        <div>
          {visibleProgresses.slice(0, 1000).map((p) => (
            <div key={p.id} className="progress-item">
              <p><strong>{p.object.name}</strong></p>
              <p>Grade: Pass</p>
              <p>Starting Date: {new Date(p.createdAt).toLocaleDateString()}</p>
              <p>Completed Date: {new Date(p.updatedAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayProgress;
