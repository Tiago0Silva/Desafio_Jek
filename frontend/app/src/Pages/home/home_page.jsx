import { useState, useRef } from "react";
import { Make_Reservation } from "./make_reservation";
import { Link } from 'react-router-dom';
import image1 from './imagemcouraca.jpg';

export function Home_Page({
    table, settable, setreservation, Selecttable, setSelecttable, isadmin,
    n_table, setn_table, email, setemail, name, setname, time,
    settime, date, setdate, n_guests, set_n_guests, setActiveSection, freetable, setlooggedin, loggedin, setisadmin
}) {
    const reservationRef = useRef(null);

    const handleMakeReservation = () => {
        if (reservationRef.current) {
            reservationRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <div className="home">
            <div className="header_bar">
                <div className="header_title">
                    Café Couraça
                </div>
                {!loggedin && (
                    <div className="header_login">
                        <Link to="/Log_in">
                            <button onClick={() => setActiveSection("Log_in")}>Login</button>
                        </Link>
                    </div>
                )}

                {isadmin && (
                    <div className="header_dashboard">
                        <Link to="/AdminDashboard">
                            <button>Dashboard</button>
                        </Link>
                    </div>
                )}
                {loggedin && (
                    <div className="heder_log_out">
                        <button onClick={() => (setisadmin(false), setlooggedin(false))}> Log out </button>
                    </div>

                )}

            </div>
            <div className="couraca_startpage">
                <div className="images_couraca">
                    <div className="main_title">
                        <h1>Café Couraça</h1>
                        <h2>Desde 1974 nos vossos Courações</h2>
                    </div>
                    <div className="text_couraca">
                        <a>É descrito como um "Café de Estudantes" e um local onde "num lugar com tantas histórias, criamos novas memórias"</a>
                    </div>

                    <div className="reserve_button">
                        <button onClick={handleMakeReservation}>Reservar uma mesa</button>
                    </div>
                </div>
                <div className="image">
                    <img
                        src={image1}
                        alt="Café Couraça"
                        className="image-content"
                    />
                </div>
            </div>

            <div className="description_section">
                <p>É descrito como um "Café de Estudantes" e um local onde</p>
                <p>"num lugar com tantas histórias, criamos novas memórias"</p>
            </div>

            <div className="reservation_page">
                <Make_Reservation
                    freetable={freetable}
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
                />
            </div>
        </div>
    );
}