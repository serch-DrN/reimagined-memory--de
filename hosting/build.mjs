import {mkdir, copyFile} from 'node:fs/promises';
await mkdir(new URL('../public/',import.meta.url),{recursive:true});
for(const name of ['index.html','styles.css','app.js']) await copyFile(new URL('../'+name,import.meta.url),new URL('../public/'+name,import.meta.url));
console.log('Archivos públicos preparados. Los respaldos no se incluyen.');
