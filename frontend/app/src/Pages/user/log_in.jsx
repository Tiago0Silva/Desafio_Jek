import { useState } from 'react'
import { checkAccount } from './checkAccount'
import { useNavigate, Link } from 'react-router-dom';

export function Log_In({ setActiveSection, customer, admin, email, setemail, password, setpassword, setisadmin, setlooggedin }) {
    const [emailExist, setemailExist] = useState(true);
    const [passwordCorrect, setpasswordCorrect] = useState(true);
    const [emailExistadmin, setemailExistadmin] = useState(true);
    const [passwordCorrectadmin, setpasswordCorrectadmin] = useState(true);

    const navigate = useNavigate();

    const verifyLogin = () => {
        console.log("admins:", admin);
        console.log("custumers:", customer);
        const validCustomer = checkAccount({ setemailExist, setpasswordCorrect, email, password, Users: customer || [] });
        const validAdmin = checkAccount({ setemailExist: setemailExistadmin, setpasswordCorrect: setpasswordCorrectadmin, email, password, Users: admin || [] });
        console.log(validCustomer);
        console.log(validAdmin);
        if (validCustomer) {
            setisadmin(false);
            setlooggedin(true);
            navigate('/Home');
        }
        if (validAdmin) {
            setisadmin(true);
            setlooggedin(true);
            navigate('/Home');
        }
    };

    return (
        <div className="Card_login">
            <div className="Header">
                <h1> Log in </h1>
                <div className="login_form_group">
                    <input
                        type="email"
                        placeholder="Email ..."
                        onChange={(e) => setemail(e.target.value)}
                    />
                </div>
                <div className="login_form_group">
                    <input
                        type="password"
                        placeholder="Password ..."
                        onChange={(e) => setpassword(e.target.value)}
                    />
                </div>

                <div>
                    <button className="login_button" onClick={verifyLogin}> Entrar </button>
                    {(!emailExist && !emailExistadmin) && (<p style={{ color: 'red' }}>Email não está associado a nenhuma conta</p>)}
                    {((emailExist || emailExistadmin) && (!passwordCorrect && !passwordCorrectadmin)) && (<p style={{ color: 'red' }}>A password está incorreta</p>)}
                </div>

                <Link to="/Register">
                    <button className="register_button"> Register </button>
                </Link>
            </div>
        </div>
    );
}