export default function StoreNavbar({ pagina, onNav, carritoCount, onCartOpen, clienteLogueado, onLogout }) {
  const links = [
    {id:'home',label:'Home'},{id:'servicios',label:'Servicios'},{id:'ofertas',label:'Ofertas'},
    {id:'categorias',label:'Categorías'},{id:'nosotros',label:'Nosotros'},
    {id:'blog',label:'Blog'},{id:'contacto',label:'Contacto'},
  ]
  return (
    <nav className="store-nav">
      <div className="inner">
        <div className="brand" onClick={()=>onNav('home')}>Repara<span>Tech</span></div>
        <div className="links">
          {links.map(l=><a key={l.id} className={pagina===l.id?'activo':''} onClick={()=>onNav(l.id)}>{l.label}</a>)}
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <button className="cart-btn" onClick={onCartOpen}>
            <i className="bi bi-cart3"/>
            {carritoCount>0&&<span className="cart-badge">{carritoCount}</span>}
          </button>
          {clienteLogueado
            ?<><span style={{color:'rgba(255,255,255,0.8)',fontSize:'0.82rem'}}>{clienteLogueado.nombre}</span>
               <button className="btn-rt btn-ghost" style={{fontSize:'0.78rem',padding:'4px 10px',background:'transparent',color:'rgba(255,255,255,0.7)',borderColor:'rgba(255,255,255,0.2)'}} onClick={onLogout}>Salir</button></>
            :<><button className="btn-rt btn-ghost" style={{fontSize:'0.82rem',background:'transparent',color:'rgba(255,255,255,0.7)',borderColor:'rgba(255,255,255,0.2)'}} onClick={()=>onNav('login')}>Iniciar sesión</button>
               <button className="btn-rt btn-cyan"  style={{fontSize:'0.82rem'}} onClick={()=>onNav('registro')}>Crear cuenta</button></>
          }
        </div>
      </div>
    </nav>
  )
}