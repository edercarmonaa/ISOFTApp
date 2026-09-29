# Gasoleo

> Aplicacion movil para que clientes de una estacion de servicio registren tickets de compra, consulten promociones, acumulen puntos y den seguimiento a premios y datos de facturacion.

## El problema

En negocios de combustible o servicios similares, las promociones suelen depender de tickets fisicos, validaciones manuales y consultas separadas sobre puntos, premios o datos de facturacion. Para el cliente, eso puede significar perder el seguimiento de sus compras, no saber cuantos puntos lleva acumulados o tener que pedir ayuda para consultar promociones vigentes.

Este proyecto intenta resolver ese flujo desde una aplicacion movil: el cliente inicia sesion, registra tickets, revisa promociones disponibles, consulta su avance hacia premios y mantiene sus datos de cuenta y facturacion en un solo lugar.

## La solucion

Gasoleo centraliza la experiencia del cliente en una app React Native conectada a una API externa:

1. El usuario crea una cuenta o inicia sesion.
2. La app guarda la sesion localmente y muestra el panel principal.
3. El usuario consulta promociones, puntos acumulados y premios disponibles.
4. El usuario registra tickets manualmente o mediante lectura de QR.
5. La app permite revisar premios obtenidos y actualizar datos de cuenta o facturacion.
6. El cierre de sesion invalida la sesion local y regresa al flujo de autenticacion.

## Funcionalidades principales

- Registro de usuarios con nombre, correo, telefono, direccion y contrasena.
- Inicio de sesion con almacenamiento local del token de sesion.
- Pantalla inicial con promocion activa, puntos acumulados, meta de puntos y premio.
- Consulta de promociones, reglas, vigencia y premios asociados.
- Registro de tickets mediante escaneo QR o captura del identificador del ticket.
- Consulta de premios obtenidos.
- Consulta y actualizacion de datos de cuenta.
- Registro y actualizacion de datos de facturacion: correo, razon social y RFC.
- Navegacion lateral con secciones de inicio, promociones, premios, tickets, facturacion y cuenta.
- Orientacion adaptable para telefono o tablet usando deteccion de dispositivo.

## Que mejora este proyecto

- Reduce la dependencia de consultas manuales para saber cuantos puntos tiene un cliente.
- Permite que el cliente registre tickets desde el telefono.
- Reune promociones, premios y avance de puntos en una sola interfaz.
- Facilita mantener datos de facturacion sin depender de atencion directa.
- Da al usuario visibilidad sobre promociones vigentes y premios disponibles.

## Para quien esta pensado

El proyecto esta pensado para clientes de una estacion de servicio o negocio de combustible que participa en promociones por tickets y puntos. Tambien puede servir como base para negocios que necesitan una app movil sencilla para fidelizacion, registro de compras y consulta de recompensas.

No se detectaron roles administrativos dentro de esta app. El codigo revisado corresponde al flujo del cliente final.

## Capturas

El repositorio no incluye capturas de pantalla del producto. Actualmente solo existen imagenes de marca y recursos graficos en `Image/`.

Cuando existan capturas reales, se recomienda agregarlas en una carpeta como `docs/images/` y documentarlas asi:

```markdown
## Capturas

### Inicio

![Inicio](docs/images/inicio.png)

### Registro de ticket

![Registro de ticket](docs/images/registro-ticket.png)
```

## Tecnologias utilizadas

- React Native 0.65.1: base de la aplicacion movil.
- React 17.0.2: construccion de componentes de interfaz.
- React Navigation: navegacion por stack y drawer.
- React Native Paper: componentes visuales como botones, inputs y snackbars.
- AsyncStorage: almacenamiento local de token, correo de usuario y preferencias.
- react-native-qrcode-scanner y react-native-camera: escaneo de codigos QR para tickets.
- react-native-circular-progress: visualizacion del avance de puntos.
- moment: formateo de fechas de promociones.
- react-native-orientation-locker y react-native-device-info: manejo de orientacion segun telefono o tablet.
- Android Gradle Plugin 4.2.1 y Gradle 6.9: build nativo Android.
- CocoaPods / Podfile: dependencias nativas iOS.
- Jest y react-test-renderer: prueba basica de renderizado.

## Requisitos

El proyecto no fija una version exacta de Node.js en `package.json`. Por compatibilidad con React Native 0.65.1, usa una version de Node compatible con esa generacion de React Native.

Requisitos principales:

- Node.js y npm o Yarn.
- React Native CLI.
- Android Studio con SDK Android:
  - `compileSdkVersion 30`
  - `targetSdkVersion 30`
  - `minSdkVersion 21`
  - Build Tools `30.0.2`
- JDK compatible con Android Gradle Plugin 4.2.1.
- Para iOS: macOS, Xcode, CocoaPods e iOS 11.0 o superior.

## Instalacion

Clona el repositorio e instala dependencias JavaScript:

```bash
git clone URL_DEL_REPOSITORIO
cd ISOFTApp
npm install
```

Tambien puedes usar Yarn si prefieres mantener el flujo basado en `yarn.lock`:

```bash
yarn install
```

Para iOS, instala pods despues de instalar dependencias:

```bash
cd ios
pod install
cd ..
```

## Configuracion

Crea un archivo local `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

Variables documentadas:

```env
API_BASE_URL=https://api.example.com
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id
```

`API_BASE_URL` define la API backend que atiende endpoints como `/api/login`, `/api/register`, `/api/ticket`, `/api/get_promotion`, `/api/point`, `/api/win` y endpoints de facturacion.

Importante: las variables incluidas en una app movil no deben considerarse privadas. No coloques secretos de backend, contrasenas de base de datos, claves privadas ni service accounts dentro de la aplicacion.

### Firebase en Android

El archivo real `android/app/src/google-services.json` no debe subirse al repositorio. Para desarrollo local:

```bash
copy android\app\src\google-services.json.example android\app\src\google-services.json
```

En macOS/Linux:

```bash
cp android/app/src/google-services.json.example android/app/src/google-services.json
```

Luego reemplaza los placeholders con la configuracion de tu propio proyecto Firebase.

## Base de datos

Este repositorio no incluye modelos, migraciones, seeders ni configuracion directa de base de datos. La persistencia parece estar delegada a una API externa consumida por la app.

Para ejecutar la aplicacion completa se necesita un backend compatible con los endpoints usados por las pantallas:

- `/api/login`
- `/api/register`
- `/api/logout`
- `/api/show_user`
- `/api/update_user`
- `/api/get_promotion`
- `/api/point`
- `/api/ticket`
- `/api/win`
- `/api/get_taxes`
- `/api/taxes`
- `/api/update_taxes`

## Ejecutar el proyecto

Inicia Metro:

```bash
npm start
```

Ejecuta Android:

```bash
npm run android
```

Ejecuta iOS:

```bash
npm run ios
```

Los scripts anteriores estan definidos en `package.json`.

## Uso

1. Abre la app.
2. Crea una cuenta desde la pantalla de registro o inicia sesion.
3. Consulta en Inicio la promocion activa, tus puntos y el premio asociado.
4. Revisa la seccion Promociones para ver descripcion, reglas, vigencia y premios.
5. En Tickets, escanea un QR o registra el identificador del ticket.
6. En Premios, consulta los premios obtenidos.
7. En Facturacion, captura o actualiza correo, razon social y RFC.
8. En Cuenta, actualiza tus datos personales.
9. Usa el menu lateral para cerrar sesion.

## Estructura

```text
.
|-- App.js                         # Navegacion principal: splash, autenticacion y drawer
|-- Screen/
|   |-- LoginScreen.js             # Inicio de sesion
|   |-- RegisterScreen.js          # Registro de usuarios
|   |-- SplashScreen.js            # Deteccion inicial y redireccion segun sesion
|   |-- config.js                  # Configuracion base de API
|   |-- DrawerNavigationRoutes.js  # Rutas del menu lateral
|   |-- DrawerScreens/             # Inicio, promociones, premios, tickets, facturacion y cuenta
|   `-- Components/                # Loader, menu lateral y componentes reutilizables
|-- Image/                         # Recursos graficos de la app
|-- android/                       # Proyecto nativo Android
|-- ios/                           # Proyecto nativo iOS
`-- __tests__/                     # Prueba basica de renderizado
```

## Seguridad

- No subas `.env`, `google-services.json`, keystores, claves privadas ni service accounts.
- Usa `.env.example` y `google-services.json.example` como plantillas sin secretos reales.
- Configura `API_BASE_URL` con HTTPS.
- No guardes secretos de backend dentro de la app movil.
- Si encuentras una vulnerabilidad, reportala de forma responsable al mantenedor antes de publicarla.

## Pruebas

Existe una prueba basica en `__tests__/App-test.js` que verifica que `App` renderice sin fallar.

Ejecuta:

```bash
npm test
```

Tambien existe un script de lint:

```bash
npm run lint
```

## Estado del proyecto

El proyecto parece una version inicial funcional en desarrollo. Tiene pantallas principales conectadas a una API, pero no incluye el backend, documentacion de contrato de API ni una suite de pruebas amplia.

## Limitaciones actuales

- El backend no esta incluido en este repositorio.
- No hay documentacion formal del contrato de API.
- No se detecto recuperacion de contrasena.
- La suite de pruebas automatizadas es minima.
- La configuracion de entorno para React Native requiere integracion adicional si se desea cargar `.env` automaticamente en runtime.
- El almacenamiento de sesion usa AsyncStorage; para una app productiva conviene evaluar almacenamiento seguro.
- No hay capturas de pantalla reales del flujo de la app.
- `package.json` mantiene `"private": true`, por lo que el proyecto no esta preparado como paquete publicable de npm.

## Proximas mejoras

- Documentar el contrato del backend con ejemplos de request/response sin datos reales.
- Agregar recuperacion de contrasena.
- Incorporar pruebas de pantallas y flujos criticos.
- Usar almacenamiento seguro para tokens de sesion.
- Agregar capturas reales en `docs/images/`.
- Definir una estrategia clara para cargar variables de entorno en React Native.
- Revisar compatibilidad con versiones actuales de React Native, Android SDK e iOS.

## Contribuciones

1. Haz un fork del repositorio.
2. Crea una rama para tu cambio:

```bash
git checkout -b feature/nueva-funcionalidad
```

3. Realiza cambios pequenos y enfocados.
4. Ejecuta las pruebas y lint:

```bash
npm test
npm run lint
```

5. Abre un Pull Request explicando el problema que resuelve y como validaste el cambio.

No incluyas credenciales, datos personales reales, archivos `.env`, `google-services.json` reales ni keystores.

## Licencia

Este proyecto está publicado bajo licencia MIT. Consulta LICENSE para el texto completo.
