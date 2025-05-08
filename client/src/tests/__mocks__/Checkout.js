import React, { useState } from 'react';

export default function Checkout() {
  const [step, setStep] = useState('shipping');
  const [showSummary, setShowSummary] = useState(false);
  const [shippingName, setShippingName] = useState('');
  const [zip, setZip] = useState('');

  const isShippingComplete = shippingName && /^\d{5}$/.test(zip);

  return (
    <div>
      <h1>Mocked Checkout Page</h1>

      <button onClick={() => setShowSummary(true)}>Show Order Summary</button>

      {showSummary && (
        <div data-testid="summary-panel">
          <p>Your Order Total</p>
          <button onClick={() => setShowSummary(false)}>✕</button>
        </div>
      )}

      {step === 'shipping' ? (
        <div>
          <label htmlFor="name">Full Name</label>
          <input id="name" value={shippingName} onChange={(e) => setShippingName(e.target.value)} />

          <label htmlFor="zip">Zip Code</label>
          <input id="zip" value={zip} onChange={(e) => setZip(e.target.value)} />

          <button
            onClick={() => setStep('payment')}
            disabled={!isShippingComplete}
          >
            Continue to Payment
          </button>
        </div>
      ) : (
        <div>
          <h2>Payment Step</h2>
          <button>Submit Order</button>
        </div>
      )}
    </div>
  );
}
