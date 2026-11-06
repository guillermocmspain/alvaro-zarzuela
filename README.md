# Álvaro Zarzuela — Archivo musical

Prototipo de portfolio editorial inspirado en el ritmo narrativo, las grandes composiciones tipográficas y las transiciones de https://daddyyankee.com/es. Implementación original adaptada a Álvaro: azul cobalto, amarillo, rojo y papel; fotografías reales completas; capítulos de origen, C. Tangana, David Bisbal y archivo audiovisual.

## Desarrollo

Requiere Node.js 22 o posterior. No hay framework, CMS, base de datos ni compilación. El servidor de desarrollo no necesita dependencias.

```sh
npm run dev
```

Abrir http://127.0.0.1:4321. Los archivos publicables están en `dist/` y funcionan en cualquier alojamiento estático. `npm run check` comprueba la sintaxis de JavaScript.

## Editar

- `dist/index.html`: textos, orden de capítulos, fotografías y enlaces a publicaciones. Las URL de Instagram se definen mediante `data-video` y los títulos mediante `data-title`.
- `dist/style.css`: diseño adaptable, colores, tipografía y movimiento reducido.
- `dist/app.js`: revelado de secciones, paralaje ligero, progreso, navegación y reproductor modal.
- `dist/assets/`: imágenes WebP y fuentes locales con sus licencias OFL.

No hay librerías de JavaScript en producción ni peticiones a Instagram hasta abrir un vídeo. El scroll es nativo, sin interceptar la rueda ni el teclado. La animación de scroll se agrupa con requestAnimationFrame; el resto usa CSS e IntersectionObserver. Las fotografías secundarias tienen carga diferida y dimensiones explícitas. Se respeta prefers-reduced-motion. Hay enlace de salto, foco visible, diálogo nativo con Escape, retirada del iframe al cerrar y retorno de foco al activador.

## Fotografías y fidelidad

Se utilizaron diez fotografías distintas aportadas por el usuario; dos de las once capturas eran idénticas. Se preservan el encuadre, las personas, el fondo y las marcas de origen. Sin generación de rostros, recorte o ampliación artificial. Solo conversión a WebP de alta calidad y nitidez leve. Los originales se guardan localmente en `originals/`, fuera del repositorio. Sus resoluciones se documentan en `dist/assets/images.json`.

Para regenerar los derivados: `npm ci`, añadir los PNG originales en `originals/` con los nombres del script y ejecutar `npm run prepare:assets`. Las capturas no equivalen a archivos de alta resolución; reemplazar por originales antes de una presentación que requiera grandes ampliaciones.

## Vídeos y contenido pendiente

Los cuatro enlaces se integran mediante el reproductor de Instagram bajo demanda. El vídeo de C. Tangana está en la tercera diapositiva del carrusel; se muestra una indicación. Instagram controla si una publicación se reproduce dentro del iframe o remite a su aplicación, y puede exigir sesión/cookies o restringir una publicación. Siempre existe enlace directo. Para reproducción totalmente independiente se necesitan los archivos de vídeo autorizados; no se simula vídeo mediante una imagen ni se promete control sobre Instagram.

Las fotos de las tarjetas son portadas editoriales; no se presentan como fotogramas de los reels. Los textos biográficos son provisionales. El año 1998 está explícitamente pendiente de confirmación. No se atribuyen fechas, premios, giras o hitos no confirmados. No se inventó correo de contacto. El prototipo lleva `noindex` hasta validar el contenido.

## Verificación de esta versión

- Inspección visual en escritorio (1280 px) y móvil (390 px), sin desbordamiento horizontal.
- Menú, enlaces entre capítulos, apertura de los cuatro embeds y cierre del diálogo con Escape.
- Eliminación del iframe y devolución del foco tras cerrar.
- Las publicaciones cargaron; algunos reels muestran «Ver en Instagram», por lo que no se certifica reproducción interna universal.
- Comprobación de sintaxis, recursos locales y enlaces internos. Sin puntuaciones de Lighthouse inventadas.

## Publicación

Repositorio GitHub privado para iterar. Sites sirve una vista privada del prototipo; la configuración está en `.openai/hosting.json`. El proyecto puede migrarse a Astro si crece a varias páginas; no es necesario para esta primera página estática.

Las fotografías y marcas pertenecen a sus respectivos titulares. Las licencias OFL de las fuentes están incluidas en `dist/assets/`.
