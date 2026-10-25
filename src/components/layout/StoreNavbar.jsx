export default function StoreNavbar({ page, onNav, carritoCount, onCartOpen, clienteLogueado, onLogout }) {
  const links = [
    { id:'home',       label:'Home'       },
    { id:'servicios',  label:'Servicios'  },
    { id:'ofertas',    label:'Ofertas'    },
    { id:'categorias', label:'Categorías' },
    { id:'nosotros',   label:'Nosotros'   },
    { id:'blog',       label:'Blog'       },
    { id:'contacto',   label:'Contacto'   },
  ]
  return (
    <nav className="store-nav">
      <div className="nav-inner">
        <div className="brand" onClick={()=>onNav('home')} style={{cursor:'pointer'}}>
          Repara<span>Tech</span>
        </div>
        <div className="nav-links">
          {links.map(l=>(
            <a key={l.id} className={page===l.id?'active':''} onClick={()=>onNav(l.id)} style={{cursor:'pointer'}}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <button className="cart-btn" onClick={onCartOpen}>
            <i className="bi bi-cart3"/>
            <span>Carrito</span>
            {carritoCount>0&&<span className="cart-badge">{carritoCount}</span>}
          </button>
          {clienteLogueado
            ? <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                <span style={{color:'rgba(255,255,255,0.8)',fontSize:'0.83rem'}}>{clienteLogueado.nombre}</span>
                <button className="btn-rt btn-ghost-rt" style={{fontSize:'0.78rem',padding:'0.3rem 0.6rem'}} onClick={onLogout}>Salir</button>
              </div>
            : <>
                <button className="btn-rt btn-ghost-rt" style={{fontSize:'0.83rem',background:'transparent',color:'rgba(255,255,255,0.8)',borderColor:'rgba(255,255,255,0.2)'}} onClick={()=>onNav('login')}>Iniciar sesión</button>
                <button className="btn-rt btn-cyan-rt"  style={{fontSize:'0.83rem'}} onClick={()=>onNav('registro')}>Crear cuenta</button>
              </>
          }
        </div>
      </div>
    </nav>
  )
}
