import { useState, useMemo } from 'react'
import { serviciosDB, categoriasDB, blogsDB, clientesDB, formatCLP, ordenesDB } from '../../data/db'

export function HomePage({ onNav, onAddCart }) {
  const servicios  = serviciosDB.getAll().slice(0,4)
  const categorias = categoriasDB.getAll()
  return (
    <div>
      <div className="hero">
        <h1>🔧 Repara tu dispositivo hoy</h1>
        <p>Servicio técnico profesional para smartphones, laptops y tablets. Garantía en todas las reparaciones.</p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <button className="btn-rt btn-cyan" style={{fontSize:'1rem',padding:'10px 24px'}} onClick={()=>onNav('servicios')}><i className="bi bi-tools"/> Ver servicios</button>
          <button className="btn-rt btn-ghost" style={{fontSize:'1rem',padding:'10px 24px',background:'rgba(255,255,255,0.1)',color:'#fff',borderColor:'rgba(255,255,255,0.3)'}} onClick={()=>onNav('comprar')}>Solicitar reparación</button>
        </div>
      </div>
      <div className="contenedor">
        <div className="sec-title">Categorías</div>
        <div className="cat-grid">
          {categorias.map(c=><div key={c.id} className="cat-card" onClick={()=>onNav('categorias')}><div style={{fontSize:'2rem',marginBottom:6}}>{c.icono}</div><div style={{fontWeight:700,fontSize:'0.83rem'}}>{c.nombre}</div></div>)}
        </div>
        <div className="sec-title">Servicios <span>destacados</span></div>
        <div className="srv-grid">
          {servicios.map(s=>{const p=serviciosDB.precioConDescuento(s);return(
            <div key={s.id} className="srv-card">
              <div className="sc-img">{s.icono}</div>
              <div className="sc-body">
                {s.enOferta&&<span className="offer-tag">-{s.descuento}% OFF</span>}
                <div className="sc-name">{s.nombre}</div>
                <div className="sc-desc">{s.descripcion}</div>
                <div className="sc-price">{formatCLP(p)}</div>
                {s.enOferta&&<div style={{textDecoration:'line-through',color:'var(--rt-gray)',fontSize:'0.8rem'}}>{formatCLP(s.precio)}</div>}
                <div style={{fontSize:'0.75rem',color:'var(--rt-gray)',marginTop:4}}>⏱ {s.tiempo} min</div>
                <button className="btn-add" onClick={()=>onAddCart(s)}>Agregar al carrito</button>
              </div>
            </div>
          )})}
        </div>
        <div style={{background:'linear-gradient(135deg,var(--rt-blue),var(--rt-cyan))',borderRadius:14,padding:'2rem',color:'#fff',margin:'2rem 0',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem'}}>
          <div><div style={{fontSize:'0.78rem',opacity:0.8,fontWeight:600,textTransform:'uppercase'}}>Oferta del mes</div><div style={{fontSize:'1.4rem',fontWeight:800,margin:'4px 0'}}>Limpieza de software — 15% OFF</div><div style={{opacity:0.85}}>Incluye eliminación de virus y optimización</div></div>
          <button className="btn-rt" style={{background:'#fff',color:'var(--rt-blue)',padding:'10px 20px'}} onClick={()=>onNav('ofertas')}>Ver oferta</button>
        </div>
        <div className="sec-title">Últimos <span>artículos</span></div>
        <div className="blog-grid">
          {blogsDB.getAll().slice(0,2).map(b=>(
            <div key={b.id} className="blog-card" onClick={()=>onNav('blog-detalle',b.id)}>
              <div style={{height:170,background:'linear-gradient(135deg,#e8f4fd,#dbeafe)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'3rem'}}>{b.icono}</div>
              <div style={{padding:'1rem'}}><div style={{fontSize:'0.72rem',color:'var(--rt-cyan)',fontWeight:700,textTransform:'uppercase'}}>{b.tag}</div><div style={{fontWeight:700,margin:'4px 0',fontSize:'0.95rem'}}>{b.titulo}</div><div style={{fontSize:'0.78rem',color:'var(--rt-gray)'}}>{b.fecha}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ServiciosPage({ onNav, onAddCart }) {
  const servicios  = serviciosDB.getAll()
  const categorias = categoriasDB.getAll()
  const [cat, setCat] = useState('Todos')
  const [buscar, setBuscar] = useState('')
  const filtrados = useMemo(()=>servicios.filter(s=>(!buscar||s.nombre.toLowerCase().includes(buscar.toLowerCase()))&&(cat==='Todos'||s.categoria===cat)),[cat,buscar,servicios])
  return (
    <div className="contenedor">
      <div className="sec-title">Nuestros <span>servicios</span></div>
      <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}>
        <div className="search-box" style={{flex:1,maxWidth:340}}>
          <i className="bi bi-search"/>
          <input className="f-input" style={{paddingLeft:'2.2rem'}} placeholder="Buscar..." value={buscar} onChange={e=>setBuscar(e.target.value)}/>
        </div>
      </div>
      <div className="cat-tabs">
        <div className={`cat-tab${cat==='Todos'?' activo':''}`} onClick={()=>setCat('Todos')}>Todos</div>
        {categorias.map(c=><div key={c.id} className={`cat-tab${cat===c.nombre?' activo':''}`} onClick={()=>setCat(c.nombre)}>{c.nombre}</div>)}
      </div>
      <div className="srv-grid">
        {filtrados.map(s=>{const p=serviciosDB.precioConDescuento(s);return(
          <div key={s.id} className="srv-card">
            <div className="sc-img">{s.icono}</div>
            <div className="sc-body">
              {s.enOferta&&<span className="offer-tag">-{s.descuento}% OFF</span>}
              <div className="sc-name">{s.nombre}</div>
              <div className="sc-desc">{s.descripcion}</div>
              <div className="sc-price">{formatCLP(p)}</div>
              {s.enOferta&&<div style={{textDecoration:'line-through',color:'var(--rt-gray)',fontSize:'0.8rem'}}>{formatCLP(s.precio)}</div>}
              <div style={{fontSize:'0.75rem',color:'var(--rt-gray)',marginTop:4}}>⏱ {s.tiempo} min</div>
              <button className="btn-add" onClick={()=>onAddCart(s)}>Agregar al carrito</button>
            </div>
          </div>
        )})}
      </div>
    </div>
  )
}

export function OfertasPage({ onAddCart }) {
  const ofertas = serviciosDB.getEnOferta()
  return (
    <div className="contenedor">
      <div style={{background:'linear-gradient(135deg,#dc2626,#f97316)',borderRadius:14,padding:'2rem',color:'#fff',textAlign:'center',marginBottom:24}}>
        <h1 style={{fontSize:'1.8rem',fontWeight:800}}>🔥 Ofertas especiales</h1>
        <p style={{opacity:0.9}}>Servicios con descuento por tiempo limitado</p>
      </div>
      <div className="srv-grid">
        {ofertas.map(s=>{const p=serviciosDB.precioConDescuento(s);return(
          <div key={s.id} className="srv-card" style={{border:'2px solid var(--rt-danger)'}}>
            <div className="sc-img" style={{background:'linear-gradient(135deg,#fee2e2,#fecaca)'}}>{s.icono}</div>
            <div className="sc-body">
              <span className="offer-tag">-{s.descuento}% OFF</span>
              <div className="sc-name" style={{marginTop:6}}>{s.nombre}</div>
              <div className="sc-desc">{s.descripcion}</div>
              <div style={{display:'flex',gap:8,alignItems:'baseline',margin:'6px 0'}}>
                <span className="sc-price" style={{color:'var(--rt-danger)'}}>{formatCLP(p)}</span>
                <span style={{textDecoration:'line-through',color:'var(--rt-gray)',fontSize:'0.82rem'}}>{formatCLP(s.precio)}</span>
              </div>
              <div style={{fontSize:'0.75rem',color:'var(--rt-gray)'}}>⏱ {s.tiempo} min</div>
              <button className="btn-add" style={{background:'var(--rt-danger)'}} onClick={()=>onAddCart(s)}>🔥 Aprovechar oferta</button>
            </div>
          </div>
        )})}
      </div>
    </div>
  )
}

export function CategoriasPage({ onAddCart }) {
  const categorias = categoriasDB.getAll()
  const [activa, setActiva] = useState(categorias[0])
  const srvs = serviciosDB.getByCategoria(activa?.nombre||'')
  return (
    <div className="contenedor">
      <div className="sec-title">Categorías de <span>servicios</span></div>
      <div className="cat-grid">
        {categorias.map(c=><div key={c.id} className={`cat-card${activa?.id===c.id?' activo':''}`} onClick={()=>setActiva(c)}><div style={{fontSize:'2rem',marginBottom:6}}>{c.icono}</div><div style={{fontWeight:700,fontSize:'0.83rem'}}>{c.nombre}</div></div>)}
      </div>
      {activa&&<>
        <h3 style={{margin:'1.5rem 0 1rem'}}>{activa.icono} {activa.nombre}</h3>
        <p style={{color:'var(--rt-gray)',marginBottom:16}}>{activa.descripcion}</p>
        {srvs.length===0
          ?<div className="alerta info"><i className="bi bi-info-circle"/> Sin servicios en esta categoría.</div>
          :<div className="srv-grid">
            {srvs.map(s=>{const p=serviciosDB.precioConDescuento(s);return(
              <div key={s.id} className="srv-card">
                <div className="sc-img">{s.icono}</div>
                <div className="sc-body">
                  {s.enOferta&&<span className="offer-tag">-{s.descuento}% OFF</span>}
                  <div className="sc-name">{s.nombre}</div>
                  <div className="sc-desc">{s.descripcion}</div>
                  <div className="sc-price">{formatCLP(p)}</div>
                  <button className="btn-add" onClick={()=>onAddCart(s)}>Agregar</button>
                </div>
              </div>
            )})}
          </div>
        }
      </>}
    </div>
  )
}

export function NosotrosPage() {
  const equipo=[{n:'Rodrigo Fuentes',r:'Jefe Técnico',i:'👨‍🔧'},{n:'Camila Vera',r:'Laptops',i:'👩‍💻'},{n:'Felipe Morales',r:'Tablets',i:'👨‍💻'},{n:'Josefa Lagos',r:'Placa Base',i:'👩‍🔧'},{n:'Matías Pérez',r:'Smartphones',i:'👨‍🔧'},{n:'Daniela Araya',r:'Software',i:'👩‍💻'}]
  return (
    <div>
      <div style={{background:'var(--rt-dark)',color:'#fff',padding:'4rem 24px',textAlign:'center'}}><h1 style={{fontSize:'2rem',fontWeight:800}}>Sobre ReparaTech 🔧</h1><p style={{opacity:0.75,maxWidth:540,margin:'8px auto 0'}}>Expertos en reparación de dispositivos electrónicos desde 2017.</p></div>
      <div className="contenedor">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2rem',marginBottom:'3rem',alignItems:'center'}}>
          <div>
            <h2 style={{fontSize:'1.5rem',fontWeight:700,marginBottom:12}}>Nuestra <span style={{color:'var(--rt-cyan)'}}>historia</span></h2>
            <p style={{color:'var(--rt-gray)',lineHeight:1.7,marginBottom:12}}>ReparaTech nació en 2017 con una misión clara: brindar servicio técnico de calidad a precios justos. Hoy atendemos más de 800 reparaciones al mes con 6 técnicos especializados.</p>
            <p style={{color:'var(--rt-gray)',lineHeight:1.7}}>Nos especializamos en smartphones, tablets y laptops, ofreciendo diagnóstico gratuito y garantía en todas nuestras reparaciones.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            {[['800+','Reparaciones/mes'],['7 años','Experiencia'],['98%','Satisfacción'],['6','Técnicos cert.']].map(([v,l])=>(
              <div key={l} style={{background:'#fff',border:'1px solid var(--rt-border)',borderRadius:12,padding:'1.2rem',textAlign:'center'}}>
                <div style={{fontFamily:'Space Grotesk',fontSize:'1.7rem',fontWeight:800,color:'var(--rt-blue)'}}>{v}</div>
                <div style={{fontSize:'0.78rem',color:'var(--rt-gray)',marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <h2 style={{fontSize:'1.3rem',fontWeight:700,marginBottom:16}}>Nuestro <span style={{color:'var(--rt-cyan)'}}>equipo</span></h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'1rem'}}>
          {equipo.map(t=>(
            <div key={t.n} style={{background:'#fff',border:'1px solid var(--rt-border)',borderRadius:14,padding:'1.5rem',textAlign:'center'}}>
              <div style={{width:60,height:60,borderRadius:'50%',background:'linear-gradient(135deg,var(--rt-blue),var(--rt-cyan))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.6rem',margin:'0 auto 10px'}}>{t.i}</div>
              <div style={{fontWeight:700,fontSize:'0.9rem'}}>{t.n}</div>
              <div style={{fontSize:'0.75rem',color:'var(--rt-gray)',marginTop:2}}>{t.r}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function BlogPage({ onNav }) {
  const blogs = blogsDB.getAll()
  return (
    <div className="contenedor">
      <div className="sec-title">Blog <span>ReparaTech</span></div>
      <div className="blog-grid">
        {blogs.map(b=>(
          <div key={b.id} className="blog-card" onClick={()=>onNav('blog-detalle',b.id)}>
            <div style={{height:175,background:'linear-gradient(135deg,#e8f4fd,#dbeafe)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'3rem'}}>{b.icono}</div>
            <div style={{padding:'1.1rem'}}>
              <div style={{fontSize:'0.72rem',color:'var(--rt-cyan)',fontWeight:700,textTransform:'uppercase'}}>{b.tag}</div>
              <div style={{fontWeight:700,margin:'4px 0',fontSize:'0.95rem'}}>{b.titulo}</div>
              <div style={{fontSize:'0.82rem',color:'var(--rt-gray)',marginBottom:8}}>{b.resumen}</div>
              <div style={{fontSize:'0.75rem',color:'var(--rt-gray)'}}>{b.fecha}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DetalleBlogPage({ blogId, onNav }) {
  const b = blogsDB.getById(blogId)
  const otros = blogsDB.getAll().filter(x=>x.id!==blogId).slice(0,2)
  if(!b)return<div className="contenedor"><p>No encontrado.</p></div>
  return (
    <div className="contenedor" style={{maxWidth:720}}>
      <button className="btn-rt btn-ghost" style={{marginBottom:16}} onClick={()=>onNav('blog')}><i className="bi bi-arrow-left"/> Volver</button>
      <div style={{background:'linear-gradient(135deg,#e8f4fd,#dbeafe)',borderRadius:14,height:230,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'5rem',marginBottom:20}}>{b.icono}</div>
      <span style={{background:'var(--rt-cyan)',color:'#fff',borderRadius:20,padding:'2px 12px',fontSize:'0.73rem',fontWeight:700}}>{b.tag}</span>
      <h1 style={{fontSize:'1.7rem',fontWeight:800,margin:'10px 0'}}>{b.titulo}</h1>
      <div style={{color:'var(--rt-gray)',fontSize:'0.82rem',marginBottom:16}}>{b.fecha}</div>
      <p style={{lineHeight:1.8,color:'#374151'}}>{b.contenido}</p>
      {otros.length>0&&<>
        <div className="divider"/>
        <h3 style={{marginBottom:12}}>Otros artículos</h3>
        <div className="blog-grid">
          {otros.map(x=>(
            <div key={x.id} className="blog-card" onClick={()=>onNav('blog-detalle',x.id)}>
              <div style={{height:150,background:'linear-gradient(135deg,#e8f4fd,#dbeafe)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.5rem'}}>{x.icono}</div>
              <div style={{padding:'1rem'}}><div style={{fontSize:'0.72rem',color:'var(--rt-cyan)',fontWeight:700}}>{x.tag}</div><div style={{fontWeight:700,fontSize:'0.9rem',margin:'4px 0'}}>{x.titulo}</div></div>
            </div>
          ))}
        </div>
      </>}
    </div>
  )
}

export function ContactoPage({ toast }) {
  const [form,setForm]=useState({nombre:'',correo:'',asunto:'',mensaje:''})
  const submit=(e)=>{e.preventDefault();toast&&toast('Mensaje enviado');setForm({nombre:'',correo:'',asunto:'',mensaje:''})}
  return (
    <div className="contenedor">
      <div className="sec-title">Contáctanos</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2rem'}}>
        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          {[['📍','Dirección','Av. Libertador B. O\'Higgins 1234, Santiago'],['📞','Teléfono','+56 2 2345 6789'],['📧','Email','contacto@reparatech.cl'],['🕐','Horario','Lun–Vie 9:00–19:00 | Sáb 10:00–15:00']].map(([i,l,v])=>(
            <div key={l} style={{display:'flex',gap:10,alignItems:'flex-start'}}>
              <span style={{fontSize:'1.1rem'}}>{i}</span>
              <div><div style={{fontWeight:600,fontSize:'0.88rem'}}>{l}</div><div style={{color:'var(--rt-gray)',fontSize:'0.83rem',marginTop:2}}>{v}</div></div>
            </div>
          ))}
        </div>
        <div className="form-card" style={{padding:'1.5rem'}}>
          <form onSubmit={submit}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
              <div><label className="f-label">Nombre *</label><input className="f-input" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} required/></div>
              <div><label className="f-label">Correo *</label><input className="f-input" type="email" value={form.correo} onChange={e=>setForm({...form,correo:e.target.value})} required/></div>
            </div>
            <div style={{marginBottom:10}}><label className="f-label">Asunto *</label><input className="f-input" value={form.asunto} onChange={e=>setForm({...form,asunto:e.target.value})} required/></div>
            <div style={{marginBottom:14}}><label className="f-label">Mensaje *</label><textarea className="f-input" rows={4} value={form.mensaje} onChange={e=>setForm({...form,mensaje:e.target.value})} required/></div>
            <button type="submit" className="btn-full" style={{background:'var(--rt-blue)',color:'#fff'}}>Enviar mensaje</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export function RegistroPage({ onNav, onLogin }) {
  const [form,setForm]=useState({nombre:'',apellido:'',correo:'',telefono:'',direccion:'',password:'',confirmar:''})
  const [err,setErr]=useState('')
  const submit=(e)=>{e.preventDefault();if(form.password!==form.confirmar){setErr('Las contraseñas no coinciden.');return};const{confirmar,...d}=form;const n=clientesDB.create(d);onLogin&&onLogin(n);onNav('home')}
  return (
    <div className="contenedor" style={{maxWidth:500}}>
      <div className="form-card">
        <h2 style={{marginBottom:4}}>Crear cuenta</h2>
        <p style={{color:'var(--rt-gray)',fontSize:'0.85rem',marginBottom:16}}>Regístrate para hacer seguimiento de tus reparaciones</p>
        {err&&<div className="alerta danger"><i className="bi bi-x-circle"/> {err}</div>}
        <form onSubmit={submit}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
            <div><label className="f-label">Nombre *</label><input className="f-input" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} required/></div>
            <div><label className="f-label">Apellido *</label><input className="f-input" value={form.apellido} onChange={e=>setForm({...form,apellido:e.target.value})} required/></div>
          </div>
          <div style={{marginBottom:10}}><label className="f-label">Correo *</label><input className="f-input" type="email" value={form.correo} onChange={e=>setForm({...form,correo:e.target.value})} required/></div>
          <div style={{marginBottom:10}}><label className="f-label">Teléfono</label><input className="f-input" value={form.telefono} onChange={e=>setForm({...form,telefono:e.target.value})}/></div>
          <div style={{marginBottom:10}}><label className="f-label">Dirección</label><input className="f-input" value={form.direccion} onChange={e=>setForm({...form,direccion:e.target.value})}/></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
            <div><label className="f-label">Contraseña *</label><input className="f-input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/></div>
            <div><label className="f-label">Confirmar *</label><input className="f-input" type="password" value={form.confirmar} onChange={e=>setForm({...form,confirmar:e.target.value})} required/></div>
          </div>
          <button type="submit" className="btn-full" style={{background:'var(--rt-blue)',color:'#fff'}}>Crear cuenta</button>
        </form>
        <p style={{textAlign:'center',marginTop:12,fontSize:'0.84rem'}}>¿Ya tienes cuenta? <span style={{color:'var(--rt-cyan)',cursor:'pointer',fontWeight:600}} onClick={()=>onNav('login')}>Inicia sesión</span></p>
      </div>
    </div>
  )
}

export function LoginClientePage({ onNav, onLogin }) {
  const [form,setForm]=useState({correo:'carlos@gmail.com',password:'1234'})
  const [err,setErr]=useState('')
  const submit=(e)=>{e.preventDefault();const c=clientesDB.login(form.correo,form.password);if(c){onLogin&&onLogin(c);onNav('home')}else setErr('Correo o contraseña incorrectos.')}
  return (
    <div className="contenedor" style={{maxWidth:420}}>
      <div className="form-card">
        <h2 style={{marginBottom:4}}>Iniciar sesión</h2>
        <p style={{color:'var(--rt-gray)',fontSize:'0.85rem',marginBottom:12}}>Accede para ver el estado de tus reparaciones</p>
        <div className="alerta info"><i className="bi bi-info-circle"/><small>Demo: carlos@gmail.com / 1234</small></div>
        {err&&<div className="alerta danger"><i className="bi bi-x-circle"/> {err}</div>}
        <form onSubmit={submit}>
          <div style={{marginBottom:10}}><label className="f-label">Correo</label><input className="f-input" type="email" value={form.correo} onChange={e=>setForm({...form,correo:e.target.value})} required/></div>
          <div style={{marginBottom:14}}><label className="f-label">Contraseña</label><input className="f-input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/></div>
          <button type="submit" className="btn-full" style={{background:'var(--rt-blue)',color:'#fff'}}>Entrar</button>
        </form>
        <p style={{textAlign:'center',marginTop:12,fontSize:'0.84rem'}}>¿No tienes cuenta? <span style={{color:'var(--rt-cyan)',cursor:'pointer',fontWeight:600}} onClick={()=>onNav('registro')}>Regístrate</span></p>
        <div className="divider"/>
        <button className="btn-full" style={{background:'var(--rt-bg)',color:'var(--rt-dark)',border:'1px solid var(--rt-border)'}} onClick={()=>onNav('admin-login')}>🔑 Acceso administradores</button>
      </div>
    </div>
  )
}

export function CheckoutPage({ carrito, clienteLogueado, onResult }) {
  const [form,setForm]=useState({nombre:clienteLogueado?.nombre||'',apellido:clienteLogueado?.apellido||'',correo:clienteLogueado?.correo||'',calle:'',departamento:'',region:'Región Metropolitana de Santiago',comuna:'Santiago',indicaciones:''})
  const total=carrito.reduce((s,i)=>s+serviciosDB.precioConDescuento(i),0)
  const STEPS=['Carrito','Datos','Pago']
  const submit=(e)=>{e.preventDefault();const ok=Math.random()>0.2;onResult(ok?'ok':'error',{form,total,nro:Math.floor(Math.random()*90000+10000)})}
  return (
    <div className="checkout-wrap">
      <div className="steps">
        {STEPS.map((s,i)=>(
          <div key={s} className={`step${i===1?' activo':''}`}>
            <div className="step-dot">{i+1}</div>
            <div className="step-label">{s}</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:'1.5rem',alignItems:'start'}}>
        <form onSubmit={submit}>
          <div className="ch-card">
            <h4>Servicios solicitados</h4>
            {carrito.length===0?<div className="alerta warning"><i className="bi bi-cart-x"/> Carrito vacío.</div>:carrito.map((s,i)=>(
              <div key={i} className="order-line"><span>{s.icono} {s.nombre}</span><strong>{formatCLP(serviciosDB.precioConDescuento(s))}</strong></div>
            ))}
          </div>
          <div className="ch-card">
            <h4>Información del cliente</h4>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
              <div><label className="f-label">Nombre *</label><input className="f-input" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} required/></div>
              <div><label className="f-label">Apellidos *</label><input className="f-input" value={form.apellido} onChange={e=>setForm({...form,apellido:e.target.value})} required/></div>
            </div>
            <div><label className="f-label">Correo *</label><input className="f-input" type="email" value={form.correo} onChange={e=>setForm({...form,correo:e.target.value})} required/></div>
          </div>
          <div className="ch-card">
            <h4>Dirección de entrega del dispositivo</h4>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
              <div><label className="f-label">Calle *</label><input className="f-input" value={form.calle} onChange={e=>setForm({...form,calle:e.target.value})} required/></div>
              <div><label className="f-label">Dpto.</label><input className="f-input" placeholder="Ej: 605" value={form.departamento} onChange={e=>setForm({...form,departamento:e.target.value})}/></div>
              <div><label className="f-label">Región *</label><select className="f-input" value={form.region} onChange={e=>setForm({...form,region:e.target.value})}><option>Región Metropolitana de Santiago</option><option>Valparaíso</option><option>Biobío</option></select></div>
              <div><label className="f-label">Comuna *</label><select className="f-input" value={form.comuna} onChange={e=>setForm({...form,comuna:e.target.value})}><option>Santiago</option><option>Providencia</option><option>Las Condes</option><option>Ñuñoa</option><option>Maipú</option><option>Cerrillos</option></select></div>
            </div>
            <div><label className="f-label">Indicaciones (opcional)</label><textarea className="f-input" rows={2} value={form.indicaciones} onChange={e=>setForm({...form,indicaciones:e.target.value})}/></div>
          </div>
          <button type="submit" className="btn-full" style={{background:'var(--rt-cyan)',color:'#fff'}} disabled={carrito.length===0}>Confirmar solicitud · {formatCLP(total)}</button>
        </form>
        <div className="ch-card" style={{position:'sticky',top:80}}>
          <h4>Resumen</h4>
          {carrito.map((s,i)=><div key={i} className="order-line"><span style={{fontSize:'0.84rem'}}>{s.icono} {s.nombre}</span><span>{formatCLP(serviciosDB.precioConDescuento(s))}</span></div>)}
          <div className="order-total"><span>Total</span><span style={{color:'var(--rt-blue)'}}>{formatCLP(total)}</span></div>
          <div className="alerta info" style={{marginTop:8,fontSize:'0.8rem'}}><i className="bi bi-shield-check"/> Pago seguro al retirar</div>
        </div>
      </div>
    </div>
  )
}

export function PagoOKPage({ data, onNav }) {
  return (
    <div className="contenedor" style={{maxWidth:480,textAlign:'center',paddingTop:'4rem'}}>
      <div style={{background:'#fff',borderRadius:16,padding:'3rem 2rem',boxShadow:'0 8px 40px rgba(0,0,0,0.1)'}}>
        <div style={{fontSize:'4rem',marginBottom:16}}>✅</div>
        <h2 style={{color:'var(--rt-success)',marginBottom:8}}>¡Solicitud confirmada!</h2>
        <p style={{color:'var(--rt-gray)',marginBottom:6}}>N° de orden: <strong>#{data?.nro}</strong></p>
        <p style={{color:'var(--rt-gray)',marginBottom:20}}>Nos pondremos en contacto para coordinar la entrega.</p>
        <div className="alerta success" style={{textAlign:'left'}}><div><strong>{data?.form?.nombre} {data?.form?.apellido}</strong><br/><small>{data?.form?.correo}</small><br/><small>{data?.form?.calle}, {data?.form?.comuna}</small></div></div>
        <div style={{display:'flex',gap:10,marginTop:16,flexWrap:'wrap'}}>
          <button className="btn-full" style={{background:'var(--rt-blue)',color:'#fff',flex:1}} onClick={()=>onNav('home')}>Volver al inicio</button>
          <button className="btn-full" style={{background:'var(--rt-bg)',color:'var(--rt-dark)',border:'1px solid var(--rt-border)',flex:1}} onClick={()=>window.print()}>🖨️ Imprimir boleta</button>
        </div>
      </div>
    </div>
  )
}

export function PagoErrorPage({ data, onNav }) {
  return (
    <div className="contenedor" style={{maxWidth:480,textAlign:'center',paddingTop:'4rem'}}>
      <div style={{background:'#fff',borderRadius:16,padding:'3rem 2rem',boxShadow:'0 8px 40px rgba(0,0,0,0.1)'}}>
        <div style={{fontSize:'4rem',marginBottom:16}}>❌</div>
        <h2 style={{color:'var(--rt-danger)',marginBottom:8}}>No se pudo realizar el pago</h2>
        <p style={{color:'var(--rt-gray)',marginBottom:6}}>N° de intento: <strong>#{data?.nro}</strong></p>
        <div className="alerta danger" style={{marginTop:16}}><i className="bi bi-exclamation-triangle"/> Verifica tu información e intenta nuevamente.</div>
        <div style={{display:'flex',gap:10,marginTop:16,flexWrap:'wrap'}}>
          <button className="btn-full" style={{background:'var(--rt-danger)',color:'#fff',flex:1}} onClick={()=>onNav('comprar')}>🔄 Volver a intentar</button>
          <button className="btn-full" style={{background:'var(--rt-bg)',color:'var(--rt-dark)',border:'1px solid var(--rt-border)',flex:1}} onClick={()=>onNav('contacto')}>Contactar soporte</button>
        </div>
      </div>
    </div>
  )
}
