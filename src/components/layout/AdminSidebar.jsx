const NAV = [
  {section:'Principal'},
  {id:'dashboard', label:'Dashboard',     icon:'bi-speedometer2'},
  {id:'ordenes',   label:'Órdenes',       icon:'bi-clipboard2-check'},
  {id:'kanban',    label:'Vista Kanban',  icon:'bi-kanban'},
  {section:'Catálogo'},
  {id:'servicios', label:'Servicios',     icon:'bi-tools'},
  {id:'categorias',label:'Categorías',    icon:'bi-tags'},
  {id:'repuestos', label:'Repuestos',     icon:'bi-box-seam'},
  {section:'Personas'},
  {id:'clientes',  label:'Clientes',      icon:'bi-people'},
  {id:'tecnicos',  label:'Técnicos',      icon:'bi-person-badge'},
  {id:'usuarios',  label:'Usuarios',      icon:'bi-shield-person'},
  {section:'Sistema'},
  {id:'reportes',  label:'Reportes',      icon:'bi-bar-chart-line'},
  // Pendiente v3.0: perfil completo con cambio de contraseña
  {id:'tienda',    label:'Ver tienda',    icon:'bi-shop'},
]
export default function AdminSidebar({ activo, onNav, user, onLogout }) {
  return (
    <div className="admin-sidebar">
      <div className="brand">
        <div className="logo-icon">🔧</div>
        <span className="logo">Repara<span>Tech</span></span>
      </div>
      <nav className="admin-nav">
        {NAV.map((item,i)=>
          item.section
            ?<div key={i} className="sec-lbl">{item.section}</div>
            :<div key={item.id} className={`nav-item${activo===item.id?' activo':''}`} onClick={()=>onNav(item.id)}>
               <i className={`bi ${item.icon}`}/><span>{item.label}</span>
             </div>
        )}
      </nav>
      <div className="sb-footer">
        <div className="user-pill" onClick={onLogout}>
          <div className="u-avatar">{user.nombre[0]}{user.apellido[0]}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:'0.8rem',color:'#fff',fontWeight:600}}>{user.nombre} {user.apellido}</div>
            <div style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.4)'}}>{user.rol}</div>
          </div>
          <i className="bi bi-box-arrow-right" style={{color:'rgba(255,255,255,0.4)',fontSize:'0.85rem'}}/>
        </div>
      </div>
    </div>
  )
}
