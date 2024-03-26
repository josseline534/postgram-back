# Serverless Framework Node Express API on AWS and MOngoDB

Este proyecto tiene como finalidad demostrar como se desarrolla e implementa un servicios API de Node Express y MongoDb que se ejecuta en AWS Lambda utilizando el marco tradicional sin servidor.

## Uso

### Deployment

Instalar dependencias con:

```
npm install
```

y hacer deploy con:

```
npm run deploy
```

Después de ejecutar el despliegue, debería ver un resultado similar a:

```bash
Deploying postgram-back to stage dev (us-east-1)

✔ Service deployed to stack postgram-back-dev (113s)

dashboard: https://app.serverless.com/josscode/apps/postgram-back/postgram-back/dev/us-east-1
endpoint: ANY - https://i5wh3gew3j.execute-api.us-east-1.amazonaws.com
functions:
  api: postgram-back-dev-api (46 MB)
```

_Note_: Después de este despliegue la API es pública y se puede invocar de cualquier lado

### Invocation

Después de una implementación exitosa, puede llamar a la aplicación creada a través de HTTP:


Para verificar el estado de la API puede invocar lo siguiente
```bash
curl https://i5wh3gew3j.execute-api.us-east-1.amazonaws.com/api/v1/health-check
```

Con la siguiente respuesta
```
{
  "status": 200,
  "message": "Health Check!"
}
```

Si intenta invocar una ruta o método que no tiene un controlador configurado con:

```bash
curl https://i5wh3gew3j.execute-api.us-east-1.amazonaws.com/api/v1/nonexistent
```

Recibirá la siguiente respuesta:

```bash
{
  "status": 404,
  "message": "not_found",
  "type": "not_found"
}
```

### Local development

Para levantar el servicio de forma local, ejecute el siguiente comando:

```bash
npm run dev
```

### Módulos

El servicio cuenta con un módulo de seguridad encontrado en el folder `Authenticate`

LLeva su capa de middleware para validar que el token este activo y por medio de las cookies se envía el `refreshToken`
* Este middleware es el encargado de validar que el usuario exista, tenga credenciales correcta y tokens validos.
* También se maneja una collection que almacena los tokens revocados.

Su capa de middleware también le permite validar las entradas que vienen en el body, query y params

El servicio cuenta con un módulo para gestionar los errores
El servicio cuenta con un módulo para gestionar los logs

El servicio cuenta con los siguientes handlers donde se realiza su respectivo CRUD:
`/users`
`/posts`
