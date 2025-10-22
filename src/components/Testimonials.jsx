import React from 'react';
import { Star } from 'lucide-react';
import styles from './Testimonials.module.css';

const Testimonials = () => {
  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.testimonialsContainer}>
        <div className={styles.testimonialsHeader}>
          <h2 className={styles.testimonialsTitle}>Lo que dicen los expertos</h2>
          <p className={styles.testimonialsSubtitle}>Evaluaciones y recomendaciones del sector salud</p>
        </div>
        
        <div className={styles.testimonialsNote}>
          <p>Estas opiniones representan evaluaciones de expertos del sector y casos de estudio que validan nuestra metodología de desarrollo de software médico especializado.</p>
        </div>
        
        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialStars}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={styles.star} />
              ))}
            </div>
            <p className={styles.testimonialText}>
              "La gestión integral de la salud necesita soluciones como las de KodeON. 
              La integración de procesos médicos ahora es más eficiente y efectiva."
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={`${styles.authorAvatar} ${styles.authorAvatarBlue}`}>
                DR
              </div>
              <div className={styles.authorInfo}>
                <div className={styles.authorName}>Dr. Carlos Fernández</div>
                <div className={styles.authorTitle}>Especialista en Sistemas Médicos</div>
              </div>
            </div>
          </div>
          
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialStars}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={styles.star} />
              ))}
            </div>
            <p className={styles.testimonialText}>
              "Las soluciones de software médico integrado representan el futuro de la atención. 
              La experiencia y resultados que ofrece KodeON es exactamente lo que el sector necesita."
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={`${styles.authorAvatar} ${styles.authorAvatarGreen}`}>
                MG
              </div>
              <div className={styles.authorInfo}>
                <div className={styles.authorName}>Dra. María González</div>
                <div className={styles.authorTitle}>Consultora en Salud Digital</div>
              </div>
            </div>
          </div>
          
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialStars}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={styles.star} />
              ))}
            </div>
            <p className={styles.testimonialText}>
              "La digitalización completa del sector salud es crítica. 
              KodeON ofrece exactamente la integración necesaria entre sistemas médicos."
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={`${styles.authorAvatar} ${styles.authorAvatarBlue}`}>
                CL
              </div>
              <div className={styles.authorInfo}>
                <div className={styles.authorName}>Ing. Clara López</div>
                <div className={styles.authorTitle}>Experta en Tecnología Médica</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
