import { useEffect } from 'react';
import * as CookieConsent from 'vanilla-cookieconsent';

const CookieConsentComponent = () => {
  useEffect(() => {
    CookieConsent.run({
      guiOptions: {
        consentModal: {
          layout: 'box',
          position: 'bottom right',
          equalWeightButtons: true,
          flipButtons: false
        },
        preferencesModal: {
          layout: 'box',
          position: 'right',
          equalWeightButtons: true,
          flipButtons: false
        }
      },
      
      categories: {
        necessary: {
          readOnly: true,
          enabled: true
        },
        analytics: {
          enabled: false,
          autoClear: {
            cookies: [
              {
                name: /^_ga/
              },
              {
                name: '_gid'
              }
            ]
          }
        },
        marketing: {
          enabled: false
        }
      },
      
      language: {
        default: 'es',
        translations: {
          es: {
            consentModal: {
              title: 'Utilizamos cookies',
              description: 'Este sitio web utiliza cookies para mejorar tu experiencia de navegación. Las cookies esenciales son necesarias para el funcionamiento básico del sitio.',
              acceptAllBtn: 'Aceptar todas',
              acceptNecessaryBtn: 'Solo necesarias',
              showPreferencesBtn: 'Gestionar preferencias',
              footer: '<a href="/politica-privacidad">Política de Privacidad</a>\n<a href="/terminos-condiciones">Términos y Condiciones</a>'
            },
            preferencesModal: {
              title: 'Preferencias de Cookies',
              acceptAllBtn: 'Aceptar todas',
              acceptNecessaryBtn: 'Solo necesarias',
              savePreferencesBtn: 'Guardar preferencias',
              closeIconLabel: 'Cerrar modal',
              serviceCounterLabel: 'Servicio|Servicios',
              sections: [
                {
                  title: 'Uso de Cookies',
                  description: 'Utilizamos cookies para asegurar las funcionalidades básicas del sitio web y para mejorar tu experiencia en línea. Puedes elegir para cada categoría si quieres activarla o desactivarla. Para más detalles relativos a las cookies y otros datos sensibles, por favor lee la política de privacidad completa.'
                },
                {
                  title: 'Cookies Estrictamente Necesarias',
                  description: 'Estas cookies son esenciales para el correcto funcionamiento de mi sitio web. Sin estas cookies, el sitio web no funcionaría correctamente.',
                  linkedCategory: 'necessary'
                },
                {
                  title: 'Cookies de Rendimiento y Analíticas',
                  description: 'Estas cookies nos permiten contar las visitas y fuentes de circulación para poder medir y mejorar el desempeño de nuestro sitio. Nos ayudan a saber qué páginas son las más o menos populares, y ver cuántas personas visitan el sitio.',
                  linkedCategory: 'analytics'
                },
                {
                  title: 'Cookies de Publicidad y Marketing',
                  description: 'Estas cookies pueden ser establecidas a través de nuestro sitio por nuestros socios publicitarios. Pueden ser utilizadas por esas empresas para construir un perfil de tus intereses y mostrarte anuncios relevantes en otros sitios.',
                  linkedCategory: 'marketing'
                },
                {
                  title: 'Más información',
                  description: 'Para cualquier consulta en relación con nuestra política de cookies y tus opciones, por favor <a class="cc__link" href="mailto:info@academialidera.es">contáctanos</a>.'
                }
              ]
            }
          }
        }
      }
    });
  }, []);

  return null;
};

export default CookieConsentComponent;