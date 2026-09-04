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
      question: '¿Qué equipos atienden?',
      answer: 'Equipamiento médico de consultorio y hospitalario: diagnóstico, soporte de vida y electrónica biomédica. Evaluamos cada caso y te indicamos el alcance real.',
    },
    {
      question: '¿Hacen preventivo y correctivo?',
      answer: 'Sí. Planificamos preventivos y resolvemos correctivos en campo o taller, con seguimiento hasta el cierre.',
    },
    {
      question: '¿También venden equipos?',
      answer: 'Sí. Asesoramos en la selección, comercializamos equipamiento y acompañamos la puesta en marcha.',
    },
    {
      question: '¿Desarrollan software y sitios web?',
      answer: 'Sí. Incluye trazabilidad de equipamiento médico con software propio, sistemas a medida y sitios profesionales.',
    },
    {
      question: '¿Cómo se inicia un trabajo?',
      answer: 'Nos contactás por WhatsApp o email, relevamos la necesidad y proponemos un plan concreto.',
    },
    {
      question: '¿Atienden fuera de Buenos Aires?',
      answer: 'Sí. Evaluamos intervenciones según criticidad, logística y tipo de equipo. También hay soporte remoto cuando corresponde.',
    },
  ];

  return (
    <section id="faq" className={styles.faqSection}>
      <div className={styles.faqContainer}>
        <div className={styles.faqHeader}>
          <h2 className={styles.faqTitle}>Preguntas frecuentes</h2>
          <p className={styles.faqSubtitle}>
            Dudas habituales sobre equipos, servicio técnico y software.
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
            href="https://wa.me/5492944369647?text=Hola%2C%20tengo%20una%20pregunta%20sobre%20KodeON" 
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

