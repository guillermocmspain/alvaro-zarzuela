# Álvaro Zarzuela — Archivo musical

Prototipo de portfolio editorial inspirado en el ritmo narrativo, las grandes composiciones tipográficas y las transiciones de https://daddyyankee.com/es. Implementación original adaptada a Álvaro: negro, marfil, amarillo suave, rojo y papel. Capítulos de origen, formación, C. Tangana, David Bisbal y archivo audiovisual.

## Versión 2: entrada y narrativa de scroll

- Entrada a pantalla completa con carga real de imagen/fuentes y botón INGRESAR. No activa sonido. Escape también permite acceder; un fallo de recursos nunca bloquea permanentemente la entrada.
- Silueta de Álvaro andando delante de su nombre. Una máscara SVG de contorno deja ver los píxeles de la fotografía original; no se regeneraron su rostro, su ropa ni el instrumento. La foto completa se conserva en otras composiciones.
- La portada permanece fija mientras se contrae, las dos líneas de su nombre se separan y aparece la historia sobre fondo marfil.
- Cronología fijada con hitos confirmados por el usuario: escuela de música de Cuéllar (2005), Musikene (2017), máster en Holanda (2021), inicio con C. Tangana (2021), inicio con David Bisbal (2022).
- Cambios de capítulo sincronizados con el scroll: barrido vertical, apertura circular y apertura lateral; letras en sentidos opuestos, imágenes que pasan de monocromo a color y máscaras que se abren. Avanzan y retroceden con el desplazamiento nativo.
- Control MOVIMIENTO ON/OFF y respeto a prefers-reduced-motion. En modo reducido, las escenas decorativas se omiten y la cronología se presenta como contenido estático.
- Cabecera «MÚSICA, ESCENARIO Y VIDA» y eliminación de los tres rótulos pequeños sobre el nombre.

## Desarrollo

Requiere Node.js 22 o posterior. No hay framework, CMS, base de datos ni compilación. El servidor de desarrollo no necesita dependencias.

```sh
npm run dev
```

Abrir http://127.0.0.1:4321. Los archivos publicables están en `dist/` y funcionan en cualquier alojamiento estático. `npm run check` comprueba la sintaxis de JavaScript.

## Editar

- `dist/index.html`: textos, orden de capítulos, fotografías y enlaces a publicaciones. Las URL de Instagram se definen mediante `data-video` y los títulos mediante `data-title`.
- `dist/style.css`: diseño adaptable, colores, tipografía y movimiento reducido.
- `dist/motion.css`: entrada, máscaras, escenas fijadas, cronología y adaptación del movimiento.
- `dist/app.js`: revelado de secciones, paralaje ligero, progreso, navegación y reproductor modal.
- `dist/assets/`: imágenes WebP y fuentes locales con sus licencias OFL.

No hay librerías de JavaScript en producción ni peticiones a Instagram hasta abrir un vídeo. El scroll es nativo, sin interceptar la rueda ni el teclado. La animación de scroll se agrupa con requestAnimationFrame; el resto usa CSS e IntersectionObserver. Las fotografías secundarias tienen carga diferida y dimensiones explícitas. Se respeta prefers-reduced-motion. Hay enlace de salto, foco visible, diálogo nativo con Escape, retirada del iframe al cerrar y retorno de foco al activador.

## Fotografías y fidelidad

La primera selección contiene diez fotografías distintas; dos de las once capturas iniciales eran idénticas. La segunda versión añade la nueva foto de Álvaro andando. Las galerías conservan las escenas completas y sus marcas de origen. La entrada usa una máscara SVG y las transiciones usan máscaras y tratamientos de color CSS, como pidió el usuario, sin generar rostros o reconstruir fotografías. Los originales se guardan localmente en `originals/`, fuera del repositorio. La imagen de entrada tiene 397 × 573 píxeles: los efectos no añaden detalle inexistente.

Para regenerar los derivados: `npm ci`, añadir los PNG originales en `originals/` con los nombres del script y ejecutar `npm run prepare:assets`. Las capturas no equivalen a archivos de alta resolución; reemplazar por originales antes de una presentación que requiera grandes ampliaciones.

## Vídeos y contenido pendiente

Los cuatro enlaces se integran mediante el reproductor de Instagram bajo demanda. El vídeo de C. Tangana está en la tercera diapositiva del carrusel; se muestra una indicación. Instagram controla si una publicación se reproduce dentro del iframe o remite a su aplicación, y puede exigir sesión/cookies o restringir una publicación. Siempre existe enlace directo. Para reproducción totalmente independiente se necesitan los archivos de vídeo autorizados; no se simula vídeo mediante una imagen ni se promete control sobre Instagram.

Las fotos de las tarjetas son portadas editoriales; no se presentan como fotogramas de los reels. Los retratos de la cronología son imágenes de archivo, no fotos fechadas en los años representados. Los hitos de 2005, 2017, 2021 y 2022 proceden del usuario. El año 1998 sigue explícitamente pendiente de confirmación. No se atribuyen premios o giras no confirmados. No se inventó correo de contacto. El prototipo lleva `noindex` hasta validar el contenido.

## Verificación de esta versión

- Inspección visual en escritorio (1280 px) y móvil (390 px), sin desbordamiento horizontal.
- Menú, enlaces entre capítulos, apertura de los cuatro embeds y cierre del diálogo con Escape.
- Eliminación del iframe y devolución del foco tras cerrar.
- Las publicaciones cargaron; algunos reels muestran «Ver en Instagram», por lo que no se certifica reproducción interna universal.
- Comprobación de sintaxis, recursos locales y enlaces internos. Sin puntuaciones de Lighthouse inventadas.

## Publicación

Web pública: https://guillermocmspain.github.io/alvaro-zarzuela/

Repositorio GitHub público. Cada push a `main` valida y publica `dist/` mediante `.github/workflows/pages.yml`. La web no necesita inicio de sesión. La configuración de la vista privada anterior en Sites se conserva en `.openai/hosting.json`. El proyecto puede migrarse a Astro si crece a varias páginas; no es necesario para esta primera página estática.

Las fotografías y marcas pertenecen a sus respectivos titulares. Las licencias OFL de las fuentes están incluidas en `dist/assets/`.
