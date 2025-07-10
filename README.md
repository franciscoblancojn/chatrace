# ChatRace

ChatRace es una clase para conectar y operar con la API de Chatrace, permitiendo gestionar usuarios, custom fields y flujos desde Node.js o TypeScript.

## Instalación

```bash
npm install chatrace
```

## Uso Básico

```js
import { ChatRace } from 'chatrace';
//o
const { ChatRace } = require('chatrace');

const chat = new ChatRace({
  URL: 'https://api.chatrace.com',
  TOKEN: 'TU_TOKEN',
  CUSTOM_FIELDS: [
    { id: '1', name: 'campo1', type: 'string' },
    // ...otros campos personalizados
  ],
});
```

## Métodos principales

- onRequest: Realiza una petición genérica a la API.
- getIdCustomFieldApi: Obtiene todos los custom fields desde la API.
- getIdCustomField: Obtiene el id de un custom field por nombre.
- setCustomField: Asigna un valor a un custom field de un usuario.
- onCreateUser: Crea un usuario nuevo.
- onExecuteFlow: Ejecuta un flujo para un usuario.
- getUsersByCustomField: Busca usuarios por valor de custom field.
- getUsersById: Obtiene un usuario por su id.
- onCreateUserIfNotExist: Crea un usuario solo si no existe (por id).

## Ejemplo de uso

```js
await chat.onCreateUser({
  phone: '123456789',
  first_name: 'Juan',
  last_name: 'Pérez',
});
```

## Tipos de configuración

- URL: string. URL base de la API de Chatrace.
- TOKEN: string. Token de acceso.
- CUSTOM_FIELDS: Array de objetos { id, name, type }.

## Licencia
ISC