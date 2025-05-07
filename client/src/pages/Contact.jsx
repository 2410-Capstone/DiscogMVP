import { useState } from "react";
import { useRef, useEffect } from "react";
import {useNavigate} from "react-router-dom";

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


  return (
    <div className="contact-main">
      <div className="contact">
        <section className="">
          <h3>Contact us</h3>
          <div className="contact-instr">
            <h4>
              Ask us anything! We'll get back to you as soon as possible. 
            </h4>
          </div>
          <div className="">
            <input
              type="text"
               placeholder="Name"
               ref={nameRef}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="">
            <input
              type="text"
               placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="">
            <input
              type="text"
              placeholder="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="">
            <textarea
              type="text"
              placeholder="What would you like to know? "
              value={message}
              onChange={(e) => {
                
                if (e.target.value.length <= 255) setMessage(e.target.value); 
                <label>Enter your message here. {message.length}/255</label>
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
