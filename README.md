# Camino a Neurocirugía

Aplicación personal en español para organizar la preparación para la residencia. Funciona sin cuentas, suscripciones ni conexión a servicios externos. No contiene datos médicos de pacientes.

## Cómo abrirla (para principiantes)

1. Descarga este repositorio con **Code → Download ZIP** en GitHub y descomprime el archivo.
2. Dentro de la carpeta, haz doble clic en **index.html**. Se abrirá en tu navegador. Conserva la carpeta completa: también necesita `styles.css` y `app.js`.
3. Utiliza siempre el mismo navegador y ubicación para volver a tus datos. Algunos navegadores limitan el almacenamiento al abrir archivos directamente; en ese caso usa el servidor local explicado abajo.

Si tienes Python instalado, abre una terminal en la carpeta del proyecto y ejecuta:

```sh
python3 -m http.server 8000
```

En Windows también puedes usar `py -m http.server 8000`. Abre `http://localhost:8000` en tu navegador. Deja la terminal abierta mientras lo usas y presiona Ctrl+C para detener el servidor. No necesitas instalar paquetes ni compilar nada.

## Cómo utilizarla

- **Panel principal:** muestra tareas pendientes, completadas, proyectos activos y vencimientos. Selecciona hasta tres prioridades entre tareas sin fecha o con vencimiento hasta dentro de siete días, incluidas las vencidas; ordena primero por prioridad y después por fecha. Las tareas posteriores siguen visibles entre las pendientes.
- **Sedes:** pulsa **Editar** en cada fila para actualizar lo que confirmes. Incluye IMSS HGZ 45 como primera opción de R1 de Cirugía General, IMSS HGZ 110 como segunda, y CMNO y Hospital Civil Nuevo como opciones de Neurocirugía. Todos los datos no aportados están como **Por confirmar**. Puedes añadir y eliminar sedes.
- **Preparación:** crea tareas y selecciona habilidades quirúrgicas, inglés médico, investigación, CV o entrevista. Puedes filtrar por área. Edita el título, la fecha opcional, la prioridad y el estado: pendiente, en curso o completada. Usa **Editar** para marcar avances y **Eliminar** para borrar una tarea con confirmación.
- **Investigación:** registra proyectos, su siguiente acción, estado, prioridad y fecha límite. Usa tareas del área Investigación para dividir un proyecto en pasos concretos.
- **Revisión semanal:** registra la fecha, qué avanzaste, obstáculos y acciones para la próxima semana. Puedes editar o eliminar cada revisión.

## Guardado y respaldos

Los cambios se guardan automáticamente en el almacenamiento del navegador. No se sincronizan entre dispositivos. Cambiar de navegador, dirección, puerto o dispositivo puede mostrar una lista distinta. Borrar los datos del navegador elimina el guardado; el modo privado no es adecuado para conservarlo.

Pulsa **Exportar respaldo** para descargar un archivo JSON. Hazlo cada semana y antes de cambiar de equipo. Para recuperarlo, pulsa **Importar**, elige el archivo y confirma. **Importar reemplaza todo el contenido actual**, no lo combina: exporta antes para conservarlo. Un archivo inválido se rechaza sin modificar tus datos. El respaldo contiene tu información personal: guárdalo en un lugar privado.

## Publicación privada en internet

La opción preparada para acceso exclusivo es **Cloudflare Workers + Cloudflare Access**, con autorización en el servidor para todos los archivos. No uses GitHub Pages para este objetivo: la versión normal es pública.

**Antes de cambiar de alojamiento, pulsa Exportar respaldo en la dirección donde usas la aplicación.** Los datos no se trasladan automáticamente a otra dirección.

Sigue [la guía de acceso privado](PRIVACIDAD.md), que explica las cuentas necesarias, la configuración, la desactivación de Pages, la importación del respaldo y cómo probar el rechazo de visitantes. El código está preparado, pero la publicación privada requiere configurar tu cuenta Cloudflare y tu proveedor de identidad. No se considera activa ni verificada hasta completar las pruebas en el alojamiento real.

## Detalles técnicos

La interfaz usa HTML, CSS y JavaScript sin dependencias. El alojamiento privado añade un Worker que usa `jose` para verificar identidad; Wrangler es la herramienta de despliegue. `app.js` usa `localStorage` con la clave `camino-neurocirugia-v1` y respaldo JSON con versión 1. No hay servidor de datos ni solicitudes a APIs. No se incluyen afirmaciones sobre requisitos o actividad hospitalaria. El diseño se adapta a celular y computadora.

Comprobación de sintaxis: `node --check app.js`. Para una prueba funcional, abre el sitio, crea y edita una tarea, recarga, exporta e importa el respaldo, y comprueba las demás secciones.
