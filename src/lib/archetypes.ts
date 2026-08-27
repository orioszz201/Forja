import type { AppConfig, CatalogItem, FeatureId, ItemType } from "./types";
import type { IconName } from "../components/Icons";

export interface Archetype {
  id: string;
  label: string;
  short: string;
  icon: IconName;
  hue: number;
  defaultName: string;
  tagline: string;
  audience: string;
  categories: string[];
  itemTypes: ItemType[];
  defaultFeatures: FeatureId[];
  flow: string[];
  flowLabel: string;
  seeds: CatalogItem[];
}

let n = 0;
function mk(
  archetypeHue: number,
  name: string,
  category: string,
  type: ItemType,
  price: number | null,
  description: string,
  extra: Partial<CatalogItem> = {}
): CatalogItem {
  n += 1;
  return {
    id: `seed-${n}`,
    name,
    category,
    type,
    price,
    description,
    rating: Math.round((4.2 + ((n * 7) % 9) / 10) * 10) / 10,
    reviews: 12 + ((n * 37) % 140),
    tags: [category],
    hue: (archetypeHue + ((n * 23) % 40) - 20 + 360) % 360,
    ...extra,
  };
}

export const ARCHETYPES: Archetype[] = [
  {
    id: "fisica",
    label: "Tienda de productos físicos",
    short: "Inventario, carrito, envíos y pagos.",
    icon: "bag",
    hue: 152,
    defaultName: "Verde Adentro",
    tagline: "Plantas de estudio, macetas de autor y todo para que vivan bien.",
    audience: "Aficionados a las plantas de 22 a 45 años en ciudad",
    categories: ["Plantas de interior", "Macetas y textiles", "Sustratos y cuidado", "Regalería"],
    itemTypes: ["product"],
    defaultFeatures: ["busqueda", "categorias", "filtros", "favoritos", "variantes", "carrito", "pagos", "opiniones"],
    flow: ["Explorar", "Ver detalles", "Agregar al carrito", "Checkout", "Pago", "Confirmación"],
    flowLabel: "Flujo de compra física",
    seeds: [
      mk(152, "Monstera deliciosa", "Plantas de interior", "product", 480, "Ejemplar de 60 cm con 5 hojas fenestradas. Incluye guía de aclimatación y maceta de cultivo.", { tags: ["tropical", "fácil cuidado"], featured: true, variants: [{ name: "Tamaño", options: ["40 cm", "60 cm", "90 cm"] }] }),
      mk(152, "Calathea orbifolia", "Plantas de interior", "product", 390, "Follaje rayado en verde plata. Amiga de los espacios con luz indirecta y humedad media.", { tags: ["pet friendly", "sombra"] }),
      mk(152, "Philodendron brasil", "Plantas de interior", "product", 260, "Colgante de crecimiento rápido, perfecta para repisas altas y principiantes.", { tags: ["colgante", "fácil cuidado"] }),
      mk(152, "Maceta de gres esmaltado", "Macetas y textiles", "product", 540, "Torneada a mano con esmalte reactivo. Plato incluido y orificio de drenaje.", { featured: true, variants: [{ name: "Diámetro", options: ["14 cm", "18 cm", "22 cm"] }, { name: "Esmalte", options: ["Verde musgo", "Arena", "Óxido"] }] }),
      mk(152, "Canasta tejida de fibra", "Macetas y textiles", "product", 320, "Fibra natural trenzada, ideal como cubremaceta o para almacenar herramientas.", { tags: ["fibra natural"] }),
      mk(152, "Kit de sustrato premium", "Sustratos y cuidado", "product", 210, "Mezcla aireada de corteza, perlita y fibra de coco. Rinde 8 litros.", { tags: ["aroides", "8 L"] }),
      mk(152, "Regadera de acero 1.2 L", "Sustratos y cuidado", "product", 450, "Boquilla de chorro fino para riego de precisión. Acero esmaltado en verde profundo.", { featured: true }),
      mk(152, "Tarjeta regalo digital", "Regalería", "digital", 500, "Canjeable en tienda física y en línea. Sin fecha de vencimiento.", { tags: ["regalo"] }),
    ],
  },
  {
    id: "digital",
    label: "Tienda de productos digitales",
    short: "Cursos, e-books y plantillas con entrega inmediata.",
    icon: "chip",
    hue: 268,
    defaultName: "Nébula Academy",
    tagline: "Cursos y recursos para creativos que quieren producir más y mejor.",
    audience: "Diseñadores, freelancers y creadores de contenido",
    categories: ["Cursos", "E-books", "Plantillas", "Recursos de audio"],
    itemTypes: ["digital"],
    defaultFeatures: ["busqueda", "categorias", "filtros", "favoritos", "carrito", "pagos", "opiniones"],
    flow: ["Explorar", "Ver detalles", "Comprar ahora", "Pago", "Acceso inmediato"],
    flowLabel: "Flujo de compra digital",
    seeds: [
      mk(268, "Diseño de interfaces desde cero", "Cursos", "digital", 899, "12 módulos en video, archivos fuente y comunidad privada. Acceso de por vida.", { duration: "18 h de video", featured: true, tags: ["UI", "Figma"] }),
      mk(268, "Fotografía con teléfono", "Cursos", "digital", 599, "Composición, luz y edición móvil. Incluye 40 presets exclusivos.", { duration: "9 h de video", tags: ["móvil"] }),
      mk(268, "Finanzas para creativos", "E-books", "digital", 249, "Guía de 120 páginas para ponerle precio a tu trabajo y cobrar a tiempo.", { duration: "120 páginas", tags: ["PDF", "plantillas"] }),
      mk(268, "Manual de lettering moderno", "E-books", "digital", 199, "Ejercicios progresivos, alfabetos completos y referencias históricas.", { duration: "86 páginas" }),
      mk(268, "Pack de plantillas Notion", "Plantillas", "digital", 349, "CRM, planner editorial y finanzas. 14 plantillas conectadas entre sí.", { featured: true, tags: ["Notion", "productividad"] }),
      mk(268, "Sistema de diseño Figma", "Plantillas", "digital", 749, "Tokens, componentes y documentación lista para equipos pequeños.", { tags: ["Figma", "equipos"] }),
      mk(268, "Biblioteca de foley urbano", "Recursos de audio", "digital", 429, "240 sonidos de ciudad grabados a 96 kHz, libres de regalías.", { duration: "3.2 GB", tags: ["96 kHz"] }),
    ],
  },
  {
    id: "marketplace",
    label: "Marketplace",
    short: "Varios vendedores, un solo checkout.",
    icon: "network",
    hue: 30,
    defaultName: "Kiosko",
    tagline: "Objetos de diseño independiente, directo del taller de quien los hace.",
    audience: "Compradores que valoran piezas de autor y producción local",
    categories: ["Mobiliario", "Iluminación", "Textil", "Cerámica"],
    itemTypes: ["product"],
    defaultFeatures: ["busqueda", "categorias", "filtros", "favoritos", "carrito", "pagos", "opiniones"],
    flow: ["Explorar", "Ver detalles", "Carrito multi-vendedor", "Checkout", "Pago", "Confirmación"],
    flowLabel: "Flujo de marketplace",
    seeds: [
      mk(30, "Silla Nórdica de encino", "Mobiliario", "product", 3200, "Estructura de encino macizo y asiento tejido. Ensamblaje sin herramientas.", { seller: "Estudio Lúa", featured: true }),
      mk(30, "Mesa lateral Trípode", "Mobiliario", "product", 1850, "Tres patas torneadas, cubierta de fresno con aceite natural.", { seller: "Estudio Lúa" }),
      mk(30, "Lámpara colgante Cesta", "Iluminación", "product", 1290, "Tejido de palma y latón. Cable textil de 1.8 m incluido.", { seller: "Taller Sur", featured: true, variants: [{ name: "Diámetro", options: ["30 cm", "45 cm"] }] }),
      mk(30, "Aplique de pared Arco", "Iluminación", "product", 980, "Aluminio pintado al horno, luz cálida regulable.", { seller: "Taller Sur" }),
      mk(30, "Manta de lana teñida", "Textil", "product", 1150, "Lana de borrego teñida con grana cochinilla. 130 × 180 cm.", { seller: "Colectivo Ñuu", variants: [{ name: "Tinte", options: ["Carmín", "Añil", "Musgo"] }] }),
      mk(30, "Set de tazas de barro", "Cerámica", "product", 640, "Cuatro tazas vidriadas a alta temperatura, aptas para lavavajillas.", { seller: "Horno Tres", tags: ["set ×4"] }),
      mk(30, "Jarrón Ondas", "Cerámica", "product", 720, "Gres esmaltado con relieve ondulado. Pieza firmada.", { seller: "Horno Tres", featured: true }),
    ],
  },
  {
    id: "catalogo",
    label: "Catálogo de productos",
    short: "Exhibición con consulta, sin venta en línea.",
    icon: "grid",
    hue: 210,
    defaultName: "Atlas Mobiliario",
    tagline: "Catálogo de mobiliario a medida. Consulta disponibilidad y tiempos de entrega.",
    audience: "Arquitectos, despachos de interiorismo y clientes residenciales",
    categories: ["Sala", "Comedor", "Recámara", "Oficina"],
    itemTypes: ["quote"],
    defaultFeatures: ["busqueda", "categorias", "filtros", "favoritos", "cotizaciones", "opiniones"],
    flow: ["Explorar", "Ver detalles", "Consultar pieza", "Respuesta del equipo"],
    flowLabel: "Flujo de consulta",
    seeds: [
      mk(210, "Sofá modular Nube", "Sala", "quote", null, "Configuración modular de 2 a 6 cuerpos. Más de 40 tapices disponibles.", { featured: true, tags: ["modular", "40+ tapices"] }),
      mk(210, "Mesa de comedor Roble", "Comedor", "quote", null, "Cubierta de roble europeo de 32 mm, extensible hasta 2.8 m.", { tags: ["extensible"] }),
      mk(210, "Cabecera Flotante", "Recámara", "quote", null, "Panel suspendido con luz LED integrada y buró flotante opcional.", { featured: true, tags: ["LED"] }),
      mk(210, "Escritorio Ejecutivo", "Oficina", "quote", null, "Nogal americano con gestión de cables y cajonera móvil.", { tags: ["nogal"] }),
      mk(210, "Librero Escalera", "Sala", "quote", null, "Estructura metálica y repisas de encino. Se fija a muro.", { variants: [{ name: "Niveles", options: ["3", "4", "5"] }] }),
      mk(210, "Sillas Comedor ×6", "Comedor", "quote", null, "Set de seis sillas tapizadas, estructura de fresno.", { tags: ["set ×6"] }),
    ],
  },
  {
    id: "profesionales",
    label: "Servicios profesionales",
    short: "Contratación directa y proyectos a cotizar.",
    icon: "briefcase",
    hue: 350,
    defaultName: "Vector Studio",
    tagline: "Estrategia, diseño y desarrollo para marcas que se toman en serio crecer.",
    audience: "PyMEs, startups y fundadores con presupuesto de marketing",
    categories: ["Estrategia", "Diseño", "Desarrollo", "Acompañamiento"],
    itemTypes: ["service", "quote"],
    defaultFeatures: ["busqueda", "categorias", "favoritos", "cotizaciones", "carrito", "pagos", "opiniones"],
    flow: ["Explorar", "Ver servicio", "Contratar / Cotizar", "Pago o propuesta", "Confirmación"],
    flowLabel: "Flujo de contratación",
    seeds: [
      mk(350, "Auditoría de marca", "Estrategia", "service", 6500, "Análisis de posicionamiento, competencia y arquitectura de marca. Entrega en 10 días.", { duration: "10 días", featured: true, tags: ["reporte", "workshop"] }),
      mk(350, "Sesión de descubrimiento", "Estrategia", "service", 1800, "Taller de 3 horas para alinear objetivos, audiencia y mensaje.", { duration: "3 h" }),
      mk(350, "Identidad visual completa", "Diseño", "quote", null, "Logotipo, sistema tipográfico, paleta y manual de aplicación.", { duration: "4–6 semanas", featured: true }),
      mk(350, "Diseño de empaque", "Diseño", "quote", null, "Sistema de empaque listo para imprenta, con mockups y guía de materiales.", { duration: "3 semanas" }),
      mk(350, "Sitio web a medida", "Desarrollo", "quote", null, "Diseño y desarrollo con CMS, SEO técnico y analítica configurada.", { duration: "6–8 semanas", tags: ["CMS", "SEO"] }),
      mk(350, "Iguala de diseño mensual", "Acompañamiento", "service", 9800, "Bolsa de 40 horas mensuales de diseño para tu equipo. Renovación flexible.", { duration: "40 h / mes", featured: true }),
    ],
  },
  {
    id: "tecnicos",
    label: "Servicios técnicos",
    short: "Reparaciones, visitas a domicilio y agenda.",
    icon: "wrench",
    hue: 188,
    defaultName: "Taller Voltio",
    tagline: "Reparación de equipos de cómputo con diagnóstico claro y garantía escrita.",
    audience: "Hogares y oficinas que necesitan soporte técnico confiable",
    categories: ["Cómputo", "Pantallas y móviles", "Redes", "Visitas a domicilio"],
    itemTypes: ["service", "booking", "quote"],
    defaultFeatures: ["busqueda", "categorias", "favoritos", "reservas", "cotizaciones", "opiniones"],
    flow: ["Explorar", "Ver servicio", "Agendar visita / Cotizar", "Diagnóstico", "Confirmación"],
    flowLabel: "Flujo de servicio técnico",
    seeds: [
      mk(188, "Diagnóstico de laptop", "Cómputo", "service", 350, "Revisión completa con reporte y presupuesto sin compromiso. Se abona a la reparación.", { duration: "24 h", featured: true }),
      mk(188, "Cambio de disco + respaldo", "Cómputo", "service", 900, "Migración a SSD con clonado de sistema y respaldo de 500 GB.", { duration: "48 h" }),
      mk(188, "Cambio de pantalla", "Pantallas y móviles", "quote", null, "Pantalla original o certificada según modelo. Cotiza con tu equipo.", { duration: "Mismo día" }),
      mk(188, "Instalación de red mesh", "Redes", "booking", 1400, "Hasta 3 nodos configurados con medición de cobertura por habitación.", { duration: "2 h en sitio", featured: true }),
      mk(188, "Mantenimiento preventivo", "Visitas a domicilio", "booking", 600, "Limpieza interna, pasta térmica y actualización de sistema a domicilio.", { duration: "1.5 h en sitio" }),
      mk(188, "Armado de PC a medida", "Cómputo", "quote", null, "Asesoría de componentes, ensamblaje, pruebas de estrés y gestión de cables.", { duration: "5 días" }),
    ],
  },
  {
    id: "reservas",
    label: "Reservas y citas",
    short: "Calendario, horarios y confirmación al instante.",
    icon: "calendar",
    hue: 40,
    defaultName: "Norte Barbería",
    tagline: "Reserva tu silla. Cortes clásicos, barba con toalla caliente y cero esperas.",
    audience: "Hombres de 18 a 40 años que agendan en línea",
    categories: ["Cortes", "Barba", "Rituales", "Color"],
    itemTypes: ["booking"],
    defaultFeatures: ["busqueda", "categorias", "favoritos", "reservas", "opiniones"],
    flow: ["Explorar", "Ver servicio", "Elegir fecha y hora", "Confirmar cita"],
    flowLabel: "Flujo de agendamiento",
    seeds: [
      mk(40, "Corte clásico", "Cortes", "booking", 280, "Tijera y máquina, acabado con navaja y styling. 40 minutos.", { duration: "40 min", featured: true }),
      mk(40, "Corte + diseño", "Cortes", "booking", 350, "Clásico con diseño de líneas o figuras a navaja.", { duration: "55 min" }),
      mk(40, "Barba completa", "Barba", "booking", 250, "Perfilado, toalla caliente, aceites y bálsamo de acabado.", { duration: "30 min", featured: true }),
      mk(40, "Ritual Norte completo", "Rituales", "booking", 520, "Corte, barba, mascarilla facial y masaje de cuello. Café de la casa incluido.", { duration: "90 min", featured: true }),
      mk(40, "Camuflaje de canas", "Color", "booking", 380, "Coloración natural tono sobre tono, sin cambios drásticos.", { duration: "45 min" }),
      mk(40, "Corte junior", "Cortes", "booking", 220, "Para menores de 12 años. Paciencia incluida.", { duration: "30 min" }),
    ],
  },
  {
    id: "restaurante",
    label: "Restaurante y pedidos",
    short: "Menú, carrito de pedido y entrega.",
    icon: "cloche",
    hue: 12,
    defaultName: "Brasa & Humo",
    tagline: "Hamburguesas al carbón, costillas lentas y malteadas espesas. Pide en línea.",
    audience: "Familias y grupos de amigos que piden a domicilio",
    categories: ["Entradas", "Principales", "Para compartir", "Bebidas", "Postres"],
    itemTypes: ["product"],
    defaultFeatures: ["busqueda", "categorias", "filtros", "favoritos", "variantes", "carrito", "pagos", "opiniones"],
    flow: ["Explorar el menú", "Armar pedido", "Checkout", "Pago", "Confirmación"],
    flowLabel: "Flujo de pedido",
    seeds: [
      mk(12, "Hamburguesa de la casa", "Principales", "product", 165, "180 g de res al carbón, queso madurado, cebolla caramelizada y salsa de la casa.", { featured: true, variants: [{ name: "Término", options: ["Medio", "Tres cuartos", "Bien cocida"] }, { name: "Extra", options: ["Sin extra", "Tocino +25", "Doble carne +60"] }] }),
      mk(12, "Costillas BBQ ½ rack", "Principales", "product", 240, "Cocción lenta de 6 horas con glaseado de bourbon y papas gajo.", { featured: true, tags: ["6 h de cocción"] }),
      mk(12, "Pollo frito sureño", "Principales", "product", 185, "Marinado 24 h en buttermilk, costra crujiente y miel picante.", { tags: ["picante opcional"] }),
      mk(12, "Alitas glaseadas ×8", "Entradas", "product", 145, "Bañadas en salsa a elegir: BBQ ahumada, búfalo o tamarindo.", { variants: [{ name: "Salsa", options: ["BBQ ahumada", "Búfalo", "Tamarindo"] }] }),
      mk(12, "Papas con cheddar y tocino", "Para compartir", "product", 95, "Papas gajo, queso cheddar fundido, tocino y cebollín.", { tags: ["para 2"] }),
      mk(12, "Malteada de galleta", "Bebidas", "product", 85, "Helado de vainilla, galleta de mantequilla y crema batida.", {}),
      mk(12, "Limonada ahumada", "Bebidas", "product", 60, "Limón, romero y un toque de jarabe ahumado. 500 ml.", {}),
      mk(12, "Flan de la abuela", "Postres", "product", 70, "Receta de la casa con caramelo oscuro. Porción generosa.", {}),
    ],
  },
  {
    id: "cotizacion",
    label: "Venta bajo cotización",
    short: "Proyectos a medida que se cotizan uno a uno.",
    icon: "draft",
    hue: 222,
    defaultName: "Herrería Forja Sur",
    tagline: "Herrería estructural y ornamental a medida. Cada proyecto se cotiza según plano.",
    audience: "Constructoras, arquitectos y propietarios en remodelación",
    categories: ["Portones", "Escaleras", "Barandas", "Estructuras"],
    itemTypes: ["quote"],
    defaultFeatures: ["busqueda", "categorias", "favoritos", "cotizaciones", "opiniones"],
    flow: ["Explorar", "Ver proyecto", "Solicitar cotización", "Visita técnica", "Propuesta en 24 h"],
    flowLabel: "Flujo de cotización",
    seeds: [
      mk(222, "Portón corredizo industrial", "Portones", "quote", null, "Fabricación según claro, con riel superior y motor opcional. Acero A-36.", { featured: true, tags: ["motor opcional"] }),
      mk(222, "Portón abatible forjado", "Portones", "quote", null, "Diseño ornamental forjado a mano, acabado con pintura electrostática.", { tags: ["forjado"] }),
      mk(222, "Escalera caracol", "Escaleras", "quote", null, "Estructura helicoidal con huellas de placa antiderrapante o madera.", { featured: true, variants: [{ name: "Huellas", options: ["Placa", "Madera", "Rejilla"] }] }),
      mk(222, "Escalera recta con descansos", "Escaleras", "quote", null, "Cálculo estructural incluido, baranda integrada y anclaje químico.", {}),
      mk(222, "Baranda de balcón", "Barandas", "quote", null, "Perfil cuadrado o redondo, vidrio templado opcional. Precio por metro lineal.", { variants: [{ name: "Relleno", options: ["Vertical", "Horizontal", "Vidrio"] }] }),
      mk(222, "Estructura para quincho", "Estructuras", "quote", null, "Marco metálico para techo ligero con canal pluvial integrada.", { tags: ["por m²"] }),
    ],
  },
  {
    id: "mixto",
    label: "Comercio mixto",
    short: "Productos y servicios en la misma app.",
    icon: "layers",
    hue: 320,
    defaultName: "Ritmo Club",
    tagline: "Gimnasio de fuerza con tienda de suplementos. Membresías, clases y proteína en un solo lugar.",
    audience: "Personas activas de 20 a 45 años que entrenan 3+ veces por semana",
    categories: ["Membresías", "Clases", "Suplementos", "Equipo"],
    itemTypes: ["service", "booking", "product", "quote"],
    defaultFeatures: ["busqueda", "categorias", "filtros", "favoritos", "variantes", "carrito", "reservas", "cotizaciones", "pagos", "opiniones"],
    flow: ["Explorar", "Elegir producto o servicio", "Comprar / Reservar / Cotizar", "Confirmación"],
    flowLabel: "Flujo mixto",
    seeds: [
      mk(320, "Membresía mensual", "Membresías", "service", 750, "Acceso ilimitado a sala de fuerza y cardio. Sin plazo forzoso.", { featured: true, duration: "Renovación mensual" }),
      mk(320, "Pase de día", "Membresías", "product", 150, "Acceso completo por 24 h. Incluye toalla y casillero.", { tags: ["24 h"] }),
      mk(320, "Entrenamiento personalizado", "Clases", "booking", 420, "Sesión 1 a 1 con coach certificado. Evaluación de movimiento incluida.", { duration: "60 min", featured: true }),
      mk(320, "Clase de fuerza grupal", "Clases", "booking", 180, "Cupo de 8 personas, barra y discos incluidos. Reserva tu lugar.", { duration: "50 min" }),
      mk(320, "Proteína whey 2 kg", "Suplementos", "product", 1150, "Aislado de suero, 25 g de proteína por scoop. Sabores disponibles.", { variants: [{ name: "Sabor", options: ["Vainilla", "Chocolate", "Fresa"] }], tags: ["2 kg"] }),
      mk(320, "Creatina monohidratada", "Suplementos", "product", 520, "300 g de creatina micronizada con sello de pureza.", { tags: ["300 g"] }),
      mk(320, "Botella térmica 1 L", "Equipo", "product", 380, "Acero inoxidable, mantiene frío 24 h. Logo del club grabado.", {}),
      mk(320, "Plan nutricional personalizado", "Clases", "quote", null, "Plan de 12 semanas diseñado por nutrióloga deportiva según tus metas.", { duration: "12 semanas" }),
    ],
  },
];

export function getArchetype(id: string): Archetype {
  return ARCHETYPES.find((a) => a.id === id) ?? ARCHETYPES[0];
}

export function resolveItems(config: AppConfig): CatalogItem[] {
  const arch = getArchetype(config.archetypeId);
  const selected = arch.seeds.filter((s) => config.itemIds.includes(s.id));
  const custom: CatalogItem[] = config.customItems.map((c, i) => ({
    id: `custom-${i}-${config.createdAt}`,
    name: c.name,
    description: "Elemento agregado por ti durante la configuración. Edítalo o elimínalo cuando quieras.",
    price: c.price,
    type: c.type,
    category: c.category,
    rating: 0,
    reviews: 0,
    tags: [c.category],
    hue: (arch.hue + i * 31) % 360,
  }));
  return [...selected, ...custom];
}

export function brandColors(hue: number) {
  return {
    brand: `hsl(${hue} 72% 45%)`,
    brandSoft: `hsl(${hue} 60% 92%)`,
    brandInk: hue > 60 && hue < 200 ? "#171b15" : "#ffffff",
  };
}
