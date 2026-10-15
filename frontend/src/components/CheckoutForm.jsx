import React from 'react';
import { SHIPPING_FIELDS } from '../utils/shipping';

function CheckoutForm({ values, errors, onChange, disabled }) {
  return (
    <div className="checkout-form-box">
      <h3>Shipping Details</h3>

      {SHIPPING_FIELDS.map((field) => (
        <div className="form-group" key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          <input
            id={field.name}
            name={field.name}
            value={values[field.name]}
            onChange={(e) => onChange(field.name, e.target.value)}
            autoComplete={field.autoComplete}
            inputMode={field.inputMode}
            disabled={disabled}
          />
          {errors[field.name] && <div className="error">{errors[field.name]}</div>}
        </div>
      ))}
    </div>
  );
}

export default CheckoutForm;
