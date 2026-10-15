import React from 'react';
import { Link } from 'react-router-dom';

function EmptyState({ title, message, linkTo, linkText }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{message}</p>
      <Link className="button-link" to={linkTo}>
        {linkText}
      </Link>
    </div>
  );
}

export default EmptyState;
