import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import './App.css'
import { Home_Page } from "./Pages/home/home_page";
import { Log_In } from "./Pages/user/log_in";
import { AdminDashboard } from "./Pages/Admin_Dashboard/admin_dashboard";
import { Register } from "./Pages/user/register"

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
function App() {
  const [isadminLogin, setisadminLogin] = useState(false);
  const [iscustomerLogin, setiscustomerLogin] = useState(false);
  const [customer, setcustomer] = useState([]);
  const [admin, setadmin] = useState([]);
  const [table, settable] = useState([]);
  const [n_table, setn_table] = useState([]);
  // reservation pode ajudar a ver toda as reservas, posso me ter esquecido de usar ou trocado por outra variável

  const [reservation, setreservation] = useState([]);
  const [date, setdate] = useState(dayjs().format('YYYY-MM-DD'));
  const [time, settime] = useState("");
  const [n_guests, set_n_guests] = useState(1);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [Selecttable, setSelecttable] = useState("");
  const [password, setpassword] = useState("");
  const [activeSection, setActiveSection] = useState('Home');
  const [freetable, set_freetable] = useState([]);
  const [isadmin, setisadmin] = useState(false);
  const [loggedin, setloggedin] = useState(false);

  const location = useLocation();
  const path = location.pathname.replace('/', '');

  useEffect(() => {
    fetchAdmins();
    fetchCustomers();
    fetchReservations();
    fetchTables();
    fetchAvailableTables();
  }, []);


  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin/GETcostumers/');
      const data = await response.json();
      setcustomer(data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchAdmins = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin/GETadmins/');
      const data = await response.json();
      setadmin(data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchTables = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin/GETtables/');
      const data = await response.json();
      settable(data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchReservations = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin/GETreservations/');
      const data = await response.json();
      setreservation(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAvailableTables = async (date, time, n_guests) => {
    if (!date || !time || !n_guests) return;
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/GET_any_tables/${date}/${time}/${n_guests}/`
      );
      const data = await response.json();
      set_freetable(data || []);
    } catch (err) {
      console.log(err);
      set_freetable([]);
    }
  };


  return (
    <div id="main">
      <Routes>
        <Route path="/" element={<Navigate to="/Home" />} />
        <Route path="/Home" element={
          <Home_Page
            setisadmin={setisadmin}
            setlooggedin={setloggedin}
            loggedin={loggedin}
            isadmin={isadmin}
            freetable={freetable}
            setActiveSection={setActiveSection}
            activeSection={activeSection}
            table={table}
            settable={settable}
            setreservation={setreservation}
            Selecttable={Selecttable}
            setSelecttable={setSelecttable}
            n_table={n_table}
            setn_table={setn_table}
            email={email}
            setemail={setemail}
            name={name}
            setname={setname}
            time={time}
            settime={settime}
            date={date}
            setdate={setdate}
            n_guests={n_guests}
            set_n_guests={set_n_guests}
            isadminLogin={isadminLogin}
          />

        } />
        <Route path="/AdminDashboard" element={
          <>
            <AdminDashboard
              setadmin={setadmin}
            />
          </>
        } />
        <Route path="/Log_in" element={
          <Log_In
            setlooggedin={setloggedin}
            setisadmin={setisadmin}
            setActiveSection={setActiveSection}
            activeSection={activeSection}
            customer={customer}
            admin={admin}
            email={email}
            setemail={setemail}
            password={password}
            setpassword={setpassword}
            setiscustomerLogin={setiscustomerLogin}
            setisadminLogin={setisadminLogin}
            setcustomer={setcustomer}
          />
        } />
        <Route path="/Register" element={
          <Register
            setcustomer={setcustomer}
          />
        } />
      </Routes >
    </div >)
}
export default AppWrapper;