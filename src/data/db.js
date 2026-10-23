// ReparaTech v2.2 - CRUD casi completo
// Completado: clientes, técnicos, servicios, categorías, órdenes, repuestos, auth
// Pendiente v3.0: reportes avanzados, ofertas, blogs detalle, perfil admin

const _d = {
  clientes:[
    {id:1,nombre:'Carlos',   apellido:'Mendoza',correo:'carlos@gmail.com',  telefono:'+56912345678',direccion:'Av. Providencia 1234',password:'1234'},
    {id:2,nombre:'Ana',      apellido:'Torres', correo:'ana@hotmail.com',   telefono:'+56987654321',direccion:'Los Leones 567',      password:'1234'},
    {id:3,nombre:'Pedro',    apellido:'Rojas',  correo:'pedro@gmail.com',   telefono:'+56955443322',direccion:'Ñuñoa 890',           password:'1234'},
    {id:4,nombre:'Valentina',apellido:'Soto',   correo:'vale@outlook.com',  telefono:'+56933221100',direccion:'Maipú 456',           password:'1234'},
  ],
  tecnicos:[
    {id:1,nombre:'Rodrigo',apellido:'Fuentes',especialidad:'Smartphones', activo:true,ordenesActivas:3},
    {id:2,nombre:'Camila', apellido:'Vera',   especialidad:'Computadores',activo:true,ordenesActivas:2},
    {id:3,nombre:'Felipe', apellido:'Morales',especialidad:'Tablets',     activo:true,ordenesActivas:1},
    {id:4,nombre:'Josefa', apellido:'Lagos',  especialidad:'Placa Base',  activo:true,ordenesActivas:4},
    {id:5,nombre:'Matías', apellido:'Pérez',  especialidad:'Smartphones', activo:true,ordenesActivas:2},
    {id:6,nombre:'Daniela',apellido:'Araya',  especialidad:'Computadores',activo:true,ordenesActivas:1},
  ],
  servicios:[
    {id:'SE001',nombre:'Diagnóstico',           descripcion:'Evaluación del dispositivo.',      tiempo:30, precio:15000,categoria:'General', icono:'🔍',enOferta:false,descuento:0 },
    {id:'SE002',nombre:'Reparación de pantalla',descripcion:'Cambio de pantalla de smartphone.',tiempo:60, precio:40000,categoria:'Pantallas',icono:'📱',enOferta:true, descuento:10},
    {id:'SE003',nombre:'Reparación de batería', descripcion:'Cambio de batería.',               tiempo:45, precio:25000,categoria:'Baterías', icono:'🔋',enOferta:false,descuento:0 },
    {id:'SE004',nombre:'Limpieza de software',  descripcion:'Eliminación de virus.',            tiempo:60, precio:20000,categoria:'Software', icono:'💻',enOferta:true, descuento:15},
    {id:'SE005',nombre:'Reparación de placa',   descripcion:'Reparación placa base.',           tiempo:120,precio:60000,categoria:'Hardware', icono:'🔌',enOferta:false,descuento:0 },
    {id:'SE006',nombre:'Instalación de SO',     descripcion:'Instalación Windows o macOS.',     tiempo:90, precio:30000,categoria:'Software', icono:'🖥️',enOferta:false,descuento:0 },
  ],
  categorias:[
    {id:1,nombre:'Smartphones',icono:'📱',descripcion:'Reparaciones para iPhone, Samsung y más.'},
    {id:2,nombre:'Laptops',    icono:'💻',descripcion:'Servicio técnico para portátiles.'},
    {id:3,nombre:'Tablets',    icono:'📟',descripcion:'Reparación y mantención de tablets.'},
    {id:4,nombre:'Software',   icono:'🖥️',descripcion:'Soporte de sistemas operativos.'},
    {id:5,nombre:'Hardware',   icono:'🔌',descripcion:'Reparación de componentes físicos.'},
  ],
  repuestos:[
    {id:'RP001',nombre:'Pantalla iPhone 12',  compatible:'iPhone 12',  precio:35000,stock:12},
    {id:'RP002',nombre:'Pantalla Samsung S21',compatible:'Samsung S21',precio:30000,stock:8 },
    {id:'RP003',nombre:'Batería iPhone 12',   compatible:'iPhone 12',  precio:15000,stock:20},
    {id:'RP004',nombre:'Batería Samsung S21', compatible:'Samsung S21',precio:12000,stock:15},
    {id:'RP005',nombre:'Disco SSD 256GB',     compatible:'Laptop',     precio:25000,stock:10},
  ],
  ordenes:[
    {id:'OT-001',clienteId:1,tecnicoId:1,dispositivo:'iPhone 12',       marca:'Apple',  falla:'Pantalla rota',       servicioId:'SE002',repuestosUsados:['RP001'],estado:'En reparación',    prioridad:'Alta', fechaIngreso:'2024-01-15',fechaEstimada:'2024-01-15',diagnostico:'Pantalla dañada.',notas:'Caída 1m.',costoTotal:75000},
    {id:'OT-002',clienteId:2,tecnicoId:2,dispositivo:'MacBook Pro 2019',marca:'Apple',  falla:'No enciende',         servicioId:'SE001',repuestosUsados:[],       estado:'En diagnóstico',  prioridad:'Media',fechaIngreso:'2024-01-15',fechaEstimada:'2024-01-16',diagnostico:'En evaluación.',notas:'',costoTotal:15000},
    {id:'OT-003',clienteId:3,tecnicoId:3,dispositivo:'Galaxy Tab S7',   marca:'Samsung',falla:'Batería dura muy poco',servicioId:'SE003',repuestosUsados:[],       estado:'Listo para retirar',prioridad:'Baja',fechaIngreso:'2024-01-14',fechaEstimada:'2024-01-15',diagnostico:'Batería al 45%.',notas:'Cliente avisado.',costoTotal:25000},
    {id:'OT-004',clienteId:4,tecnicoId:4,dispositivo:'iPhone 13 Pro',   marca:'Apple',  falla:'No carga',            servicioId:'SE005',repuestosUsados:[],       estado:'Recibido',        prioridad:'Alta', fechaIngreso:'2024-01-15',fechaEstimada:'2024-01-17',diagnostico:'',notas:'Urgente.',costoTotal:60000},
    {id:'OT-005',clienteId:1,tecnicoId:5,dispositivo:'Samsung S21',     marca:'Samsung',falla:'Pantalla con líneas',  servicioId:'SE002',repuestosUsados:['RP002'],estado:'Cancelado',       prioridad:'Media',fechaIngreso:'2024-01-10',fechaEstimada:'2024-01-12',diagnostico:'Cancelado.',notas:'',costoTotal:0},
  ],
  blogs:[
    {id:1,titulo:'¿Cómo saber si tu batería necesita cambio?',   tag:'Consejos',  fecha:'2024-01-10',icono:'🔋',resumen:'Señales de que tu batería ya no rinde.',                contenido:'Una batería degradada se descarga rápido, calienta en exceso y puede apagar el equipo. Si notas estos síntomas, es hora de cambiarla. En ReparaTech contamos con baterías originales para la mayoría de modelos.'},
    {id:2,titulo:'5 cosas que NO debes hacer si se rompe tu pantalla',tag:'Tutoriales',fecha:'2024-01-08',icono:'📱',resumen:'Errores comunes que empeoran el daño.',contenido:'Evita: seguir usando con vidrios sueltos, pegar con cinta, exponer al agua, desarmar sin experiencia, o esperar demasiado. Visítanos y lo resolvemos el mismo día.'},
    {id:3,titulo:'Guía para cuidar tu laptop',                    tag:'Guías',     fecha:'2024-01-05',icono:'💻',resumen:'Consejos para alargar la vida de tu portátil.',        contenido:'Limpia el ventilador cada 6 meses, mantén el SO actualizado, usa el cargador original y no bloquees los ventiladores. Estos hábitos extienden la vida varios años.'},
    {id:4,titulo:'¿Vale la pena reparar o comprar nuevo?',        tag:'Consejos',  fecha:'2024-01-02',icono:'💡',resumen:'Cómo tomar la mejor decisión económica.',              contenido:'Si la reparación cuesta menos del 50% del valor del equipo, generalmente vale la pena. Hacemos diagnósticos para ayudarte a decidir.'},
  ],
  usuarios:[
    {id:1,nombre:'Admin', apellido:'Sistema',  correo:'admin@reparatech.cl',    rol:'administrador',password:'admin123'},
    {id:2,nombre:'María', apellido:'González', correo:'recepcion@reparatech.cl',rol:'recepcionista', password:'recep123'},
    {id:3,nombre:'Juan',  apellido:'Encargado',correo:'encargado@reparatech.cl',rol:'encargado',      password:'enc123'},
  ],
  contadores:{clientes:5,ordenes:6,usuarios:4,tecnicos:7,categorias:6},
}

const hoy  = ()=>new Date().toISOString().split('T')[0]
const genId= (e)=>{_d.contadores[e]=(_d.contadores[e]||0)+1;return _d.contadores[e]}
const genOT= ()=>{const n=genId('ordenes');return `OT-${String(n).padStart(3,'0')}`}

export const clientesDB = {
  getAll:  ()     =>[..._d.clientes],
  getById: (id)   =>_d.clientes.find(c=>c.id===id)||null,
  login:   (co,pw)=>_d.clientes.find(c=>c.correo===co&&c.password===pw)||null,
  create:  (d)    =>{const n={id:genId('clientes'),...d};_d.clientes.push(n);return n},
  update:  (id,d) =>{const i=_d.clientes.findIndex(c=>c.id===id);if(i<0)return null;_d.clientes[i]={..._d.clientes[i],...d};return _d.clientes[i]},
  delete:  (id)   =>{const i=_d.clientes.findIndex(c=>c.id===id);if(i<0)return false;_d.clientes.splice(i,1);return true},
}
export const tecnicosDB = {
  getAll:  ()     =>[..._d.tecnicos],
  getById: (id)   =>_d.tecnicos.find(t=>t.id===id)||null,
  create:  (d)    =>{const n={id:genId('tecnicos'),ordenesActivas:0,activo:true,...d};_d.tecnicos.push(n);return n},
  update:  (id,d) =>{const i=_d.tecnicos.findIndex(t=>t.id===id);if(i<0)return null;_d.tecnicos[i]={..._d.tecnicos[i],...d};return _d.tecnicos[i]},
  delete:  (id)   =>{const i=_d.tecnicos.findIndex(t=>t.id===id);if(i<0)return false;_d.tecnicos.splice(i,1);return true},
}
export const serviciosDB = {
  getAll:             ()   =>[..._d.servicios],
  getById:            (id) =>_d.servicios.find(s=>s.id===id)||null,
  getEnOferta:        ()   =>_d.servicios.filter(s=>s.enOferta),
  getByCategoria:     (c)  =>_d.servicios.filter(s=>s.categoria===c),
  precioConDescuento: (s)  =>s.enOferta?Math.round(s.precio*(1-s.descuento/100)):s.precio,
  create:  (d)    =>{const n={id:`SE${String(genId('servicios')).padStart(3,'0')}`,...d};_d.servicios.push(n);return n},
  update:  (id,d) =>{const i=_d.servicios.findIndex(s=>s.id===id);if(i<0)return null;_d.servicios[i]={..._d.servicios[i],...d};return _d.servicios[i]},
  delete:  (id)   =>{const i=_d.servicios.findIndex(s=>s.id===id);if(i<0)return false;_d.servicios.splice(i,1);return true},
}
export const categoriasDB = {
  getAll:  ()     =>[..._d.categorias],
  getById: (id)   =>_d.categorias.find(c=>c.id===id)||null,
  create:  (d)    =>{const n={id:genId('categorias'),...d};_d.categorias.push(n);return n},
  update:  (id,d) =>{const i=_d.categorias.findIndex(c=>c.id===id);if(i<0)return null;_d.categorias[i]={..._d.categorias[i],...d};return _d.categorias[i]},
  delete:  (id)   =>{const i=_d.categorias.findIndex(c=>c.id===id);if(i<0)return false;_d.categorias.splice(i,1);return true},
}
export const repuestosDB = {
  getAll:       ()         =>[..._d.repuestos],
  getById:      (id)       =>_d.repuestos.find(r=>r.id===id)||null,
  update:       (id,d)     =>{const i=_d.repuestos.findIndex(r=>r.id===id);if(i<0)return null;_d.repuestos[i]={..._d.repuestos[i],...d};return _d.repuestos[i]},
  ajustarStock: (id,delta) =>{const r=_d.repuestos.find(r=>r.id===id);if(!r)return null;const n=r.stock+delta;if(n<0)return null;r.stock=n;return r},
}
export const ordenesDB = {
  getAll:       ()    =>[..._d.ordenes],
  getById:      (id)  =>_d.ordenes.find(o=>o.id===id)||null,
  getByCliente: (cId) =>_d.ordenes.filter(o=>o.clienteId===cId),
  getByEstado:  (est) =>_d.ordenes.filter(o=>o.estado===est),
  create:(d)=>{
    const n={id:genOT(),estado:'Recibido',fechaIngreso:hoy(),repuestosUsados:[],diagnostico:'',costoTotal:0,...d}
    _d.ordenes.push(n)
    const t=_d.tecnicos.find(t=>t.id===d.tecnicoId);if(t)t.ordenesActivas++
    return n
  },
  update:(id,d)=>{const i=_d.ordenes.findIndex(o=>o.id===id);if(i<0)return null;_d.ordenes[i]={..._d.ordenes[i],...d};return _d.ordenes[i]},
  cambiarEstado:(id,est)=>{
    const o=_d.ordenes.find(o=>o.id===id);if(!o)return null
    const prev=o.estado;o.estado=est
    const fin=['Listo para retirar','Cancelado']
    if(fin.includes(est)&&!fin.includes(prev)){const t=_d.tecnicos.find(t=>t.id===o.tecnicoId);if(t&&t.ordenesActivas>0)t.ordenesActivas--}
    return o
  },
  delete:(id)=>{const i=_d.ordenes.findIndex(o=>o.id===id);if(i<0)return false;_d.ordenes.splice(i,1);return true},
  getStats:()=>{
    const total=_d.ordenes.length,porEstado={}
    _d.ordenes.forEach(o=>{porEstado[o.estado]=(porEstado[o.estado]||0)+1})
    const ingresos=_d.ordenes.filter(o=>o.estado==='Listo para retirar').reduce((s,o)=>s+(o.costoTotal||0),0)
    return{total,porEstado,ingresos}
  },
}
export const blogsDB   = { getAll:()=>[..._d.blogs], getById:(id)=>_d.blogs.find(b=>b.id===id)||null }
export const authDB    = {
  login:   (co,pw)=>{ const u=_d.usuarios.find(u=>u.correo===co&&u.password===pw);return u?{...u,password:undefined}:null },
  getAll:  ()     =>_d.usuarios.map(u=>({...u,password:undefined})),
  create:  (d)    =>{const n={id:genId('usuarios'),...d};_d.usuarios.push(n);return{...n,password:undefined}},
  update:  (id,d) =>{const i=_d.usuarios.findIndex(u=>u.id===id);if(i<0)return null;_d.usuarios[i]={..._d.usuarios[i],...d};return{..._d.usuarios[i],password:undefined}},
  delete:  (id)   =>{const i=_d.usuarios.findIndex(u=>u.id===id);if(i<0)return false;_d.usuarios.splice(i,1);return true},
}

export const ESTADOS   = ['Recibido','En diagnóstico','En reparación','Listo para retirar','Cancelado']
export const formatCLP = (n)=>`$${Number(n).toLocaleString('es-CL')}`
export const badgeClass= (e)=>({'Recibido':'b-recibido','En diagnóstico':'b-diagnostico','En reparación':'b-reparacion','Listo para retirar':'b-listo','Cancelado':'b-cancelado'}[e]||'b-recibido')
export const badgeIcon = (e)=>({'Recibido':'📥','En diagnóstico':'🔍','En reparación':'🔧','Listo para retirar':'✅','Cancelado':'❌'}[e]||'📋')
