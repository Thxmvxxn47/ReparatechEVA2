import { useState, useCallback } from 'react'
import { ToastContainer } from './components/ui'
import StoreNavbar  from './components/layout/StoreNavbar'
import AdminSidebar from './components/layout/AdminSidebar'

// Páginas tienda
import {
  HomePage, ServiciosPage, OfertasPage,
  CategoriasPage, RegistroPage, LoginClientePage, NosotrosPage,
  BlogPage, DetalleBlogPage, ContactoPage, CheckoutPage,
  PagoOKPage, PagoErrorPage,
} from './pages/tienda'

// Páginas admin
import {
  AdminLoginPage, AdminDashboard, AdminOrdenes, AdminServicios,
  AdminCategorias, AdminClientes, AdminTecnicos, AdminRepuestos,
  AdminUsuarios, AdminReportes, AdminPerfil,
} from './pages/admin'

// ── Carrito lateral ──────────────────────────────────────────
import { serviciosDB, formatCLP } from './data/db'

function CartDrawer({ open, onClose, carrito, onRemove, onCheckout }) {
  const total = carrito.reduce((s,i)=>s+serviciosDB.precioConDescuento(i),0)
  return (
    <>
      <div className={`cart-drawer-overlay ${open?'show':''}`} onClick={onClose}/>
      <div className={`cart-drawer ${open?'open':''}`}>
        <div className="cart-header">
          <h4>🛒 Carrito de servicios</h4>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:'1.3rem',cursor:'pointer'}}>×</button>
        </div>
        <div className="cart-items">
          {carrito.length===0
            ? <div style={{textAlign:'center',padding:'3rem 1rem',color:'var(--rt-gray)'}}>
                <div style={{fontSize:'2.5rem',opacity:0.3}}>🛒</div>
                <p style={{marginTop:'0.5rem',fontSize:'0.88rem'}}>Tu carrito está vacío</p>
              </div>
            : carrito.map((s,i)=>(
                <div key={i} className="cart-item">
                  <div className="ci-icon">{s.icono}</div>
                  <div className="ci-info">
                    <div className="ci-name">{s.nombre}</div>
                    <div className="ci-price">{formatCLP(serviciosDB.precioConDescuento(s))}</div>
                  </div>
                  <button onClick={()=>onRemove(i)} style={{background:'none',border:'none',color:'var(--rt-danger)',cursor:'pointer',fontSize:'1.1rem'}}>×</button>
                </div>
              ))
          }
        </div>
        <div className="cart-footer">
          <div className="cart-total">
            <span>Total</span>
            <span style={{color:'var(--rt-blue)'}}>{formatCLP(total)}</span>
          </div>
          <button className="btn-full btn-cyan-full" disabled={carrito.length===0} onClick={()=>{onCheckout();onClose()}}>
            Solicitar reparación
          </button>
        </div>
      </div>
    </>
  )
}

// ── Topbar admin ─────────────────────────────────────────────
const ADMIN_TITLES = {
  dashboard:'Dashboard', ordenes:'Órdenes / Boletas', servicios:'Servicios',
  categorias:'Categorías', clientes:'Clientes', tecnicos:'Técnicos',
  repuestos:'Repuestos', usuarios:'Usuarios', reportes:'Reportes', perfil:'Mi perfil',
}

function AdminTopbar({ page, user, onMenuToggle }) {
  return (
    <div className="admin-topbar">
      <div className="page-title">{ADMIN_TITLES[page]||page}</div>
      <div style={{display:'flex',alignItems:'center',gap:'0.6rem'}}>
        <div className="user-avatar" style={{background:'var(--rt-blue)'}}>{user.nombre[0]}{user.apellido[0]}</div>
        <span style={{fontSize:'0.82rem',fontWeight:600}}>{user.nombre}</span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// APP PRINCIPAL
// ═══════════════════════════════════════════════════════════
export default function App() {
  // ── Estado global ──────────────────────────────────────
  const [mode,            setMode]           = useState('tienda')   // 'tienda' | 'admin'
  const [storePage,       setStorePage]      = useState('home')     // página tienda
  const [adminPage,       setAdminPage]      = useState('dashboard')// página admin
  const [extraId,         setExtraId]        = useState(null)       // id detalle blog/servicio
  const [adminUser,       setAdminUser]      = useState(null)       // usuario admin logueado
  const [clienteLogueado, setClienteLogueado]= useState(null)       // cliente tienda logueado
  const [carrito,         setCarrito]        = useState([])         // items carrito
  const [cartOpen,        setCartOpen]       = useState(false)
  const [pagoResult,      setPagoResult]     = useState(null)       // {ok, data}
  const [toasts,          setToasts]         = useState([])

  // ── Toast ───────────────────────────────────────────────
  const toast = useCallback((msg, type='success')=>{
    const id=Date.now()
    setToasts(p=>[...p,{id,msg,type}])
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),3000)
  },[])

  // ── Navegación tienda ───────────────────────────────────
  const navStore = (page, id=null) => {
    setStorePage(page); setExtraId(id)
    window.scrollTo(0,0)
    if (page==='admin-login') { setMode('admin-login') }
    if (page==='tienda')      { setMode('tienda') }
  }

  // ── Navegación admin ────────────────────────────────────
  const navAdmin = (page) => {
    if (page==='tienda') { setMode('tienda'); return }
    setAdminPage(page)
  }

  // ── Carrito ─────────────────────────────────────────────
  const addCart   = (s)  => { setCarrito(p=>[...p,s]); toast(`${s.nombre} agregado al carrito`); setCartOpen(true) }
  const removeCart= (i)  => setCarrito(p=>p.filter((_,idx)=>idx!==i))
  const goCheckout= ()   => setStorePage('comprar')

  // ── Resultado pago ──────────────────────────────────────
  const handleResult = (tipo, data) => {
    setPagoResult({tipo,data})
    setStorePage(tipo==='ok'?'pago-ok':'pago-error')
    if (tipo==='ok') setCarrito([])
  }

  const pageProps = { toast }

  // ══ LOGIN ADMIN ══════════════════════════════════════════
  if (mode==='admin-login' || (mode==='admin' && !adminUser)) {
    return (
      <>
        <AdminLoginPage onLogin={u=>{setAdminUser(u);setMode('admin');setAdminPage('dashboard')}}/>
        <ToastContainer toasts={toasts}/>
      </>
    )
  }

  // ══ PANEL ADMIN ══════════════════════════════════════════
  if (mode==='admin' && adminUser) {
    return (
      <>
        <div className="admin-layout">
          <AdminSidebar active={adminPage} onNav={navAdmin} user={adminUser} onLogout={()=>{setAdminUser(null);setMode('tienda')}}/>
          <div className="admin-main">
            <AdminTopbar page={adminPage} user={adminUser}/>
            <div className="admin-content">
              {adminPage==='dashboard'  && <AdminDashboard  onNav={navAdmin}/>}
              {adminPage==='ordenes'    && <AdminOrdenes    {...pageProps}/>}
              {adminPage==='servicios'  && <AdminServicios  {...pageProps}/>}
              {adminPage==='categorias' && <AdminCategorias {...pageProps}/>}
              {adminPage==='clientes'   && <AdminClientes   {...pageProps}/>}
              {adminPage==='tecnicos'   && <AdminTecnicos   {...pageProps}/>}
              {adminPage==='repuestos'  && <AdminRepuestos  {...pageProps}/>}
              {adminPage==='usuarios'   && <AdminUsuarios   {...pageProps}/>}
              {adminPage==='reportes'   && <AdminReportes/>}
              {adminPage==='perfil'     && <AdminPerfil user={adminUser} {...pageProps}/>}
            </div>
          </div>
        </div>
        <ToastContainer toasts={toasts}/>
      </>
    )
  }

  // ══ TIENDA PÚBLICA ═══════════════════════════════════════
  return (
    <>
      <StoreNavbar
        page={storePage}
        onNav={navStore}
        carritoCount={carrito.length}
        onCartOpen={()=>setCartOpen(true)}
        clienteLogueado={clienteLogueado}
        onLogout={()=>setClienteLogueado(null)}
      />

      {storePage==='home'          && <HomePage           onNav={navStore} onAddCart={addCart}/>}
      {storePage==='servicios'     && <ServiciosPage      onNav={navStore} onAddCart={addCart}/>}
      {storePage==='detalle-servicio' && <ServiciosPage onNav={navStore} onAddCart={addCart}/>}
      {storePage==='ofertas'       && <OfertasPage        onNav={navStore} onAddCart={addCart}/>}
      {storePage==='categorias'    && <CategoriasPage     onNav={navStore} onAddCart={addCart}/>}
      {storePage==='nosotros'      && <NosotrosPage/>}
      {storePage==='blog'          && <BlogPage           onNav={navStore}/>}
      {storePage==='blog-detalle'  && <DetalleBlogPage    blogId={extraId} onNav={navStore}/>}
      {storePage==='contacto'      && <ContactoPage       toast={toast}/>}
      {storePage==='registro'      && <RegistroPage       onNav={navStore} onLogin={setClienteLogueado}/>}
      {storePage==='login'         && <LoginClientePage   onNav={navStore} onLogin={setClienteLogueado}/>}
      {storePage==='comprar'       && <CheckoutPage       carrito={carrito} clienteLogueado={clienteLogueado} onResult={handleResult} toast={toast}/>}
      {storePage==='pago-ok'       && <PagoOKPage         data={pagoResult?.data} onNav={navStore}/>}
      {storePage==='pago-error'    && <PagoErrorPage      data={pagoResult?.data} onNav={navStore}/>}

      <footer className="store-footer">
        © 2024 <strong>ReparaTech</strong> — Av. Libertador B. O'Higgins 1234, Santiago &nbsp;·&nbsp; contacto@reparatech.cl &nbsp;·&nbsp;
        <a onClick={()=>navStore('admin-login')} style={{color:'var(--rt-cyan)',cursor:'pointer',marginLeft:'0.3rem'}}>Admin</a>
      </footer>

      <CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)} carrito={carrito} onRemove={removeCart} onCheckout={goCheckout}/>
      <ToastContainer toasts={toasts}/>
    </>
  )
}
