const EditBillingInfo = () => {
  return (
    <div>
      <h2>Edit Billing Information</h2>
      <form>
        <div>
          <label htmlFor='cardNumber'>Card Number:</label>
          <input type='text' id='cardNumber' name='cardNumber' required />
        </div>
        <div>
          <label htmlFor='expiryDate'>Expiry Date:</label>
          <input type='text' id='expiryDate' name='expiryDate' required />
        </div>
        <div>
          <label htmlFor='cvv'>CVV:</label>
          <input type='text' id='cvv' name='cvv' required />
        </div>
        <button type='submit'>Update Billing Info</button>
      </form>
    </div>
  );
};
export default EditBillingInfo;
