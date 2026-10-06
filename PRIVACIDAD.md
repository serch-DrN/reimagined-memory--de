# Acceso privado: guía paso a paso

## Qué se revisó y qué sigue pendiente

La versión anterior se publicó mediante GitHub Pages desde `main`. La última pantalla compartida mostraba la selección de publicación; desde este entorno el acceso a la API de GitHub y al sitio de Pages devuelve un bloqueo de red 403. Por eso no se pudo confirmar su estado actual ni desactivarlo remotamente. El sitio anterior no contiene un control de acceso.

Los archivos `index.html`, `app.js` y `styles.css` no incluyen tus tareas personales. Los cambios se guardan en `localStorage`, clave `camino-neurocirugia-v1`, dentro de tu navegador y para esa dirección web. No hay cuenta, servidor de datos, sincronización ni cifrado adicional del almacenamiento local. Alguien con acceso a tu perfil del navegador podría verlos. Los respaldos JSON contienen tus datos y tampoco están cifrados.

GitHub Pages privado requiere una modalidad compatible de GitHub Enterprise; hacer privado el repositorio con un plan gratuito no convierte Pages en una aplicación protegida para tu cuenta. Se eligió Cloudflare Workers con Cloudflare Access. El servidor verifica un token firmado por Access, emisor, aplicación, vencimiento y correo autorizado antes de servir **todos** los archivos. Sin configuración válida devuelve 403. No hay contraseña en el código ni un acceso validado solo en JavaScript del navegador.

**El nuevo alojamiento todavía no está activado.** Las pruebas locales verifican el código, no demuestran que tu política de Cloudflare esté desplegada. Necesitas una cuenta Cloudflare y conectar tu cuenta de acceso. Los planes gratuitos de Workers y Zero Trust suelen bastar para una persona; selecciona Free y confirma los límites y condiciones vigentes en el panel, sin contratar un plan de pago. Puedes utilizar la dirección workers.dev sin comprar dominio.

## 1. Conserva tus datos antes de tocar la publicación

1. Abre la aplicación antigua, en el mismo navegador y perfil donde registraste tus datos.
2. Pulsa **Exportar respaldo**. Se descarga `camino-neurocirugia-FECHA.json`.
3. Guarda dos copias en lugares privados. No subas ese archivo a GitHub.
4. No borres los datos del navegador. No cierres definitivamente el acceso antiguo hasta tener el respaldo.

Un respaldo vacío significa que abriste otro navegador o una dirección distinta; vuelve al que usabas. Esta actualización no cambia la clave de guardado ni borra los datos. Yo no puedo extraer el almacenamiento de tu laptop desde este chat.

## 2. Desactiva la copia pública tras obtener tu respaldo

En tu repositorio GitHub abre **Settings → Pages**. En **Branch** selecciona **None** y guarda; si aparece **Unpublish site**, úsalo. Espera a que la dirección antigua deje de entregar la aplicación. Esto puede hacerse antes de preparar Cloudflare para evitar mantener una copia pública mientras configuras el acceso.

Opcionalmente cambia el repositorio a privado en **Settings → General → Danger Zone → Change visibility**. Hazlo antes de conectar GitHub a Cloudflare y concede acceso solo a este repositorio. Hacer privado el código es diferente de proteger el sitio. No subas respaldos ni credenciales al repositorio.

## 3. Crea el alojamiento en Cloudflare

1. Crea una cuenta en https://dash.cloudflare.com/ y verifica tu correo.
2. En **Workers & Pages**, crea un **Worker**, conecta GitHub y selecciona `serch-DrN/reimagined-memory--de`. Elige Workers, no Pages.
3. Rama: `main`. Directorio: raíz del repositorio. Comando de compilación: `npm run build`. Comando de despliegue: `npm run deploy`. La instalación debe usar `npm ci` cuando se pueda configurar.
4. Despliega. Anota la dirección principal `https://camino-neurocirugia-privado.TU-SUBDOMINIO.workers.dev`. Al principio debe responder **403**: es intencional, porque aún no hay identidad configurada.

El nombre del Worker debe coincidir con `camino-neurocirugia-privado` de `wrangler.jsonc`. Si el panel pide cambiarlo, actualiza también ese campo. El archivo desactiva las direcciones de vista previa y obliga a pasar primero por el servidor de autorización. No crees otro sitio estático que publique `public/` sin este Worker.

## 4. Conecta tu cuenta de acceso

Usaremos tu cuenta de **Google**. Tu correo autorizado se introduce en los paneles privados de Cloudflare; no se añade al repositorio público.

1. En Cloudflare abre **Zero Trust**, selecciona el plan gratuito y elige el nombre de tu equipo.
2. En **Settings → Authentication → Login methods** (o **Integrations → Identity providers**, según el panel), selecciona **Google**. Anota la dirección de devolución que muestra Cloudflare, normalmente `https://TU-EQUIPO.cloudflareaccess.com/cdn-cgi/access/callback`.
3. En https://console.cloud.google.com/ crea un proyecto llamado Camino a Neurocirugía. Abre **Google Auth Platform** (en algunos paneles, **APIs & Services → OAuth consent screen**).
4. Configura el nombre de la aplicación y el correo de contacto. Como usas Gmail personal, selecciona usuarios **External**. Puedes dejarlo en **Testing** y añadir únicamente tu correo como **Test user**. No necesitas publicar una aplicación para otros usuarios ni contratar servicios de Google Cloud.
5. En **Clients → Create client** (o **Credentials → Create credentials → OAuth client ID**), elige **Web application**. En **Authorized redirect URIs**, pega la dirección exacta de devolución indicada por Cloudflare. Guarda.
6. Copia el **Client ID** y **Client Secret** a los campos de Google dentro de Cloudflare. Introduce el secreto únicamente allí: nunca en el chat, el código o un respaldo. Guarda y prueba la conexión.
7. En la aplicación de Access selecciona solo Google como método de inicio de sesión. Desactiva One-time PIN para esta aplicación: el objetivo es entrar con tu cuenta de Google.

La pantalla de consentimiento de Google puede aparecer durante la primera entrada, porque esta integración fue creada por ti y está en modo de prueba. Los nombres de menús pueden cambiar. Si aparece un error, comparte el texto o una captura ocultando Client Secret y otros secretos. No hace falta proporcionar tu contraseña a Camino a Neurocirugía.

## 5. Autoriza únicamente tu cuenta

1. En el Worker, **Settings → Domains & Routes**, busca la opción de habilitar **Cloudflare Access** para su dirección `workers.dev`. Usa la integración para Workers; no basta con escribir una dirección workers.dev arbitraria en una aplicación de dominio propio.
2. Abre la aplicación de Access generada, normalmente desde **Zero Trust → Access → Applications**. Comprueba que cubra toda la dirección del Worker y todas las rutas.
3. Sustituye cualquier política amplia por una sola política **Allow**, con **Include → Emails → TU CORREO EXACTO**. No uses Everyone, dominios de correo completos, Bypass ni Service Auth. Para permitir solo tu proveedor, selecciona únicamente ese método de inicio de sesión y añade **Require → Login methods → tu proveedor** si el panel lo ofrece.
4. Configura una sesión corta, por ejemplo una hora. Copia el **Application Audience (AUD)** de esta aplicación, no de otra.
5. En el Worker, **Settings → Variables and Secrets**, añade como secretos de configuración estos tres valores y guarda/despliega:
   - `ACCESS_ISSUER`: `https://TU-EQUIPO.cloudflareaccess.com`, sin barra final.
   - `ACCESS_AUD`: el AUD copiado de Access.
   - `OWNER_EMAIL`: exactamente el correo autorizado en la política.

Estos nombres se leen solo en el servidor. No aparecen en `app.js`. Se mantienen fuera del repositorio y no son contraseñas. Las variables no están definidas con valores vacíos en Wrangler para no sobrescribir tu configuración. No habilites rutas alternativas o dominios adicionales sin protegerlos también con Access.

Si no aparece la opción de Access para workers.dev, no publiques una copia abierta como alternativa: envía una captura para configurar la ruta compatible o un dominio propio protegido. No contrates un dominio antes de comprobar esa opción.

## 6. Comprueba que nadie más puede entrar

Antes de importar información personal:

1. Abre la nueva dirección en una ventana privada/incógnito. Debe mostrar el acceso de Cloudflare, **no el panel ni tus secciones**.
2. Sin iniciar sesión, prueba también la dirección seguida de `/app.js`, `/styles.css` y `/index.html`. No debe entregar esos archivos: debe pedir acceso o responder 403.
3. Inicia sesión con tu cuenta autorizada. Debe abrir la aplicación.
4. En otra ventana privada o dispositivo, intenta iniciar sesión con otra cuenta. Debe denegar el acceso. Una prueba sin sesión no sustituye esta comprobación con otra identidad.
5. Prueba cualquier dirección adicional que aparezca en el panel. Las vistas previas deben estar desactivadas; la dirección antigua de GitHub Pages debe dejar de entregar la aplicación.

Para cerrar la sesión de Access, visita `https://TU-DIRECCION-WORKER/cdn-cgi/access/logout` y cierra las pestañas; la cuenta del proveedor puede seguir iniciada en el navegador. Usa incógnito u otro perfil para comprobar una identidad diferente. No entregues tokens ni cookies a otras personas.

## 7. Recupera tus datos

Ya dentro de la dirección privada, pulsa **Importar**, elige tu respaldo y confirma. Comprueba las tareas, sedes, proyectos y revisiones. Exporta un nuevo respaldo desde esta versión.

Tus datos siguen guardándose solo en ese navegador, separados de los de la dirección antigua. Entrar con la misma cuenta desde el celular no sincroniza datos automáticamente: deberás importar el respaldo allí. El acceso privado no añade una base de datos ni borra la copia local antigua.

## Validación técnica reproducible

```sh
npm ci
npm test
npm run build
npx wrangler deploy --dry-run
```

Las pruebas firman tokens RSA de prueba y cubren falta de sesión en todas las rutas, cuenta autorizada, cuenta distinta, firma falsa, vencimiento, emisor/audiencia incorrectos, configuración ausente y cabeceras manipuladas. Las claves de prueba no se usan en producción; el Worker consulta las claves públicas de tu equipo Cloudflare y nunca confía en una cabecera sin verificar su firma. Una sesión es un token de acceso: utiliza HTTPS y no compartas cookies.
