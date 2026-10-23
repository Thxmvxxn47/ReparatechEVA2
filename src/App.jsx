// ReparaTech v2.2
// Tienda: completa con carrito, checkout, blog detalle, ofertas, categorías
// Admin:  dashboard, órdenes, kanban, servicios, categorías, clientes,
//         técnicos, repuestos, usuarios, reportes básicos
// Pendiente v3.0: perfil admin completo, reportes avanzados con top clientes

import { useState, useCallback } from 'react'
import { serviciosDB, formatCLP } from './data/db'
import { ToastContainer } from './components/ui'
import StoreNavbar   from './components/layout/StoreNavbar'
import AdminSidebar  from './components/layout/AdminSidebar'

import {
  HomePage, ServiciosPage, OfertasPage, CategoriasPage,
  NosotrosPage, BlogPage, DetalleBlogPage, ContactoPage,
  LoginClientePage, RegistroPage, CheckoutPage,
  PagoOKPage, PagoErrorPage,
} from './pages/tienda'

import {
  AdminLoginPage, AdminDashboard, AdminOrdenes, AdminKanban,
  AdminServicios, AdminCategorias, AdminClientes, AdminTecnicos,
  AdminRepuestos, AdminUsuarios, AdminReportes,
} from './pages/admin'

// ── Carrito lateral ─────────────────────────────────────────
function CartDrawer({ open, onClose, carrito, onRemove, onCheckout }) {
  const total = carrito.reduce((s,i)=>s+serviciosDB.precioConDescuento(i),0)
  return (
    <>
      {open && <div className="cart-overlay" onClick={onClose}/>}
      <div className={`cart-drawer${open?' open':''}`}>
        <div className="cart-hdr">
          <h4>🛒 Carrito</h4>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:'1.4rem',cursor:'pointer',lineHeight:1}}>×</button>
        </div>
        <div className="cart-items">
          {carrito.length===0
            ? <div style={{textAlign:'center',padding:'3rem 1rem',color:'#6b7280'}}><div style={{fontSize:'2.5rem',opacity:0.3}}>🛒</div><p style={{marginTop:8,fontSize:'0.88rem'}}>Tu carrito está vacío</p></div>
            : carrito.map((s,i)=>(
                <div key={i} className="cart-item">
                  <div className="ci-icon">{s.icono}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:'0.88rem'}}>{s.nombre}</div>
                    <div style={{fontSize:'0.8rem',color:'#00b4d8',fontWeight:600}}>{formatCLP(serviciosDB.precioConDescuento(s))}</div>
                  </div>
                  <button onClick={()=>onRemove(i)} style={{background:'none',border:'none',color:'#dc2626',cursor:'pointer',fontSize:'1.1rem'}}>×</button>
                </div>
              ))
          }
        </div>
        <div className="cart-footer">
          <div style={{display:'flex',justifyContent:'space-between',fontWeight:700,fontSize:'1rem',marginBottom:12}}>
            <span>Total</span>
            <span style={{color:'#0f4c81'}}>{formatCLP(total)}</span>
          </div>
          <button className="btn-full" style={{background:'#00b4d8',color:'#fff'}} disabled={carrito.length===0} onClick={()=>{onCheckout();onClose()}}>
            Solicitar reparación
          </button>
        </div>
      </div>
    </>
  )
}

// ── Topbar admin ─────────────────────────────────────────────
const TITULOS = {
  dashboard:'Dashboard', ordenes:'Órdenes / Boletas', kanban:'Vista Kanban',
  servicios:'Servicios', categorias:'Categorías', clientes:'Clientes',
  tecnicos:'Técnicos', repuestos:'Repuestos', usuarios:'Usuarios', reportes:'Reportes',
}

function AdminTopbar({ pagina, user }) {
  return (
    <div className="admin-topbar">
      <div className="page-title">{TITULOS[pagina]||pagina}</div>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <div className="u-avatar" style={{background:'#0f4c81'}}>{user.nombre[0]}{user.apellido[0]}</div>
        <span style={{fontSize:'0.82rem',fontWeight:600}}>{user.nombre}</span>
      </div>
    </div>
  )
}

// ── APP ──────────────────────────────────────────────────────
export default function App() {
  const [modo,      setModo]     = useState('tienda')
  const [pagina,    setPagina]   = useState('home')
  const [adminPag,  setAdminPag] = useState('dashboard')
  const [extraId,   setExtraId]  = useState(null)
  const [adminUser, setAdminUser]= useState(null)
  const [clienteLog,setClienteLog]=useState(null)
  const [carrito,   setCarrito]  = useState([])
  const [cartOpen,  setCartOpen] = useState(false)
  const [pagoData,  setPagoData] = useState(null)
  const [toasts,    setToasts]   = useState([])

  const toast = useCallback((msg, type='success')=>{
    const id=Date.now()
    setToasts(p=>[...p,{id,msg,type}])
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),3000)
  },[])

  const navStore = (p, id=null) => {
    if (p==='admin-login') { setModo('admin-login'); return }
    setPagina(p); setExtraId(id); window.scrollTo(0,0)
  }

  const navAdmin = (p) => {
    if (p==='tienda') { setModo('tienda'); setPagina('home'); return }
    setAdminPag(p)
  }

  const addCart    = (s)         => { setCarrito(p=>[...p,s]); toast(`${s.nombre} agregado`); setCartOpen(true) }
  const removeCart = (i)         => setCarrito(p=>p.filter((_,idx)=>idx!==i))
  const handleResult = (tipo, d) => { setPagoData({tipo,d}); setPagina(tipo==='ok'?'pago-ok':'pago-error'); if(tipo==='ok')setCarrito([]) }

  const pageProps = { toast }

  // Login admin
  if (modo==='admin-login' || (modo==='admin' && !adminUser)) {
    return <>
      <AdminLoginPage onLogin={u=>{setAdminUser(u);setModo('admin');setAdminPag('dashboard')}}/>
      <ToastContainer toasts={toasts}/>
    </>
  }

  // Panel admin
  if (modo==='admin' && adminUser) {
    return <>
      <div style={{display:'flex',minHeight:'100vh'}}>
        <AdminSidebar activo={adminPag} onNav={navAdmin} user={adminUser} onLogout={()=>{setAdminUser(null);setModo('tienda')}}/>
        <div className="admin-main">
          <AdminTopbar pagina={adminPag} user={adminUser}/>
          <div className="admin-content">
            {adminPag==='dashboard'  && <AdminDashboard  onNav={navAdmin}/>}
            {adminPag==='ordenes'    && <AdminOrdenes    {...pageProps}/>}
            {adminPag==='kanban'     && <AdminKanban     {...pageProps}/>}
            {adminPag==='servicios'  && <AdminServicios  {...pageProps}/>}
            {adminPag==='categorias' && <AdminCategorias {...pageProps}/>}
            {adminPag==='clientes'   && <AdminClientes   {...pageProps}/>}
            {adminPag==='tecnicos'   && <AdminTecnicos   {...pageProps}/>}
            {adminPag==='repuestos'  && <AdminRepuestos  {...pageProps}/>}
            {adminPag==='usuarios'   && <AdminUsuarios   {...pageProps}/>}
            {adminPag==='reportes'   && <AdminReportes/>}
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts}/>
    </>
  }

  // Tienda pública
  return <>
    <StoreNavbar pagina={pagina} onNav={navStore} carritoCount={carrito.length}
      onCartOpen={()=>setCartOpen(true)} clienteLogueado={clienteLog} onLogout={()=>setClienteLog(null)}/>

    {pagina==='home'         && <HomePage          onNav={navStore} onAddCart={addCart}/>}
    {pagina==='servicios'    && <ServiciosPage      onNav={navStore} onAddCart={addCart}/>}
    {pagina==='ofertas'      && <OfertasPage        onAddCart={addCart}/>}
    {pagina==='categorias'   && <CategoriasPage     onAddCart={addCart}/>}
    {pagina==='nosotros'     && <NosotrosPage/>}
    {pagina==='blog'         && <BlogPage           onNav={navStore}/>}
    {pagina==='blog-detalle' && <DetalleBlogPage    blogId={extraId} onNav={navStore}/>}
    {pagina==='contacto'     && <ContactoPage       toast={toast}/>}
    {pagina==='login'        && <LoginClientePage   onNav={navStore} onLogin={setClienteLog}/>}
    {pagina==='registro'     && <RegistroPage       onNav={navStore} onLogin={setClienteLog}/>}
    {pagina==='comprar'      && <CheckoutPage       carrito={carrito} clienteLogueado={clienteLog} onResult={handleResult}/>}
    {pagina==='pago-ok'      && <PagoOKPage         data={pagoData?.d} onNav={navStore}/>}
    {pagina==='pago-error'   && <PagoErrorPage      data={pagoData?.d} onNav={navStore}/>}

    <div className="store-footer">
      © 2024 <strong>ReparaTech</strong> — Santiago Centro &nbsp;·&nbsp;
      <span style={{color:'#00b4d8',cursor:'pointer'}} onClick={()=>navStore('admin-login')}>Admin</span>
    </div>

    <CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)}
      carrito={carrito} onRemove={removeCart} onCheckout={()=>navStore('comprar')}/>
    <ToastContainer toasts={toasts}/>
  </>
}
