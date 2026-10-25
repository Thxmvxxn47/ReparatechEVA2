import { useState, useMemo } from 'react'
import {
  ordenesDB, clientesDB, tecnicosDB, serviciosDB,
  categoriasDB, repuestosDB, authDB,
  formatCLP, ESTADOS, estadoBadgeClass, estadoIcono
} from '../../data/db'
import { EstadoBadge, Modal, Confirm, EmptyState, StatCard, StockBar } from '../../components/ui'

// ── helpers ──────────────────────────────────────────────────
const FL = ({ label, children }) => (
  <div className="mb-3">
    <label className="f-label">{label}</label>
    {children}
  </div>
)

// ══ LOGIN ADMIN ══════════════════════════════════════════════
export function AdminLoginPage({ onLogin }) {
  const [form, setForm] = useState({ correo: 'admin@reparatech.cl', password: 'admin123' })
  const [err,  setErr]  = useState('')
  const [load, setLoad] = useState(false)

  const submit = (e) => {
    e.preventDefault(); setLoad(true); setErr('')
    setTimeout(() => {
      const u = authDB.login(form.correo, form.password)
      if (u) onLogin(u)
      else   setErr('Correo o contraseña incorrectos.')
      setLoad(false)
    }, 500)
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,var(--rt-dark) 0%,#1a3a5c 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ background:'#fff', borderRadius:16, padding:'2.5rem 2rem', width:'100%', maxWidth:400, boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>🔧</div>
          <div style={{ fontFamily:'Space Grotesk', fontSize:'1.4rem', fontWeight:700, color:'var(--rt-blue)' }}>
            Repara<span style={{ color:'var(--rt-cyan)' }}>Tech</span>
          </div>
          <p style={{ fontSize:'0.83rem', color:'var(--rt-gray)', marginTop:'0.3rem' }}>Panel de administración</p>
        </div>
        <div className="rt-alert info">
          <i className="bi bi-info-circle"/>
          <div><small>Admin: admin@reparatech.cl / admin123</small><br/><small>Recepción: recepcion@reparatech.cl / recep123</small></div>
        </div>
        {err && <div className="rt-alert danger"><i className="bi bi-x-circle"/> {err}</div>}
        <form onSubmit={submit}>
          <FL label="Correo"><input className="f-input" type="email" value={form.correo} onChange={e=>setForm({...form,correo:e.target.value})} required/></FL>
          <FL label="Contraseña"><input className="f-input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/></FL>
          <button type="submit" className="btn-full btn-primary-full" style={{ marginTop:'0.5rem' }} disabled={load}>
            {load ? 'Ingresando...' : <><i className="bi bi-box-arrow-in-right"/> Ingresar</>}
          </button>
        </form>
      </div>
    </div>
  )
}

// ══ DASHBOARD ════════════════════════════════════════════════
export function AdminDashboard({ onNav }) {
  const stats    = ordenesDB.getStats()
  const ordenes  = ordenesDB.getAll()
  const tecnicos = tecnicosDB.getAll()
  const alertas  = ordenes.filter(o => o.prioridad==='Alta' && ['Recibido','En diagnóstico','En reparación'].includes(o.estado))
  const recientes = [...ordenes].reverse().slice(0,5)
  const clientes = clientesDB.getAll()

  return (
    <div>
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3"><StatCard icon="📋" iconColor="blue"   value={stats.total}                                label="Órdenes totales"       sub="Este mes"/></div>
        <div className="col-6 col-md-3"><StatCard icon="✅" iconColor="green"  value={stats.porEstado['Listo para retirar']||0}   label="Listas para retirar"   sub="Pendientes entrega"/></div>
        <div className="col-6 col-md-3"><StatCard icon="👥" iconColor="cyan"   value={clientes.length}                            label="Clientes registrados"  sub="+4 nuevos"/></div>
        <div className="col-6 col-md-3"><StatCard icon="💰" iconColor="orange" value={formatCLP(stats.ingresos)}                  label="Ingresos confirmados"  sub="Órdenes completadas"/></div>
      </div>

      {alertas.length>0 && (
        <div className="rt-alert warning mb-4">
          <i className="bi bi-exclamation-triangle-fill"/>
          <div><strong>{alertas.length} orden(es) con prioridad Alta.</strong> {alertas.map(a=>a.id).join(', ')}</div>
        </div>
      )}

      <div className="row g-3">
        <div className="col-md-8">
          <div className="a-card">
            <div className="a-card-header">
              <h5><i className="bi bi-clipboard2-check me-2" style={{color:'var(--rt-cyan)'}}/>Órdenes recientes</h5>
              <button className="btn-rt btn-ghost-rt" style={{fontSize:'0.8rem',padding:'0.3rem 0.7rem'}} onClick={()=>onNav('ordenes')}>Ver todas</button>
            </div>
            <div style={{overflowX:'auto'}}>
              <table className="rt-table">
                <thead><tr><th>ID</th><th>Dispositivo</th><th>Estado</th><th>Prioridad</th><th>Costo</th></tr></thead>
                <tbody>
                  {recientes.map(o=>(
                    <tr key={o.id}>
                      <td><code style={{fontSize:'0.78rem'}}>{o.id}</code></td>
                      <td><strong>{o.dispositivo}</strong><br/><small style={{color:'var(--rt-gray)'}}>{o.marca}</small></td>
                      <td><EstadoBadge estado={o.estado}/></td>
                      <td><span className={`prioridad-${o.prioridad.toLowerCase()}`}>{o.prioridad}</span></td>
                      <td>{formatCLP(o.costoTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="a-card mb-3">
            <div className="a-card-header"><h5>📊 Por estado</h5></div>
            <div className="a-card-body">
              {ESTADOS.map(e=>(
                <div key={e} className="d-flex align-items-center justify-content-between mb-2">
                  <EstadoBadge estado={e}/>
                  <strong>{stats.porEstado[e]||0}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="a-card">
            <div className="a-card-header"><h5>🔧 Carga técnicos</h5></div>
            <div className="a-card-body">
              {tecnicos.map(t=>(
                <div key={t.id} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span style={{fontSize:'0.82rem',fontWeight:600}}>{t.nombre} {t.apellido}</span>
                    <small style={{color:'var(--rt-gray)'}}>{t.ordenesActivas}</small>
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

// ══ ÓRDENES / BOLETAS ════════════════════════════════════════
export function AdminOrdenes({ toast }) {
  const [ordenes,    setOrdenes]   = useState(()=>ordenesDB.getAll())
  const [clientes]                 = useState(()=>clientesDB.getAll())
  const [tecnicos]                 = useState(()=>tecnicosDB.getAll())
  const [servicios]                = useState(()=>serviciosDB.getAll())
  const [buscar,     setBuscar]    = useState('')
  const [filtro,     setFiltro]    = useState('Todos')
  const [modal,      setModal]     = useState(null)
  const [seleccion,  setSeleccion] = useState(null)
  const [toDelete,   setToDelete]  = useState(null)

  const refresh = () => setOrdenes(ordenesDB.getAll())

  const filtradas = useMemo(()=>ordenes.filter(o=>{
    const t=buscar.toLowerCase()
    return (!buscar||o.id.toLowerCase().includes(t)||o.dispositivo.toLowerCase().includes(t)) && (filtro==='Todos'||o.estado===filtro)
  }),[ordenes,buscar,filtro])

  // Formulario orden
  const [form, setForm] = useState({})
  const abrirCrear = () => { setForm({clienteId:'',tecnicoId:'',dispositivo:'',marca:'',falla:'',servicioId:'SE001',prioridad:'Media',fechaEstimada:'',notas:'',diagnostico:'',costoTotal:0}); setSeleccion(null); setModal('form') }
  const abrirEditar= (o) => { setForm({...o}); setSeleccion(o); setModal('form') }
  const guardar = (e) => {
    e.preventDefault()
    const data={...form,clienteId:Number(form.clienteId),tecnicoId:Number(form.tecnicoId)}
    if (seleccion) { ordenesDB.update(seleccion.id,data); toast('Orden actualizada') }
    else { const s=servicios.find(s=>s.id===data.servicioId); if(s)data.costoTotal=s.precio; ordenesDB.create(data); toast('Orden creada') }
    refresh(); setModal(null)
  }
  const cambiarEstado=(id,est)=>{ ordenesDB.cambiarEstado(id,est); refresh(); setModal(null); toast(`Estado → ${est}`) }
  const eliminar=()=>{ ordenesDB.delete(toDelete); refresh(); setModal(null); toast('Orden eliminada','info') }

  // Boleta
  const abrirBoleta = (o) => { setSeleccion(o); setModal('boleta') }
  const cl=(o)=>clientes.find(c=>c.id===o?.clienteId)
  const te=(o)=>tecnicos.find(t=>t.id===o?.tecnicoId)

  return (
    <div>
      <div className="a-card">
        <div className="a-card-header">
          <h5><i className="bi bi-clipboard2-check me-2" style={{color:'var(--rt-cyan)'}}/>Órdenes de Trabajo</h5>
          <button className="btn-rt btn-primary-rt" onClick={abrirCrear}><i className="bi bi-plus-lg"/> Nueva orden</button>
        </div>
        <div className="a-card-body" style={{paddingBottom:0}}>
          <div className="row g-2 mb-3">
            <div className="col-md-5">
              <div className="search-box">
                <i className="bi bi-search"/>
                <input className="f-input" style={{paddingLeft:'2.2rem'}} placeholder="Buscar por ID o dispositivo..." value={buscar} onChange={e=>setBuscar(e.target.value)}/>
              </div>
            </div>
            <div className="col-md-4">
              <select className="f-input" value={filtro} onChange={e=>setFiltro(e.target.value)}>
                <option value="Todos">Todos los estados</option>
                {ESTADOS.map(e=><option key={e}>{e}</option>)}
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-center justify-content-end">
              <small style={{color:'var(--rt-gray)'}}>{filtradas.length} resultado(s)</small>
            </div>
          </div>
        </div>
        <div style={{overflowX:'auto'}}>
          <table className="rt-table">
            <thead><tr><th>ID</th><th>Dispositivo</th><th>Cliente</th><th>Técnico</th><th>Estado</th><th>Prioridad</th><th>Costo</th><th>Acciones</th></tr></thead>
            <tbody>
              {filtradas.length===0
                ? <tr><td colSpan={8}><EmptyState icon="bi-clipboard-x" text="Sin órdenes."/></td></tr>
                : filtradas.map(o=>(
                  <tr key={o.id}>
                    <td><code style={{fontSize:'0.78rem'}}>{o.id}</code></td>
                    <td><strong>{o.dispositivo}</strong><br/><small style={{color:'var(--rt-gray)'}}>{o.marca}</small></td>
                    <td>{cl(o)?.nombre} {cl(o)?.apellido}</td>
                    <td>{te(o)?.nombre} {te(o)?.apellido}</td>
                    <td><EstadoBadge estado={o.estado}/></td>
                    <td><span className={`prioridad-${o.prioridad.toLowerCase()}`}>{o.prioridad}</span></td>
                    <td>{formatCLP(o.costoTotal)}</td>
                    <td>
                      <div style={{display:'flex',gap:'0.35rem'}}>
                        <button className="btn-icon primary" title="Ver boleta"  onClick={()=>abrirBoleta(o)}><i className="bi bi-receipt"/></button>
                        <button className="btn-icon success" title="Editar"      onClick={()=>abrirEditar(o)}><i className="bi bi-pencil"/></button>
                        <button className="btn-icon danger"  title="Eliminar"    onClick={()=>{setToDelete(o.id);setModal('confirm')}}><i className="bi bi-trash"/></button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Formulario */}
      <Modal open={modal==='form'} onClose={()=>setModal(null)} title={seleccion?`Editar ${seleccion.id}`:'Nueva Orden'} wide>
        <form onSubmit={guardar}>
          <div className="f-row-2 mb-3">
            <FL label="Cliente *"><select className="f-input" value={form.clienteId} onChange={e=>setForm({...form,clienteId:e.target.value})} required><option value="">— Seleccionar —</option>{clientes.map(c=><option key={c.id} value={c.id}>{c.nombre} {c.apellido}</option>)}</select></FL>
            <FL label="Técnico *"><select className="f-input" value={form.tecnicoId} onChange={e=>setForm({...form,tecnicoId:e.target.value})} required><option value="">— Seleccionar —</option>{tecnicos.map(t=><option key={t.id} value={t.id}>{t.nombre} {t.apellido}</option>)}</select></FL>
          </div>
          <div className="f-row-2 mb-3">
            <FL label="Dispositivo *"><input className="f-input" value={form.dispositivo||''} onChange={e=>setForm({...form,dispositivo:e.target.value})} required/></FL>
            <FL label="Marca *"><input className="f-input" value={form.marca||''} onChange={e=>setForm({...form,marca:e.target.value})} required/></FL>
          </div>
          <FL label="Falla reportada *"><input className="f-input" value={form.falla||''} onChange={e=>setForm({...form,falla:e.target.value})} required/></FL>
          <div className="f-row-2 mb-3">
            <FL label="Servicio *"><select className="f-input" value={form.servicioId} onChange={e=>setForm({...form,servicioId:e.target.value})}>{servicios.map(s=><option key={s.id} value={s.id}>{s.nombre} — {formatCLP(s.precio)}</option>)}</select></FL>
            <FL label="Prioridad *"><select className="f-input" value={form.prioridad} onChange={e=>setForm({...form,prioridad:e.target.value})}><option>Alta</option><option>Media</option><option>Baja</option></select></FL>
          </div>
          <div className="f-row-2 mb-3">
            <FL label="Fecha estimada"><input className="f-input" type="date" value={form.fechaEstimada||''} onChange={e=>setForm({...form,fechaEstimada:e.target.value})}/></FL>
            <FL label="Costo (CLP)"><input className="f-input" type="number" value={form.costoTotal||0} onChange={e=>setForm({...form,costoTotal:Number(e.target.value)})}/></FL>
          </div>
          {seleccion && <FL label="Diagnóstico"><textarea className="f-input" rows={2} value={form.diagnostico||''} onChange={e=>setForm({...form,diagnostico:e.target.value})}/></FL>}
          <FL label="Notas"><textarea className="f-input" rows={2} value={form.notas||''} onChange={e=>setForm({...form,notas:e.target.value})}/></FL>
          {seleccion && (
            <div className="mb-3">
              <label className="f-label">Cambiar estado</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:'0.4rem'}}>
                {ESTADOS.filter(e=>e!==seleccion.estado).map(e=>(
                  <button key={e} type="button" className="btn-rt btn-ghost-rt" style={{fontSize:'0.78rem',padding:'0.3rem 0.6rem'}} onClick={()=>cambiarEstado(seleccion.id,e)}>{estadoIcono(e)} {e}</button>
                ))}
              </div>
            </div>
          )}
          <div className="modal-footer" style={{padding:0,marginTop:'1rem'}}>
            <button type="button" className="btn-rt btn-ghost-rt" onClick={()=>setModal(null)}>Cancelar</button>
            <button type="submit" className="btn-rt btn-primary-rt"><i className="bi bi-check-lg"/> {seleccion?'Guardar':'Crear'}</button>
          </div>
        </form>
      </Modal>

      {/* Boleta */}
      <Modal open={modal==='boleta'} onClose={()=>setModal(null)} title={`Boleta ${seleccion?.id}`}>
        {seleccion && (
          <div>
            <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
              <div style={{fontFamily:'Space Grotesk',fontSize:'1.3rem',fontWeight:700}}>🔧 ReparaTech</div>
              <div style={{fontSize:'0.8rem',color:'var(--rt-gray)'}}>Av. Libertador B. O'Higgins 1234, Santiago</div>
              <div style={{fontSize:'0.8rem',color:'var(--rt-gray)'}}>contacto@reparatech.cl</div>
            </div>
            <div className="divider"/>
            <div className="row g-2 mb-3">
              <div className="col-6"><small style={{color:'var(--rt-gray)'}}>N° Orden</small><div><strong>{seleccion.id}</strong></div></div>
              <div className="col-6"><small style={{color:'var(--rt-gray)'}}>Fecha ingreso</small><div>{seleccion.fechaIngreso}</div></div>
              <div className="col-6"><small style={{color:'var(--rt-gray)'}}>Cliente</small><div>{cl(seleccion)?.nombre} {cl(seleccion)?.apellido}</div></div>
              <div className="col-6"><small style={{color:'var(--rt-gray)'}}>Técnico</small><div>{te(seleccion)?.nombre} {te(seleccion)?.apellido}</div></div>
              <div className="col-6"><small style={{color:'var(--rt-gray)'}}>Dispositivo</small><div>{seleccion.dispositivo} — {seleccion.marca}</div></div>
              <div className="col-6"><small style={{color:'var(--rt-gray)'}}>Estado</small><div><EstadoBadge estado={seleccion.estado}/></div></div>
            </div>
            <div className="divider"/>
            <div style={{display:'flex',justifyContent:'space-between',padding:'0.5rem 0',fontWeight:700,fontSize:'1.1rem'}}>
              <span>Total</span>
              <span style={{color:'var(--rt-blue)'}}>{formatCLP(seleccion.costoTotal)}</span>
            </div>
            <div className="divider"/>
            <div style={{display:'flex',gap:'0.8rem',marginTop:'0.5rem'}}>
              <button className="btn-rt btn-primary-rt" style={{flex:1}} onClick={()=>window.print()}>🖨️ Imprimir</button>
              <button className="btn-rt btn-ghost-rt"   style={{flex:1}} onClick={()=>setModal(null)}>Cerrar</button>
            </div>
          </div>
        )}
      </Modal>

      <Confirm open={modal==='confirm'} msg="¿Eliminar esta orden?" onConfirm={eliminar} onCancel={()=>setModal(null)}/>
    </div>
  )
}

// ══ SERVICIOS ADMIN ══════════════════════════════════════════
export function AdminServicios({ toast }) {
  const [servicios, setServicios] = useState(()=>serviciosDB.getAll())
  const [modal,     setModal]     = useState(null)
  const [seleccion, setSeleccion] = useState(null)
  const [toDelete,  setToDelete]  = useState(null)
  const [form, setForm] = useState({nombre:'',descripcion:'',tiempoEstimado:30,precio:0,categoria:'General',icono:'🔧',enOferta:false,descuento:0})

  const refresh = ()=>setServicios(serviciosDB.getAll())
  const abrirCrear  = ()=>{ setForm({nombre:'',descripcion:'',tiempoEstimado:30,precio:0,categoria:'General',icono:'🔧',enOferta:false,descuento:0}); setSeleccion(null); setModal('form') }
  const abrirEditar = (s)=>{ setForm({...s}); setSeleccion(s); setModal('form') }

  const guardar = (e)=>{ e.preventDefault(); if(seleccion){serviciosDB.update(seleccion.id,form);toast('Servicio actualizado')}else{serviciosDB.create(form);toast('Servicio creado')}; refresh(); setModal(null) }
  const eliminar = ()=>{ serviciosDB.delete(toDelete); refresh(); setModal(null); toast('Servicio eliminado','info') }

  const criticos = servicios.filter(s=>s.precio>50000)

  return (
    <div>
      <div className="a-card mb-3">
        <div className="a-card-header">
          <h5><i className="bi bi-tools me-2" style={{color:'var(--rt-cyan)'}}/>Servicios</h5>
          <div style={{display:'flex',gap:'0.5rem'}}>
            <button className="btn-rt btn-ghost-rt" onClick={()=>setModal('criticos')} style={{fontSize:'0.82rem'}}><i className="bi bi-exclamation-triangle"/> Listado críticos ({criticos.length})</button>
            <button className="btn-rt btn-primary-rt" onClick={abrirCrear}><i className="bi bi-plus-lg"/> Nuevo servicio</button>
          </div>
        </div>
        <div style={{overflowX:'auto'}}>
          <table className="rt-table">
            <thead><tr><th>Servicio</th><th>Categoría</th><th>Tiempo</th><th>Precio</th><th>Oferta</th><th>Acciones</th></tr></thead>
            <tbody>
              {servicios.map(s=>(
                <tr key={s.id}>
                  <td><strong>{s.icono} {s.nombre}</strong><br/><small style={{color:'var(--rt-gray)'}}>{s.descripcion.slice(0,50)}…</small></td>
                  <td><span className="badge-estado badge-diagnostico">{s.categoria}</span></td>
                  <td>{s.tiempoEstimado} min</td>
                  <td>{formatCLP(s.precio)}</td>
                  <td>{s.enOferta ? <span className="badge-estado badge-oferta">-{s.descuento}% OFF</span> : <span style={{color:'var(--rt-gray)',fontSize:'0.8rem'}}>No</span>}</td>
                  <td>
                    <div style={{display:'flex',gap:'0.35rem'}}>
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

      <Modal open={modal==='form'} onClose={()=>setModal(null)} title={seleccion?'Editar servicio':'Nuevo servicio'} wide>
        <form onSubmit={guardar}>
          <div className="f-row-2 mb-3">
            <FL label="Nombre *"><input className="f-input" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} required/></FL>
            <FL label="Icono"><input className="f-input" value={form.icono} onChange={e=>setForm({...form,icono:e.target.value})} placeholder="🔧"/></FL>
          </div>
          <FL label="Descripción *"><textarea className="f-input" rows={2} value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})} required/></FL>
          <div className="f-row-3 mb-3">
            <FL label="Tiempo (min) *"><input className="f-input" type="number" value={form.tiempoEstimado} onChange={e=>setForm({...form,tiempoEstimado:Number(e.target.value)})} required/></FL>
            <FL label="Precio (CLP) *"><input className="f-input" type="number" value={form.precio} onChange={e=>setForm({...form,precio:Number(e.target.value)})} required/></FL>
            <FL label="Categoría *"><select className="f-input" value={form.categoria} onChange={e=>setForm({...form,categoria:e.target.value})}><option>General</option><option>Pantallas</option><option>Baterías</option><option>Software</option><option>Hardware</option></select></FL>
          </div>
          <div className="f-row-2 mb-3">
            <FL label="¿En oferta?"><select className="f-input" value={form.enOferta} onChange={e=>setForm({...form,enOferta:e.target.value==='true'})}><option value="false">No</option><option value="true">Sí</option></select></FL>
            <FL label="Descuento (%)"><input className="f-input" type="number" min={0} max={100} value={form.descuento} onChange={e=>setForm({...form,descuento:Number(e.target.value)})} disabled={!form.enOferta}/></FL>
          </div>
          <div className="modal-footer" style={{padding:0,marginTop:'1rem'}}>
            <button type="button" className="btn-rt btn-ghost-rt" onClick={()=>setModal(null)}>Cancelar</button>
            <button type="submit" className="btn-rt btn-primary-rt"><i className="bi bi-check-lg"/> {seleccion?'Guardar':'Crear'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={modal==='criticos'} onClose={()=>setModal(null)} title="Listado servicios críticos (precio > $50.000)">
        <table className="rt-table">
          <thead><tr><th>Servicio</th><th>Precio</th><th>Tiempo</th></tr></thead>
          <tbody>
            {criticos.map(s=>(
              <tr key={s.id}><td>{s.icono} {s.nombre}</td><td style={{fontWeight:700,color:'var(--rt-danger)'}}>{formatCLP(s.precio)}</td><td>{s.tiempoEstimado} min</td></tr>
            ))}
          </tbody>
        </table>
      </Modal>

      <Confirm open={modal==='confirm'} msg="¿Eliminar este servicio?" onConfirm={eliminar} onCancel={()=>setModal(null)}/>
    </div>
  )
}

// ══ CATEGORÍAS ADMIN ═════════════════════════════════════════
export function AdminCategorias({ toast }) {
  const [cats,      setCats]      = useState(()=>categoriasDB.getAll())
  const [modal,     setModal]     = useState(null)
  const [seleccion, setSeleccion] = useState(null)
  const [toDelete,  setToDelete]  = useState(null)
  const [form, setForm] = useState({nombre:'',icono:'📦',descripcion:''})

  const refresh = ()=>setCats(categoriasDB.getAll())
  const abrirCrear  = ()=>{ setForm({nombre:'',icono:'📦',descripcion:''}); setSeleccion(null); setModal('form') }
  const abrirEditar = (c)=>{ setForm({...c}); setSeleccion(c); setModal('form') }

  const guardar = (e)=>{ e.preventDefault(); if(seleccion){categoriasDB.update(seleccion.id,form);toast('Categoría actualizada')}else{categoriasDB.create(form);toast('Categoría creada')}; refresh(); setModal(null) }
  const eliminar = ()=>{ categoriasDB.delete(toDelete); refresh(); setModal(null); toast('Categoría eliminada','info') }

  return (
    <div>
      <div className="a-card">
        <div className="a-card-header">
          <h5><i className="bi bi-tags me-2" style={{color:'var(--rt-cyan)'}}/>Categorías</h5>
          <button className="btn-rt btn-primary-rt" onClick={abrirCrear}><i className="bi bi-plus-lg"/> Nueva categoría</button>
        </div>
        <div style={{overflowX:'auto'}}>
          <table className="rt-table">
            <thead><tr><th>Categoría</th><th>Descripción</th><th>Servicios</th><th>Acciones</th></tr></thead>
            <tbody>
              {cats.map(c=>(
                <tr key={c.id}>
                  <td><strong>{c.icono} {c.nombre}</strong></td>
                  <td style={{color:'var(--rt-gray)',fontSize:'0.85rem'}}>{c.descripcion}</td>
                  <td>{serviciosDB.getByCategoria(c.nombre).length}</td>
                  <td>
                    <div style={{display:'flex',gap:'0.35rem'}}>
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

      <Modal open={modal==='form'} onClose={()=>setModal(null)} title={seleccion?'Editar categoría':'Nueva categoría'}>
        <form onSubmit={guardar}>
          <div className="f-row-2 mb-3">
            <FL label="Nombre *"><input className="f-input" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} required/></FL>
            <FL label="Icono"><input className="f-input" value={form.icono} onChange={e=>setForm({...form,icono:e.target.value})} placeholder="📦"/></FL>
          </div>
          <FL label="Descripción"><textarea className="f-input" rows={2} value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})}/></FL>
          <div className="modal-footer" style={{padding:0,marginTop:'1rem'}}>
            <button type="button" className="btn-rt btn-ghost-rt" onClick={()=>setModal(null)}>Cancelar</button>
            <button type="submit" className="btn-rt btn-primary-rt"><i className="bi bi-check-lg"/> {seleccion?'Guardar':'Crear'}</button>
          </div>
        </form>
      </Modal>

      <Confirm open={modal==='confirm'} msg="¿Eliminar esta categoría?" onConfirm={eliminar} onCancel={()=>setModal(null)}/>
    </div>
  )
}

// ══ CLIENTES ADMIN ═══════════════════════════════════════════
export function AdminClientes({ toast }) {
  const [clientes,  setClientes]  = useState(()=>clientesDB.getAll())
  const [buscar,    setBuscar]    = useState('')
  const [modal,     setModal]     = useState(null)
  const [seleccion, setSeleccion] = useState(null)
  const [toDelete,  setToDelete]  = useState(null)
  const [form, setForm] = useState({nombre:'',apellido:'',correo:'',telefono:'',direccion:'',password:'1234'})

  const refresh = ()=>setClientes(clientesDB.getAll())
  const filtrados = useMemo(()=>clientes.filter(c=>!buscar||`${c.nombre} ${c.apellido} ${c.correo}`.toLowerCase().includes(buscar.toLowerCase())),[clientes,buscar])

  const abrirCrear  = ()=>{ setForm({nombre:'',apellido:'',correo:'',telefono:'',direccion:'',password:'1234'}); setSeleccion(null); setModal('form') }
  const abrirEditar = (c)=>{ setForm({...c}); setSeleccion(c); setModal('form') }
  const abrirHistorial = (c)=>{ setSeleccion(c); setModal('historial') }

  const guardar = (e)=>{ e.preventDefault(); if(seleccion){clientesDB.update(seleccion.id,form);toast('Cliente actualizado')}else{clientesDB.create(form);toast('Cliente creado')}; refresh(); setModal(null) }
  const eliminar = ()=>{ clientesDB.delete(toDelete); refresh(); setModal(null); toast('Cliente eliminado','info') }

  const historial = (c) => ordenesDB.getByCliente(c?.id||0)

  return (
    <div>
      <div className="a-card">
        <div className="a-card-header">
          <h5><i className="bi bi-people me-2" style={{color:'var(--rt-cyan)'}}/>Clientes</h5>
          <button className="btn-rt btn-primary-rt" onClick={abrirCrear}><i className="bi bi-plus-lg"/> Nuevo cliente</button>
        </div>
        <div className="a-card-body" style={{paddingBottom:0}}>
          <div className="search-box mb-3" style={{maxWidth:380}}>
            <i className="bi bi-search"/>
            <input className="f-input" style={{paddingLeft:'2.2rem'}} placeholder="Buscar..." value={buscar} onChange={e=>setBuscar(e.target.value)}/>
          </div>
        </div>
        <div style={{overflowX:'auto'}}>
          <table className="rt-table">
            <thead><tr><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Órdenes</th><th>Acciones</th></tr></thead>
            <tbody>
              {filtrados.length===0
                ? <tr><td colSpan={5}><EmptyState icon="bi-people" text="Sin clientes."/></td></tr>
                : filtrados.map(c=>(
                  <tr key={c.id}>
                    <td><strong>{c.nombre} {c.apellido}</strong><br/><small style={{color:'var(--rt-gray)'}}>{c.direccion}</small></td>
                    <td>{c.correo}</td>
                    <td>{c.telefono}</td>
                    <td><span className="badge-estado badge-recibido">{ordenesDB.getByCliente(c.id).length}</span></td>
                    <td>
                      <div style={{display:'flex',gap:'0.35rem'}}>
                        <button className="btn-icon primary"  title="Historial"  onClick={()=>abrirHistorial(c)}><i className="bi bi-clock-history"/></button>
                        <button className="btn-icon success"  title="Editar"     onClick={()=>abrirEditar(c)}><i className="bi bi-pencil"/></button>
                        <button className="btn-icon danger"   title="Eliminar"   onClick={()=>{setToDelete(c.id);setModal('confirm')}}><i className="bi bi-trash"/></button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal==='form'} onClose={()=>setModal(null)} title={seleccion?'Editar cliente':'Nuevo cliente'}>
        <form onSubmit={guardar}>
          <div className="f-row-2 mb-3">
            <FL label="Nombre *"><input className="f-input" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} required/></FL>
            <FL label="Apellido *"><input className="f-input" value={form.apellido} onChange={e=>setForm({...form,apellido:e.target.value})} required/></FL>
          </div>
          <FL label="Correo *"><input className="f-input" type="email" value={form.correo} onChange={e=>setForm({...form,correo:e.target.value})} required/></FL>
          <div className="f-row-2 mb-3">
            <FL label="Teléfono"><input className="f-input" value={form.telefono} onChange={e=>setForm({...form,telefono:e.target.value})}/></FL>
            <FL label="Dirección"><input className="f-input" value={form.direccion} onChange={e=>setForm({...form,direccion:e.target.value})}/></FL>
          </div>
          <div className="modal-footer" style={{padding:0,marginTop:'1rem'}}>
            <button type="button" className="btn-rt btn-ghost-rt" onClick={()=>setModal(null)}>Cancelar</button>
            <button type="submit" className="btn-rt btn-primary-rt"><i className="bi bi-check-lg"/> {seleccion?'Guardar':'Crear'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={modal==='historial'} onClose={()=>setModal(null)} title={`Historial de compras — ${seleccion?.nombre} ${seleccion?.apellido}`} wide>
        {historial(seleccion).length===0
          ? <EmptyState icon="bi-bag-x" text="Sin órdenes registradas."/>
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

// ══ TÉCNICOS ADMIN ═══════════════════════════════════════════
export function AdminTecnicos({ toast }) {
  const [tecnicos,  setTecnicos]  = useState(()=>tecnicosDB.getAll())
  const [modal,     setModal]     = useState(null)
  const [seleccion, setSeleccion] = useState(null)
  const [toDelete,  setToDelete]  = useState(null)
  const [form, setForm] = useState({nombre:'',apellido:'',especialidad:'Smartphones'})
  const ESPS = ['Smartphones','Computadores','Tablets','Placa Base','Software','General']

  const refresh = ()=>setTecnicos(tecnicosDB.getAll())
  const abrirCrear  = ()=>{ setForm({nombre:'',apellido:'',especialidad:'Smartphones'}); setSeleccion(null); setModal('form') }
  const abrirEditar = (t)=>{ setForm({...t}); setSeleccion(t); setModal('form') }
  const guardar = (e)=>{ e.preventDefault(); if(seleccion){tecnicosDB.update(seleccion.id,form);toast('Técnico actualizado')}else{tecnicosDB.create(form);toast('Técnico creado')}; refresh(); setModal(null) }
  const eliminar = ()=>{ tecnicosDB.delete(toDelete); refresh(); setModal(null); toast('Técnico eliminado','info') }

  return (
    <div>
      <div className="a-card">
        <div className="a-card-header">
          <h5><i className="bi bi-person-badge me-2" style={{color:'var(--rt-cyan)'}}/>Técnicos</h5>
          <button className="btn-rt btn-primary-rt" onClick={abrirCrear}><i className="bi bi-plus-lg"/> Nuevo técnico</button>
        </div>
        <div style={{overflowX:'auto'}}>
          <table className="rt-table">
            <thead><tr><th>Técnico</th><th>Especialidad</th><th>Carga</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              {tecnicos.map(t=>(
                <tr key={t.id}>
                  <td><strong>{t.nombre} {t.apellido}</strong></td>
                  <td><span className="badge-estado badge-diagnostico">{t.especialidad}</span></td>
                  <td style={{minWidth:120}}>
                    <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                      <strong style={{minWidth:16}}>{t.ordenesActivas}</strong>
                      <StockBar value={t.ordenesActivas} max={5}/>
                    </div>
                  </td>
                  <td>{t.activo?<span className="badge-estado badge-listo">Activo</span>:<span className="badge-estado badge-cancelado">Inactivo</span>}</td>
                  <td>
                    <div style={{display:'flex',gap:'0.35rem'}}>
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

      <Modal open={modal==='form'} onClose={()=>setModal(null)} title={seleccion?'Editar técnico':'Nuevo técnico'}>
        <form onSubmit={guardar}>
          <div className="f-row-2 mb-3">
            <FL label="Nombre *"><input className="f-input" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} required/></FL>
            <FL label="Apellido *"><input className="f-input" value={form.apellido} onChange={e=>setForm({...form,apellido:e.target.value})} required/></FL>
          </div>
          <FL label="Especialidad *"><select className="f-input" value={form.especialidad} onChange={e=>setForm({...form,especialidad:e.target.value})}>{ESPS.map(e=><option key={e}>{e}</option>)}</select></FL>
          <div className="modal-footer" style={{padding:0,marginTop:'1rem'}}>
            <button type="button" className="btn-rt btn-ghost-rt" onClick={()=>setModal(null)}>Cancelar</button>
            <button type="submit" className="btn-rt btn-primary-rt"><i className="bi bi-check-lg"/> {seleccion?'Guardar':'Crear'}</button>
          </div>
        </form>
      </Modal>

      <Confirm open={modal==='confirm'} msg="¿Eliminar este técnico?" onConfirm={eliminar} onCancel={()=>setModal(null)}/>
    </div>
  )
}

// ══ REPUESTOS ADMIN ══════════════════════════════════════════
export function AdminRepuestos({ toast }) {
  const [repuestos, setRepuestos] = useState(()=>repuestosDB.getAll())
  const [modal,     setModal]     = useState(null)
  const [seleccion, setSeleccion] = useState(null)
  const [delta,     setDelta]     = useState(0)

  const refresh = ()=>setRepuestos(repuestosDB.getAll())
  const abrirAjuste = (r)=>{ setSeleccion(r); setDelta(0); setModal('ajuste') }
  const guardar = (e)=>{ e.preventDefault(); const r=repuestosDB.ajustarStock(seleccion.id,Number(delta)); if(!r){toast('Stock no puede ser negativo','error');return}; refresh(); setModal(null); toast(`Stock actualizado a ${r.stock}`) }

  return (
    <div>
      <div className="a-card">
        <div className="a-card-header"><h5><i className="bi bi-box-seam me-2" style={{color:'var(--rt-cyan)'}}/>Inventario Repuestos</h5></div>
        {repuestos.some(r=>r.stock<=3)&&<div className="a-card-body" style={{paddingBottom:0}}><div className="rt-alert warning"><i className="bi bi-exclamation-triangle-fill"/><strong>Stock crítico:</strong> {repuestos.filter(r=>r.stock<=3).map(r=>r.nombre).join(', ')}</div></div>}
        <div style={{overflowX:'auto'}}>
          <table className="rt-table">
            <thead><tr><th>Código</th><th>Repuesto</th><th>Compatible</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
            <tbody>
              {repuestos.map(r=>(
                <tr key={r.id}>
                  <td><code>{r.id}</code></td>
                  <td><strong>{r.nombre}</strong></td>
                  <td>{r.compatible}</td>
                  <td>{formatCLP(r.precio)}</td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                      <strong style={{minWidth:24,color:r.stock<=3?'var(--rt-danger)':r.stock<=8?'var(--rt-warn)':'var(--rt-success)'}}>{r.stock}</strong>
                      <div style={{width:70}}><StockBar value={r.stock} max={20}/></div>
                    </div>
                  </td>
                  <td><button className="btn-rt btn-ghost-rt" style={{fontSize:'0.78rem',padding:'0.3rem 0.6rem'}} onClick={()=>abrirAjuste(r)}><i className="bi bi-sliders"/> Ajustar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal==='ajuste'} onClose={()=>setModal(null)} title={`Ajustar stock: ${seleccion?.nombre}`}>
        <form onSubmit={guardar}>
          <div className="rt-alert info mb-3"><i className="bi bi-info-circle"/> Stock actual: <strong>{seleccion?.stock}</strong> unidades</div>
          <FL label="Variación de stock"><input className="f-input" type="number" value={delta} onChange={e=>setDelta(e.target.value)} placeholder="+5 agregar, -2 restar"/></FL>
          {delta!=0&&<small style={{color:'var(--rt-gray)'}}>Nuevo stock: <strong>{(seleccion?.stock||0)+Number(delta)}</strong></small>}
          <div className="modal-footer" style={{padding:0,marginTop:'1rem'}}>
            <button type="button" className="btn-rt btn-ghost-rt" onClick={()=>setModal(null)}>Cancelar</button>
            <button type="submit" className="btn-rt btn-primary-rt">Guardar</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

// ══ USUARIOS ADMIN ═══════════════════════════════════════════
export function AdminUsuarios({ toast }) {
  const [usuarios, setUsuarios] = useState(()=>authDB.getAll())
  const [modal,    setModal]    = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [form, setForm] = useState({nombre:'',apellido:'',correo:'',rol:'recepcionista',password:''})
  const ROLES = ['administrador','encargado','recepcionista','tecnico']
  const rolColor = {administrador:'badge-reparacion',encargado:'badge-diagnostico',recepcionista:'badge-recibido',tecnico:'badge-listo'}

  const refresh = ()=>setUsuarios(authDB.getAll())
  const guardar = (e)=>{ e.preventDefault(); authDB.create(form); refresh(); setModal(null); toast('Usuario creado') }
  const eliminar = ()=>{ authDB.delete(toDelete); refresh(); setModal(null); toast('Usuario eliminado','info') }

  return (
    <div>
      <div className="a-card">
        <div className="a-card-header">
          <h5><i className="bi bi-shield-person me-2" style={{color:'var(--rt-cyan)'}}/>Usuarios del sistema</h5>
          <button className="btn-rt btn-primary-rt" onClick={()=>{setForm({nombre:'',apellido:'',correo:'',rol:'recepcionista',password:''});setModal('form')}}><i className="bi bi-plus-lg"/> Nuevo usuario</button>
        </div>
        <div style={{overflowX:'auto'}}>
          <table className="rt-table">
            <thead><tr><th>Usuario</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              {usuarios.map(u=>(
                <tr key={u.id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:'0.6rem'}}>
                      <div className="user-avatar" style={{background:'var(--rt-blue)'}}>{u.nombre[0]}{u.apellido[0]}</div>
                      <strong>{u.nombre} {u.apellido}</strong>
                    </div>
                  </td>
                  <td>{u.correo}</td>
                  <td><span className={`badge-estado ${rolColor[u.rol]||'badge-recibido'}`}>{u.rol}</span></td>
                  <td><span className="badge-estado badge-listo">Activo</span></td>
                  <td><button className="btn-icon danger" onClick={()=>{setToDelete(u.id);setModal('confirm')}}><i className="bi bi-trash"/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal==='form'} onClose={()=>setModal(null)} title="Nuevo usuario">
        <form onSubmit={guardar}>
          <div className="f-row-2 mb-3">
            <FL label="Nombre *"><input className="f-input" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} required/></FL>
            <FL label="Apellido *"><input className="f-input" value={form.apellido} onChange={e=>setForm({...form,apellido:e.target.value})} required/></FL>
          </div>
          <FL label="Correo *"><input className="f-input" type="email" value={form.correo} onChange={e=>setForm({...form,correo:e.target.value})} required/></FL>
          <div className="f-row-2 mb-3">
            <FL label="Rol *"><select className="f-input" value={form.rol} onChange={e=>setForm({...form,rol:e.target.value})}>{ROLES.map(r=><option key={r}>{r}</option>)}</select></FL>
            <FL label="Contraseña *"><input className="f-input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/></FL>
          </div>
          <div className="modal-footer" style={{padding:0,marginTop:'1rem'}}>
            <button type="button" className="btn-rt btn-ghost-rt" onClick={()=>setModal(null)}>Cancelar</button>
            <button type="submit" className="btn-rt btn-primary-rt"><i className="bi bi-check-lg"/> Crear</button>
          </div>
        </form>
      </Modal>

      <Confirm open={modal==='confirm'} msg="¿Eliminar este usuario?" onConfirm={eliminar} onCancel={()=>setModal(null)}/>
    </div>
  )
}

// ══ REPORTES ═════════════════════════════════════════════════
export function AdminReportes() {
  const stats    = ordenesDB.getStats()
  const ordenes  = ordenesDB.getAll()
  const tecnicos = tecnicosDB.getAll()
  const clientes = clientesDB.getAll()
  const tasa = stats.total>0?Math.round(((stats.porEstado['Listo para retirar']||0)/stats.total)*100):0

  const productividad = tecnicos.map(t=>({...t,total:ordenes.filter(o=>o.tecnicoId===t.id).length,completadas:ordenes.filter(o=>o.tecnicoId===t.id&&o.estado==='Listo para retirar').length,ingresos:ordenes.filter(o=>o.tecnicoId===t.id&&o.estado==='Listo para retirar').reduce((s,o)=>s+o.costoTotal,0)})).sort((a,b)=>b.completadas-a.completadas)
  const topClientes  = clientes.map(c=>({...c,total:ordenes.filter(o=>o.clienteId===c.id).length,gasto:ordenes.filter(o=>o.clienteId===c.id&&o.estado==='Listo para retirar').reduce((s,o)=>s+o.costoTotal,0)})).sort((a,b)=>b.total-a.total).slice(0,5)

  return (
    <div>
      <div className="row g-3 mb-4">
        <div className="col-md-4"><StatCard icon="📊" iconColor="blue"   value={stats.total}          label="Total órdenes"/></div>
        <div className="col-md-4"><StatCard icon="💵" iconColor="green"  value={formatCLP(stats.ingresos)} label="Ingresos totales"/></div>
        <div className="col-md-4"><StatCard icon="📈" iconColor="orange" value={`${tasa}%`}            label="Tasa completadas"/></div>
      </div>
      <div className="row g-3">
        <div className="col-md-6">
          <div className="a-card">
            <div className="a-card-header"><h5>🏆 Productividad por técnico</h5></div>
            <div style={{overflowX:'auto'}}>
              <table className="rt-table">
                <thead><tr><th>Técnico</th><th>Total</th><th>Completadas</th><th>Ingresos</th></tr></thead>
                <tbody>{productividad.map(t=><tr key={t.id}><td><strong>{t.nombre} {t.apellido}</strong><br/><small style={{color:'var(--rt-gray)'}}>{t.especialidad}</small></td><td>{t.total}</td><td><span className="badge-estado badge-listo">{t.completadas}</span></td><td>{formatCLP(t.ingresos)}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="a-card mb-3">
            <div className="a-card-header"><h5>📋 Por estado</h5></div>
            <div className="a-card-body">
              {ESTADOS.map(e=>{ const cnt=stats.porEstado[e]||0; const pct=stats.total>0?((cnt/stats.total)*100).toFixed(0):0; return(
                <div key={e} className="mb-3">
                  <div className="d-flex justify-content-between mb-1"><EstadoBadge estado={e}/><span style={{fontSize:'0.8rem',fontWeight:600}}>{cnt} ({pct}%)</span></div>
                  <div className="stock-bar"><div className="stock-fill" style={{width:`${pct}%`,background:'var(--rt-cyan)'}}/></div>
                </div>
              )})}
            </div>
          </div>
          <div className="a-card">
            <div className="a-card-header"><h5>👥 Top clientes</h5></div>
            <table className="rt-table"><thead><tr><th>Cliente</th><th>Órdenes</th><th>Gasto</th></tr></thead><tbody>{topClientes.map(c=><tr key={c.id}><td>{c.nombre} {c.apellido}</td><td>{c.total}</td><td>{formatCLP(c.gasto)}</td></tr>)}</tbody></table>
          </div>
        </div>
      </div>
    </div>
  )
}

// ══ PERFIL ADMIN ═════════════════════════════════════════════
export function AdminPerfil({ user, toast }) {
  const [form, setForm] = useState({nombre:user.nombre,apellido:user.apellido,correo:user.correo})
  const [pwd,  setPwd]  = useState({actual:'',nueva:'',confirmar:''})

  const guardarPerfil = (e)=>{ e.preventDefault(); toast('Perfil actualizado correctamente') }
  const cambiarPwd    = (e)=>{ e.preventDefault(); if(pwd.nueva!==pwd.confirmar){toast('Las contraseñas no coinciden','error');return}; toast('Contraseña actualizada'); setPwd({actual:'',nueva:'',confirmar:''}) }

  return (
    <div style={{maxWidth:640}}>
      <div className="a-card mb-3">
        <div className="a-card-header"><h5><i className="bi bi-person-circle me-2" style={{color:'var(--rt-cyan)'}}/>Mi perfil</h5></div>
        <div className="a-card-body">
          <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.5rem'}}>
            <div className="user-avatar" style={{width:60,height:60,fontSize:'1.4rem',background:'var(--rt-blue)'}}>{user.nombre[0]}{user.apellido[0]}</div>
            <div>
              <div style={{fontWeight:700,fontSize:'1.05rem'}}>{user.nombre} {user.apellido}</div>
              <span className="badge-estado badge-reparacion">{user.rol}</span>
            </div>
          </div>
          <form onSubmit={guardarPerfil}>
            <div className="f-row-2 mb-3">
              <FL label="Nombre"><input className="f-input" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})}/></FL>
              <FL label="Apellido"><input className="f-input" value={form.apellido} onChange={e=>setForm({...form,apellido:e.target.value})}/></FL>
            </div>
            <FL label="Correo"><input className="f-input" type="email" value={form.correo} onChange={e=>setForm({...form,correo:e.target.value})}/></FL>
            <button type="submit" className="btn-rt btn-primary-rt" style={{marginTop:'0.5rem'}}><i className="bi bi-check-lg"/> Guardar cambios</button>
          </form>
        </div>
      </div>

      <div className="a-card">
        <div className="a-card-header"><h5><i className="bi bi-lock me-2" style={{color:'var(--rt-cyan)'}}/>Cambiar contraseña</h5></div>
        <div className="a-card-body">
          <form onSubmit={cambiarPwd}>
            <FL label="Contraseña actual"><input className="f-input" type="password" value={pwd.actual} onChange={e=>setPwd({...pwd,actual:e.target.value})} required/></FL>
            <div className="f-row-2 mb-3">
              <FL label="Nueva contraseña"><input className="f-input" type="password" value={pwd.nueva} onChange={e=>setPwd({...pwd,nueva:e.target.value})} required/></FL>
              <FL label="Confirmar"><input className="f-input" type="password" value={pwd.confirmar} onChange={e=>setPwd({...pwd,confirmar:e.target.value})} required/></FL>
            </div>
            <button type="submit" className="btn-rt btn-success-rt"><i className="bi bi-shield-check"/> Actualizar contraseña</button>
          </form>
        </div>
      </div>
    </div>
  )
}
