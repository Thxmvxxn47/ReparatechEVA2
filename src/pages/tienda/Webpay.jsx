import { useState, useEffect } from 'react'
import { formatCLP } from '../../data/db'

// ── Webpay simulado — replica el flujo real de Transbank ────
// En producción real se usaría:
// import { WebpayPlus } from 'transbank-sdk'
// const tx = WebpayPlus.Transaction.buildForProduction(commerceCode, apiKey)

const TARJETAS_PRUEBA = [
  { numero:'4051 8856 0044 6623', tipo:'Visa Débito',   banco:'BancoEstado', cvv:'123', exp:'12/25', resultado:'APROBADA' },
  { numero:'5186 0595 5959 0568', tipo:'Mastercard',    banco:'Santander',   cvv:'456', exp:'11/26', resultado:'APROBADA' },
  { numero:'4051 8842 3993 7763', tipo:'Visa Crédito',  banco:'BCI',         cvv:'789', exp:'08/27', resultado:'RECHAZADA' },
]

// Genera un token falso similar al de Webpay real
const generarToken = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({length:64}, ()=>chars[Math.floor(Math.random()*chars.length)]).join('')
}

const generarOrdenCompra = () => `OC-${Date.now()}-${Math.floor(Math.random()*9999)}`

// ── PASO 1: Redirección a Webpay (pantalla de inicio) ───────
function WebpayInicio({ monto, ordenCompra, onContinuar, onVolver }) {
  const [cargando, setCargando] = useState(true)
  const token = generarToken()

  useEffect(() => {
    const t = setTimeout(() => setCargando(false), 1500)
    return () => clearTimeout(t)
  }, [])

  if (cargando) {
    return (
      <div style={estilos.overlay}>
        <div style={estilos.card}>
          <img src="https://www.webpay.cl/img/logo-webpay.png"
            onError={e=>e.target.style.display='none'}
            alt="Webpay" style={{height:50,marginBottom:16}}/>
          <div style={estilos.logo}>🔒 Webpay Plus</div>
          <div style={{color:'#666',fontSize:'0.9rem',margin:'1rem 0'}}>Conectando con Transbank...</div>
          <div style={estilos.spinner}/>
        </div>
      </div>
    )
  }

  return (
    <div style={estilos.overlay}>
      <div style={estilos.card}>
        {/* Header Webpay */}
        <div style={estilos.header}>
          <div style={estilos.logoWebpay}>
            <span style={{fontSize:'1.4rem'}}>🔒</span>
            <div>
              <div style={{fontWeight:800,color:'#c00',fontSize:'1.1rem'}}>Webpay</div>
              <div style={{fontSize:'0.65rem',color:'#666',marginTop:-2}}>by Transbank</div>
            </div>
          </div>
          <div style={{fontSize:'0.75rem',color:'#888'}}>
            <span style={{background:'#e8f5e9',color:'#2e7d32',padding:'2px 8px',borderRadius:20,fontWeight:600}}>
              🔐 Conexión segura SSL
            </span>
          </div>
        </div>

        <div style={estilos.divider}/>

        {/* Comercio */}
        <div style={estilos.comercio}>
          <div style={{fontSize:'1.5rem'}}>🔧</div>
          <div>
            <div style={{fontWeight:700,fontSize:'0.95rem'}}>ReparaTech</div>
            <div style={{fontSize:'0.75rem',color:'#888'}}>Santiago Centro, Chile</div>
          </div>
        </div>

        {/* Monto */}
        <div style={estilos.montoBox}>
          <div style={{fontSize:'0.8rem',color:'#888',marginBottom:4}}>Total a pagar</div>
          <div style={{fontFamily:'monospace',fontSize:'2rem',fontWeight:800,color:'#c00'}}>
            {formatCLP(monto)}
          </div>
          <div style={{fontSize:'0.72rem',color:'#aaa',marginTop:4}}>
            Orden: {ordenCompra}
          </div>
        </div>

        {/* Info tarjetas de prueba */}
        <div style={{background:'#fff8e1',border:'1px solid #ffe082',borderRadius:8,padding:'10px 14px',marginBottom:16,fontSize:'0.78rem'}}>
          <div style={{fontWeight:700,marginBottom:6,color:'#f57f17'}}>🧪 Ambiente de pruebas — Tarjetas de test:</div>
          {TARJETAS_PRUEBA.map(t=>(
            <div key={t.numero} style={{display:'flex',justifyContent:'space-between',marginBottom:3,fontSize:'0.72rem'}}>
              <span style={{fontFamily:'monospace'}}>{t.numero}</span>
              <span style={{color:t.resultado==='APROBADA'?'#2e7d32':'#c62828',fontWeight:600}}>{t.resultado}</span>
            </div>
          ))}
        </div>

        <button style={estilos.btnRojo} onClick={()=>onContinuar(token)}>
          Continuar al pago →
        </button>
        <button style={estilos.btnGris} onClick={onVolver}>
          ← Volver al comercio
        </button>

        <div style={estilos.footer}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Transbank_logo.svg/200px-Transbank_logo.svg.png"
            onError={e=>e.target.style.display='none'}
            alt="Transbank" style={{height:20}}/>
          <span style={{fontSize:'0.65rem',color:'#aaa'}}>Powered by Transbank © 2024</span>
        </div>
      </div>
    </div>
  )
}

// ── PASO 2: Formulario de pago Webpay ───────────────────────
function WebpayFormulario({ monto, ordenCompra, token, onPagar, onCancelar }) {
  const [form, setForm] = useState({ numero:'', exp:'', cvv:'', nombre:'' })
  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState('')
  const [tipoPago, setTipoPago] = useState('debito')
  const [cuotas, setCuotas] = useState(1)

  const formatNumero = (v) => v.replace(/\D/g,'').replace(/(\d{4})/g,'$1 ').trim().slice(0,19)
  const formatExp    = (v) => v.replace(/\D/g,'').replace(/(\d{2})(\d)/,'$1/$2').slice(0,5)

  const handlePagar = (e) => {
    e.preventDefault()
    setError('')
    if(form.numero.replace(/\s/g,'').length < 16) { setError('Número de tarjeta inválido.'); return }
    if(form.exp.length < 5) { setError('Fecha de vencimiento inválida.'); return }
    if(form.cvv.length < 3) { setError('CVV inválido.'); return }
    if(!form.nombre.trim()) { setError('Ingresa el nombre del titular.'); return }

    setProcesando(true)
    // Simula latencia de red real de Webpay (2-3 segundos)
    setTimeout(() => {
      const tarjeta = TARJETAS_PRUEBA.find(t => t.numero.replace(/\s/g,'') === form.numero.replace(/\s/g,''))
      const aprobada = tarjeta ? tarjeta.resultado === 'APROBADA' : Math.random() > 0.15
      onPagar({ aprobada, tarjeta: form.numero.slice(-4), cuotas, tipoPago })
    }, 2500)
  }

  if (procesando) {
    return (
      <div style={estilos.overlay}>
        <div style={{...estilos.card, textAlign:'center'}}>
          <div style={estilos.logoWebpay}><span style={{fontSize:'1.4rem'}}>🔒</span><div><div style={{fontWeight:800,color:'#c00',fontSize:'1.1rem'}}>Webpay</div></div></div>
          <div style={estilos.divider}/>
          <div style={{fontSize:'3rem',margin:'1rem 0'}}>⏳</div>
          <div style={{fontWeight:700,fontSize:'1rem',marginBottom:8}}>Procesando pago...</div>
          <div style={{color:'#888',fontSize:'0.85rem',marginBottom:20}}>No cierres ni actualices esta página</div>
          <div style={estilos.spinner}/>
          <div style={{marginTop:16,fontSize:'0.75rem',color:'#aaa'}}>Conectando con banco emisor...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={estilos.overlay}>
      <div style={{...estilos.card, maxWidth:440}}>
        {/* Header */}
        <div style={estilos.header}>
          <div style={estilos.logoWebpay}>
            <span style={{fontSize:'1.4rem'}}>🔒</span>
            <div><div style={{fontWeight:800,color:'#c00',fontSize:'1.1rem'}}>Webpay</div><div style={{fontSize:'0.65rem',color:'#666'}}>by Transbank</div></div>
          </div>
          <span style={{background:'#e8f5e9',color:'#2e7d32',padding:'2px 8px',borderRadius:20,fontWeight:600,fontSize:'0.72rem'}}>🔐 SSL</span>
        </div>
        <div style={estilos.divider}/>

        {/* Monto */}
        <div style={{...estilos.montoBox, padding:'10px 14px', marginBottom:16}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div style={{fontSize:'0.72rem',color:'#888'}}>ReparaTech</div>
              <div style={{fontSize:'0.7rem',color:'#aaa'}}>Orden: {ordenCompra}</div>
            </div>
            <div style={{fontFamily:'monospace',fontSize:'1.6rem',fontWeight:800,color:'#c00'}}>{formatCLP(monto)}</div>
          </div>
        </div>

        {/* Tipo de pago */}
        <div style={{display:'flex',gap:6,marginBottom:14}}>
          {['debito','credito'].map(t=>(
            <button key={t} type="button"
              style={{flex:1,padding:'7px',border:`2px solid ${tipoPago===t?'#c00':'#ddd'}`,borderRadius:8,background:tipoPago===t?'#fff0f0':'#fafafa',color:tipoPago===t?'#c00':'#666',fontWeight:600,fontSize:'0.82rem',cursor:'pointer'}}
              onClick={()=>setTipoPago(t)}>
              {t==='debito'?'💳 Débito':'💳 Crédito'}
            </button>
          ))}
        </div>

        {error && <div style={{background:'#ffebee',color:'#c62828',padding:'8px 12px',borderRadius:6,fontSize:'0.82rem',marginBottom:12}}>⚠️ {error}</div>}

        <form onSubmit={handlePagar}>
          {/* Número tarjeta */}
          <div style={{marginBottom:12}}>
            <label style={estilos.label}>Número de tarjeta</label>
            <div style={{position:'relative'}}>
              <input style={{...estilos.input, paddingRight:50, fontFamily:'monospace', letterSpacing:2}}
                value={form.numero} placeholder="0000 0000 0000 0000" maxLength={19}
                onChange={e=>setForm({...form,numero:formatNumero(e.target.value)})}/>
              <span style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',fontSize:'1.2rem'}}>
                {form.numero.startsWith('4')?'💙':form.numero.startsWith('5')?'🔴':'💳'}
              </span>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
            <div>
              <label style={estilos.label}>Vencimiento</label>
              <input style={{...estilos.input,fontFamily:'monospace'}} value={form.exp} placeholder="MM/AA" maxLength={5}
                onChange={e=>setForm({...form,exp:formatExp(e.target.value)})}/>
            </div>
            <div>
              <label style={estilos.label}>CVV</label>
              <input style={{...estilos.input,fontFamily:'monospace'}} value={form.cvv} placeholder="•••" maxLength={4} type="password"
                onChange={e=>setForm({...form,cvv:e.target.value.replace(/\D/g,'').slice(0,4)})}/>
            </div>
          </div>

          <div style={{marginBottom:12}}>
            <label style={estilos.label}>Nombre del titular</label>
            <input style={estilos.input} value={form.nombre} placeholder="Como aparece en la tarjeta"
              onChange={e=>setForm({...form,nombre:e.target.value.toUpperCase()})}/>
          </div>

          {tipoPago==='credito' && (
            <div style={{marginBottom:14}}>
              <label style={estilos.label}>Cuotas</label>
              <select style={estilos.input} value={cuotas} onChange={e=>setCuotas(Number(e.target.value))}>
                <option value={1}>Sin cuotas</option>
                <option value={3}>3 cuotas sin interés</option>
                <option value={6}>6 cuotas sin interés</option>
                <option value={12}>12 cuotas</option>
                <option value={24}>24 cuotas</option>
              </select>
            </div>
          )}

          <button type="submit" style={estilos.btnRojo}>
            🔒 Pagar {formatCLP(monto)}
          </button>
          <button type="button" style={estilos.btnGris} onClick={onCancelar}>
            Cancelar
          </button>
        </form>

        <div style={estilos.footer}>
          <span style={{fontSize:'0.65rem',color:'#aaa'}}>🔒 Tus datos están protegidos con cifrado SSL 256 bits</span>
        </div>
      </div>
    </div>
  )
}

// ── COMPONENTE PRINCIPAL WEBPAY ──────────────────────────────
export default function WebpayPage({ monto, carrito, onExito, onFracaso, onCancelar }) {
  const [paso, setPaso] = useState('inicio') // inicio | formulario | resultado
  const [token,         setToken]         = useState('')
  const [ordenCompra]                     = useState(generarOrdenCompra)
  const [resultadoPago, setResultadoPago] = useState(null)

  const handleContinuar = (tkn) => { setToken(tkn); setPaso('formulario') }

  const handlePagar = ({ aprobada, tarjeta, cuotas, tipoPago }) => {
    const resultado = {
      token,
      ordenCompra,
      monto,
      tarjeta: `**** **** **** ${tarjeta}`,
      cuotas,
      tipoPago,
      fecha: new Date().toLocaleString('es-CL'),
      codigoAutorizacion: aprobada ? Math.floor(Math.random()*900000+100000).toString() : null,
      aprobada,
    }
    setResultadoPago(resultado)
    setPaso('resultado')
    setTimeout(() => {
      if(aprobada) onExito(resultado)
      else         onFracaso(resultado)
    }, 2000)
  }

  if (paso === 'inicio') {
    return <WebpayInicio monto={monto} ordenCompra={ordenCompra} onContinuar={handleContinuar} onVolver={onCancelar}/>
  }

  if (paso === 'formulario') {
    return <WebpayFormulario monto={monto} ordenCompra={ordenCompra} token={token} onPagar={handlePagar} onCancelar={onCancelar}/>
  }

  // Resultado (pantalla de transición antes de redirigir)
  return (
    <div style={estilos.overlay}>
      <div style={{...estilos.card, textAlign:'center'}}>
        <div style={{fontSize:'3.5rem',marginBottom:12}}>
          {resultadoPago?.aprobada ? '✅' : '❌'}
        </div>
        <div style={{fontWeight:800,fontSize:'1.2rem',color:resultadoPago?.aprobada?'#2e7d32':'#c62828',marginBottom:8}}>
          {resultadoPago?.aprobada ? 'Pago aprobado' : 'Pago rechazado'}
        </div>
        {resultadoPago?.aprobada && (
          <div style={{fontSize:'0.82rem',color:'#666',marginBottom:4}}>
            Código autorización: <strong>{resultadoPago.codigoAutorizacion}</strong>
          </div>
        )}
        <div style={{fontSize:'0.8rem',color:'#888'}}>Redirigiendo al comercio...</div>
        <div style={{...estilos.spinner,margin:'16px auto 0'}}/>
      </div>
    </div>
  )
}

// ── Estilos Webpay ───────────────────────────────────────────
const estilos = {
  overlay: {
    position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',
    zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',
  },
  card: {
    background:'#fff',borderRadius:12,width:'100%',maxWidth:400,
    padding:'1.5rem',boxShadow:'0 20px 60px rgba(0,0,0,0.3)',
    maxHeight:'95vh',overflowY:'auto',
  },
  header: {
    display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12,
  },
  logoWebpay: {
    display:'flex',alignItems:'center',gap:8,
  },
  logo: {
    fontWeight:800,color:'#c00',fontSize:'1.3rem',textAlign:'center',marginBottom:4,
  },
  divider: { height:1,background:'#eee',margin:'12px 0' },
  comercio: {
    display:'flex',alignItems:'center',gap:10,marginBottom:14,
    background:'#f5f5f5',borderRadius:8,padding:'10px 12px',
  },
  montoBox: {
    background:'#fff0f0',border:'1px solid #ffcdd2',borderRadius:8,
    padding:'14px',textAlign:'center',marginBottom:16,
  },
  label: {
    display:'block',fontSize:'0.78rem',fontWeight:600,color:'#444',marginBottom:4,
  },
  input: {
    width:'100%',padding:'9px 12px',border:'1px solid #ddd',borderRadius:7,
    fontSize:'0.88rem',fontFamily:'inherit',outline:'none',
    boxSizing:'border-box',
  },
  btnRojo: {
    width:'100%',padding:'12px',background:'linear-gradient(135deg,#c00,#e53935)',
    color:'#fff',border:'none',borderRadius:8,fontWeight:700,fontSize:'0.95rem',
    cursor:'pointer',marginBottom:8,letterSpacing:'0.02em',
  },
  btnGris: {
    width:'100%',padding:'10px',background:'#f5f5f5',color:'#666',
    border:'1px solid #ddd',borderRadius:8,fontWeight:600,fontSize:'0.85rem',
    cursor:'pointer',marginBottom:12,
  },
  footer: {
    display:'flex',flexDirection:'column',alignItems:'center',gap:4,marginTop:12,
  },
  spinner: {
    width:32,height:32,border:'3px solid #eee',borderTop:'3px solid #c00',
    borderRadius:'50%',animation:'spin 0.8s linear infinite',
  },
}

// Inyectar animación spinner
if (typeof document !== 'undefined' && !document.getElementById('webpay-spin')) {
  const s = document.createElement('style')
  s.id = 'webpay-spin'
  s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}'
  document.head.appendChild(s)
}
