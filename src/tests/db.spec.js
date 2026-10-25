/**
 * ReparaTech — Pruebas unitarias Jasmine
 * Cubre: CRUD clientes, técnicos, repuestos, órdenes y utilidades.
 * Ejecutar con: npm test
 */

function crearDB() {
  const data = {
    clientes:  [
      { id:1, nombre:'Carlos', apellido:'Mendoza', correo:'carlos@test.cl', telefono:'+56912345678', direccion:'Providencia 1234', password:'1234' },
      { id:2, nombre:'Ana',    apellido:'Torres',  correo:'ana@test.cl',    telefono:'+56987654321', direccion:'Los Leones 567',   password:'1234' },
    ],
    tecnicos:  [{ id:1, nombre:'Rodrigo', apellido:'Fuentes', especialidad:'Smartphones', activo:true, ordenesActivas:2 }],
    servicios: [
      { id:'SE001', nombre:'Diagnóstico',           precio:15000, tiempoEstimado:30, categoria:'General', icono:'🔍', enOferta:false, descuento:0   },
      { id:'SE002', nombre:'Reparación de pantalla',precio:40000, tiempoEstimado:60, categoria:'Pantallas',icono:'📱', enOferta:true,  descuento:10  },
    ],
    repuestos: [
      { id:'RP001', nombre:'Pantalla iPhone 12',   compatible:'iPhone 12',   precio:35000, stock:10 },
      { id:'RP002', nombre:'Batería Samsung S21',  compatible:'Samsung S21', precio:12000, stock:2  },
    ],
    ordenes: [
      { id:'OT-001', clienteId:1, tecnicoId:1, dispositivo:'iPhone 12', marca:'Apple', falla:'Pantalla rota', servicioId:'SE002', repuestosUsados:[], estado:'En reparación', prioridad:'Alta', fechaIngreso:'2024-01-15', fechaEstimada:'2024-01-16', diagnostico:'', notas:'', costoTotal:40000 },
    ],
    contadores:{ clientes:3, ordenes:2, tecnicos:2, servicios:3 },
  }

  const today = ()=>new Date().toISOString().split('T')[0]
  const genId = (e)=>{ data.contadores[e]=(data.contadores[e]||0)+1; return data.contadores[e] }
  const genOT = ()=>{ const n=genId('ordenes'); return `OT-${String(n).padStart(3,'0')}` }

  return {
    clientes: {
      getAll:  ()     =>[...data.clientes],
      getById: (id)   =>data.clientes.find(c=>c.id===id)||null,
      login:   (co,pw)=>data.clientes.find(c=>c.correo===co&&c.password===pw)||null,
      create:  (d)    =>{ const n={id:genId('clientes'),...d}; data.clientes.push(n); return n },
      update:  (id,d) =>{ const i=data.clientes.findIndex(c=>c.id===id); if(i<0)return null; data.clientes[i]={...data.clientes[i],...d}; return data.clientes[i] },
      delete:  (id)   =>{ const i=data.clientes.findIndex(c=>c.id===id); if(i<0)return false; data.clientes.splice(i,1); return true },
    },
    tecnicos: {
      getAll:  ()     =>[...data.tecnicos],
      getById: (id)   =>data.tecnicos.find(t=>t.id===id)||null,
      create:  (d)    =>{ const n={id:genId('tecnicos'),ordenesActivas:0,activo:true,...d}; data.tecnicos.push(n); return n },
      update:  (id,d) =>{ const i=data.tecnicos.findIndex(t=>t.id===id); if(i<0)return null; data.tecnicos[i]={...data.tecnicos[i],...d}; return data.tecnicos[i] },
      delete:  (id)   =>{ const i=data.tecnicos.findIndex(t=>t.id===id); if(i<0)return false; data.tecnicos.splice(i,1); return true },
    },
    servicios: {
      getAll:             ()  =>[...data.servicios],
      getEnOferta:        ()  =>data.servicios.filter(s=>s.enOferta),
      precioConDescuento: (s) =>s.enOferta?Math.round(s.precio*(1-s.descuento/100)):s.precio,
    },
    repuestos: {
      getAll:       ()         =>[...data.repuestos],
      getById:      (id)       =>data.repuestos.find(r=>r.id===id)||null,
      ajustarStock: (id,delta) =>{ const r=data.repuestos.find(r=>r.id===id); if(!r)return null; const n=r.stock+delta; if(n<0)return null; r.stock=n; return r },
    },
    ordenes: {
      getAll:       ()    =>[...data.ordenes],
      getById:      (id)  =>data.ordenes.find(o=>o.id===id)||null,
      getByEstado:  (est) =>data.ordenes.filter(o=>o.estado===est),
      getByCliente: (cId) =>data.ordenes.filter(o=>o.clienteId===cId),
      create: (d)=>{ const n={id:genOT(),estado:'Recibido',fechaIngreso:today(),repuestosUsados:[],diagnostico:'',costoTotal:0,...d}; data.ordenes.push(n); const t=data.tecnicos.find(t=>t.id===d.tecnicoId); if(t)t.ordenesActivas++; return n },
      update: (id,d)=>{ const i=data.ordenes.findIndex(o=>o.id===id); if(i<0)return null; data.ordenes[i]={...data.ordenes[i],...d}; return data.ordenes[i] },
      cambiarEstado:(id,est)=>{ const o=data.ordenes.find(o=>o.id===id); if(!o)return null; const prev=o.estado; o.estado=est; const fin=['Listo para retirar','Cancelado']; if(fin.includes(est)&&!fin.includes(prev)){const t=data.tecnicos.find(t=>t.id===o.tecnicoId);if(t&&t.ordenesActivas>0)t.ordenesActivas--}; return o },
      delete:(id)=>{ const i=data.ordenes.findIndex(o=>o.id===id); if(i<0)return false; data.ordenes.splice(i,1); return true },
      getStats:()=>{ const total=data.ordenes.length,porEstado={}; data.ordenes.forEach(o=>{porEstado[o.estado]=(porEstado[o.estado]||0)+1}); const ingresos=data.ordenes.filter(o=>o.estado==='Listo para retirar').reduce((s,o)=>s+(o.costoTotal||0),0); return{total,porEstado,ingresos} },
    },
    _data: data,
  }
}

// ═══════════════════════════════════════════════════════════
// SUITE 1 — CLIENTES
// ═══════════════════════════════════════════════════════════
describe('CRUD Clientes', ()=>{
  let db
  beforeEach(()=>{ db=crearDB() })

  describe('create()', ()=>{
    it('crea cliente con datos correctos', ()=>{ const c=db.clientes.create({nombre:'Pedro',apellido:'Rojas',correo:'pedro@test.cl',telefono:'',direccion:'',password:'1234'}); expect(c.nombre).toBe('Pedro'); expect(c.id).toBeDefined() })
    it('asigna ID único', ()=>{ const a=db.clientes.create({nombre:'A',apellido:'B',correo:'a@b.cl',password:''}); const b=db.clientes.create({nombre:'C',apellido:'D',correo:'c@d.cl',password:''}); expect(a.id).not.toBe(b.id) })
    it('aumenta cantidad de clientes', ()=>{ const n=db.clientes.getAll().length; db.clientes.create({nombre:'X',apellido:'Y',correo:'x@y.cl',password:''}); expect(db.clientes.getAll().length).toBe(n+1) })
  })

  describe('getAll() y getById()', ()=>{
    it('retorna todos los clientes',      ()=>expect(db.clientes.getAll().length).toBe(2))
    it('retorna cliente correcto por ID', ()=>expect(db.clientes.getById(1).nombre).toBe('Carlos'))
    it('retorna null si ID no existe',    ()=>expect(db.clientes.getById(999)).toBeNull())
    it('retorna copia, no referencia',    ()=>{ const l=db.clientes.getAll(); l.push({id:99}); expect(db.clientes.getAll().length).toBe(2) })
  })

  describe('update()', ()=>{
    it('actualiza nombre del cliente',       ()=>expect(db.clientes.update(1,{nombre:'Carlos Nuevo'}).nombre).toBe('Carlos Nuevo'))
    it('conserva campos no actualizados',    ()=>{ db.clientes.update(1,{nombre:'X'}); expect(db.clientes.getById(1).apellido).toBe('Mendoza') })
    it('retorna null si ID no existe',       ()=>expect(db.clientes.update(999,{nombre:'X'})).toBeNull())
  })

  describe('delete()', ()=>{
    it('elimina cliente y retorna true',  ()=>{ expect(db.clientes.delete(1)).toBeTrue(); expect(db.clientes.getById(1)).toBeNull() })
    it('reduce cantidad de clientes',     ()=>{ db.clientes.delete(1); expect(db.clientes.getAll().length).toBe(1) })
    it('retorna false si ID no existe',   ()=>expect(db.clientes.delete(999)).toBeFalse())
  })

  describe('login()', ()=>{
    it('retorna cliente con credenciales correctas',   ()=>expect(db.clientes.login('carlos@test.cl','1234')).not.toBeNull())
    it('retorna null con contraseña incorrecta',       ()=>expect(db.clientes.login('carlos@test.cl','wrong')).toBeNull())
    it('retorna null con correo inexistente',          ()=>expect(db.clientes.login('noexiste@test.cl','1234')).toBeNull())
  })
})

// ═══════════════════════════════════════════════════════════
// SUITE 2 — TÉCNICOS
// ═══════════════════════════════════════════════════════════
describe('CRUD Técnicos', ()=>{
  let db
  beforeEach(()=>{ db=crearDB() })

  it('create() inicializa ordenesActivas en 0',  ()=>expect(db.tecnicos.create({nombre:'Luis',apellido:'López',especialidad:'Tablets'}).ordenesActivas).toBe(0))
  it('create() inicializa activo en true',        ()=>expect(db.tecnicos.create({nombre:'Luis',apellido:'López',especialidad:'Tablets'}).activo).toBeTrue())
  it('update() cambia especialidad',              ()=>expect(db.tecnicos.update(1,{especialidad:'Computadores'}).especialidad).toBe('Computadores'))
  it('delete() elimina técnico',                  ()=>{ db.tecnicos.delete(1); expect(db.tecnicos.getById(1)).toBeNull() })
  it('delete() retorna false si no existe',       ()=>expect(db.tecnicos.delete(999)).toBeFalse())
})

// ═══════════════════════════════════════════════════════════
// SUITE 3 — REPUESTOS
// ═══════════════════════════════════════════════════════════
describe('Repuestos — ajuste de stock', ()=>{
  let db
  beforeEach(()=>{ db=crearDB() })

  it('delta positivo aumenta stock',                            ()=>expect(db.repuestos.ajustarStock('RP001',5).stock).toBe(15))
  it('delta negativo reduce stock',                             ()=>expect(db.repuestos.ajustarStock('RP001',-3).stock).toBe(7))
  it('no permite stock negativo (retorna null)',                 ()=>expect(db.repuestos.ajustarStock('RP002',-10)).toBeNull())
  it('ID inexistente retorna null',                             ()=>expect(db.repuestos.ajustarStock('RP999',5)).toBeNull())
  it('getAll() retorna todos los repuestos',                    ()=>expect(db.repuestos.getAll().length).toBe(2))
  it('getById() encuentra repuesto correcto',                   ()=>expect(db.repuestos.getById('RP001').nombre).toBe('Pantalla iPhone 12'))
})

// ═══════════════════════════════════════════════════════════
// SUITE 4 — ÓRDENES
// ═══════════════════════════════════════════════════════════
describe('CRUD Órdenes de Trabajo', ()=>{
  let db
  beforeEach(()=>{ db=crearDB() })

  describe('create()', ()=>{
    it('estado por defecto es Recibido',                      ()=>expect(db.ordenes.create({clienteId:1,tecnicoId:1,dispositivo:'iPad',marca:'Apple',falla:'No carga',servicioId:'SE001',prioridad:'Media'}).estado).toBe('Recibido'))
    it('genera ID en formato OT-XXX',                         ()=>expect(db.ordenes.create({clienteId:1,tecnicoId:1,dispositivo:'Test',marca:'X',falla:'Y',servicioId:'SE001',prioridad:'Baja'}).id).toMatch(/^OT-\d{3}$/))
    it('incrementa ordenesActivas del técnico',               ()=>{ const antes=db.tecnicos.getById(1).ordenesActivas; db.ordenes.create({clienteId:1,tecnicoId:1,dispositivo:'T',marca:'X',falla:'Z',servicioId:'SE001',prioridad:'Baja'}); expect(db.tecnicos.getById(1).ordenesActivas).toBe(antes+1) })
    it('inicializa repuestosUsados como array vacío',         ()=>expect(db.ordenes.create({clienteId:2,tecnicoId:1,dispositivo:'Laptop',marca:'HP',falla:'Lento',servicioId:'SE001',prioridad:'Baja'}).repuestosUsados).toEqual([]))
  })

  describe('getById() y getByEstado()', ()=>{
    it('retorna orden correcta por ID',                       ()=>expect(db.ordenes.getById('OT-001').dispositivo).toBe('iPhone 12'))
    it('retorna null si ID no existe',                        ()=>expect(db.ordenes.getById('OT-999')).toBeNull())
    it('filtra órdenes por estado correctamente',             ()=>{ const r=db.ordenes.getByEstado('En reparación'); expect(r.length).toBe(1); expect(r[0].id).toBe('OT-001') })
    it('getByCliente retorna órdenes del cliente',            ()=>expect(db.ordenes.getByCliente(1).length).toBe(1))
  })

  describe('update()', ()=>{
    it('actualiza diagnóstico',                               ()=>expect(db.ordenes.update('OT-001',{diagnostico:'Pantalla dañada.'}).diagnostico).toBe('Pantalla dañada.'))
    it('conserva campos no modificados',                      ()=>{ db.ordenes.update('OT-001',{notas:'x'}); expect(db.ordenes.getById('OT-001').dispositivo).toBe('iPhone 12') })
    it('retorna null si ID no existe',                        ()=>expect(db.ordenes.update('OT-999',{})).toBeNull())
  })

  describe('cambiarEstado()', ()=>{
    it('cambia estado correctamente',                         ()=>expect(db.ordenes.cambiarEstado('OT-001','Listo para retirar').estado).toBe('Listo para retirar'))
    it('reduce ordenesActivas del técnico al completar',      ()=>{ const antes=db.tecnicos.getById(1).ordenesActivas; db.ordenes.cambiarEstado('OT-001','Listo para retirar'); expect(db.tecnicos.getById(1).ordenesActivas).toBe(antes-1) })
    it('no reduce si ya estaba en estado final',              ()=>{ db.ordenes.cambiarEstado('OT-001','Cancelado'); const d=db.tecnicos.getById(1).ordenesActivas; db.ordenes.cambiarEstado('OT-001','Listo para retirar'); expect(db.tecnicos.getById(1).ordenesActivas).toBe(d) })
    it('retorna null si ID no existe',                        ()=>expect(db.ordenes.cambiarEstado('OT-999','Cancelado')).toBeNull())
  })

  describe('delete()', ()=>{
    it('elimina orden y retorna true',                        ()=>{ expect(db.ordenes.delete('OT-001')).toBeTrue(); expect(db.ordenes.getById('OT-001')).toBeNull() })
    it('retorna false si ID no existe',                       ()=>expect(db.ordenes.delete('OT-999')).toBeFalse())
  })

  describe('getStats()', ()=>{
    it('retorna total correcto',                              ()=>expect(db.ordenes.getStats().total).toBe(1))
    it('calcula ingresos solo de completadas',                ()=>{ db.ordenes.cambiarEstado('OT-001','Listo para retirar'); expect(db.ordenes.getStats().ingresos).toBe(40000) })
    it('agrupa por estado',                                   ()=>expect(db.ordenes.getStats().porEstado['En reparación']).toBe(1))
  })
})

// ═══════════════════════════════════════════════════════════
// SUITE 5 — SERVICIOS
// ═══════════════════════════════════════════════════════════
describe('Servicios', ()=>{
  let db
  beforeEach(()=>{ db=crearDB() })

  it('getEnOferta() retorna solo servicios en oferta',          ()=>{ const o=db.servicios.getEnOferta(); expect(o.length).toBeGreaterThan(0); o.forEach(s=>expect(s.enOferta).toBeTrue()) })
  it('precioConDescuento() aplica descuento correcto',          ()=>{ const s=db.servicios.getAll().find(s=>s.enOferta); const esp=Math.round(s.precio*(1-s.descuento/100)); expect(db.servicios.precioConDescuento(s)).toBe(esp) })
  it('precioConDescuento() sin oferta retorna precio normal',   ()=>{ const s=db.servicios.getAll().find(s=>!s.enOferta); expect(db.servicios.precioConDescuento(s)).toBe(s.precio) })
})

// ═══════════════════════════════════════════════════════════
// SUITE 6 — UTILIDADES
// ═══════════════════════════════════════════════════════════
describe('Utilidades', ()=>{
  const formatCLP = (n)=>`$${Number(n).toLocaleString('es-CL')}`
  const estadoBadgeClass = (e)=>({'Recibido':'badge-recibido','En diagnóstico':'badge-diagnostico','En reparación':'badge-reparacion','Listo para retirar':'badge-listo','Cancelado':'badge-cancelado'}[e]||'badge-recibido')

  describe('formatCLP()', ()=>{
    it('incluye símbolo $',            ()=>expect(formatCLP(25000)).toMatch(/^\$/))
    it('formatea número correctamente',()=>expect(formatCLP(0)).toContain('0'))
    it('maneja números grandes',       ()=>expect(formatCLP(1000000)).toContain('1'))
  })

  describe('estadoBadgeClass()', ()=>{
    it('badge-listo para Listo para retirar',      ()=>expect(estadoBadgeClass('Listo para retirar')).toBe('badge-listo'))
    it('badge-cancelado para Cancelado',           ()=>expect(estadoBadgeClass('Cancelado')).toBe('badge-cancelado'))
    it('badge-reparacion para En reparación',      ()=>expect(estadoBadgeClass('En reparación')).toBe('badge-reparacion'))
    it('badge-recibido para estado desconocido',   ()=>expect(estadoBadgeClass('Desconocido')).toBe('badge-recibido'))
    it('badge-diagnostico para En diagnóstico',    ()=>expect(estadoBadgeClass('En diagnóstico')).toBe('badge-diagnostico'))
  })
})
