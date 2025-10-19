import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import image2 from './mesas.jpg';

export function Make_Reservation({
    table,
    setreservation,
    Selecttable, setSelecttable,
    email, setemail,
    name, setname,
    time, settime,
    date, setdate,
    n_guests, set_n_guests
}) {
    const [availableTables, setAvailableTables] = useState([]);
    const [loading, setLoading] = useState(false);

    console.log(table);

    const fetchAvailableTables = async () => {
        if (!date || !time || !n_guests) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/GET_any_tables/${date}/${time}/${n_guests}/`
            );
            const data = await response.json();
            setAvailableTables(data);
            setSelecttable(null);
        } catch (err) {
            console.error("Erro ao buscar mesas disponíveis:", err);
            setAvailableTables([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (date && time && n_guests) {
            fetchAvailableTables();
        }
    }, [date, time, n_guests]);

    const makeReservation = async () => {
        if (!Selecttable) {
            alert("Selecione uma mesa antes de confirmar a reserva!");
            return;
        }
        console.log(time);
        console.log(date);
        console.log(name);
        console.log(n_guests);
        console.log(email);
        console.log(Selecttable);
        const Reservation = {
            time,
            date,
            name,
            n_guests,
            email,
            table: Selecttable,
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/create_reservation/', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Reservation),
            });
            const data = await response.json();
            setreservation(prev => [...prev, data]);
            alert("Reserva confirmada!");

            setSelecttable("");
            setname("");
            setemail("");
            set_n_guests(1);
        } catch (err) {
            console.log(err);
            alert("Erro ao confirmar a reserva.");
        }
    };

    return (
        <div className='reservation_main'>
            <div className="reservation_page">
                <h2>Fazer Reserva</h2>

                <div className="date_reserv">
                    <label>Date:</label>
                    <input
                        type="date"
                        value={date || dayjs().format('YYYY-MM-DD')}
                        onChange={e => setdate(e.target.value)}
                    />
                </div>

                <div className="time_reserv">
                    <label>Time:</label>
                    <input
                        type="time"
                        value={time || ""}
                        onChange={e => settime(e.target.value)}
                    />
                </div>

                <div className="n_guest_reserv">
                    <label>Number of guests:</label>
                    <input
                        type="number"
                        min="1"
                        value={n_guests || 1}
                        onChange={e => set_n_guests(Number(e.target.value))}
                    />
                </div>

                <div className="name_reserv">
                    <label>Nome:</label>
                    <input
                        type="text"
                        value={name || ""}
                        onChange={e => setname(e.target.value)}
                    />
                </div>

                <div className="email_reserv">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email || ""}
                        onChange={e => setemail(e.target.value)}
                    />
                </div>

                <div className="table_reserv">
                    <label>Chose a table:</label>
                    {loading ? (
                        <p>Loading available tables...</p>
                    ) : (
                        <select
                            value={Selecttable || ""}
                            onChange={e => setSelecttable(Number(e.target.value))}
                        >
                            <option value="">Select a table ... </option>
                            {!date || !time || !n_guests ? (
                                <option value="" disabled>
                                    Choose a date, hour and guests
                                </option>
                            ) : availableTables.length === 0 ? (
                                <option value="" disabled>
                                    No tables available
                                </option>
                            ) : (
                                availableTables.map(t => (
                                    <option key={t.id} value={t.id}>
                                        Table {t.id} — {t.n_seats} seats
                                    </option>
                                ))
                            )}
                        </select>
                    )}
                </div>
                <button
                    onClick={makeReservation}
                    disabled={!Selecttable}
                >
                    Confirm Reservation
                </button>

                {date && time && n_guests && !loading && (
                    <div className="available-tables-info">
                        <p>
                            {availableTables.length > 0
                                ? `${availableTables.length} mesa(s) disponível(eis)`
                                : "Nenhuma mesa disponível para os critérios selecionados"
                            }
                        </p>
                    </div>
                )}
            </div>
            <div className='image'>
                <img
                    src={image2}
                    alt="Café Couraça"
                    className="image-content"
                />
            </div>
        </div>
    );
}