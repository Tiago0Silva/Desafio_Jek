import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';


export function AdminDashboard({ setadmin }) {
    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [activeTab, setActiveTab] = useState("reservations");

    const [dailySummary, setDailySummary] = useState(null);
    const [allReservations, setAllReservations] = useState([]);
    const [tables, setTables] = useState([]);

    const fetchDailySummary = async () => {
        try {
            // Ou fazer chamadas individuais:
            const [resResp, guestsResp, occupiedResp, availableResp] = await Promise.all([
                fetch("http://127.0.0.1:8000/api/admin/total-reservations-today/"),
                fetch("http://127.0.0.1:8000/api/admin/total-guests-today/"),
                fetch("http://127.0.0.1:8000/api/admin/occupied-tables-today/"),
                fetch("http://127.0.0.1:8000/api/admin/available-tables-today/")
            ]);

            const summaryData = {
                total_reservations: (await resResp.json()).total_reservations,
                total_guests: (await guestsResp.json()).total_guests,
                occupied_tables: (await occupiedResp.json()).occupied_tables,
                available_tables: (await availableResp.json()).available_tables
            };

            setDailySummary({ summary: summaryData });
        } catch (err) {
            console.error("Erro ao obter sumário:", err);
        }
    };

    const fetchReservations = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/admin/GETreservations/");
            const data = await response.json();
            setAllReservations(data);
        } catch (err) {
            console.error("Erro ao obter reservas:", err);
        }
    };

    const fetchTables = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/admin/GETtables/");
            const data = await response.json();
            setTables(data);
        } catch (err) {
            console.error("Erro ao obter mesas:", err);
        }
    };

    const updateSeats = async (id, newSeats) => {
        try {
            await fetch(`http://127.0.0.1:8000/api/admin/alter_n_seats/${id}/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ n_seats: newSeats }),
            });
            fetchTables();
        } catch (err) {
            console.error("Erro ao atualizar lugares:", err);
        }
    };

    const addAdmin = async (e) => {
        e.preventDefault();
        const newAdmin = { name, email, password };
        try {
            const response = await fetch("http://127.0.0.1:8000/api/add_admins/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAdmin),
            });
            const data = await response.json();
            setadmin((prev) => [...prev, data]);
            setname("");
            setemail("");
            setpassword("");
            alert("Admin criado com sucesso!");
        } catch (err) {
            console.error("Erro ao criar admin:", err);
        }
    };

    useEffect(() => {
        if (activeTab === "summary") fetchDailySummary();
        if (activeTab === "reservations") fetchReservations();
        if (activeTab === "tables") fetchTables();
    }, [activeTab]);

    console.log(dailySummary);
    return (
        <div className="admin_dashboard">
            <div className=" Retunr_home">
                <Link to="/Home">
                    <button> Home </button>
                </Link>
            </div>
            <div className="nav">
                <nav>
                    <div className="Nav_buttons">
                        <a onClick={() => setActiveTab("reservations")}>Reservations</a>
                        <a onClick={() => setActiveTab("summary")}>Daily Summary</a>
                        <a onClick={() => setActiveTab("tables")}>Edit table seats</a>
                        <a onClick={() => setActiveTab("admins")}>Create Admin</a>
                    </div>
                </nav>
            </div>

            <div className="dashboard-content">
                {activeTab === "reservations" && (
                    <div>
                        <h2>All Reservations</h2>
                        {allReservations.map((r) => (
                            <div key={r.id}>
                                {r.name} - {r.date} {r.time} - Table: {r.table}
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "summary" && dailySummary && (
                    <div>
                        <h2>Day Summary</h2>
                        <p>Total reservations: {dailySummary.summary.total_reservations}</p>
                        <p>Total guests: {dailySummary.summary.total_guests}</p>
                        <p>Tables ocupied: {dailySummary.summary.occupied_tables}</p>
                        <p>Available tables: {dailySummary.summary.available_tables}</p>
                    </div>
                )}

                {activeTab === "tables" && (
                    <div>
                        <h2>Edit table seats</h2>
                        {tables.map((t) => (
                            <div key={t.id}>
                                Table {t.id} - Seats: {t.n_seats}
                                <input
                                    type="number"
                                    min="1"
                                    defaultValue={t.n_seats}
                                    onBlur={(e) => updateSeats(t.id, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "admins" && (
                    <div>
                        <h2>Create New Admin</h2>
                        <form onSubmit={addAdmin}>
                            <input
                                type="text"
                                placeholder="Nome"
                                value={name}
                                onChange={(e) => setname(e.target.value)}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setemail(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                                required
                            />
                            <button type="submit">Create Admin</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
