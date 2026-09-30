import styles from './presentation.module.css';

function SystemVisual() {
  return (
    <div className={styles.visual} aria-hidden="true">
      <div className={styles.visualFrame}>
        <div className={styles.visualBar}>
          <span />
          <span />
          <span />
          <strong>KodeON · operación</strong>
        </div>
        <div className={styles.visualBody}>
          <article>
            <p>Equipamiento</p>
            <strong>Estado e historial</strong>
            <div className={styles.bars}><i /><i /><i /></div>
          </article>
          <article>
            <p>Turnos</p>
            <strong>Llamado en curso</strong>
            <div className={styles.queue}>
              <span /><span /><span />
            </div>
          </article>
          <article className={styles.visualWide}>
            <p>Proceso</p>
            <strong>De la necesidad al sistema</strong>
            <ol>
              <li>Entender</li>
              <li>Diseñar</li>
              <li>Implementar</li>
            </ol>
          </article>
        </div>
        <div className={styles.nodes}>
          <span>Hospital</span>
          <span>Consultorio</span>
          <span>Institución</span>
        </div>
      </div>
    </div>
  );
}

export default SystemVisual;
