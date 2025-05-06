import { useState } from "react";

const Contact = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="contact-main">
      <div className="contact">
        <section className="">
          <h3>Contact us!</h3>

          <div className="">
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="">
            <label>Your email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="">
            <label>Phone (optional)</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="">
            <label>Enter your message here. {message.length}/255</label>
            <textarea
              type="text"
              value={message}
              onChange={(e) => {
                if (e.target.value.length <= 255) setMessage(e.target.value);
              }}
            />
          </div>
        </section>

        <div className="full-width-divider-2" />

        <button className="" onClick={() => {}}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Contact;
