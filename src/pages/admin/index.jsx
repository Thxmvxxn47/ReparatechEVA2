import { useState, useMemo } from 'react'
import {
  ordenesDB, clientesDB, tecnicosDB, serviciosDB,
  categoriasDB, repuestosDB, authDB,
  formatCLP, ESTADOS, badgeClass, badgeIcon,
} from '../../data/db'
import { EstadoBadge, Modal, Confirm, EmptyState, StockBar } from '../../components/ui'

const FL = ({ label, children }) => (
  <div style={{ marginBottom: 12 }}>
    <label className="f-label">{label}</label>
    {children}
  </div>
)

// ── LOGIN ADMIN ─────────────────────────────────────────────
export function AdminLoginPage({ onLogin }) {
  const [form, setForm] = useState({ correo: 'admin@reparatech.cl', password: 'admin123' })
  const [err,  setErr]  = useState('')
  const submit = (e) => {
    e.preventDefault()
    const u = authDB.login(form.correo, form.password)
    if (u) onLogin(u)
    else   setErr('Correo o contraseña incorrectos.')
  }
  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0a1628,#1a3a5c)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ background:'#fff', borderRadius:16, padding:'2.5rem 2rem', width:'100%', maxWidth:400, boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:8 }}>🔧</div>
          <div style={{ fontFamily:'Space Grotesk', fontSize:'1.4rem', fontWeight:700, color:'#0f4c81' }}>
            Repara<span style={{ color:'#00b4d8' }}>Tech</span>
          </div>
          <p style={{ fontSize:'0.82rem', color:'#6b7280', marginTop:4 }}>Panel de administración</p>
        </div>
        <div className="alerta info">
          <i className="bi bi-info-circle"/>
          <div><small>Admin: admin@reparatech.cl / admin123</small><br/><small>Recepción: recepcion@reparatech.cl / recep123</small></div>
        </div>
        {err && <div className="alerta danger"><i className="bi bi-x-circle"/> {err}</div>}
        <form onSubmit={submit}>
          <FL label="Correo"><input className="f-input" type="email" value={form.correo} onChange={e=>setForm({...form,correo:e.target.value})} required/></FL>
          <FL label="Contraseña"><input className="f-input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/></FL>
          <button type="submit" className="btn-full" style={{ background:'#0f4c81', color:'#fff', marginTop:8 }}>
            <i className="bi bi-box-arrow-in-right"/> Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}

// ── DASHBOARD ───────────────────────────────────────────────
export function AdminDashboard({ onNav }) {
  const stats    = ordenesDB.getStats()
  const ordenes  = ordenesDB.getAll()
  const clientes = clientesDB.getAll()
  const tecnicos = tecnicosDB.getAll()
  const recientes = [...ordenes].reverse().slice(0, 5)
  const alertas   = ordenes.filter(o => o.prioridad === 'Alta' && ['Recibido','En diagnóstico','En reparación'].includes(o.estado))

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        {[
          { icon:'📋', color:'blue',   val:stats.total,                                label:'Órdenes totales'      },
          { icon:'✅', color:'green',  val:stats.porEstado['Listo para retirar']||0,   label:'Listas para retirar'  },
          { icon:'👥', color:'cyan',   val:clientes.length,                            label:'Clientes'             },
          { icon:'💰', color:'orange', val:formatCLP(stats.ingresos),                  label:'Ingresos confirmados'  },
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div><div className="stat-val">{s.val}</div><div className="stat-lbl">{s.label}</div></div>
          </div>
        ))}
      </div>

      {alertas.length > 0 && (
        <div className="alerta warning" style={{ marginBottom:'1.5rem' }}>
          <i className="bi bi-exclamation-triangle-fill"/>
          <div><strong>{alertas.length} orden(es) con prioridad Alta.</strong> {alertas.map(a=>a.id).join(', ')}</div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
        <div className="a-card">
          <div className="a-card-hdr">
            <h5>Órdenes recientes</h5>
            <button className="btn-rt btn-ghost" style={{ fontSize:'0.8rem', padding:'4px 10px' }} onClick={()=>onNav('ordenes')}>Ver todas</button>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table className="rt-table">
              <thead><tr><th>ID</th><th>Dispositivo</th><th>Estado</th><th>Costo</th></tr></thead>
              <tbody>
                {recientes.map(o=>(
                  <tr key={o.id}>
                    <td><code style={{ fontSize:'0.78rem' }}>{o.id}</code></td>
                    <td><strong>{o.dispositivo}</strong></td>
                    <td><EstadoBadge estado={o.estado}/></td>
                    <td>{formatCLP(o.costoTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="a-card" style={{ marginBottom:'1rem' }}>
            <div className="a-card-hdr"><h5>📊 Por estado</h5></div>
            <div className="a-card-bdy">
              {ESTADOS.map(e=>(
                <div key={e} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                  <EstadoBadge estado={e}/>
                  <strong>{stats.porEstado[e]||0}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="a-card">
            <div className="a-card-hdr"><h5>🔧 Carga técnicos</h5></div>
            <div className="a-card-bdy">
              {tecnicos.map(t=>(
                <div key={t.id} style={{ marginBottom:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontSize:'0.83rem', fontWeight:600 }}>{t.nombre} {t.apellido}</span>
                    <small style={{ color:'#6b7280' }}>{t.ordenesActivas}</small>
                  </div>
                  <StockBar value={t.ordenesActivas} max={5}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── ÓRDENES ─────────────────────────────────────────────────
export function AdminOrdenes({ toast }) {
  const [ordenes,   setOrdenes]   = useState(()=>ordenesDB.getAll())
  const [clientes]                = useState(()=>clientesDB.getAll())
  const [tecnicos]                = useState(()=>tecnicosDB.getAll())
  const [servicios]               = useState(()=>serviciosDB.getAll())
  const [buscar,    setBuscar]    = useState('')
  const [filtro,    setFiltro]    = useState('Todos')
  const [modal,     setModal]     = useState(null)
  const [seleccion, setSeleccion] = useState(null)
  const [toDelete,  setToDelete]  = useState(null)
  const [form,      setForm]      = useState({})

  const refresh = () => setOrdenes(ordenesDB.getAll())

  const filtradas = useMemo(()=>ordenes.filter(o=>{
    const t = buscar.toLowerCase()
    return (!buscar||o.id.toLowerCase().includes(t)||o.dispositivo.toLowerCase().includes(t)) && (filtro==='Todos'||o.estado===filtro)
  }),[ordenes,buscar,filtro])

  const abrirCrear  = () => { setForm({clienteId:'',tecnicoId:'',dispositivo:'',marca:'',falla:'',servicioId:'SE001',prioridad:'Media',fechaEstimada:'',notas:'',costoTotal:0}); setSeleccion(null); setModal('form') }
  const abrirEditar = (o) => { setForm({...o}); setSeleccion(o); setModal('form') }

  const guardar = (e) => {
    e.preventDefault()
    const data = { ...form, clienteId:Number(form.clienteId), tecnicoId:Number(form.tecnicoId) }
    if (seleccion) { ordenesDB.update(seleccion.id, data); toast('Orden actualizada') }
    else           { const s=servicios.find(s=>s.id===data.servicioId); if(s)data.costoTotal=s.precio; ordenesDB.create(data); toast('Orden creada') }
    refresh(); setModal(null)
  }

  const cambiarEstado = (id, est) => { ordenesDB.cambiarEstado(id, est); refresh(); setModal(null); toast(`Estado → ${est}`) }
  const eliminar      = ()        => { ordenesDB.delete(toDelete); refresh(); setModal(null); toast('Orden eliminada','info') }

  const cl = (id) => clientes.find(c=>c.id===id)
  const te = (id) => tecnicos.find(t=>t.id===id)

  return (
    <div>
      <div className="a-card">
        <div className="a-card-hdr">
          <h5><i className="bi bi-clipboard2-check me-2" style={{color:'#00b4d8'}}/>Órdenes de Trabajo</h5>
          <button className="btn-rt btn-primary" onClick={abrirCrear}><i className="bi bi-plus-lg"/> Nueva orden</button>
        </div>
        <div className="a-card-bdy" style={{ paddingBottom:0 }}>
          <div style={{ display:'flex', gap:10, marginBottom:12, flexWrap:'wrap' }}>
            <div className="search-box" style={{ flex:1, maxWidth:340 }}>
              <i className="bi bi-search"/>
              <input className="f-input" style={{ paddingLeft:'2.2rem' }} placeholder="Buscar..." value={buscar} onChange={e=>setBuscar(e.target.value)}/>
            </div>
            <select className="f-input" style={{ maxWidth:200 }} value={filtro} onChange={e=>setFiltro(e.target.value)}>
              <option value="Todos">Todos los estados</option>
              {ESTADOS.map(e=><option key={e}>{e}</option>)}
            </select>
            <small style={{ alignSelf:'center', color:'#6b7280' }}>{filtradas.length} resultado(s)</small>
          </div>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table className="rt-table">
            <thead><tr><th>ID</th><th>Dispositivo</th><th>Cliente</th><th>Técnico</th><th>Estado</th><th>Prioridad</th><th>Costo</th><th>Acciones</th></tr></thead>
            <tbody>
              {filtradas.length===0
                ? <tr><td colSpan={8}><EmptyState icon="bi-clipboard-x" text="Sin órdenes."/></td></tr>
                : filtradas.map(o=>(
                  <tr key={o.id}>
                    <td><code style={{ fontSize:'0.78rem' }}>{o.id}</code></td>
                    <td><strong>{o.dispositivo}</strong><br/><small style={{color:'#6b7280'}}>{o.marca}</small></td>
                    <td>{cl(o.clienteId)?.nombre} {cl(o.clienteId)?.apellido}</td>
                    <td>{te(o.tecnicoId)?.nombre} {te(o.tecnicoId)?.apellido}</td>
                    <td><EstadoBadge estado={o.estado}/></td>
                    <td><span className={`prioridad-${o.prioridad.toLowerCase()}`}>{o.prioridad}</span></td>
                    <td>{formatCLP(o.costoTotal)}</td>
                    <td>
                      <div style={{ display:'flex', gap:4 }}>
                        <button className="btn-icon success" onClick={()=>abrirEditar(o)}><i className="bi bi-pencil"/></button>
                        <button className="btn-icon danger"  onClick={()=>{setToDelete(o.id);setModal('confirm')}}><i className="bi bi-trash"/></button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal==='form'} onClose={()=>setModal(null)} title={seleccion?`Editar ${seleccion.id}`:'Nueva Orden'} wide
        footer={<><button className="btn-rt btn-ghost" onClick={()=>setModal(null)}>Cancelar</button><button className="btn-rt btn-primary" onClick={guardar}><i className="bi bi-check-lg"/> {seleccion?'Guardar':'Crear'}</button></>}>
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
            <FL label="Cliente *"><select className="f-input" value={form.clienteId||''} onChange={e=>setForm({...form,clienteId:e.target.value})} required><option value="">— Seleccionar —</option>{clientes.map(c=><option key={c.id} value={c.id}>{c.nombre} {c.apellido}</option>)}</select></FL>
            <FL label="Técnico *"><select className="f-input" value={form.tecnicoId||''} onChange={e=>setForm({...form,tecnicoId:e.target.value})} required><option value="">— Seleccionar —</option>{tecnicos.map(t=><option key={t.id} value={t.id}>{t.nombre} {t.apellido}</option>)}</select></FL>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
            <FL label="Dispositivo *"><input className="f-input" value={form.dispositivo||''} onChange={e=>setForm({...form,dispositivo:e.target.value})} required/></FL>
            <FL label="Marca *"><input className="f-input" value={form.marca||''} onChange={e=>setForm({...form,marca:e.target.value})} required/></FL>
          </div>
          <FL label="Falla reportada *"><input className="f-input" value={form.falla||''} onChange={e=>setForm({...form,falla:e.target.value})} required/></FL>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:10 }}>
            <FL label="Servicio *"><select className="f-input" value={form.servicioId||'SE001'} onChange={e=>setForm({...form,servicioId:e.target.value})}>{servicios.map(s=><option key={s.id} value={s.id}>{s.nombre}</option>)}</select></FL>
            <FL label="Prioridad *"><select className="f-input" value={form.prioridad||'Media'} onChange={e=>setForm({...form,prioridad:e.target.value})}><option>Alta</option><option>Media</option><option>Baja</option></select></FL>
            <FL label="Costo (CLP)"><input className="f-input" type="number" value={form.costoTotal||0} onChange={e=>setForm({...form,costoTotal:Number(e.target.value)})}/></FL>
          </div>
          {seleccion && (
            <>
              <FL label="Diagnóstico"><textarea className="f-input" rows={2} value={form.diagnostico||''} onChange={e=>setForm({...form,diagnostico:e.target.value})}/></FL>
              <div style={{ marginBottom:10 }}>
                <label className="f-label">Cambiar estado</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:6 }}>
                  {ESTADOS.filter(e=>e!==seleccion.estado).map(e=>(
                    <button key={e} className="btn-rt btn-ghost" style={{ fontSize:'0.78rem', padding:'4px 10px' }} onClick={()=>cambiarEstado(seleccion.id,e)}>{badgeIcon(e)} {e}</button>
                  ))}
                </div>
              </div>
            </>
          )}
          <FL label="Notas"><textarea className="f-input" rows={2} value={form.notas||''} onChange={e=>setForm({...form,notas:e.target.value})}/></FL>
        </div>
      </Modal>

      <Confirm open={modal==='confirm'} msg="¿Eliminar esta orden?" onConfirm={eliminar} onCancel={()=>setModal(null)}/>
    </div>
  )
}

// ── KANBAN ──────────────────────────────────────────────────
export function AdminKanban({ toast }) {
  const [ordenes,  setOrdenes]  = useState(()=>ordenesDB.getAll())
  const [clientes]              = useState(()=>clientesDB.getAll())
  const [tecnicos]              = useState(()=>tecnicosDB.getAll())

  const COLS = [
    {id:'Recibido',           bg:'#f8fafc',head:'#e2e8f0',txt:'#475569'},
    {id:'En diagnóstico',     bg:'#f0f9ff',head:'#bae6fd',txt:'#0369a1'},
    {id:'En reparación',      bg:'#fffbeb',head:'#fde68a',txt:'#92400e'},
    {id:'Listo para retirar', bg:'#f0fdf4',head:'#bbf7d0',txt:'#166534'},
    {id:'Cancelado',          bg:'#fff5f5',head:'#fecaca',txt:'#991b1b'},
  ]

  const cambiar = (id, est) => { ordenesDB.cambiarEstado(id, est); setOrdenes(ordenesDB.getAll()); toast(`${id} → ${est}`) }

  return (
    <div>
      <div className="alerta info" style={{ marginBottom:16 }}>
        <i className="bi bi-info-circle"/> Usa los botones de cada tarjeta para cambiar el estado.
      </div>
      <div className="kanban">
        {COLS.map(col=>{
          const items = ordenes.filter(o=>o.estado===col.id)
          return (
            <div key={col.id} className="kanban-col">
              <div className="kanban-col-hdr" style={{ background:col.head, color:col.txt }}>
                <span>{col.id}</span>
                <span style={{ background:'rgba(0,0,0,0.1)', borderRadius:20, padding:'1px 8px', fontSize:'0.75rem' }}>{items.length}</span>
              </div>
              <div className="kanban-cards" style={{ background:col.bg }}>
                {items.length===0
                  ? <div style={{ textAlign:'center', padding:'1rem', color:'#6b7280', fontSize:'0.78rem' }}>Sin órdenes</div>
                  : items.map(o=>{
                      const cl = clientes.find(c=>c.id===o.clienteId)
                      const te = tecnicos.find(t=>t.id===o.tecnicoId)
                      return (
                        <div key={o.id} className="kanban-card">
                          <div style={{ fontSize:'0.7rem', color:'#6b7280', fontWeight:600 }}>{o.id} · <span className={`prioridad-${o.prioridad.toLowerCase()}`}>{o.prioridad}</span></div>
                          <div style={{ fontWeight:700, fontSize:'0.88rem', margin:'4px 0' }}>{o.dispositivo}</div>
                          <div style={{ fontSize:'0.75rem', color:'#6b7280' }}>👤 {cl?.nombre} {cl?.apellido}</div>
                          <div style={{ fontSize:'0.72rem', color:'#00b4d8', fontWeight:600, marginTop:4 }}>🔧 {te?.nombre} {te?.apellido}</div>
                          <div style={{ marginTop:8, display:'flex', flexWrap:'wrap', gap:4 }}>
                            {ESTADOS.filter(e=>e!==o.estado).map(e=>(
                              <button key={e} onClick={()=>cambiar(o.id,e)} style={{ fontSize:'0.62rem', padding:'2px 6px', border:'1px solid #dde3ea', borderRadius:4, background:'#fff', cursor:'pointer', whiteSpace:'nowrap' }}>
                                →{e.replace('En ','').replace('para retirar','retirar')}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    })
                }
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── SERVICIOS ───────────────────────────────────────────────
export function AdminServicios({ toast }) {
  const [servicios, setServicios] = useState(()=>serviciosDB.getAll())
  const [modal,     setModal]     = useState(null)
  const [seleccion, setSeleccion] = useState(null)
  const [toDelete,  setToDelete]  = useState(null)
  const [form, setForm] = useState({nombre:'',descripcion:'',tiempo:30,precio:0,categoria:'General',icono:'🔧',enOferta:false,descuento:0})

  const refresh = () => setServicios(serviciosDB.getAll())
  const abrirCrear  = () => { setForm({nombre:'',descripcion:'',tiempo:30,precio:0,categoria:'General',icono:'🔧',enOferta:false,descuento:0}); setSeleccion(null); setModal('form') }
  const abrirEditar = (s) => { setForm({...s}); setSeleccion(s); setModal('form') }
  const guardar = (e) => { e.preventDefault(); if(seleccion){serviciosDB.update(seleccion.id,form);toast('Servicio actualizado')}else{serviciosDB.create(form);toast('Servicio creado')}; refresh(); setModal(null) }
  const eliminar    = () => { serviciosDB.delete(toDelete); refresh(); setModal(null); toast('Eliminado','info') }

  return (
    <div>
      <div className="a-card">
        <div className="a-card-hdr">
          <h5><i className="bi bi-tools me-2" style={{color:'#00b4d8'}}/>Servicios</h5>
          <button className="btn-rt btn-primary" onClick={abrirCrear}><i className="bi bi-plus-lg"/> Nuevo</button>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table className="rt-table">
            <thead><tr><th>Servicio</th><th>Categoría</th><th>Tiempo</th><th>Precio</th><th>Oferta</th><th>Acciones</th></tr></thead>
            <tbody>
              {servicios.map(s=>(
                <tr key={s.id}>
                  <td><strong>{s.icono} {s.nombre}</strong></td>
                  <td><span className="b-estado b-diagnostico">{s.categoria}</span></td>
                  <td>{s.tiempo} min</td>
                  <td>{formatCLP(s.precio)}</td>
                  <td>{s.enOferta?<span className="b-estado b-reparacion">-{s.descuento}% OFF</span>:<span style={{color:'#6b7280',fontSize:'0.8rem'}}>No</span>}</td>
                  <td>
                    <div style={{ display:'flex', gap:4 }}>
                      <button className="btn-icon success" onClick={()=>abrirEditar(s)}><i className="bi bi-pencil"/></button>
                      <button className="btn-icon danger"  onClick={()=>{setToDelete(s.id);setModal('confirm')}}><i className="bi bi-trash"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal==='form'} onClose={()=>setModal(null)} title={seleccion?'Editar servicio':'Nuevo servicio'} wide
        footer={<><button className="btn-rt btn-ghost" onClick={()=>setModal(null)}>Cancelar</button><button className="btn-rt btn-primary" onClick={guardar}><i className="bi bi-check-lg"/> {seleccion?'Guardar':'Crear'}</button></>}>
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
            <FL label="Nombre *"><input className="f-input" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} required/></FL>
            <FL label="Icono"><input className="f-input" value={form.icono} onChange={e=>setForm({...form,icono:e.target.value})}/></FL>
          </div>
          <FL label="Descripción *"><textarea className="f-input" rows={2} value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})} required/></FL>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:10 }}>
            <FL label="Tiempo (min) *"><input className="f-input" type="number" value={form.tiempo} onChange={e=>setForm({...form,tiempo:Number(e.target.value)})}/></FL>
            <FL label="Precio (CLP) *"><input className="f-input" type="number" value={form.precio} onChange={e=>setForm({...form,precio:Number(e.target.value)})}/></FL>
            <FL label="Categoría *"><select className="f-input" value={form.categoria} onChange={e=>setForm({...form,categoria:e.target.value})}><option>General</option><option>Pantallas</option><option>Baterías</option><option>Software</option><option>Hardware</option></select></FL>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <FL label="¿En oferta?"><select className="f-input" value={String(form.enOferta)} onChange={e=>setForm({...form,enOferta:e.target.value==='true'})}><option value="false">No</option><option value="true">Sí</option></select></FL>
            <FL label="Descuento (%)"><input className="f-input" type="number" min={0} max={100} value={form.descuento} onChange={e=>setForm({...form,descuento:Number(e.target.value)})} disabled={!form.enOferta}/></FL>
          </div>
        </div>
      </Modal>

      <Confirm open={modal==='confirm'} msg="¿Eliminar este servicio?" onConfirm={eliminar} onCancel={()=>setModal(null)}/>
    </div>
  )
}

// ── CATEGORÍAS ──────────────────────────────────────────────
export function AdminCategorias({ toast }) {
  const [cats,      setCats]      = useState(()=>categoriasDB.getAll())
  const [modal,     setModal]     = useState(null)
  const [seleccion, setSeleccion] = useState(null)
  const [toDelete,  setToDelete]  = useState(null)
  const [form, setForm] = useState({nombre:'',icono:'📦',descripcion:''})

  const refresh = () => setCats(categoriasDB.getAll())
  const abrirCrear  = () => { setForm({nombre:'',icono:'📦',descripcion:''}); setSeleccion(null); setModal('form') }
  const abrirEditar = (c) => { setForm({...c}); setSeleccion(c); setModal('form') }
  const guardar = (e) => { e.preventDefault(); if(seleccion){categoriasDB.update(seleccion.id,form);toast('Categoría actualizada')}else{categoriasDB.create(form);toast('Categoría creada')}; refresh(); setModal(null) }
  const eliminar    = () => { categoriasDB.delete(toDelete); refresh(); setModal(null); toast('Eliminada','info') }

  return (
    <div>
      <div className="a-card">
        <div className="a-card-hdr">
          <h5><i className="bi bi-tags me-2" style={{color:'#00b4d8'}}/>Categorías</h5>
          <button className="btn-rt btn-primary" onClick={abrirCrear}><i className="bi bi-plus-lg"/> Nueva</button>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table className="rt-table">
            <thead><tr><th>Categoría</th><th>Descripción</th><th>Servicios</th><th>Acciones</th></tr></thead>
            <tbody>
              {cats.map(c=>(
                <tr key={c.id}>
                  <td><strong>{c.icono} {c.nombre}</strong></td>
                  <td style={{ color:'#6b7280', fontSize:'0.84rem' }}>{c.descripcion}</td>
                  <td>{serviciosDB.getByCategoria(c.nombre).length}</td>
                  <td>
                    <div style={{ display:'flex', gap:4 }}>
                      <button className="btn-icon success" onClick={()=>abrirEditar(c)}><i className="bi bi-pencil"/></button>
                      <button className="btn-icon danger"  onClick={()=>{setToDelete(c.id);setModal('confirm')}}><i className="bi bi-trash"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal==='form'} onClose={()=>setModal(null)} title={seleccion?'Editar categoría':'Nueva categoría'}
        footer={<><button className="btn-rt btn-ghost" onClick={()=>setModal(null)}>Cancelar</button><button className="btn-rt btn-primary" onClick={guardar}><i className="bi bi-check-lg"/> {seleccion?'Guardar':'Crear'}</button></>}>
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
            <FL label="Nombre *"><input className="f-input" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} required/></FL>
            <FL label="Icono"><input className="f-input" value={form.icono} onChange={e=>setForm({...form,icono:e.target.value})}/></FL>
          </div>
          <FL label="Descripción"><textarea className="f-input" rows={2} value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})}/></FL>
        </div>
      </Modal>

      <Confirm open={modal==='confirm'} msg="¿Eliminar esta categoría?" onConfirm={eliminar} onCancel={()=>setModal(null)}/>
    </div>
  )
}

// ── CLIENTES ────────────────────────────────────────────────
export function AdminClientes({ toast }) {
  const [clientes,  setClientes]  = useState(()=>clientesDB.getAll())
  const [buscar,    setBuscar]    = useState('')
  const [modal,     setModal]     = useState(null)
  const [seleccion, setSeleccion] = useState(null)
  const [toDelete,  setToDelete]  = useState(null)
  const [form, setForm] = useState({nombre:'',apellido:'',correo:'',telefono:'',direccion:'',password:'1234'})

  const refresh = () => setClientes(clientesDB.getAll())
  const filtrados = useMemo(()=>clientes.filter(c=>!buscar||`${c.nombre} ${c.apellido} ${c.correo}`.toLowerCase().includes(buscar.toLowerCase())),[clientes,buscar])

  const abrirCrear       = ()  => { setForm({nombre:'',apellido:'',correo:'',telefono:'',direccion:'',password:'1234'}); setSeleccion(null); setModal('form') }
  const abrirEditar      = (c) => { setForm({...c}); setSeleccion(c); setModal('form') }
  const abrirHistorial   = (c) => { setSeleccion(c); setModal('historial') }
  const guardar = (e)         => { e.preventDefault(); if(seleccion){clientesDB.update(seleccion.id,form);toast('Cliente actualizado')}else{clientesDB.create(form);toast('Cliente creado')}; refresh(); setModal(null) }
  const eliminar              = () => { clientesDB.delete(toDelete); refresh(); setModal(null); toast('Eliminado','info') }
  const historial = (c) => ordenesDB.getByCliente(c?.id||0)

  return (
    <div>
      <div className="a-card">
        <div className="a-card-hdr">
          <h5><i className="bi bi-people me-2" style={{color:'#00b4d8'}}/>Clientes</h5>
          <button className="btn-rt btn-primary" onClick={abrirCrear}><i className="bi bi-plus-lg"/> Nuevo</button>
        </div>
        <div className="a-card-bdy" style={{ paddingBottom:0 }}>
          <div className="search-box" style={{ maxWidth:360, marginBottom:12 }}>
            <i className="bi bi-search"/>
            <input className="f-input" style={{ paddingLeft:'2.2rem' }} placeholder="Buscar..." value={buscar} onChange={e=>setBuscar(e.target.value)}/>
          </div>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table className="rt-table">
            <thead><tr><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Órdenes</th><th>Acciones</th></tr></thead>
            <tbody>
              {filtrados.length===0
                ? <tr><td colSpan={5}><EmptyState icon="bi-people" text="Sin clientes."/></td></tr>
                : filtrados.map(c=>(
                  <tr key={c.id}>
                    <td><strong>{c.nombre} {c.apellido}</strong><br/><small style={{color:'#6b7280'}}>{c.direccion}</small></td>
                    <td>{c.correo}</td>
                    <td>{c.telefono}</td>
                    <td><span className="b-estado b-recibido">{ordenesDB.getByCliente(c.id).length}</span></td>
                    <td>
                      <div style={{ display:'flex', gap:4 }}>
                        <button className="btn-icon primary"  onClick={()=>abrirHistorial(c)} title="Historial"><i className="bi bi-clock-history"/></button>
                        <button className="btn-icon success"  onClick={()=>abrirEditar(c)}><i className="bi bi-pencil"/></button>
                        <button className="btn-icon danger"   onClick={()=>{setToDelete(c.id);setModal('confirm')}}><i className="bi bi-trash"/></button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal==='form'} onClose={()=>setModal(null)} title={seleccion?'Editar cliente':'Nuevo cliente'}
        footer={<><button className="btn-rt btn-ghost" onClick={()=>setModal(null)}>Cancelar</button><button className="btn-rt btn-primary" onClick={guardar}><i className="bi bi-check-lg"/> {seleccion?'Guardar':'Crear'}</button></>}>
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
            <FL label="Nombre *"><input className="f-input" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} required/></FL>
            <FL label="Apellido *"><input className="f-input" value={form.apellido} onChange={e=>setForm({...form,apellido:e.target.value})} required/></FL>
          </div>
          <FL label="Correo *"><input className="f-input" type="email" value={form.correo} onChange={e=>setForm({...form,correo:e.target.value})} required/></FL>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <FL label="Teléfono"><input className="f-input" value={form.telefono} onChange={e=>setForm({...form,telefono:e.target.value})}/></FL>
            <FL label="Dirección"><input className="f-input" value={form.direccion} onChange={e=>setForm({...form,direccion:e.target.value})}/></FL>
          </div>
        </div>
      </Modal>

      <Modal open={modal==='historial'} onClose={()=>setModal(null)} title={`Historial — ${seleccion?.nombre} ${seleccion?.apellido}`} wide>
        {historial(seleccion).length===0
          ? <EmptyState icon="bi-bag-x" text="Sin órdenes."/>
          : <table className="rt-table">
              <thead><tr><th>ID</th><th>Dispositivo</th><th>Estado</th><th>Fecha</th><th>Costo</th></tr></thead>
              <tbody>
                {historial(seleccion).map(o=>(
                  <tr key={o.id}>
                    <td><code>{o.id}</code></td>
                    <td>{o.dispositivo}</td>
                    <td><EstadoBadge estado={o.estado}/></td>
                    <td>{o.fechaIngreso}</td>
                    <td>{formatCLP(o.costoTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </Modal>

      <Confirm open={modal==='confirm'} msg="¿Eliminar este cliente?" onConfirm={eliminar} onCancel={()=>setModal(null)}/>
    </div>
  )
}

// ── TÉCNICOS ────────────────────────────────────────────────
export function AdminTecnicos({ toast }) {
  const [tecnicos,  setTecnicos]  = useState(()=>tecnicosDB.getAll())
  const [modal,     setModal]     = useState(null)
  const [seleccion, setSeleccion] = useState(null)
  const [toDelete,  setToDelete]  = useState(null)
  const [form, setForm] = useState({nombre:'',apellido:'',especialidad:'Smartphones'})
  const ESPS = ['Smartphones','Computadores','Tablets','Placa Base','Software','General']

  const refresh = () => setTecnicos(tecnicosDB.getAll())
  const abrirCrear  = () => { setForm({nombre:'',apellido:'',especialidad:'Smartphones'}); setSeleccion(null); setModal('form') }
  const abrirEditar = (t) => { setForm({...t}); setSeleccion(t); setModal('form') }
  const guardar = (e) => { e.preventDefault(); if(seleccion){tecnicosDB.update(seleccion.id,form);toast('Técnico actualizado')}else{tecnicosDB.create(form);toast('Técnico creado')}; refresh(); setModal(null) }
  const eliminar    = () => { tecnicosDB.delete(toDelete); refresh(); setModal(null); toast('Eliminado','info') }

  return (
    <div>
      <div className="a-card">
        <div className="a-card-hdr">
          <h5><i className="bi bi-person-badge me-2" style={{color:'#00b4d8'}}/>Técnicos</h5>
          <button className="btn-rt btn-primary" onClick={abrirCrear}><i className="bi bi-plus-lg"/> Nuevo</button>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table className="rt-table">
            <thead><tr><th>Técnico</th><th>Especialidad</th><th>Carga</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              {tecnicos.map(t=>(
                <tr key={t.id}>
                  <td><strong>{t.nombre} {t.apellido}</strong></td>
                  <td><span className="b-estado b-diagnostico">{t.especialidad}</span></td>
                  <td style={{ minWidth:130 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <strong style={{ minWidth:16 }}>{t.ordenesActivas}</strong>
                      <StockBar value={t.ordenesActivas} max={5}/>
                    </div>
                  </td>
                  <td>{t.activo?<span className="b-estado b-listo">Activo</span>:<span className="b-estado b-cancelado">Inactivo</span>}</td>
                  <td>
                    <div style={{ display:'flex', gap:4 }}>
                      <button className="btn-icon success" onClick={()=>abrirEditar(t)}><i className="bi bi-pencil"/></button>
                      <button className="btn-icon danger"  onClick={()=>{setToDelete(t.id);setModal('confirm')}}><i className="bi bi-trash"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal==='form'} onClose={()=>setModal(null)} title={seleccion?'Editar técnico':'Nuevo técnico'}
        footer={<><button className="btn-rt btn-ghost" onClick={()=>setModal(null)}>Cancelar</button><button className="btn-rt btn-primary" onClick={guardar}><i className="bi bi-check-lg"/> {seleccion?'Guardar':'Crear'}</button></>}>
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
            <FL label="Nombre *"><input className="f-input" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} required/></FL>
            <FL label="Apellido *"><input className="f-input" value={form.apellido} onChange={e=>setForm({...form,apellido:e.target.value})} required/></FL>
          </div>
          <FL label="Especialidad *"><select className="f-input" value={form.especialidad} onChange={e=>setForm({...form,especialidad:e.target.value})}>{ESPS.map(e=><option key={e}>{e}</option>)}</select></FL>
        </div>
      </Modal>

      <Confirm open={modal==='confirm'} msg="¿Eliminar este técnico?" onConfirm={eliminar} onCancel={()=>setModal(null)}/>
    </div>
  )
}

// ── REPUESTOS ───────────────────────────────────────────────
export function AdminRepuestos({ toast }) {
  const [repuestos, setRepuestos] = useState(()=>repuestosDB.getAll())
  const [modal,     setModal]     = useState(null)
  const [seleccion, setSeleccion] = useState(null)
  const [delta,     setDelta]     = useState(0)

  const refresh = () => setRepuestos(repuestosDB.getAll())
  const abrirAjuste = (r) => { setSeleccion(r); setDelta(0); setModal('ajuste') }
  const guardar = (e) => { e.preventDefault(); const r=repuestosDB.ajustarStock(seleccion.id,Number(delta)); if(!r){toast('Stock no puede ser negativo','error');return}; refresh(); setModal(null); toast(`Stock actualizado a ${r.stock}`) }

  return (
    <div>
      <div className="a-card">
        <div className="a-card-hdr"><h5><i className="bi bi-box-seam me-2" style={{color:'#00b4d8'}}/>Repuestos</h5></div>
        {repuestos.some(r=>r.stock<=3) && (
          <div className="a-card-bdy" style={{ paddingBottom:0 }}>
            <div className="alerta warning"><i className="bi bi-exclamation-triangle-fill"/><strong>Stock crítico:</strong> {repuestos.filter(r=>r.stock<=3).map(r=>r.nombre).join(', ')}</div>
          </div>
        )}
        <div style={{ overflowX:'auto' }}>
          <table className="rt-table">
            <thead><tr><th>Código</th><th>Repuesto</th><th>Compatible</th><th>Precio</th><th>Stock</th><th>Acción</th></tr></thead>
            <tbody>
              {repuestos.map(r=>(
                <tr key={r.id}>
                  <td><code>{r.id}</code></td>
                  <td><strong>{r.nombre}</strong></td>
                  <td>{r.compatible}</td>
                  <td>{formatCLP(r.precio)}</td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <strong style={{ minWidth:24, color:r.stock<=3?'var(--rt-danger)':r.stock<=8?'var(--rt-warn)':'var(--rt-success)' }}>{r.stock}</strong>
                      <div style={{ width:70 }}><StockBar value={r.stock} max={20}/></div>
                    </div>
                  </td>
                  <td><button className="btn-rt btn-ghost" style={{ fontSize:'0.78rem', padding:'4px 10px' }} onClick={()=>abrirAjuste(r)}><i className="bi bi-sliders"/> Ajustar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal==='ajuste'} onClose={()=>setModal(null)} title={`Ajustar stock: ${seleccion?.nombre}`}
        footer={<><button className="btn-rt btn-ghost" onClick={()=>setModal(null)}>Cancelar</button><button className="btn-rt btn-primary" onClick={guardar}>Guardar</button></>}>
        <div>
          <div className="alerta info"><i className="bi bi-info-circle"/> Stock actual: <strong>{seleccion?.stock}</strong> unidades</div>
          <FL label="Variación de stock">
            <input className="f-input" type="number" value={delta} onChange={e=>setDelta(e.target.value)} placeholder="+5 para agregar, -2 para restar"/>
          </FL>
          {delta!=0 && <small style={{ color:'#6b7280' }}>Nuevo stock: <strong>{(seleccion?.stock||0)+Number(delta)}</strong></small>}
        </div>
      </Modal>
    </div>
  )
}

// ── USUARIOS ────────────────────────────────────────────────
export function AdminUsuarios({ toast }) {
  const [usuarios, setUsuarios] = useState(()=>authDB.getAll())
  const [modal,    setModal]    = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [form, setForm] = useState({nombre:'',apellido:'',correo:'',rol:'recepcionista',password:''})
  const ROLES = ['administrador','encargado','recepcionista','tecnico']
  const rolColor = { administrador:'b-reparacion', encargado:'b-diagnostico', recepcionista:'b-recibido', tecnico:'b-listo' }

  const refresh = () => setUsuarios(authDB.getAll())
  const guardar = (e) => { e.preventDefault(); authDB.create(form); refresh(); setModal(null); toast('Usuario creado') }
  const eliminar    = () => { authDB.delete(toDelete); refresh(); setModal(null); toast('Eliminado','info') }

  return (
    <div>
      <div className="a-card">
        <div className="a-card-hdr">
          <h5><i className="bi bi-shield-person me-2" style={{color:'#00b4d8'}}/>Usuarios del sistema</h5>
          <button className="btn-rt btn-primary" onClick={()=>{setForm({nombre:'',apellido:'',correo:'',rol:'recepcionista',password:''});setModal('form')}}><i className="bi bi-plus-lg"/> Nuevo</button>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table className="rt-table">
            <thead><tr><th>Usuario</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acción</th></tr></thead>
            <tbody>
              {usuarios.map(u=>(
                <tr key={u.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div className="u-avatar" style={{ background:'#0f4c81' }}>{u.nombre[0]}{u.apellido[0]}</div>
                      <strong>{u.nombre} {u.apellido}</strong>
                    </div>
                  </td>
                  <td>{u.correo}</td>
                  <td><span className={`b-estado ${rolColor[u.rol]||'b-recibido'}`}>{u.rol}</span></td>
                  <td><span className="b-estado b-listo">Activo</span></td>
                  <td><button className="btn-icon danger" onClick={()=>{setToDelete(u.id);setModal('confirm')}}><i className="bi bi-trash"/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal==='form'} onClose={()=>setModal(null)} title="Nuevo usuario"
        footer={<><button className="btn-rt btn-ghost" onClick={()=>setModal(null)}>Cancelar</button><button className="btn-rt btn-primary" onClick={guardar}><i className="bi bi-check-lg"/> Crear</button></>}>
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
            <FL label="Nombre *"><input className="f-input" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} required/></FL>
            <FL label="Apellido *"><input className="f-input" value={form.apellido} onChange={e=>setForm({...form,apellido:e.target.value})} required/></FL>
          </div>
          <FL label="Correo *"><input className="f-input" type="email" value={form.correo} onChange={e=>setForm({...form,correo:e.target.value})} required/></FL>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <FL label="Rol *"><select className="f-input" value={form.rol} onChange={e=>setForm({...form,rol:e.target.value})}>{ROLES.map(r=><option key={r}>{r}</option>)}</select></FL>
            <FL label="Contraseña *"><input className="f-input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/></FL>
          </div>
        </div>
      </Modal>

      <Confirm open={modal==='confirm'} msg="¿Eliminar este usuario?" onConfirm={eliminar} onCancel={()=>setModal(null)}/>
    </div>
  )
}

// ── REPORTES (básico — sin productividad avanzada, pendiente v3.0) ──
export function AdminReportes() {
  const stats   = ordenesDB.getStats()
  const ordenes = ordenesDB.getAll()
  const ingresos = stats.ingresos
  const tasa = stats.total > 0 ? Math.round(((stats.porEstado['Listo para retirar']||0)/stats.total)*100) : 0

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        <div className="stat-card"><div className="stat-icon blue">📊</div><div><div className="stat-val">{stats.total}</div><div className="stat-lbl">Total órdenes</div></div></div>
        <div className="stat-card"><div className="stat-icon green">💵</div><div><div className="stat-val" style={{ fontSize:'1.4rem' }}>{formatCLP(ingresos)}</div><div className="stat-lbl">Ingresos totales</div></div></div>
        <div className="stat-card"><div className="stat-icon orange">📈</div><div><div className="stat-val">{tasa}%</div><div className="stat-lbl">Tasa completadas</div></div></div>
      </div>

      <div className="a-card">
        <div className="a-card-hdr"><h5>📋 Distribución por estado</h5></div>
        <div className="a-card-bdy">
          {ESTADOS.map(e=>{
            const cnt = stats.porEstado[e]||0
            const pct = stats.total > 0 ? ((cnt/stats.total)*100).toFixed(0) : 0
            return (
              <div key={e} style={{ marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <EstadoBadge estado={e}/>
                  <span style={{ fontSize:'0.8rem', fontWeight:600 }}>{cnt} ({pct}%)</span>
                </div>
                <div className="stock-bar"><div className="stock-fill" style={{ width:`${pct}%`, background:'#00b4d8' }}/></div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="alerta info">
        <i className="bi bi-info-circle"/>
        <div><strong>Próximamente en v3.0:</strong> productividad por técnico, top clientes, gráficos avanzados y exportación de reportes.</div>
      </div>
    </div>
  )
}
