# Geolocalización en Tiempo Real - Alliance Campus Map

## Descripción General

El sistema de geolocalización implementado en Alliance Campus Map está diseñado específicamente para una aplicación mobile-first tipo "Waze" de campus empresarial, donde la ubicación precisa del usuario es **fundamental** para la experiencia de navegación.

## Características Principales

### 1. **Servicio Centralizado de Geolocalización** (`GeolocationService`)

Un servicio Angular dedicado que maneja toda la lógica de geolocalización con las siguientes características:

#### Estados Reactivos con Signals
- `status`: Estado actual del servicio (idle, requesting-permission, permission-granted, tracking, error)
- `currentPosition`: Posición actual del usuario con precisión, altitud, velocidad, etc.
- `error`: Información de errores de geolocalización
- `isHighAccuracy`: Modo de precisión activo

#### Configuración de Alta Precisión
```typescript
{
  enableHighAccuracy: true,  // Usa GPS en lugar de WiFi/Cell
  timeout: 10000,           // 10 segundos de timeout
  maximumAge: 0             // Siempre obtener posición fresca
}
```

#### Observables RxJS
- `position$`: Stream de actualizaciones de posición en tiempo real
- `error$`: Stream de errores de geolocalización

### 2. **Indicador Visual de Precisión**

El marcador del usuario incluye:
- **Círculo de precisión** dinámico que cambia de tamaño según la exactitud del GPS
- **Código de colores**:
  - 🟢 Verde: Excelente (≤10m)
  - 🔵 Azul: Buena (≤30m)
  - 🟡 Amarillo: Aceptable (≤50m)
  - 🔴 Rojo: Pobre (>50m)
- **Flecha de orientación** que rota según el heading del dispositivo

### 3. **Botón de Re-centrado** (`LocationButton`)

Componente floating que permite:
- Re-centrar el mapa en la ubicación actual del usuario
- Indicador visual del estado de tracking
- Indicador de precisión en tiempo real
- Deshabilitado automáticamente cuando no hay tracking

### 4. **Popup de Permisos Mejorado**

Interfaz clara y amigable para solicitar permisos de ubicación al usuario:
- Explicación clara del por qué se necesita el permiso
- Opciones de "Permitir" o "Ahora No"
- Soporte multiidioma (ES/EN)

### 5. **Tracking Continuo y Eficiente**

- Usa `watchPosition()` para actualizaciones continuas
- Auto-limpieza de listeners en `ngOnDestroy`
- Manejo de errores robusto
- Reinicio automático al cambiar precisión

### 6. **Orientación del Dispositivo**

Soporte para la brújula del dispositivo:
- Solicita permisos de orientación (iOS)
- Rota la flecha del usuario según el heading
- Compatible con Android e iOS

## Arquitectura

```
┌─────────────────────────────────────────┐
│   GeolocationService (Core Service)     │
│  - Estado global con Signals            │
│  - Tracking continuo                    │
│  - Manejo de permisos                   │
└────────────┬────────────────────────────┘
             │
             ├─────────────────┬─────────────────┐
             │                 │                 │
      ┌──────▼──────┐   ┌─────▼─────┐   ┌──────▼──────┐
      │  MapLoad    │   │ Location  │   │    Map      │
      │ Component   │   │  Button   │   │  Component  │
      │             │   │           │   │             │
      │ - Marker    │   │ - Re-     │   │ - Control   │
      │ - Accuracy  │   │   center  │   │   Flow      │
      │ - Orient.   │   │ - Status  │   │             │
      └─────────────┘   └───────────┘   └─────────────┘
```

## Utilidades Incluidas

### Cálculo de Distancia
```typescript
calculateDistance(lat1, lon1, lat2, lon2): number
```
Usa la fórmula de Haversine para calcular distancia en metros entre dos puntos.

### Validación de Campus
```typescript
isWithinCampusBounds(latitude, longitude): boolean
```
Verifica si el usuario está dentro de los límites del campus.

## Uso

### Iniciar Tracking
```typescript
await geolocationService.requestPermissionAndStartTracking();
```

### Obtener Posición Actual
```typescript
const position = geolocationService.currentPosition();
// { latitude, longitude, accuracy, heading, speed, timestamp }
```

### Re-centrar en Usuario
```typescript
onCenterOnUserLocation(): void {
  const position = this.geolocationService.currentPosition();
  if (position) {
    this.mapLoad()?.flyToLocation(
      position.longitude, 
      position.latitude, 
      19
    );
  }
}
```

## Permisos

### Browser Geolocation
Solicitado automáticamente al llamar `requestPermissionAndStartTracking()`

### Device Orientation (iOS)
```typescript
DeviceOrientationEvent.requestPermission()
```
Solicitado automáticamente en dispositivos iOS para la brújula.

## Mejores Prácticas Implementadas

1. ✅ **Alta precisión por defecto** para navegación de campus
2. ✅ **Signals de Angular** para reactividad óptima
3. ✅ **Limpieza automática** de recursos en `ngOnDestroy`
4. ✅ **Manejo de errores** robusto con feedback al usuario
5. ✅ **Indicadores visuales** claros del estado de GPS
6. ✅ **Modo fallback** a precisión estándar si es necesario
7. ✅ **Código de colores** universal para precisión
8. ✅ **Responsive** y optimizado para mobile-first

## Consideraciones de Rendimiento

- ⚡ Actualizaciones eficientes solo cuando cambia la posición
- ⚡ Círculo de precisión con transiciones CSS suaves
- ⚡ Debounce implícito del navegador en `watchPosition`
- ⚡ Signals computados para reactividad optimizada

## Testing

Tests unitarios incluidos para:
- `geolocation.service.spec.ts` - Servicio principal
- `location-button.spec.ts` - Botón de re-centrado
- Cálculos de distancia
- Validación de límites del campus

## Próximas Mejoras Sugeridas

1. 🔄 **Filtro de Kalman** para suavizar trayectorias GPS
2. 📊 **Historial de ubicaciones** para análisis de rutas
3. 🔋 **Modo de ahorro de batería** con menor frecuencia de actualización
4. 🎯 **Geo-fencing** para notificaciones al entrar/salir de áreas
5. 📍 **Snap-to-path** para alinear posición a caminos del campus
6. 🗺️ **Modo de seguimiento automático** (follow mode)

## Soporte de Navegadores

- ✅ Chrome/Edge (Android/Windows)
- ✅ Safari (iOS/macOS)
- ✅ Firefox (Android/Desktop)
- ✅ Samsung Internet

## Precisión Esperada

| Condición | Precisión Típica |
|-----------|------------------|
| GPS puro (cielo despejado) | 5-10m |
| GPS + GLONASS | 3-8m |
| A-GPS (datos móviles) | 10-20m |
| WiFi indoor | 20-50m |
| Cell towers | 100-1000m |

Para un campus, lo ideal es mantener **≤30m** de precisión para navegación confiable.

## Licencia

Parte del proyecto Alliance Campus Map.
