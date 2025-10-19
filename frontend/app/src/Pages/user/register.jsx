import { useState } from 'react'
import { Link } from 'react-router-dom';

export function Register({ setcustomer }) {
    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [phone_number, setphone_number] = useState('');
    const [password, setpassword] = useState('');
    const [NIF, setNIF] = useState([]);

    const addCustomer = async () => {
        const Customer = {
            name,
            phone_number,
            NIF,
            email,
            password,
        };
        try {
            const response = await fetch("http://127.0.0.1:8000/api/add_customer/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(Customer),
            });
            const data = await response.json();
            setcustomer((prev) => [...prev, data]);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <div className="register-bg">
                <div className="register-card">
                    <h2>Create Account</h2>
                    <div className="register-form-group">
                        <input
                            type="text"
                            placeholder="Nome ..."
                            onChange={(e) => setname(e.target.value)}
                        />
                    </div>
                    <div className="register-form-group">
                        <input
                            type="email"
                            placeholder="Email ..."
                            onChange={(e) => setemail(e.target.value)}
                        />
                    </div>
                    <div className="register-form-group">
                        <input
                            type="number"
                            placeholder="Telemóvel..."
                            onChange={(e) => setphone_number(e.target.value)}
                        />
                    </div>
                    <div className="register-form-group">
                        <input
                            type="NIF"
                            placeholder="NIF ..."
                            onChange={(e) => setNIF(e.target.value)}
                        />
                    </div>
                    <div className="register-form-group">
                        <input
                            type="password"
                            placeholder="Escolha uma senha..."
                            onChange={(e) => setpassword(e.target.value)}
                        />
                    </div>
                    <Link to="/Log_in">
                        <button className="register-btn" onClick={addCustomer}> Create account</button>
                    </Link>

                    <Link to="/Home">
                        <button className="register-btn" > Home Page </button>
                    </Link>
                </div>
            </div>
        </>
    );
}