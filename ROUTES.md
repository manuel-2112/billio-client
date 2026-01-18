# Rutas de PayInTable

## Rutas del Frontend

### 1. Página Principal (Home)
```
/
```
Página de inicio con información y enlaces a rutas demo.

### 2. Página de Pago del Cliente
```
/{restaurant}/{location}/{table}
```
**Ejemplo:** `/demo/principal/1`

**Parámetros:**
- `restaurant`: Slug del restaurante (ej: "demo")
- `location`: Slug de la ubicación (ej: "principal")
- `table`: Número de mesa (ej: 1, 2, 3, 4, 5)

**Descripción:**
Página principal donde el cliente:
1. Ve el resumen de su pedido (Vista 1)
2. Agrega propina (Vista 2)
3. Completa el pago (Vista 3)

**Flujo:**
- Vista inicial: Resumen del pedido
- Click "Agregar propina" → Vista de selector de propina
- Click "Continuar al pago" → Vista de checkout
- Click "Pagar ahora" → Inicializa orden Klap
- Aparecen botones Apple Pay / Google Pay
- Pago exitoso → Redirect a confirmación

### 3. Página de Confirmación
```
/confirmacion/{accountId}
```
**Ejemplo:** `/confirmacion/123e4567-e89b-12d3-a456-426614174000`

**Parámetros:**
- `accountId`: UUID de la cuenta pagada

**Descripción:**
Muestra mensaje de éxito después de un pago completado.

---

## Rutas Demo (Basadas en Seed Data)

Según el seed data del backend, estas son las rutas disponibles:

| Ruta | Descripción |
|------|-------------|
| `/demo/principal/1` | Mesa 1 - Demo Restaurant |
| `/demo/principal/2` | Mesa 2 - Demo Restaurant |
| `/demo/principal/3` | Mesa 3 - Demo Restaurant |
| `/demo/principal/4` | Mesa 4 - Demo Restaurant |
| `/demo/principal/5` | Mesa 5 - Demo Restaurant |

---

## Rutas del Backend API

### Públicas (Sin autenticación)

```
GET  /api/v1/{restaurant}/{location}/{table}
     → Obtener cuenta activa de una mesa

PATCH /api/v1/accounts/{account_id}/tip
     → Actualizar propina

POST /api/v1/accounts/{account_id}/checkout
     → Inicializar checkout (crear orden Klap)
```

### Webhooks

```
POST /api/v1/webhooks/klap-confirm
     → Webhook: pago confirmado

POST /api/v1/webhooks/klap-reject
     → Webhook: pago rechazado
```

### Dashboard (Requiere autenticación)

```
POST /api/v1/auth/token
     → Login staff

GET  /api/v1/dashboard/tables
     → Listar todas las mesas

GET  /api/v1/dashboard/tables/{table_id}
     → Obtener cuenta activa de una mesa

POST /api/v1/dashboard/tables/{table_id}/items
     → Agregar producto a una mesa

DELETE /api/v1/dashboard/items/{item_id}
     → Eliminar producto

POST /api/v1/dashboard/accounts/{account_id}/cancel
     → Cancelar cuenta

GET  /api/v1/dashboard/accounts?filter_date=YYYY-MM-DD
     → Historial de cuentas pagadas
```

---

## Ejemplo de Uso Completo

### 1. Cliente escanea QR
```
QR Code URL: https://app.payintable.com/demo/principal/1
```

### 2. Cliente ve su cuenta
```
GET /api/v1/demo/principal/1
Response: Account con items, subtotal, tax, total
```

### 3. Cliente agrega propina
```
PATCH /api/v1/accounts/{account_id}/tip
Body: { "tip_percentage": 15 }
Response: Account actualizado con nueva propina
```

### 4. Cliente inicia checkout
```
POST /api/v1/accounts/{account_id}/checkout
Body: { "tip_percentage": 15 }
Response: { "order_id": "klap_123", "reference_id": "...", "account": {...} }
```

### 5. Cliente paga con Apple Pay / Google Pay
```
Klap procesa el pago
→ Webhook: POST /api/v1/webhooks/klap-confirm
→ Cuenta marcada como pagada
→ Redirect a: /confirmacion/{account_id}
```

---

## Variables de Entorno

```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_KLAP_SCRIPT_URL=https://klap.cl/pagos/checkout-flex/v1/main.min.js
```

---

## Notas

- Las rutas son case-sensitive
- Los números de mesa deben ser enteros válidos
- El backend debe tener datos de seed para que funcionen las rutas demo
- Para producción, reemplazar `demo` y `principal` con slugs reales del restaurante
