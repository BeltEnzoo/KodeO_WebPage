import { useState } from 'react';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import styles from './presentation.module.css';
import { EMAIL, PHONE_LABEL, WHATSAPP_URL } from './content';

const empty = { name: '', organization: '', email: '', phone: '', message: '' };

function ContactPanel({ compact = false }) {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState('');

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      setStatus('Completá al menos tu nombre y la consulta.');
      return;
    }
    const text = [
      'Hola, soy ' + form.name.trim(),
      form.organization.trim() ? 'de ' + form.organization.trim() : '',
      form.message.trim(),
      form.email.trim() ? 'Email: ' + form.email.trim() : '',
      form.phone.trim() ? 'Teléfono: ' + form.phone.trim() : '',
    ].filter(Boolean).join('. ');

    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    setStatus('Abrimos WhatsApp con tu consulta para que la envíes.');
  }

  return (
    <section id="contacto" className={styles.section}>
      <div className={styles.container}>
        <div className={compact ? styles.contactCompact : styles.contactLayout}>
          <div>
            <p className={styles.eyebrow}>Contacto</p>
            <h2>¿Necesitás una solución tecnológica?</h2>
            <p className={styles.lead}>
              Contanos qué necesitás y analizamos juntos la mejor solución: un equipo, un service o un desarrollo.
            </p>
            <ul className={styles.contactList}>
              <li>
                <MessageCircle aria-hidden="true" />
                <a href={`${WHATSAPP_URL}?text=${encodeURIComponent('Hola, quiero hablar de un proyecto con KodeON')}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp · {PHONE_LABEL}
                </a>
              </li>
              <li>
                <Mail aria-hidden="true" />
                <a href={`mailto:${EMAIL}?subject=Consulta%20KodeON`}>{EMAIL}</a>
              </li>
              <li>
                <MapPin aria-hidden="true" />
                <span>Buenos Aires, Argentina</span>
              </li>
            </ul>
            <div className={styles.socialRow}>
              <a href="https://www.instagram.com/kode.on.soluciones/" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://www.facebook.com/kodeon.soluciones" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://www.linkedin.com/in/enzo-gonzalo-beltr%C3%A1n-a04b39207/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://kodeon.com.ar/" target="_blank" rel="noopener noreferrer">Sitio web</a>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label>
              Nombre
              <input name="name" value={form.name} onChange={update} autoComplete="name" required />
            </label>
            <label>
              Organización
              <input name="organization" value={form.organization} onChange={update} autoComplete="organization" />
            </label>
            <div className={styles.formRow}>
              <label>
                Email
                <input name="email" type="email" value={form.email} onChange={update} autoComplete="email" />
              </label>
              <label>
                Teléfono
                <input name="phone" value={form.phone} onChange={update} autoComplete="tel" />
              </label>
            </div>
            <label>
              Consulta
              <textarea name="message" rows={5} value={form.message} onChange={update} required />
            </label>
            <button type="submit" className={styles.primary}>Solicitar información</button>
            {status ? <p className={styles.formStatus} role="status">{status}</p> : null}
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactPanel;
