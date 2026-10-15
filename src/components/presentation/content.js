export const WHATSAPP_URL = 'https://wa.me/5492944369647';
export const EMAIL = 'info@kodeonsoluciones.com';
export const PHONE_LABEL = '+54 9 2944 36-9647';

export const equipmentServices = [
  {
    title: 'Venta y asesoramiento',
    text: 'Comercialización de equipamiento médico con asesoramiento previo y puesta en marcha, según la necesidad de la institución.',
  },
  {
    title: 'Servicio técnico',
    text: 'Diagnóstico y reparación de equipamiento de uso médico, en la institución o en taller, con seguimiento hasta el cierre del trabajo.',
  },
  {
    title: 'Mantenimiento preventivo',
    text: 'Revisiones programadas para reducir fallas y cuidar la vida útil del equipo.',
  },
  {
    title: 'Mantenimiento correctivo',
    text: 'Intervención ante una falla de funcionamiento. Cada trabajo queda registrado.',
  },
  {
    title: 'Gestión y seguimiento',
    text: 'Sistema propio para consultar estado, intervenciones e historial del equipamiento.',
  },
];

export const equipmentLines = [
  { title: 'Diagnóstico por imágenes', text: 'Ecógrafos y equipos de ultrasonido.' },
  { title: 'Equipamiento hospitalario', text: 'Incubadoras y dispositivos clínicos.' },
  { title: 'Electrónica biomédica', text: 'Reparación y recuperación de equipos.' },
];

export const digitalServices = [
  {
    title: 'Aplicaciones Android',
    text: 'Aplicaciones para el teléfono del profesional o del personal de la institución, desarrolladas para el uso concreto del servicio.',
  },
  {
    title: 'Aplicaciones y sistemas web',
    text: 'Sistemas de gestión accesibles desde el navegador, para consultorios, clínicas y áreas administrativas.',
  },
  {
    title: 'Sitios institucionales',
    text: 'Páginas web para presentar un servicio de salud, un consultorio o una institución con información clara y verificable.',
  },
  {
    title: 'Desarrollo a medida',
    text: 'Cuando el circuito de trabajo es propio, el sistema se diseña sobre ese circuito y no sobre una plantilla.',
  },
  {
    title: 'Automatización de procesos',
    text: 'Tareas repetitivas de registro y seguimiento, resueltas para que la información quede en un solo lugar.',
  },
  {
    title: 'Integración entre sistemas',
    text: 'Conexión entre herramientas existentes cuando la institución ya opera con más de un sistema.',
  },
];

export const ownProducts = [
  {
    id: 'gestion-equipos',
    title: 'Gestión de equipamiento médico',
    text: 'Sistema para organizar la información técnica del parque de equipos: intervenciones, estado e historial.',
    features: ['Registro de intervenciones', 'Estado operativo', 'Historial del equipo'],
  },
  {
    id: 'consultorios',
    title: 'Gestión de consultorios privados',
    text: 'Sistema para la administración de un consultorio privado.',
    features: ['Turnos', 'Historias clínicas', 'Administración'],
  },
  {
    id: 'turnos',
    title: 'Sistema de turnos por llamado',
    text: 'Solución para organizar turnos mediante llamados en la sala de atención.',
    features: ['Organización de llamados', 'Gestión de turnos'],
  },
];

export const customSteps = [
  { n: '01', title: 'Escuchamos', text: 'La institución cuenta cómo trabaja y qué necesita resolver.' },
  { n: '02', title: 'Analizamos', text: 'Revisamos el proceso, el equipo o el sistema antes de proponer.' },
  { n: '03', title: 'Diseñamos', text: 'Definimos el alcance: compra, service, software o una combinación.' },
  { n: '04', title: 'Desarrollamos', text: 'Ejecutamos el trabajo técnico o construimos la solución digital.' },
  { n: '05', title: 'Implementamos', text: 'Puesta en marcha en el consultorio, la clínica o la institución.' },
  { n: '06', title: 'Acompañamos', text: 'Seguimiento, registro técnico y ajustes después de la entrega.' },
];

export const reasons = [
  { title: 'Experiencia técnica', text: 'Trabajo sobre hardware médico y sobre los sistemas que registran ese trabajo.' },
  { title: 'Soluciones a medida', text: 'El alcance se define con la institución. No se fuerza un catálogo cerrado.' },
  { title: 'Equipamiento médico', text: 'Venta, puesta en marcha, preventivo y correctivo, con criterio técnico.' },
  { title: 'Desarrollo tecnológico', text: 'Aplicaciones, sistemas, sitios y automatizaciones construidos para el caso.' },
  { title: 'Innovación', text: 'Ordenar un proceso con una herramienta usable, no con complejidad de más.' },
  { title: 'Acompañamiento', text: 'El trabajo queda documentado y hay seguimiento después de la intervención o la entrega.' },
];

export const QUOTE_URL = `${WHATSAPP_URL}?text=${encodeURIComponent('Hola, quiero solicitar un presupuesto.')}`;

export function solutionConsultUrl(title) {
  const text = `Hola, quiero consultar por: ${title}`;
  return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
}
