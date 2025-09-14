# Integración Backend - Frontend MySubscriptions

## 🚀 Funcionalidades Implementadas

### ✅ Página MySubscriptions
- **Ubicación**: `/my-subscriptions`
- **Navegación**: Disponible en el sidebar con icono de suscripciones
- **Diseño**: Consistente con el resto de la aplicación (MyQueues)

### ✅ Integración con Backend
- **Endpoint**: `http://arreglaya-core-backend.us-east-1.elasticbeanstalk.com/subscribe`
- **Métodos soportados**:
  - `GET /subscribe` - Obtener todas las suscripciones
  - `GET /subscribe/{id}` - Obtener suscripción por ID
  - `POST /subscribe` - Crear nueva suscripción
  - `PUT /subscribe/{id}` - Actualizar suscripción
  - `DELETE /subscribe/{id}` - Eliminar suscripción
  - `GET /subscribe/search?q={query}` - Buscar suscripciones

### ✅ Características de la Tabla
- **Columnas**:
  - Subscription ID (con botón de copiar)
  - Topic (con tooltip del event name)
  - Status (chips de colores)
  - Squad (oculto en mobile)
  - Webhook URL (oculto en mobile/tablet)
  - Created (tiempo relativo)
  - Actions (ver detalles, eliminar)

### ✅ Funcionalidades de Búsqueda
- **Búsqueda por texto**: ID, topic, squad, event name, webhook URL
- **Filtro por status**: ACTIVE, INACTIVE, PENDING, ALL
- **Botón de actualizar**: Para recargar datos del servidor

### ✅ Estados de la Aplicación
- **Loading**: Spinner mientras carga datos
- **Error**: Alert con botón de reintentar
- **Success/Error**: Snackbar para acciones (crear, eliminar, etc.)

## 🔧 Configuración Técnica

### Servicios de API
- **`/src/services/api.ts`**: Configuración base de axios
- **`/src/services/subscriptionsService.ts`**: Servicio específico para suscripciones

### Proxy de Desarrollo
- **Configuración**: `vite.config.ts`
- **URL de desarrollo**: `/api/*` → `http://arreglaya-core-backend.us-east-1.elasticbeanstalk.com/*`
- **URL de producción**: Directa al backend

### Tipos TypeScript
- **`SubscriptionRow`**: Tipo interno de la aplicación
- **`SubscriptionResponse`**: Tipo de respuesta del API
- **`CreateSubscriptionRequest`**: Tipo para crear suscripciones
- **`UpdateSubscriptionRequest`**: Tipo para actualizar suscripciones

## 🎯 Datos del Backend

El endpoint devuelve datos en el formato:
```json
{
  "subscriptionId": "26bb2a37-bd16-41b0-b76a-1b508cb34656",
  "webhookUrl": "https://127.0.0.1:8000",
  "squadName": "notifications-squad",
  "topic": "payments.order.*",
  "eventName": "order*",
  "status": "ACTIVE",
  "createdAt": "2025-09-11T03:15:36.443028Z",
  "message": "Suscripción creada exitosamente"
}
```

## 🚀 Cómo Usar

1. **Navegar a MySubscriptions**: Click en "My Subscriptions" en el sidebar
2. **Buscar suscripciones**: Usar el campo de búsqueda para filtrar por cualquier campo
3. **Filtrar por status**: Usar el dropdown para filtrar por estado
4. **Actualizar datos**: Click en el botón de refresh (🔄)
5. **Ver detalles**: Click en el botón de ojo (👁️) - actualmente muestra snackbar
6. **Eliminar**: Click en el botón de eliminar (🗑️) - elimina y recarga la lista

## 🔍 Próximas Mejoras

- [ ] Modal para ver detalles completos de suscripción
- [ ] Modal para crear/editar suscripciones
- [ ] Confirmación antes de eliminar
- [ ] Paginación para grandes cantidades de datos
- [ ] Exportar datos a CSV/Excel
- [ ] Filtros avanzados (por fecha, squad, etc.)

## 🐛 Troubleshooting

### Error de CORS
- **Solución**: El proxy de Vite maneja esto automáticamente en desarrollo
- **Producción**: Asegurar que el backend tenga CORS configurado

### Error de conexión
- **Verificar**: Que el backend esté funcionando
- **URL**: `http://arreglaya-core-backend.us-east-1.elasticbeanstalk.com/subscribe`

### Datos no se cargan
- **Verificar**: Consola del navegador para errores
- **Network**: Tab de Network en DevTools para ver las requests
