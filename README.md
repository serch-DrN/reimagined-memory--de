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

## Publicación en internet

Esta versión es un sitio estático: puedes publicarla gratis en GitHub Pages.

1. Sube los archivos del proyecto a la rama `main` de tu repositorio.
2. En GitHub, entra en **Settings → Pages**.
3. Selecciona **Deploy from a branch**, rama `main` y carpeta `/ (root)`, y guarda.
4. Espera a que GitHub muestre la dirección del sitio y ábrela.

GitHub Pages debe estar disponible para la visibilidad y el plan del repositorio. No se ha publicado automáticamente. El sitio y el código serán accesibles según la configuración de GitHub, pero tus datos personales permanecen en tu navegador. Al pasar de la versión local a la publicada, exporta e importa un respaldo porque son ubicaciones diferentes. La publicación no añade cuentas ni sincronización.

## Detalles técnicos

HTML, CSS y JavaScript sin dependencias de producción. `app.js` usa `localStorage` con la clave `camino-neurocirugia-v1` y respaldo JSON con versión 1. No hay servidor de datos ni solicitudes a APIs. No se incluyen afirmaciones sobre requisitos o actividad hospitalaria. El diseño se adapta a celular y computadora.

Comprobación de sintaxis: `node --check app.js`. Para una prueba funcional, abre el sitio, crea y edita una tarea, recarga, exporta e importa el respaldo, y comprueba las demás secciones.
