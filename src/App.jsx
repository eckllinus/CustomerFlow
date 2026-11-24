
import { useState } from 'react'

const initialCases = [
  { id: 'CF-001', company: 'Müller Maschinenbau', subject: 'Ersatzteil für CNC-Fräse', type: 'Ersatzteil', status: 'Neu', priority: 'Hoch', contact: 'Thomas Müller', date: '24.11.2026', assigned: 'Max Mustermann' },
  { id: 'CF-002', company: 'Schneider Technik GmbH', subject: 'Störung an Anlage 04', type: 'Service', status: 'In Bearbeitung', priority: 'Dringend', contact: 'Sabine Schneider', date: '23.11.2026', assigned: 'Anna Becker' },
  { id: 'CF-003', company: 'Industriebedarf Weber', subject: 'Angebot für Wartung', type: 'Angebot', status: 'Warten auf Rückmeldung', priority: 'Normal', contact: 'Michael Weber', date: '22.11.2026', assigned: 'Max Mustermann' },
  { id: 'CF-004', company: 'Kraftwerk Anlagenbau', subject: 'Technische Rückfrage', type: 'Technische Frage', status: 'Abgeschlossen', priority: 'Normal', contact: 'Julia Kraft', date: '21.11.2026', assigned: 'Anna Becker' },
]

const statuses = ['Neu', 'In Bearbeitung', 'Warten auf Rückmeldung', 'Abgeschlossen']

function App() {
  const [page, setPage] = useState('Übersicht')
  const [cases, setCases] = useState(initialCases)
  const [selectedId, setSelectedId] = useState('CF-001')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Alle')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState({})
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Ersatzteilverfügbarkeit prüfen', done: false, caseId: 'CF-001' },
    { id: 2, title: 'Kunden über Reparatur informieren', done: false, caseId: 'CF-002' },
    { id: 3, title: 'Wartungsangebot nachfassen', done: true, caseId: 'CF-003' },
  ])
  const [newTask, setNewTask] = useState('')
  const [newCustomer, setNewCustomer] = useState('')
  const [customers, setCustomers] = useState([
    { name: 'Müller Maschinenbau', contact: 'Thomas Müller', email: 'thomas@mueller.example' },
    { name: 'Schneider Technik GmbH', contact: 'Sabine Schneider', email: 'sabine@schneider.example' },
    { name: 'Industriebedarf Weber', contact: 'Michael Weber', email: 'michael@weber.example' },
    { name: 'Kraftwerk Anlagenbau', contact: 'Julia Kraft', email: 'julia@kraftwerk.example' },
  ])

  const selected = cases.find(c => c.id === selectedId) || cases[0]
  const filtered = cases.filter(c =>
    `${c.id} ${c.company} ${c.subject} ${c.contact}`.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'Alle' || c.status === filter)
  )

  function updateCase(field, value) {
    setCases(old => old.map(c => c.id === selected.id ? { ...c, [field]: value } : c))
  }

  function sendMessage() {
    if (!message.trim()) return
    setMessages(old => ({
      ...old,
      [selected.id]: [...(old[selected.id] || []), { text: message, sender: 'Mitarbeiter', time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) }]
    }))
    setMessage('')
  }

  function addTask() {
    if (!newTask.trim()) return
    setTasks(old => [...old, { id: Date.now(), title: newTask, done: false, caseId: selected.id }])
    setNewTask('')
  }

  function addCustomer() {
    if (!newCustomer.trim()) return
    setCustomers(old => [...old, { name: newCustomer, contact: 'Noch offen', email: 'Noch offen' }])
    setNewCustomer('')
  }

  const nav = [
    { name: 'Übersicht', icon: '▦' },
    { name: 'Alle Vorgänge', icon: '▤' },
    { name: 'Aufgaben', icon: '◷' },
    { name: 'Kunden', icon: '♧' },
    { name: 'Einstellungen', icon: '⚙' },
  ]

  return (
    <div className="app">
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #f4f6fa; color: #17243a; font-family: Arial, sans-serif; }
        button,input,select,textarea { font: inherit; }
        button { cursor: pointer; }
        .sidebar { position: fixed; inset: 0 auto 0 0; width: 240px; background: #14243a; color: white; padding: 27px 17px; }
        .brand { font-size: 23px; font-weight: 800; margin: 0 10px 7px; }
        .brand span { color: #55c6a5; }
        .tagline { font-size: 12px; color: #9eafc4; margin: 0 10px 40px; }
        .nav-label { color: #8294ab; font-size: 10px; letter-spacing: 1.3px; margin: 24px 10px 10px; }
        .nav-item { width: 100%; padding: 12px; border: 0; border-radius: 8px; color: #d4deea; background: transparent; text-align: left; margin: 3px 0; }
        .nav-item.active,.nav-item:hover { background: #293e58; color: white; }
        .main { margin-left: 240px; padding: 30px 35px; max-width: 1600px; }
        .top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; gap: 15px; }
        .eyebrow { color: #8290a3; font-size: 11px; margin-bottom: 7px; }
        h1 { font-size: 27px; margin: 0; }
        .welcome { color: #7d899b; font-size: 13px; margin-top: 7px; }
        .profile { background: white; border: 1px solid #e5eaf1; border-radius: 9px; padding: 11px 14px; font-size: 12px; }
        .stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 22px; }
        .stat,.panel { background: white; border: 1px solid #e5eaf1; border-radius: 12px; }
        .stat { padding: 18px; }
        .stat-label { color: #78869a; font-size: 12px; }
        .stat-number { font-size: 27px; font-weight: 750; margin-top: 9px; }
        .stat-note { color: #8a96a8; font-size: 11px; margin-top: 5px; }
        .columns { display: grid; grid-template-columns: minmax(0,1.2fr) minmax(300px,.8fr); gap: 17px; align-items: start; }
        .panel { overflow: hidden; }
        .panel-head { padding: 18px 20px; border-bottom: 1px solid #edf0f5; }
        .panel-head h2 { font-size: 16px; margin: 0; }
        .panel-head p { font-size: 12px; color: #8793a5; margin: 6px 0 0; }
        .tools { display: flex; gap: 9px; padding: 13px 16px; border-bottom: 1px solid #edf0f5; }
        input,select,textarea { border: 1px solid #dce3ed; border-radius: 8px; padding: 10px; background: white; color: #17243a; }
        .tools input { flex: 1; min-width: 0; }
        .tools select { max-width: 170px; }
        .case-list { padding: 5px 12px 12px; }
        .case { width: 100%; text-align: left; border: 0; border-bottom: 1px solid #edf0f5; padding: 14px 10px; background: white; border-radius: 7px; }
        .case:hover,.case.chosen { background: #f1f6fd; }
        .case-top { display: flex; justify-content: space-between; align-items: center; gap: 7px; }
        .muted { color: #8490a2; font-size: 11px; }
        .case-title { font-size: 13px; font-weight: 700; margin: 8px 0 5px; }
        .case-company { color: #7d899b; font-size: 12px; }
        .pill { font-size: 10px; padding: 5px 8px; border-radius: 20px; background: #edf2f8; white-space: nowrap; }
        .detail { padding: 20px; }
        .detail h2 { font-size: 19px; margin: 10px 0 7px; }
        .detail-company { font-size: 13px; color: #7d899b; margin-bottom: 18px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding: 15px 0; border-top: 1px solid #edf0f5; border-bottom: 1px solid #edf0f5; }
        .info-label { color: #8290a3; font-size: 11px; margin-bottom: 5px; }
        .info-value { font-size: 12px; font-weight: 650; }
        .section-title { font-size: 13px; font-weight: 700; margin: 19px 0 9px; }
        .full { width: 100%; }
        .primary { background: #167b66; color: white; border: 0; padding: 10px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; }
        .secondary { background: white; border: 1px solid #dce3ed; padding: 9px 12px; border-radius: 8px; font-size: 12px; }
        .chat { margin-top: 13px; background: #f7f9fc; border-radius: 9px; padding: 12px; }
        .bubble { background: white; border: 1px solid #e5eaf1; border-radius: 9px; padding: 10px; margin: 7px 0; font-size: 12px; }
        .bubble small { display: block; color: #8290a3; margin-bottom: 5px; }
        .detail textarea { width: 100%; min-height: 65px; margin-top: 8px; }
        .message-row { display: flex; gap: 8px; align-items: stretch; }
        .message-row textarea { flex: 1; }
        .content-panel { background: white; border: 1px solid #e5eaf1; border-radius: 12px; padding: 20px; }
        .content-panel h2 { font-size: 17px; margin: 0 0 8px; }
        .content-panel p { color: #8290a3; font-size: 12px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
        .table th,.table td { text-align: left; padding: 13px 10px; border-bottom: 1px solid #edf0f5; }
        .table th { color: #8290a3; font-weight: 600; }
        .task { display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #edf0f5; padding: 14px 0; font-size: 13px; }
        .task.done span { text-decoration: line-through; color: #8490a2; }
        .form-row { display: flex; gap: 9px; margin: 15px 0; }
        .form-row input { flex: 1; min-width: 0; }
        .setting-row { padding: 15px 0; border-bottom: 1px solid #edf0f5; font-size: 13px; }
        .empty { padding: 25px; text-align: center; color: #8290a3; font-size: 12px; }
        @media(max-width: 950px) { .sidebar { width: 190px; } .main { margin-left: 190px; padding: 22px 16px; } .stats { grid-template-columns: repeat(2,1fr); } .columns { grid-template-columns: 1fr; } }
        @media(max-width: 620px) { .sidebar { position: static; width: auto; padding: 17px; } .tagline,.nav-label { display: none; } .nav-item { width: auto; margin-right: 3px; } .main { margin: 0; padding: 17px 12px; } .stats { gap: 8px; } .stat { padding: 12px; } .top { align-items: flex-start; } .profile { display: none; } .tools { flex-wrap: wrap; } }
      `}</style>

      <aside className="sidebar">
        <div className="brand">Customer<span>Flow</span></div>
        <div className="tagline">Vom Kundenanliegen zum Umsatz.</div>
        <div className="nav-label">ARBEITSPLATZ</div>
        {nav.slice(0,4).map(item => (
          <button key={item.name} className={`nav-item ${page === item.name ? 'active' : ''}`} onClick={() => setPage(item.name)}>
            {item.icon} &nbsp; {item.name}
          </button>
        ))}
        <div className="nav-label">VERWALTUNG</div>
        <button className={`nav-item ${page === 'Einstellungen' ? 'active' : ''}`} onClick={() => setPage('Einstellungen')}>⚙ &nbsp; Einstellungen</button>
        <div style={{ position: 'absolute', bottom: 25, left: 25, color: '#9eafc4', fontSize: 11 }}>Demo-Arbeitsbereich</div>
      </aside>

      <main className="main">
        <header className="top">
          <div>
            <div className="eyebrow">CUSTOMERFLOW / {page.toUpperCase()}</div>
            <h1>{page === 'Übersicht' ? 'Guten Morgen 👋' : page}</h1>
            <div className="welcome">
              {page === 'Übersicht' ? 'Hier ist die Übersicht deiner Kundenanliegen.' : `Verwalte hier ${page.toLowerCase()} in CustomerFlow.`}
            </div>
          </div>
          <div className="profile">● &nbsp; Müller Maschinenbau</div>
        </header>

        {page === 'Übersicht' && <>
          <section className="stats">
            <div className="stat"><div className="stat-label">Alle Vorgänge</div><div className="stat-number">{cases.length}</div><div className="stat-note">Im System</div></div>
            <div className="stat"><div className="stat-label">Neue Vorgänge</div><div className="stat-number">{cases.filter(c => c.status === 'Neu').length}</div><div className="stat-note">Noch nicht bearbeitet</div></div>
            <div className="stat"><div className="stat-label">In Bearbeitung</div><div className="stat-number">{cases.filter(c => c.status === 'In Bearbeitung').length}</div><div className="stat-note">Aktuell in Arbeit</div></div>
            <div className="stat"><div className="stat-label">Abgeschlossen</div><div className="stat-number">{cases.filter(c => c.status === 'Abgeschlossen').length}</div><div className="stat-note">Erfolgreich erledigt</div></div>
          </section>
          <div className="columns">
            <CaseList cases={cases} filtered={filtered} selected={selected} setSelectedId={setSelectedId} search={search} setSearch={setSearch} filter={filter} setFilter={setFilter}/>
            <CaseDetail selected={selected} updateCase={updateCase} messages={messages} message={message} setMessage={setMessage} sendMessage={sendMessage}/>
          </div>
        </>}

        {page === 'Alle Vorgänge' && <div className="content-panel">
          <h2>Alle Kundenanliegen</h2><p>Wähle einen Vorgang aus, um ihn zu bearbeiten.</p>
          <div className="tools"><input placeholder="Vorgang oder Kunde suchen..." value={search} onChange={e => setSearch(e.target.value)}/><select value={filter} onChange={e => setFilter(e.target.value)}><option>Alle</option>{statuses.map(s => <option key={s}>{s}</option>)}</select></div>
          <table className="table"><thead><tr><th>Nummer</th><th>Kunde</th><th>Anliegen</th><th>Status</th><th>Priorität</th><th></th></tr></thead><tbody>
            {filtered.map(c => <tr key={c.id}><td>{c.id}</td><td>{c.company}</td><td>{c.subject}</td><td>{c.status}</td><td>{c.priority}</td><td><button className="secondary" onClick={() => {setSelectedId(c.id);setPage('Übersicht')}}>Öffnen</button></td></tr>)}
          </tbody></table>
          {filtered.length === 0 && <div className="empty">Keine Vorgänge gefunden.</div>}
        </div>}

        {page === 'Aufgaben' && <div className="content-panel">
          <h2>Aufgaben verwalten</h2><p>Interne Aufgaben rund um eure Kundenanliegen.</p>
          <div className="form-row"><input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Neue Aufgabe eingeben..."/><button className="primary" onClick={addTask}>Hinzufügen</button></div>
          {tasks.map(task => <div className={`task ${task.done ? 'done' : ''}`} key={task.id}><input type="checkbox" checked={task.done} onChange={e => setTasks(old => old.map(t => t.id === task.id ? {...t,done:e.target.checked} : t))}/><span>{task.title}</span><small className="muted">{task.caseId}</small></div>)}
        </div>}

        {page === 'Kunden' && <div className="content-panel">
          <h2>Kundenübersicht</h2><p>Unternehmen und Ansprechpartner.</p>
          <div className="form-row"><input value={newCustomer} onChange={e => setNewCustomer(e.target.value)} placeholder="Neuen Firmennamen eingeben..."/><button className="primary" onClick={addCustomer}>Kunde hinzufügen</button></div>
          <table className="table"><thead><tr><th>Unternehmen</th><th>Ansprechpartner</th><th>E-Mail</th></tr></thead><tbody>{customers.map((c,i)=><tr key={i}><td>{c.name}</td><td>{c.contact}</td><td>{c.email}</td></tr>)}</tbody></table>
        </div>}

        {page === 'Einstellungen' && <div className="content-panel">
          <h2>Arbeitsbereich-Einstellungen</h2><p>Grundlegende Informationen für euren Unternehmensbereich.</p>
          <div className="setting-row"><strong>Unternehmen</strong><p>Müller Maschinenbau (Demodaten)</p></div>
          <div className="setting-row"><strong>Produkt</strong><p>CustomerFlow – Vom Kundenanliegen zum Umsatz.</p></div>
          <div className="setting-row"><strong>Vorgangsstatus</strong><p>{statuses.join(' · ')}</p></div>
          <div className="setting-row"><strong>Datenspeicherung</strong><p>Aktuell nur im Arbeitsspeicher des Browsers. Noch keine dauerhafte Datenbank.</p></div>
        </div>}
      </main>
    </div>
  )
}

function CaseList({ cases, filtered, selected, setSelectedId, search, setSearch, filter, setFilter }) {
  return <div className="panel">
    <div className="panel-head"><h2>Kundenanliegen</h2><p>Alle Anfragen zentral an einem Ort</p></div>
    <div className="tools"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Vorgang oder Kunde suchen..."/><select value={filter} onChange={e=>setFilter(e.target.value)}><option>Alle</option>{statuses.map(s=><option key={s}>{s}</option>)}</select></div>
    <div className="case-list">{filtered.map(c=><button key={c.id} className={`case ${selected.id===c.id?'chosen':''}`} onClick={()=>setSelectedId(c.id)}><div className="case-top"><span className="muted">{c.id}</span><span className="pill">{c.status}</span></div><div className="case-title">{c.subject}</div><div className="case-company">{c.company} · {c.contact}</div></button>)}{filtered.length===0&&<div className="empty">Keine Vorgänge gefunden.</div>}</div>
  </div>
}

function CaseDetail({ selected, updateCase, messages, message, setMessage, sendMessage }) {
  return <div className="panel">
    <div className="panel-head"><h2>Vorgangsdetails</h2><p>Gemeinsame Akte für Kunde und Unternehmen</p></div>
    <div className="detail">
      <div className="muted">{selected.id} · {selected.type}</div><h2>{selected.subject}</h2><div className="detail-company">{selected.company}</div>
      <div className="info-grid">
        <div><div className="info-label">Ansprechpartner</div><div className="info-value">{selected.contact}</div></div>
        <div><div className="info-label">Eingegangen am</div><div className="info-value">{selected.date}</div></div>
        <div><div className="info-label">Priorität</div><div className="info-value">{selected.priority}</div></div>
        <div><div className="info-label">Zuständig</div><div className="info-value">{selected.assigned}</div></div>
      </div>
      <div className="section-title">Status ändern</div><select className="full" value={selected.status} onChange={e=>updateCase('status',e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select>
      <div className="section-title">Priorität</div><select className="full" value={selected.priority} onChange={e=>updateCase('priority',e.target.value)}>{['Normal','Hoch','Dringend'].map(s=><option key={s}>{s}</option>)}</select>
      <div className="section-title">Zuständiger Mitarbeiter</div><select className="full" value={selected.assigned} onChange={e=>updateCase('assigned',e.target.value)}>{['Max Mustermann','Anna Becker','Peter Schmidt'].map(s=><option key={s}>{s}</option>)}</select>
      <div className="section-title">Nachrichten zum Vorgang</div>
      <div className="chat">{(messages[selected.id]||[]).map((m,i)=><div className="bubble" key={i}><small>{m.sender} · {m.time}</small>{m.text}</div>)}{!(messages[selected.id]||[]).length&&<div className="muted">Noch keine Nachrichten in diesem Demo-Vorgang.</div>}</div>
      <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Nachricht zum gemeinsamen Vorgang schreiben..."/>
      <button className="primary" style={{marginTop:8}} onClick={sendMessage}>Nachricht hinzufügen</button>
      <p className="muted">Demo: Nachrichten werden noch nicht an echte Kunden versendet oder dauerhaft gespeichert.</p>
    </div>
  </div>
}

export default App
