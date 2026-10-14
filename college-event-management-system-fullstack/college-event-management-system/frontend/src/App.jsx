import { useEffect, useState } from 'react';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ student_name: '', student_email: '' });
  const [notice, setNotice] = useState('');

  async function loadEvents() {
    setLoading(true); setError('');
    try {
      const response = await fetch(`${API}/events`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load events');
      setEvents(data);
    } catch (e) { setError(`${e.message}. Make sure the backend and MySQL are running.`); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadEvents(); }, []);

  async function register(e) {
    e.preventDefault(); setNotice('');
    try {
      const response = await fetch(`${API}/events/${selected.id}/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      setNotice(data.message); setForm({ student_name: '', student_email: '' });
    } catch (e) { setNotice(e.message); }
  }

  const visible = events.filter(ev => `${ev.title} ${ev.description || ''} ${ev.category || ''} ${ev.venue}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="page">
    <header className="topbar"><a className="brand" href="#home"><span className="brand-icon">✦</span> Campus<span>Events</span></a><a className="nav-link" href="#events">Explore events ↗</a></header>
    <main id="home">
      <section className="hero"><div className="eyebrow"><span className="dot"/> YOUR CAMPUS, YOUR MOMENT</div><h1>Make campus<br/><em>unforgettable.</em></h1><p>Discover what’s happening around campus. Find your people, explore your interests, and make memories that last.</p><a className="primary" href="#events">Explore events <span>↓</span></a><div className="hero-mark">CAMPUS LIFE / 2026</div></section>
      <section className="events-section" id="events"><div className="section-head"><div><div className="eyebrow muted">THE CAMPUS CALENDAR</div><h2>Upcoming events<span className="accent">.</span></h2></div><div className="search-wrap"><span>⌕</span><input aria-label="Search events" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)}/></div></div>
        {loading && <p className="state">Loading events…</p>}{error && <div className="error">{error} <button onClick={loadEvents}>Retry</button></div>}
        {!loading && !error && visible.length === 0 && <p className="state">No events found. Try another search.</p>}
        <div className="event-grid">{visible.map((ev, i) => <article className="event-card" key={ev.id}><div className={`event-art art-${i % 3}`}><span className="art-label">{ev.category || 'CAMPUS EVENT'}</span><span className="art-symbol">{['✳','◈','✺'][i % 3]}</span><span className="art-number">{String(i + 1).padStart(2, '0')}</span></div><div className="card-body"><div className="event-date">{new Date(ev.event_date).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</div><h3>{ev.title}</h3><p>{ev.description || 'Join us for this campus event.'}</p><div className="card-footer"><span>⌖ {ev.venue}</span><button onClick={() => { setSelected(ev); setNotice(''); }}>Register <span>↗</span></button></div></div></article>)}</div>
      </section>
    </main>
    <footer><a className="brand" href="#home">✦ Campus<span>Events</span></a><span>Made for campus life.</span></footer>
    {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="register-title" onClick={e => e.stopPropagation()}><button className="close" onClick={() => setSelected(null)} aria-label="Close">×</button><div className="eyebrow muted">SAVE YOUR SPOT</div><h2 id="register-title">Register for {selected.title}</h2><p className="modal-sub">{selected.venue} · {new Date(selected.event_date).toLocaleDateString()}</p><form onSubmit={register}><label>Full name<input required value={form.student_name} onChange={e => setForm({...form, student_name: e.target.value})} placeholder="Your name"/></label><label>College email<input required type="email" value={form.student_email} onChange={e => setForm({...form, student_email: e.target.value})} placeholder="you@college.edu"/></label><button className="primary submit" type="submit">Confirm registration ↗</button></form>{notice && <p className="notice" role="status">{notice}</p>}</section></div>}
  </div>;
}
