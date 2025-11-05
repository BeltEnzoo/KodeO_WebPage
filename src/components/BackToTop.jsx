import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import styles from './BackToTop.module.css';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={styles.backToTop}
          aria-label="Volver arriba"
        >
          <ArrowUp className={styles.backToTopIcon} />
        </button>
      )}
    </>
  );
};

export default BackToTop;

