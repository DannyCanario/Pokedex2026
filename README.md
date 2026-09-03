## Pokédex 2026

Pokédex web interactiva construida con React y Vite. Consulta el catálogo de Pokémon, filtra registros por nombre o número de Pokédex y abre una ficha detallada con estadísticas, habilidades, movimientos, sprites y descripción. La interfaz utiliza una estética de consola táctica con soporte bilingüe en español e inglés.

## Características

- Catálogo completo obtenido desde [PokéAPI](https://pokeapi.co/).
- Búsqueda en tiempo real por nombre o número de identificación.
- Ficha modal con información detallada del Pokémon seleccionado.
- Visualización de estadísticas, tipos, habilidades, movimientos y sprites.
- Descripciones localizadas en español e inglés cuando PokéAPI las proporciona.
- Caché en memoria para evitar peticiones repetidas durante la sesión.
- Diseño responsive para escritorio y dispositivos móviles.
- Estados visuales de carga, búsqueda sin resultados y selección de idioma.

## Tecnologías

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- [PokéAPI](https://pokeapi.co/)

## Requisitos

- Node.js 18 o superior.
- npm 9 o superior.
- Acceso a Internet para consultar PokéAPI y cargar las imágenes de los sprites.

## Instalación

```bash
git clone https://github.com/DannyCanario/Pokedex2026.git
cd Pokedex2026
npm install
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Vite mostrará en la terminal la URL local, normalmente `http://localhost:5173`.

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia Vite en modo desarrollo con recarga en caliente. |
| `npm run build` | Genera la compilación optimizada para producción. |
| `npm run preview` | Sirve localmente la compilación de producción. |

## Estructura del proyecto

```text
src/
├── components/       Componentes de la interfaz y ventanas de detalle
├── context/          Contexto global de idioma
├── services/         Cliente y caché de peticiones a PokéAPI
├── assets/           Recursos estáticos de la aplicación
├── App.jsx           Composición principal y búsqueda del catálogo
├── App.css           Estilos específicos de la aplicación
└── index.css         Estilos globales y utilidades visuales
```

## Datos y API

La aplicación consume el endpoint público `https://pokeapi.co/api/v2` y obtiene inicialmente hasta 1.025 registros. Las imágenes oficiales se cargan desde el repositorio de sprites de PokeAPI en GitHub.

No se necesita una variable de entorno para ejecutar el proyecto. El funcionamiento depende de que el navegador pueda realizar peticiones a los servicios públicos mencionados.

## Compilación para producción

```bash
npm run build
npm run preview
```

Los archivos generados se guardan en `dist/`.

## Contribuir

1. Crea una rama para tu cambio.
2. Instala las dependencias con `npm install`.
3. Ejecuta la aplicación con `npm run dev`.
4. Comprueba la compilación con `npm run build`.
5. Abre un pull request describiendo el cambio y las pruebas realizadas.

## Licencia

Este proyecto se distribuye bajo la licencia incluida en [LICENSE](LICENSE).

Pokémon y los nombres relacionados son marcas de Nintendo, Game Freak y The Pokémon Company. Este proyecto no está afiliado ni respaldado oficialmente por sus propietarios.
