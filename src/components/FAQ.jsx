import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './FAQ.module.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "¿Cuánto tiempo toma desarrollar un software médico personalizado?",
      answer: "El tiempo de desarrollo varía según la complejidad del proyecto. Para consultorios pequeños, puede ser de 2-3 meses. Para hospitales o sistemas más complejos, puede tomar de 4-6 meses. Siempre trabajamos con entregas incrementales para que puedas empezar a usar el software lo antes posible."
    },
    {
      question: "¿Qué tipo de soporte técnico ofrecen?",
      answer: "Ofrecemos soporte técnico 24/7 para todos nuestros clientes. Esto incluye: resolución de problemas técnicos, actualizaciones del software, capacitación del personal, mantenimiento preventivo y asistencia remota cuando la necesites."
    },
    {
      question: "¿El software se puede integrar con sistemas existentes?",
      answer: "Sí, nuestros sistemas están diseñados para integrarse con otros sistemas médicos existentes. Podemos conectar con sistemas de facturación, laboratorios, imágenes médicas, y otros softwares que ya estés utilizando en tu institución."
    },
    {
      question: "¿Ofrecen capacitación para el personal?",
      answer: "Absolutamente. Incluimos capacitación completa para todo el personal que utilizará el software. Esto incluye sesiones de entrenamiento presenciales o virtuales, manuales de usuario, videos tutoriales y soporte durante el período de implementación."
    },
    {
      question: "¿Qué garantías ofrecen?",
      answer: "Garantizamos la funcionalidad del software según las especificaciones acordadas. Ofrecemos un período de garantía post-implementación, corrección de bugs sin costo adicional, y mantenimiento continuo. También garantizamos respuesta en 24 horas para consultas técnicas."
    },
    {
      question: "¿El software es compatible con dispositivos móviles?",
      answer: "Sí, todos nuestros sistemas son responsive y funcionan en tablets y smartphones. También desarrollamos apps móviles nativas cuando es necesario para acceso desde cualquier dispositivo, permitiendo que los médicos gestionen pacientes desde cualquier lugar."
    },
    {
      question: "¿Cómo se aseguran la privacidad de los datos médicos?",
      answer: "Cumplimos con todas las normativas de protección de datos médicos. Implementamos encriptación de extremo a extremo, backups automáticos, acceso controlado por roles y permisos, y auditorías regulares. Todos los datos están protegidos según estándares internacionales de seguridad médica."
    },
    {
      question: "¿Puedo ver una demostración antes de contratar?",
      answer: "Por supuesto. Ofrecemos demostraciones personalizadas gratuitas donde te mostramos todas las funcionalidades adaptadas a tu tipo de institución. Puedes agendar una demo por WhatsApp o email y nuestro equipo te contactará para coordinar la mejor fecha."
    }
  ];

  return (
    <section id="faq" className={styles.faqSection}>
      <div className={styles.faqContainer}>
        <div className={styles.faqHeader}>
          <h2 className={styles.faqTitle}>Preguntas Frecuentes</h2>
          <p className={styles.faqSubtitle}>
            Resolvemos las dudas más comunes sobre nuestros servicios de desarrollo de software médico
          </p>
        </div>
        
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <button
                className={`${styles.faqQuestion} ${openIndex === index ? styles.faqQuestionOpen : ''}`}
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span>{faq.question}</span>
                <ChevronDown 
                  className={`${styles.faqIcon} ${openIndex === index ? styles.faqIconOpen : ''}`}
                />
              </button>
              {openIndex === index && (
                <div className={styles.faqAnswer}>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className={styles.faqCta}>
          <p>¿Tienes otra pregunta?</p>
          <a 
            href="https://wa.me/2281598338?text=Hola%2C%20tengo%20una%20pregunta%20sobre%20KodeON" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.faqCtaButton}
          >
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

