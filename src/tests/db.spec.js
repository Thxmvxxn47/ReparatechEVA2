// ReparaTech v2.2 - Pruebas unitarias Jasmine
// Cubre: clientes, técnicos, repuestos, órdenes, servicios y utilidades

function crearDB() {
  const data = {
    clientes:[
      {id:1,nombre:'Carlos',apellido:'Mendoza',correo:'carlos@test.cl',password:'1234'},
      {id:2,nombre:'Ana',   apellido:'Torres', correo:'ana@test.cl',   password:'1234'},
    ],
    tecnicos:[{id:1,nombre:'Rodrigo',apellido:'Fuentes',especialidad:'Smartphones',activo:true,ordenesActivas:2}],
    servicios:[
      {id:'SE001',nombre:'Diagnóstico',           precio:15000,tiempo:30, categoria:'General', icono:'🔍',enOferta:false,descuento:0 },
      {id:'SE002',nombre:'Reparación de pantalla',precio:40000,tiempo:60, categoria:'Pantallas',icono:'📱',enOferta:true, descuento:10},
    ],
    repuestos:[
      {id:'RP001',nombre:'Pantalla iPhone 12',compatible:'iPhone 12',  precio:35000,stock:10},
      {id:'RP002',nombre:'Batería Samsung',   compatible:'Samsung S21',precio:12000,stock:2 },
    ],
    ordenes:[
      {id:'OT-001',clienteId:1,tecnicoId:1,dispositivo:'iPhone 12',marca:'Apple',falla:'Pantalla rota',servicioId:'SE002',estado:'En reparación',prioridad:'Alta',fechaIngreso:'2024-01-15',costoTotal:40000},
    ],
    contadores:{clientes:3,ordenes:2,tecnicos:2},
  }
  const genId=(e)=>{data.contadores[e]=(data.contadores[e]||0)+1;return data.contadores[e]}
  const genOT=()=>{const n=genId('ordenes');return `OT-${String(n).padStart(3,'0')}`}
  const hoy=()=>new Date().toISOString().split('T')[0]
  return {
    clientes:{
      getAll: ()=>[...data.clientes],
      getById:(id)=>data.clientes.find(c=>c.id===id)||null,
      login:  (co,pw)=>data.clientes.find(c=>c.correo===co&&c.password===pw)||null,
      create: (d)=>{const n={id:genId('clientes'),...d};data.clientes.push(n);return n},
      update: (id,d)=>{const i=data.clientes.findIndex(c=>c.id===id);if(i<0)return null;data.clientes[i]={...data.clientes[i],...d};return data.clientes[i]},
      delete: (id)=>{const i=data.clientes.findIndex(c=>c.id===id);if(i<0)return false;data.clientes.splice(i,1);return true},
    },
    tecnicos:{
      getAll: ()=>[...data.tecnicos],
      getById:(id)=>data.tecnicos.find(t=>t.id===id)||null,
      create: (d)=>{const n={id:genId('tecnicos'),ordenesActivas:0,activo:true,...d};data.tecnicos.push(n);return n},
      update: (id,d)=>{const i=data.tecnicos.findIndex(t=>t.id===id);if(i<0)return null;data.tecnicos[i]={...data.tecnicos[i],...d};return data.tecnicos[i]},
      delete: (id)=>{const i=data.tecnicos.findIndex(t=>t.id===id);if(i<0)return false;data.tecnicos.splice(i,1);return true},
    },
    servicios:{
      getAll:             ()=>[...data.servicios],
      getEnOferta:        ()=>data.servicios.filter(s=>s.enOferta),
      getByCategoria:     (c)=>data.servicios.filter(s=>s.categoria===c),
      precioConDescuento: (s)=>s.enOferta?Math.round(s.precio*(1-s.descuento/100)):s.precio,
    },
    repuestos:{
      getAll:      ()=>[...data.repuestos],
      getById:     (id)=>data.repuestos.find(r=>r.id===id)||null,
      ajustarStock:(id,delta)=>{const r=data.repuestos.find(r=>r.id===id);if(!r)return null;const n=r.stock+delta;if(n<0)return null;r.stock=n;return r},
    },
    ordenes:{
      getAll:       ()=>[...data.ordenes],
      getById:      (id)=>data.ordenes.find(o=>o.id===id)||null,
      getByEstado:  (est)=>data.ordenes.filter(o=>o.estado===est),
      getByCliente: (cId)=>data.ordenes.filter(o=>o.clienteId===cId),
      create:(d)=>{const n={id:genOT(),estado:'Recibido',fechaIngreso:hoy(),...d};data.ordenes.push(n);const t=data.tecnicos.find(t=>t.id===d.tecnicoId);if(t)t.ordenesActivas++;return n},
      update:(id,d)=>{const i=data.ordenes.findIndex(o=>o.id===id);if(i<0)return null;data.ordenes[i]={...data.ordenes[i],...d};return data.ordenes[i]},
      cambiarEstado:(id,est)=>{const o=data.ordenes.find(o=>o.id===id);if(!o)return null;const prev=o.estado;o.estado=est;const fin=['Listo para retirar','Cancelado'];if(fin.includes(est)&&!fin.includes(prev)){const t=data.tecnicos.find(t=>t.id===o.tecnicoId);if(t&&t.ordenesActivas>0)t.ordenesActivas--};return o},
      delete:(id)=>{const i=data.ordenes.findIndex(o=>o.id===id);if(i<0)return false;data.ordenes.splice(i,1);return true},
      getStats:()=>{const total=data.ordenes.length,pE={};data.ordenes.forEach(o=>{pE[o.estado]=(pE[o.estado]||0)+1});const ing=data.ordenes.filter(o=>o.estado==='Listo para retirar').reduce((s,o)=>s+o.costoTotal,0);return{total,porEstado:pE,ingresos:ing}},
    },
    _data:data,
  }
}

describe('Clientes v2.2',()=>{
  let db; beforeEach(()=>{db=crearDB()})
  it('getAll retorna todos',                ()=>expect(db.clientes.getAll().length).toBe(2))
  it('getById retorna correcto',            ()=>expect(db.clientes.getById(1).nombre).toBe('Carlos'))
  it('getById null si no existe',           ()=>expect(db.clientes.getById(999)).toBeNull())
  it('create agrega cliente',               ()=>{db.clientes.create({nombre:'X',apellido:'Y',correo:'x@y.cl',password:''}); expect(db.clientes.getAll().length).toBe(3)})
  it('create IDs únicos',                   ()=>{const a=db.clientes.create({nombre:'A',correo:'a@test.cl',password:''}); const b=db.clientes.create({nombre:'B',correo:'b@test.cl',password:''}); expect(a.id).not.toBe(b.id)})
  it('update modifica nombre',              ()=>expect(db.clientes.update(1,{nombre:'Carlos Nuevo'}).nombre).toBe('Carlos Nuevo'))
  it('update conserva otros campos',        ()=>{db.clientes.update(1,{nombre:'X'}); expect(db.clientes.getById(1).apellido).toBe('Mendoza')})
  it('update null si no existe',            ()=>expect(db.clientes.update(999,{})).toBeNull())
  it('delete elimina cliente',              ()=>{db.clientes.delete(1); expect(db.clientes.getById(1)).toBeNull()})
  it('delete false si no existe',           ()=>expect(db.clientes.delete(999)).toBeFalse())
  it('login credenciales correctas',        ()=>expect(db.clientes.login('carlos@test.cl','1234')).not.toBeNull())
  it('login contraseña incorrecta',         ()=>expect(db.clientes.login('carlos@test.cl','wrong')).toBeNull())
  it('login correo inexistente',            ()=>expect(db.clientes.login('no@existe.cl','1234')).toBeNull())
})

describe('Técnicos v2.2',()=>{
  let db; beforeEach(()=>{db=crearDB()})
  it('create ordenesActivas=0',             ()=>expect(db.tecnicos.create({nombre:'L',apellido:'L',especialidad:'Tablets'}).ordenesActivas).toBe(0))
  it('create activo=true',                  ()=>expect(db.tecnicos.create({nombre:'L',apellido:'L',especialidad:'Tablets'}).activo).toBeTrue())
  it('update cambia especialidad',          ()=>expect(db.tecnicos.update(1,{especialidad:'Computadores'}).especialidad).toBe('Computadores'))
  it('delete elimina técnico',              ()=>{db.tecnicos.delete(1); expect(db.tecnicos.getById(1)).toBeNull()})
})

describe('Repuestos v2.2',()=>{
  let db; beforeEach(()=>{db=crearDB()})
  it('ajustar +5 aumenta stock',            ()=>expect(db.repuestos.ajustarStock('RP001',5).stock).toBe(15))
  it('ajustar -3 reduce stock',             ()=>expect(db.repuestos.ajustarStock('RP001',-3).stock).toBe(7))
  it('ajustar negativo retorna null',       ()=>expect(db.repuestos.ajustarStock('RP002',-10)).toBeNull())
  it('ID inexistente retorna null',         ()=>expect(db.repuestos.ajustarStock('RP999',5)).toBeNull())
  it('getById retorna correcto',            ()=>expect(db.repuestos.getById('RP001').nombre).toBe('Pantalla iPhone 12'))
})

describe('Órdenes v2.2',()=>{
  let db; beforeEach(()=>{db=crearDB()})
  it('create estado Recibido por defecto',  ()=>expect(db.ordenes.create({clienteId:1,tecnicoId:1,dispositivo:'iPad',marca:'Apple',falla:'X',servicioId:'SE001',prioridad:'Baja'}).estado).toBe('Recibido'))
  it('create ID en formato OT-XXX',         ()=>expect(db.ordenes.create({clienteId:1,tecnicoId:1,dispositivo:'T',marca:'X',falla:'Y',servicioId:'SE001',prioridad:'Baja'}).id).toMatch(/^OT-\d{3}$/))
  it('create incrementa ordenesActivas',    ()=>{const a=db.tecnicos.getById(1).ordenesActivas; db.ordenes.create({clienteId:1,tecnicoId:1,dispositivo:'T',marca:'X',falla:'Y',servicioId:'SE001',prioridad:'Baja'}); expect(db.tecnicos.getById(1).ordenesActivas).toBe(a+1)})
  it('getById retorna orden correcta',      ()=>expect(db.ordenes.getById('OT-001').dispositivo).toBe('iPhone 12'))
  it('getById null si no existe',           ()=>expect(db.ordenes.getById('OT-999')).toBeNull())
  it('getByEstado filtra correctamente',    ()=>{const r=db.ordenes.getByEstado('En reparación'); expect(r.length).toBe(1)})
  it('getByCliente filtra por cliente',     ()=>expect(db.ordenes.getByCliente(1).length).toBe(1))
  it('update modifica diagnóstico',         ()=>expect(db.ordenes.update('OT-001',{diagnostico:'Pantalla dañada.'}).diagnostico).toBe('Pantalla dañada.'))
  it('cambiarEstado cambia correctamente',  ()=>expect(db.ordenes.cambiarEstado('OT-001','Listo para retirar').estado).toBe('Listo para retirar'))
  it('cambiarEstado reduce ordenesActivas', ()=>{const a=db.tecnicos.getById(1).ordenesActivas; db.ordenes.cambiarEstado('OT-001','Listo para retirar'); expect(db.tecnicos.getById(1).ordenesActivas).toBe(a-1)})
  it('cambiarEstado null si no existe',     ()=>expect(db.ordenes.cambiarEstado('OT-999','Cancelado')).toBeNull())
  it('delete elimina orden',               ()=>{db.ordenes.delete('OT-001'); expect(db.ordenes.getById('OT-001')).toBeNull()})
  it('getStats total correcto',             ()=>expect(db.ordenes.getStats().total).toBe(1))
  it('getStats ingresos de completadas',    ()=>{db.ordenes.cambiarEstado('OT-001','Listo para retirar'); expect(db.ordenes.getStats().ingresos).toBe(40000)})
})

describe('Servicios v2.2',()=>{
  let db; beforeEach(()=>{db=crearDB()})
  it('getEnOferta retorna solo ofertas',    ()=>{const o=db.servicios.getEnOferta(); expect(o.length).toBeGreaterThan(0); o.forEach(s=>expect(s.enOferta).toBeTrue())})
  it('precioConDescuento aplica descuento', ()=>{const s=db.servicios.getAll().find(s=>s.enOferta); expect(db.servicios.precioConDescuento(s)).toBe(Math.round(s.precio*(1-s.descuento/100)))})
  it('precioConDescuento sin oferta igual', ()=>{const s=db.servicios.getAll().find(s=>!s.enOferta); expect(db.servicios.precioConDescuento(s)).toBe(s.precio)})
  it('getByCategoria filtra correctamente', ()=>expect(db.servicios.getByCategoria('General').length).toBe(1))
})

describe('Utilidades v2.2',()=>{
  const fmt=(n)=>`$${Number(n).toLocaleString('es-CL')}`
  const badgeClass=(e)=>({'Recibido':'b-recibido','En diagnóstico':'b-diagnostico','En reparación':'b-reparacion','Listo para retirar':'b-listo','Cancelado':'b-cancelado'}[e]||'b-recibido')
  it('formatCLP incluye $',                 ()=>expect(fmt(15000)).toMatch(/^\$/))
  it('formatCLP maneja cero',               ()=>expect(fmt(0)).toContain('0'))
  it('badgeClass listo para retirar',       ()=>expect(badgeClass('Listo para retirar')).toBe('b-listo'))
  it('badgeClass cancelado',                ()=>expect(badgeClass('Cancelado')).toBe('b-cancelado'))
  it('badgeClass desconocido → recibido',   ()=>expect(badgeClass('Desconocido')).toBe('b-recibido'))
})
