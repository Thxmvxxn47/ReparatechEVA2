// ============================================================
//  ReparaTech — Fuente de datos con dispositivos reales e imágenes
// ============================================================

const initialData = {
  clientes: [
    { id:1, nombre:'Carlos',    apellido:'Mendoza',  correo:'carlos@gmail.com',  telefono:'+56912345678', direccion:'Av. Providencia 1234, Santiago', password:'1234' },
    { id:2, nombre:'Ana',       apellido:'Torres',   correo:'ana@hotmail.com',   telefono:'+56987654321', direccion:'Los Leones 567, Providencia',    password:'1234' },
    { id:3, nombre:'Pedro',     apellido:'Rojas',    correo:'pedro@gmail.com',   telefono:'+56955443322', direccion:'Ñuñoa 890, Santiago',            password:'1234' },
    { id:4, nombre:'Valentina', apellido:'Soto',     correo:'vale@outlook.com',  telefono:'+56933221100', direccion:'Maipú 456, Santiago',            password:'1234' },
  ],

  tecnicos: [
    { id:1, nombre:'Rodrigo', apellido:'Fuentes', especialidad:'Smartphones',  activo:true, ordenesActivas:3 },
    { id:2, nombre:'Camila',  apellido:'Vera',    especialidad:'Computadores', activo:true, ordenesActivas:2 },
    { id:3, nombre:'Felipe',  apellido:'Morales', especialidad:'Tablets',      activo:true, ordenesActivas:1 },
    { id:4, nombre:'Josefa',  apellido:'Lagos',   especialidad:'Placa Base',   activo:true, ordenesActivas:4 },
    { id:5, nombre:'Matías',  apellido:'Pérez',   especialidad:'Smartphones',  activo:true, ordenesActivas:2 },
    { id:6, nombre:'Daniela', apellido:'Araya',   especialidad:'Computadores', activo:true, ordenesActivas:1 },
  ],

  // ── Catálogo de dispositivos reales con imágenes ──────────
  dispositivos: [
    // SMARTPHONES
    {
      id:'D001', nombre:'iPhone 16 Pro Max', marca:'Apple', categoria:'Smartphones',
      imagen:'https://images.unsplash.com/photo-1706016951326-9eb5c3e1b0f6?w=400&q=80',
      precio_referencial:1199000, color:'Negro titanio',
      descripcion:'6.9" Super Retina XDR, chip A18 Pro, cámara 48MP Fusion',
      fallas_comunes:['Pantalla rota','Batería agotada','Cámara sin enfocar','Botón roto'],
    },
    {
      id:'D002', nombre:'iPhone 15', marca:'Apple', categoria:'Smartphones',
      imagen:'https://images.unsplash.com/photo-1697470700932-70d2e51a77ce?w=400&q=80',
      precio_referencial:799000, color:'Azul',
      descripcion:'6.1" Super Retina XDR, chip A16 Bionic, Dynamic Island',
      fallas_comunes:['Pantalla rota','Batería dura poco','Puerto carga dañado','Sin sonido'],
    },
    {
      id:'D003', nombre:'Samsung Galaxy S25 Ultra', marca:'Samsung', categoria:'Smartphones',
      imagen:'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=400&q=80',
      precio_referencial:1299000, color:'Titanio gris',
      descripcion:'6.9" Dynamic AMOLED 2X, Snapdragon 8 Elite, S Pen incluido',
      fallas_comunes:['Pantalla rota','S Pen no funciona','Batería','Módulo cámara'],
    },
    {
      id:'D004', nombre:'Samsung Galaxy S24', marca:'Samsung', categoria:'Smartphones',
      imagen:'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=400&q=80',
      precio_referencial:799000, color:'Violeta',
      descripcion:'6.2" Dynamic AMOLED 2X, Snapdragon 8 Gen 3, 50MP',
      fallas_comunes:['Pantalla rota','Batería','Puerto USB-C','Altavoz'],
    },
    {
      id:'D005', nombre:'Xiaomi 14 Ultra', marca:'Xiaomi', categoria:'Smartphones',
      imagen:'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&q=80',
      precio_referencial:699000, color:'Negro',
      descripcion:'6.73" LTPO OLED, Snapdragon 8 Gen 3, cámara Leica 50MP',
      fallas_comunes:['Pantalla rota','Batería','Módulo cámara','Sin señal'],
    },
    {
      id:'D006', nombre:'Google Pixel 9 Pro', marca:'Google', categoria:'Smartphones',
      imagen:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
      precio_referencial:999000, color:'Porcelana',
      descripcion:'6.3" LTPO OLED, Google Tensor G4, IA avanzada integrada',
      fallas_comunes:['Pantalla rota','Batería','Cámara','Puerto carga'],
    },
    // TABLETS
    {
      id:'D007', nombre:'iPad Pro 13" M4', marca:'Apple', categoria:'Tablets',
      imagen:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
      precio_referencial:1499000, color:'Plata',
      descripcion:'13" Ultra Retina XDR OLED, chip M4, Apple Pencil Pro compatible',
      fallas_comunes:['Pantalla rota','Apple Pencil no conecta','Batería','Conector'],
    },
    {
      id:'D008', nombre:'iPad Air 11" M2', marca:'Apple', categoria:'Tablets',
      imagen:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
      precio_referencial:799000, color:'Azul cielo',
      descripcion:'11" Liquid Retina, chip M2, compatible con Apple Pencil USB-C',
      fallas_comunes:['Pantalla rota','Batería','Puerto USB-C','Sin WiFi'],
    },
    {
      id:'D009', nombre:'Samsung Galaxy Tab S10 Ultra', marca:'Samsung', categoria:'Tablets',
      imagen:'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&q=80',
      precio_referencial:1299000, color:'Gris grafito',
      descripcion:'14.6" Dynamic AMOLED 2X, Snapdragon 8 Gen 3, S Pen incluido',
      fallas_comunes:['Pantalla rota','S Pen','Batería','Puerto carga'],
    },
    {
      id:'D010', nombre:'Samsung Galaxy Tab S9 FE', marca:'Samsung', categoria:'Tablets',
      imagen:'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&q=80',
      precio_referencial:499000, color:'Verde menta',
      descripcion:'10.9" TFT LCD, Exynos 1380, batería 8000mAh',
      fallas_comunes:['Pantalla rota','Batería','Puerto USB-C','Botones'],
    },
    // LAPTOPS
    {
      id:'D011', nombre:'MacBook Pro 14" M4', marca:'Apple', categoria:'Laptops',
      imagen:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
      precio_referencial:2299000, color:'Plata',
      descripcion:'Pantalla Liquid Retina XDR, chip M4 Pro, hasta 24 núcleos GPU',
      fallas_comunes:['No enciende','Pantalla dañada','Teclado roto','Puerto Thunderbolt'],
    },
    {
      id:'D012', nombre:'MacBook Air 13" M3', marca:'Apple', categoria:'Laptops',
      imagen:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
      precio_referencial:1399000, color:'Medianoche',
      descripcion:'13.6" Liquid Retina, chip M3, diseño ultradelgado sin ventilador',
      fallas_comunes:['Pantalla rota','No carga','Teclado','Trackpad no responde'],
    },
    {
      id:'D013', nombre:'Dell XPS 15', marca:'Dell', categoria:'Laptops',
      imagen:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80',
      precio_referencial:1599000, color:'Plata',
      descripcion:'15.6" OLED 3.5K, Intel Core Ultra 9, NVIDIA GeForce RTX 4060',
      fallas_comunes:['No enciende','Pantalla dañada','Sobrecalentamiento','Teclado'],
    },
    {
      id:'D014', nombre:'ASUS ROG Zephyrus G14', marca:'ASUS', categoria:'Laptops',
      imagen:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80',
      precio_referencial:1299000, color:'Eclipse gris',
      descripcion:'14" QHD+ 165Hz, AMD Ryzen 9, NVIDIA RTX 4060, AniMe Matrix LED',
      fallas_comunes:['Sobrecalentamiento','Pantalla','Batería','Ventiladores ruidosos'],
    },
  ],

  servicios: [
    { id:'SE001', nombre:'Diagnóstico',           descripcion:'Evaluación completa del dispositivo para identificar fallas.',  tiempoEstimado:30,  precio:15000, categoria:'General',  icono:'🔍', imagen:'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80', enOferta:false, descuento:0  },
    { id:'SE002', nombre:'Reparación de pantalla',descripcion:'Cambio de pantalla rota de smartphone o tablet con garantía.',  tiempoEstimado:60,  precio:40000, categoria:'Pantallas',icono:'📱', imagen:'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=400&q=80', enOferta:true,  descuento:10 },
    { id:'SE003', nombre:'Reparación de batería', descripcion:'Cambio de batería de smartphone, tablet o laptop original.',    tiempoEstimado:45,  precio:25000, categoria:'Baterías', icono:'🔋', imagen:'https://images.unsplash.com/photo-1609592424921-83b9b65ee44e?w=400&q=80', enOferta:false, descuento:0  },
    { id:'SE004', nombre:'Limpieza de software',  descripcion:'Eliminación de virus, malware y optimización del sistema.',     tiempoEstimado:60,  precio:20000, categoria:'Software',  icono:'💻', imagen:'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80', enOferta:true,  descuento:15 },
    { id:'SE005', nombre:'Reparación de placa',   descripcion:'Reparación de componentes electrónicos en placa base.',         tiempoEstimado:120, precio:60000, categoria:'Hardware',  icono:'🔌', imagen:'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80', enOferta:false, descuento:0  },
    { id:'SE006', nombre:'Instalación de SO',     descripcion:'Instalación y configuración de Windows 11, macOS o Linux.',     tiempoEstimado:90,  precio:30000, categoria:'Software',  icono:'🖥️', imagen:'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80', enOferta:false, descuento:0  },
    { id:'SE007', nombre:'Limpieza física',       descripcion:'Limpieza interna, pasta térmica y mantenimiento preventivo.',   tiempoEstimado:45,  precio:18000, categoria:'Hardware',  icono:'🧹', imagen:'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80', enOferta:true,  descuento:20 },
  ],

  categorias: [
    { id:1, nombre:'Smartphones', icono:'📱', imagen:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80', descripcion:'iPhone, Samsung, Xiaomi, Google y más.' },
    { id:2, nombre:'Laptops',     icono:'💻', imagen:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80', descripcion:'MacBook, Dell, ASUS, Lenovo y más.' },
    { id:3, nombre:'Tablets',     icono:'📟', imagen:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80', descripcion:'iPad, Samsung Galaxy Tab y más.' },
    { id:4, nombre:'Software',    icono:'🖥️', imagen:'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&q=80', descripcion:'SO, virus, optimización y respaldo.' },
    { id:5, nombre:'Hardware',    icono:'🔌', imagen:'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80', descripcion:'Placa base, RAM, almacenamiento.' },
  ],

  repuestos: [
    { id:'RP001', nombre:'Pantalla iPhone 15',         compatible:'iPhone 15',          precio:89000,  stock:8  },
    { id:'RP002', nombre:'Pantalla iPhone 14',         compatible:'iPhone 14',          precio:75000,  stock:12 },
    { id:'RP003', nombre:'Pantalla iPhone 13',         compatible:'iPhone 13',          precio:65000,  stock:15 },
    { id:'RP004', nombre:'Pantalla Samsung S24',       compatible:'Samsung Galaxy S24', precio:79000,  stock:6  },
    { id:'RP005', nombre:'Pantalla Samsung S23',       compatible:'Samsung Galaxy S23', precio:65000,  stock:9  },
    { id:'RP006', nombre:'Batería iPhone 15',          compatible:'iPhone 15',          precio:35000,  stock:20 },
    { id:'RP007', nombre:'Batería iPhone 14',          compatible:'iPhone 14',          precio:28000,  stock:18 },
    { id:'RP008', nombre:'Batería Samsung S24',        compatible:'Samsung Galaxy S24', precio:25000,  stock:14 },
    { id:'RP009', nombre:'Batería MacBook Air M2',     compatible:'MacBook Air M2',     precio:95000,  stock:5  },
    { id:'RP010', nombre:'Disco SSD 512GB NVMe',       compatible:'Laptop universal',   precio:65000,  stock:10 },
    { id:'RP011', nombre:'Pantalla iPad Air M2',       compatible:'iPad Air M2',        precio:120000, stock:4  },
    { id:'RP012', nombre:'Pantalla Samsung Tab S9',    compatible:'Galaxy Tab S9',      precio:85000,  stock:3  },
  ],

  ordenes: [
    { id:'OT-001', clienteId:1, tecnicoId:1, dispositivo:'iPhone 15',            marca:'Apple',   falla:'Pantalla rota',         servicioId:'SE002', repuestosUsados:['RP002'], estado:'En reparación',      prioridad:'Alta',  fechaIngreso:'2024-01-15', fechaEstimada:'2024-01-15', diagnostico:'Pantalla dañada por impacto lateral.', notas:'Caída desde 1m.',      costoTotal:129000 },
    { id:'OT-002', clienteId:2, tecnicoId:2, dispositivo:'MacBook Air M3',       marca:'Apple',   falla:'No enciende',           servicioId:'SE001', repuestosUsados:[],         estado:'En diagnóstico',    prioridad:'Media', fechaIngreso:'2024-01-15', fechaEstimada:'2024-01-16', diagnostico:'En evaluación.',                       notas:'',                     costoTotal:15000  },
    { id:'OT-003', clienteId:3, tecnicoId:3, dispositivo:'Samsung Galaxy Tab S9',marca:'Samsung', falla:'Batería dura muy poco', servicioId:'SE003', repuestosUsados:['RP012'], estado:'Listo para retirar', prioridad:'Baja',  fechaIngreso:'2024-01-14', fechaEstimada:'2024-01-15', diagnostico:'Batería degradada al 38%.',            notas:'Cliente avisado.',     costoTotal:110000 },
    { id:'OT-004', clienteId:4, tecnicoId:4, dispositivo:'iPhone 16 Pro',        marca:'Apple',   falla:'No carga',              servicioId:'SE005', repuestosUsados:[],         estado:'Recibido',          prioridad:'Alta',  fechaIngreso:'2024-01-15', fechaEstimada:'2024-01-17', diagnostico:'',                                     notas:'Urgente, cliente espera.',costoTotal:60000 },
    { id:'OT-005', clienteId:1, tecnicoId:5, dispositivo:'Samsung Galaxy S24',   marca:'Samsung', falla:'Pantalla con líneas',   servicioId:'SE002', repuestosUsados:['RP004'], estado:'Cancelado',         prioridad:'Media', fechaIngreso:'2024-01-10', fechaEstimada:'2024-01-12', diagnostico:'Cancelado por cliente.',               notas:'',                     costoTotal:0      },
  ],

  blogs: [
    { id:1, titulo:'¿Cómo saber si tu batería necesita cambio?', tag:'Consejos', fecha:'2024-01-10', imagen:'https://images.unsplash.com/photo-1609592424921-83b9b65ee44e?w=600&q=80', resumen:'Señales claras de que tu batería ya no rinde como antes y cuándo es el momento de reemplazarla.', contenido:'Una batería en mal estado puede afectar el rendimiento de tu dispositivo. Si notas que se descarga rápido, se calienta en exceso o el dispositivo se apaga solo, es hora de un cambio. En ReparaTech contamos con baterías originales y compatibles para la mayoría de modelos. El proceso toma menos de una hora y ofrecemos 6 meses de garantía.' },
    { id:2, titulo:'5 cosas que NO debes hacer si se rompe tu pantalla', tag:'Tutoriales', fecha:'2024-01-08', imagen:'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=600&q=80', resumen:'Errores comunes que empeoran el daño en la pantalla de tu smartphone y cómo evitarlos.', contenido:'Cuando se rompe la pantalla, el pánico lleva a cometer errores costosos. Evita: seguir usando el dispositivo con vidrios sueltos, intentar pegar la pantalla con cinta adhesiva, exponer el equipo a agua, desarmarlo sin experiencia, y esperar demasiado para repararlo. Visítanos y lo resolvemos el mismo día con repuestos originales.' },
    { id:3, titulo:'Guía para cuidar tu laptop y alargar su vida útil', tag:'Guías', fecha:'2024-01-05', imagen:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80', resumen:'Consejos prácticos para mantener tu laptop en buen estado y evitar costosas reparaciones.', contenido:'Limpia el ventilador cada 6 meses, mantén el sistema operativo actualizado, usa el cargador original, no bloquees los ventiladores y realiza limpiezas de software periódicas. Con estos simples hábitos puedes extender la vida de tu laptop varios años más.' },
    { id:4, titulo:'¿Vale la pena reparar o comprar nuevo?', tag:'Consejos', fecha:'2024-01-02', imagen:'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80', resumen:'Cómo tomar la mejor decisión económica cuando tu dispositivo falla.', contenido:'Antes de comprar un equipo nuevo, considera el costo de reparación vs el valor del equipo. Si la reparación cuesta menos del 50% del valor del equipo, generalmente vale la pena. En ReparaTech hacemos diagnósticos gratuitos para ayudarte a decidir. Trabajamos con garantía en todas nuestras reparaciones.' },
  ],

  usuarios: [
    { id:1, nombre:'Admin',  apellido:'Sistema',   correo:'admin@reparatech.cl',     rol:'administrador', password:'admin123' },
    { id:2, nombre:'María',  apellido:'González',  correo:'recepcion@reparatech.cl', rol:'recepcionista', password:'recep123' },
    { id:3, nombre:'Juan',   apellido:'Encargado', correo:'encargado@reparatech.cl', rol:'encargado',     password:'enc123'   },
  ],

  contadores: { clientes:5, ordenes:6, usuarios:4, tecnicos:7, categorias:6 },
}

let _db = JSON.parse(JSON.stringify(initialData))

const today = () => new Date().toISOString().split('T')[0]
const genId = (e) => { _db.contadores[e] = (_db.contadores[e]||0)+1; return _db.contadores[e] }
const genOT = () => { const n=genId('ordenes'); return `OT-${String(n).padStart(3,'0')}` }

export const clientesDB = {
  getAll:  ()          => [..._db.clientes],
  getById: (id)        => _db.clientes.find(c=>c.id===id)||null,
  login:   (correo,pw) => _db.clientes.find(c=>c.correo===correo&&c.password===pw)||null,
  create:  (d)         => { const n={id:genId('clientes'),...d}; _db.clientes.push(n); return n },
  update:  (id,d)      => { const i=_db.clientes.findIndex(c=>c.id===id); if(i<0)return null; _db.clientes[i]={..._db.clientes[i],...d}; return _db.clientes[i] },
  delete:  (id)        => { const i=_db.clientes.findIndex(c=>c.id===id); if(i<0)return false; _db.clientes.splice(i,1); return true },
}
export const tecnicosDB = {
  getAll:  ()     => [..._db.tecnicos],
  getById: (id)   => _db.tecnicos.find(t=>t.id===id)||null,
  create:  (d)    => { const n={id:genId('tecnicos'),ordenesActivas:0,activo:true,...d}; _db.tecnicos.push(n); return n },
  update:  (id,d) => { const i=_db.tecnicos.findIndex(t=>t.id===id); if(i<0)return null; _db.tecnicos[i]={..._db.tecnicos[i],...d}; return _db.tecnicos[i] },
  delete:  (id)   => { const i=_db.tecnicos.findIndex(t=>t.id===id); if(i<0)return false; _db.tecnicos.splice(i,1); return true },
}
export const serviciosDB = {
  getAll:             ()    => [..._db.servicios],
  getById:            (id)  => _db.servicios.find(s=>s.id===id)||null,
  getEnOferta:        ()    => _db.servicios.filter(s=>s.enOferta),
  getByCategoria:     (cat) => _db.servicios.filter(s=>s.categoria===cat),
  precioConDescuento: (s)   => s.enOferta ? Math.round(s.precio*(1-s.descuento/100)) : s.precio,
  create:  (d)    => { const n={id:`SE${String(genId('servicios')).padStart(3,'0')}`,...d}; _db.servicios.push(n); return n },
  update:  (id,d) => { const i=_db.servicios.findIndex(s=>s.id===id); if(i<0)return null; _db.servicios[i]={..._db.servicios[i],...d}; return _db.servicios[i] },
  delete:  (id)   => { const i=_db.servicios.findIndex(s=>s.id===id); if(i<0)return false; _db.servicios.splice(i,1); return true },
}
export const dispositivosDB = {
  getAll:          ()    => [..._db.dispositivos],
  getById:         (id)  => _db.dispositivos.find(d=>d.id===id)||null,
  getByCategoria:  (cat) => _db.dispositivos.filter(d=>d.categoria===cat),
  getMarcas:       ()    => [...new Set(_db.dispositivos.map(d=>d.marca))],
}
export const categoriasDB = {
  getAll:  ()     => [..._db.categorias],
  getById: (id)   => _db.categorias.find(c=>c.id===id)||null,
  create:  (d)    => { const n={id:genId('categorias'),...d}; _db.categorias.push(n); return n },
  update:  (id,d) => { const i=_db.categorias.findIndex(c=>c.id===id); if(i<0)return null; _db.categorias[i]={..._db.categorias[i],...d}; return _db.categorias[i] },
  delete:  (id)   => { const i=_db.categorias.findIndex(c=>c.id===id); if(i<0)return false; _db.categorias.splice(i,1); return true },
}
export const repuestosDB = {
  getAll:       ()         => [..._db.repuestos],
  getById:      (id)       => _db.repuestos.find(r=>r.id===id)||null,
  update:       (id,d)     => { const i=_db.repuestos.findIndex(r=>r.id===id); if(i<0)return null; _db.repuestos[i]={..._db.repuestos[i],...d}; return _db.repuestos[i] },
  ajustarStock: (id,delta) => { const r=_db.repuestos.find(r=>r.id===id); if(!r)return null; const n=r.stock+delta; if(n<0)return null; r.stock=n; return r },
}
export const ordenesDB = {
  getAll:       ()    => [..._db.ordenes],
  getById:      (id)  => _db.ordenes.find(o=>o.id===id)||null,
  getByCliente: (cId) => _db.ordenes.filter(o=>o.clienteId===cId),
  getByEstado:  (est) => _db.ordenes.filter(o=>o.estado===est),
  create: (d) => {
    const n={id:genOT(),estado:'Recibido',fechaIngreso:today(),repuestosUsados:[],diagnostico:'',costoTotal:0,...d}
    _db.ordenes.push(n)
    const t=_db.tecnicos.find(t=>t.id===d.tecnicoId); if(t)t.ordenesActivas++
    return n
  },
  update:        (id,d)  => { const i=_db.ordenes.findIndex(o=>o.id===id); if(i<0)return null; _db.ordenes[i]={..._db.ordenes[i],...d}; return _db.ordenes[i] },
  cambiarEstado: (id,est) => {
    const o=_db.ordenes.find(o=>o.id===id); if(!o)return null
    const prev=o.estado; o.estado=est
    const fin=['Listo para retirar','Cancelado']
    if(fin.includes(est)&&!fin.includes(prev)){const t=_db.tecnicos.find(t=>t.id===o.tecnicoId);if(t&&t.ordenesActivas>0)t.ordenesActivas--}
    return o
  },
  delete:   (id)  => { const i=_db.ordenes.findIndex(o=>o.id===id); if(i<0)return false; _db.ordenes.splice(i,1); return true },
  getStats: ()    => {
    const total=_db.ordenes.length, porEstado={}
    _db.ordenes.forEach(o=>{porEstado[o.estado]=(porEstado[o.estado]||0)+1})
    const ingresos=_db.ordenes.filter(o=>o.estado==='Listo para retirar').reduce((s,o)=>s+(o.costoTotal||0),0)
    return{total,porEstado,ingresos}
  },
}
export const blogsDB   = { getAll:()=>[..._db.blogs], getById:(id)=>_db.blogs.find(b=>b.id===id)||null }
export const authDB    = {
  login:  (co,pw) => { const u=_db.usuarios.find(u=>u.correo===co&&u.password===pw); return u?{...u,password:undefined}:null },
  getAll: ()      => _db.usuarios.map(u=>({...u,password:undefined})),
  create: (d)     => { const n={id:genId('usuarios'),...d}; _db.usuarios.push(n); return{...n,password:undefined} },
  update: (id,d)  => { const i=_db.usuarios.findIndex(u=>u.id===id); if(i<0)return null; _db.usuarios[i]={..._db.usuarios[i],...d}; return{..._db.usuarios[i],password:undefined} },
  delete: (id)    => { const i=_db.usuarios.findIndex(u=>u.id===id); if(i<0)return false; _db.usuarios.splice(i,1); return true },
}

export const ESTADOS   = ['Recibido','En diagnóstico','En reparación','Listo para retirar','Cancelado']
export const formatCLP = (n) => `$${Number(n).toLocaleString('es-CL')}`
export const estadoBadgeClass = (e) => ({'Recibido':'badge-recibido','En diagnóstico':'badge-diagnostico','En reparación':'badge-reparacion','Listo para retirar':'badge-listo','Cancelado':'badge-cancelado'}[e]||'badge-recibido')
export const estadoIcono = (e) => ({'Recibido':'📥','En diagnóstico':'🔍','En reparación':'🔧','Listo para retirar':'✅','Cancelado':'❌'}[e]||'📋')
