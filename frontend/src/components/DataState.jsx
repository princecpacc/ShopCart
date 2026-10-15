import React from 'react';

function DataState({ loading, error, onRetry, loadingText, errorText, children }) {
  if (loading) {
    return <p className="loading-text">{loadingText}</p>;
  }

  if (error) {
    return (
      <div className="empty-state">
        <h3>Something went wrong.</h3>
        <p>{errorText}</p>
        <button className="btn-primary" onClick={onRetry}>Try Again</button>
      </div>
    );
  }

  return children;
}

export default DataState;
