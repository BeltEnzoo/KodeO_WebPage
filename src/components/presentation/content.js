export const WHATSAPP_URL = 'https://wa.me/5492944369647';
export const EMAIL = 'on.kode.soluciones@gmail.com';
export const PHONE_LABEL = '+54 9 2944 36-9647';

export const equipmentServices = [
  {
    title: 'Venta de equipamiento',
    text: 'Asesoramiento y comercialización según la necesidad de la institución, con puesta en marcha incluida.',
  },
  {
    title: 'Servicio técnico',
    text: 'Diagnóstico y reparación de hardware médico, en campo o en taller, con seguimiento hasta el cierre.',
  },
  {
    title: 'Mantenimiento preventivo',
    text: 'Revisiones planificadas para reducir fallas y alargar la vida útil del equipo.',
  },
  {
    title: 'Mantenimiento correctivo',
    text: 'Intervención técnica cuando el equipo falla. Cada trabajo queda documentado.',
  },
  {
    title: 'Gestión y monitoreo',
    text: 'Software propio para registrar intervenciones, estado operativo e historial del equipamiento.',
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
    text: 'Desarrollo de aplicaciones para dispositivos Android, según el uso real del proyecto.',
  },
  {
    title: 'Aplicaciones web',
    text: 'Sistemas accesibles desde el navegador, adaptados a la organización que los va a usar.',
  },
  {
    title: 'Páginas web',
    text: 'Sitios profesionales para instituciones, consultorios y empresas.',
  },
  {
    title: 'Sistemas a medida',
    text: 'Sistemas de gestión para procesos concretos de una clínica, un negocio o una institución.',
  },
  {
    title: 'Automatizaciones',
    text: 'Digitalización de tareas repetitivas para que la información no dependa de pasos sueltos.',
  },
  {
    title: 'Integraciones',
    text: 'Conexión entre sistemas y herramientas cuando el proyecto lo necesita.',
  },
];

export const ownProducts = [
  {
    id: 'gestion-equipos',
    title: 'Gestión de equipamiento médico',
    text: 'Sistema propio para organizar la información del equipamiento: intervenciones, estado operativo e historial.',
    features: ['Registro de intervenciones', 'Estado operativo', 'Historial del equipo'],
  },
  {
    id: 'consultorios',
    title: 'Gestión de consultorios privados',
    text: 'KodeON Consultorio ordena la administración de un consultorio privado.',
    features: ['Turnos', 'Historias clínicas', 'Administración'],
  },
  {
    id: 'turnos',
    title: 'Sistema de turnos por llamado',
    text: 'Solución orientada a la gestión de turnos mediante llamados.',
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

export function solutionConsultUrl(title) {
  const text = `Hola, quiero consultar por: ${title}`;
  return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
}
