import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Clock, Mail, MapPin, Phone } from 'lucide-react';

interface ContactFormState {
  nombre: string;
  email: string;
  telefono: string;
  motivo: string;
  showroom: string;
  mensaje: string;
  privacidad: boolean;
}

type ContactErrors = Partial<Record<keyof ContactFormState, string>>;

const INITIAL_FORM: ContactFormState = {
  nombre: '',
  email: '',
  telefono: '',
  motivo: 'Cita privada en showroom',
  showroom: 'Madrid — Ortega y Gasset',
  mensaje: '',
  privacidad: false,
};

export const ContactoPage: React.FC = () => {
  const [form, setForm] = useState<ContactFormState>(INITIAL_FORM);
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormState, boolean>>>({});
  const [errors, setErrors] = useState<ContactErrors>({});
  const [enviado, setEnviado] = useState<ContactFormState | null>(null);

  const validate = (state: ContactFormState): ContactErrors => {
    const next: ContactErrors = {};
    if (state.nombre.trim().length < 3) {
      next.nombre = 'Ingresa tu nombre y apellido (mínimo 3 caracteres).';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(state.email.trim())) {
      next.email = 'Introduce una dirección de correo electrónico válida.';
    }
    const digits = state.telefono.replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15) {
      next.telefono = 'Ingresa un teléfono de contacto válido (8 a 15 dígitos).';
    }
    if (state.mensaje.trim().length < 20) {
      next.mensaje = `Describe tu proyecto o consulta (mínimo 20 caracteres; llevas ${state.mensaje.trim().length}).`;
    }
    if (!state.privacidad) {
      next.privacidad = 'Debes aceptar la política de privacidad para enviar la solicitud.';
    }
    return next;
  };

  const handleChange = <K extends keyof ContactFormState>(field: K, value: ContactFormState[K]) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field]) {
      setErrors(validate(updated));
    }
  };

  const handleBlur = (field: keyof ContactFormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched: Partial<Record<keyof ContactFormState, boolean>> = {
      nombre: true,
      email: true,
      telefono: true,
      motivo: true,
      showroom: true,
      mensaje: true,
      privacidad: true,
    };
    setTouched(allTouched);
    const validation = validate(form);
    setErrors(validation);

    if (Object.keys(validation).length === 0) {
      setEnviado(form);
      setForm(INITIAL_FORM);
      setTouched({});
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <div className="pb-8 border-b border-[#E6E0D6] dark:border-[#262421]">
        <div className="text-xs font-medium tracking-[0.18em] uppercase text-[#8C6D53] dark:text-[#C5A587]">
          Atención Privada y Arquitectos
        </div>
        <h1 className="mt-1.5 font-display text-4xl sm:text-5xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
          Contacto y citas en showroom
        </h1>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        <div className="lg:col-span-7 bg-[#FFFFFF] dark:bg-[#1B1A18] border border-[#E6E0D6] dark:border-[#2A2824] rounded-lg p-6 sm:p-10">
          {enviado ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="py-6 space-y-5"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className="w-6 h-6 text-[#8C6D53] dark:text-[#C5A587] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <div className="font-mono text-xs text-[#8C6D53] dark:text-[#C5A587]">
                    SOLICITUD REGISTRADA
                  </div>
                  <h2 className="mt-1 font-display text-3xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
                    Hemos recibido tu consulta, {enviado.nombre}
                  </h2>
                  <p className="mt-2 text-sm text-[#5C554E] dark:text-[#A8A197] leading-relaxed">
                    Un asesor sénior del showroom <span className="font-medium">{enviado.showroom}</span>{' '}
                    responderá a <span className="font-medium">{enviado.email}</span> en menos de
                    24 horas hábiles respecto a: <em>{enviado.motivo}</em>.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEnviado(null)}
                className="px-5 py-2.5 text-xs font-semibold bg-[#1A1A1A] dark:bg-[#F4F1EC] text-[#F9F8F6] dark:text-[#141413] rounded-md hover:opacity-90 transition-opacity cursor-pointer"
              >
                Enviar otra consulta
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label
                    htmlFor="contacto-nombre"
                    className="block text-xs font-medium text-[#1A1A1A] dark:text-[#E8E2D9]"
                  >
                    Nombre completo *
                  </label>
                  <input
                    id="contacto-nombre"
                    type="text"
                    value={form.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    onBlur={() => handleBlur('nombre')}
                    aria-invalid={Boolean(errors.nombre)}
                    placeholder="Ej. Valeria Mendoza"
                    className={`w-full px-3.5 py-2.5 text-sm bg-[#F9F8F6] dark:bg-[#141413] border rounded-md text-[#1A1A1A] dark:text-[#F4F1EC] focus:outline-none ${
                      errors.nombre
                        ? 'border-[#8E3B46] dark:border-[#E5989B]'
                        : 'border-[#DFD8CE] dark:border-[#2E2C28] focus:border-[#8C6D53]'
                    }`}
                  />
                  {errors.nombre && (
                    <p role="alert" className="flex items-center gap-1.5 text-xs text-[#8E3B46] dark:text-[#E5989B]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.nombre}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contacto-email"
                    className="block text-xs font-medium text-[#1A1A1A] dark:text-[#E8E2D9]"
                  >
                    Correo electrónico *
                  </label>
                  <input
                    id="contacto-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    aria-invalid={Boolean(errors.email)}
                    placeholder="nombre@estudio.com"
                    className={`w-full px-3.5 py-2.5 text-sm bg-[#F9F8F6] dark:bg-[#141413] border rounded-md text-[#1A1A1A] dark:text-[#F4F1EC] focus:outline-none ${
                      errors.email
                        ? 'border-[#8E3B46] dark:border-[#E5989B]'
                        : 'border-[#DFD8CE] dark:border-[#2E2C28] focus:border-[#8C6D53]'
                    }`}
                  />
                  {errors.email && (
                    <p role="alert" className="flex items-center gap-1.5 text-xs text-[#8E3B46] dark:text-[#E5989B]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label
                    htmlFor="contacto-telefono"
                    className="block text-xs font-medium text-[#1A1A1A] dark:text-[#E8E2D9]"
                  >
                    Teléfono de contacto *
                  </label>
                  <input
                    id="contacto-telefono"
                    type="tel"
                    value={form.telefono}
                    onChange={(e) => handleChange('telefono', e.target.value)}
                    onBlur={() => handleBlur('telefono')}
                    aria-invalid={Boolean(errors.telefono)}
                    placeholder="+34 600 123 456"
                    className={`w-full px-3.5 py-2.5 text-sm bg-[#F9F8F6] dark:bg-[#141413] border rounded-md text-[#1A1A1A] dark:text-[#F4F1EC] focus:outline-none ${
                      errors.telefono
                        ? 'border-[#8E3B46] dark:border-[#E5989B]'
                        : 'border-[#DFD8CE] dark:border-[#2E2C28] focus:border-[#8C6D53]'
                    }`}
                  />
                  {errors.telefono && (
                    <p role="alert" className="flex items-center gap-1.5 text-xs text-[#8E3B46] dark:text-[#E5989B]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.telefono}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contacto-motivo"
                    className="block text-xs font-medium text-[#1A1A1A] dark:text-[#E8E2D9]"
                  >
                    Motivo de consulta
                  </label>
                  <select
                    id="contacto-motivo"
                    value={form.motivo}
                    onChange={(e) => handleChange('motivo', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F9F8F6] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md text-[#1A1A1A] dark:text-[#F4F1EC] focus:outline-none focus:border-[#8C6D53]"
                  >
                    <option value="Cita privada en showroom">Cita privada en showroom</option>
                    <option value="Asesoría de interiorismo residencial">Asesoría de interiorismo residencial</option>
                    <option value="Fabricación en medida especial">Fabricación en medida especial</option>
                    <option value="Muestrario de terciopelos y piedras">Muestrario de terciopelos y piedras</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contacto-showroom"
                  className="block text-xs font-medium text-[#1A1A1A] dark:text-[#E8E2D9]"
                >
                  Showroom de preferencia
                </label>
                <select
                  id="contacto-showroom"
                  value={form.showroom}
                  onChange={(e) => handleChange('showroom', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F9F8F6] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md text-[#1A1A1A] dark:text-[#F4F1EC] focus:outline-none focus:border-[#8C6D53]"
                >
                  <option value="Madrid — Ortega y Gasset">Madrid — Ortega y Gasset 48</option>
                  <option value="Milán — Via Brera">Milán — Via Brera 24</option>
                  <option value="Ciudad de México — Polanco">Ciudad de México — Masaryk 310</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="contacto-mensaje"
                    className="block text-xs font-medium text-[#1A1A1A] dark:text-[#E8E2D9]"
                  >
                    Detalles de tu espacio o piezas de interés *
                  </label>
                  <span className="font-mono text-xs text-[#6F675E] dark:text-[#A8A197] tabular-nums">
                    {form.mensaje.trim().length}/20 mín.
                  </span>
                </div>
                <textarea
                  id="contacto-mensaje"
                  rows={4}
                  value={form.mensaje}
                  onChange={(e) => handleChange('mensaje', e.target.value)}
                  onBlur={() => handleBlur('mensaje')}
                  aria-invalid={Boolean(errors.mensaje)}
                  placeholder="Indícanos medidas aproximadas, acabados deseados o fecha preferida para tu visita..."
                  className={`w-full px-3.5 py-2.5 text-sm bg-[#F9F8F6] dark:bg-[#141413] border rounded-md text-[#1A1A1A] dark:text-[#F4F1EC] focus:outline-none ${
                    errors.mensaje
                      ? 'border-[#8E3B46] dark:border-[#E5989B]'
                      : 'border-[#DFD8CE] dark:border-[#2E2C28] focus:border-[#8C6D53]'
                  }`}
                />
                {errors.mensaje && (
                  <p role="alert" className="flex items-center gap-1.5 text-xs text-[#8E3B46] dark:text-[#E5989B]">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.mensaje}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="inline-flex items-start gap-2.5 text-xs text-[#5C554E] dark:text-[#A8A197] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.privacidad}
                    onChange={(e) => handleChange('privacidad', e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#8C6D53] dark:accent-[#C5A587] cursor-pointer"
                  />
                  <span>
                    Acepto el tratamiento confidencial de mis datos para coordinar la asesoría
                    solicitada por Multiforme.
                  </span>
                </label>
                {errors.privacidad && (
                  <p role="alert" className="flex items-center gap-1.5 text-xs text-[#8E3B46] dark:text-[#E5989B]">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.privacidad}</span>
                  </p>
                )}
              </div>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden w-full sm:w-auto px-7 py-3.5 text-sm font-semibold bg-[#1A1A1A] dark:bg-[#F4F1EC] text-[#F9F8F6] dark:text-[#141413] rounded-md transition-colors cursor-pointer"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[#8C6D53] dark:bg-[#C5A587] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
                <span className="relative z-10">Solicitar atención privada</span>
              </motion.button>
            </form>
          )}
        </div>

        <aside className="lg:col-span-5 space-y-6">
          <div className="bg-[#F2EFE9] dark:bg-[#1B1A18] border border-[#E6E0D6] dark:border-[#2A2824] rounded-lg p-6 sm:p-8 space-y-6">
            <h2 className="font-display text-2xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
              Galerías Multiforme
            </h2>

            <div className="space-y-4 text-sm text-[#5C554E] dark:text-[#A8A197]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#8C6D53] dark:text-[#C5A587] shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <div className="font-semibold text-[#1A1A1A] dark:text-[#F4F1EC]">Madrid · Sede Central</div>
                  <div>Calle de José Ortega y Gasset 48, Barrio de Salamanca</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#8C6D53] dark:text-[#C5A587] shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <div className="font-semibold text-[#1A1A1A] dark:text-[#F4F1EC]">Horario de galería</div>
                  <div>Lunes a Sábado · 10:30 – 20:00 h (citas privadas fuera de horario)</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#8C6D53] dark:text-[#C5A587] shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <div className="font-semibold text-[#1A1A1A] dark:text-[#F4F1EC]">Línea directa de atención</div>
                  <div className="font-mono">+34 910 842 190</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#8C6D53] dark:text-[#C5A587] shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <div className="font-semibold text-[#1A1A1A] dark:text-[#F4F1EC]">Estudios de arquitectura</div>
                  <div>trade@multiforme.com</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};
