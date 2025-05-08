import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSubmit = () => {
   
    toast.success("We have your message and will be in touch soon.", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    setFullName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  return (
    <div className="contact-main">
      <div className="contact">
        <section>
          <h3>Contact us</h3>
          <div className="contact-instr">
            <h4>
              Ask us anything! We'll get back to you as soon as possible.
            </h4>
          </div>

          <div>
            <input
              type="text"
              placeholder="Name"
              ref={nameRef}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <textarea
              placeholder="What would you like to know?"
              value={message}
              onChange={(e) => {
                if (e.target.value.length <= 255) {
                  setMessage(e.target.value);
                }
              }}
            />
            <label>{message.length}/255</label>
          </div>
        </section>

        <div className="full-width-divider-2" />

        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Contact;
