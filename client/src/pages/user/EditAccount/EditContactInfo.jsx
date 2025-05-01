const EditContactInfo = () => {
  return (
    <div>
      <h2>Edit Contact Information</h2>
      <form>
        <div>
          <label htmlFor='email'>Email:</label>
          <input type='email' id='email' name='email' required />
        </div>
        <div>
          <label htmlFor='phone'>Phone:</label>
          <input type='tel' id='phone' name='phone' required />
        </div>
        <button type='submit'>Save Changes</button>
      </form>
    </div>
  );
};
export default EditContactInfo;
