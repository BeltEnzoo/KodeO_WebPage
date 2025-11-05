import React from 'react';
import styles from './Logo.module.css';
import logoImage from '../img/1.png';

const Logo = ({ className = "", showText = false }) => {
  return (
    <div className={styles.logoContainer}>
      <img 
        src={logoImage} 
        alt="KodeON Logo" 
        className={`${styles.logoImage} ${className}`.trim()}
      />
      {showText && <span className={styles.logoText}>KodeON</span>}
    </div>
  );
};

export default Logo;

