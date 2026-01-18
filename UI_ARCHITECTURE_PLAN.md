# Plan de Arquitectura UI - PayInTable MVP

## Principios de Diseño y Arquitectura

### 1. Principios SOLID Aplicados

#### Single Responsibility Principle (SRP)
- **Container Components**: Solo orquestan lógica y estado (una responsabilidad)
- **Presentational Components**: Solo renderizan UI (una responsabilidad)
- **Hooks**: Solo encapsulan lógica específica (una responsabilidad)
- **API Clients**: Solo manejan comunicación con backend (una responsabilidad)

#### Open/Closed Principle (OCP)
- Componentes base extensibles mediante props y composition
- Design system tokens permiten extensión sin modificación
- Hooks custom permiten agregar funcionalidad sin cambiar componentes

#### Liskov Substitution Principle (LSP)
- Componentes presentational intercambiables si cumplen misma interface
- Hooks con misma signature pueden intercambiarse (ej: `useAccountQuery` vs mock)

#### Interface Segregation Principle (ISP)
- Props interfaces específicas y minimalistas
- Hooks retornan solo lo necesario (no objetos gigantes)
- Separación de concerns: queries, mutations, state local

#### Dependency Inversion Principle (DIP)
- Componentes dependen de abstracciones (interfaces/props), no implementaciones
- API clients abstraen detalles de fetch
- TanStack Query abstrae detalles de cache/refetch

### 2. Separación de Responsabilidades (Container/Presentational Pattern)
- **Container Components**: Manejan lógica, estado, y llamadas a API
- **Presentational Components**: Solo renderizan UI, reciben props, son reutilizables
- **Hooks Custom**: Extraen lógica reutilizable de containers
- **Services/Repositories**: Abstraen acceso a datos (API clients)

### 3. Data Fetching con TanStack Query
- **Queries**: Para lectura de datos (GET requests)
- **Mutations**: Para escritura de datos (POST, PATCH, DELETE)
- **Cache automático**: Evita prop drilling, datos compartidos automáticamente
- **Optimistic updates**: Mejor UX en mutaciones
- **Error boundaries**: Manejo centralizado de errores

### 4. Design System Modular
- Componentes base (shadcn/ui) en `components/ui/`
- Componentes de dominio en `components/payment/` organizados por feature
- Patrones de diseño consistentes mediante tokens y utilities
- Composición sobre herencia

### 5. Layout Móvil-First
- Viewport: 320px - 428px (iPhone SE a iPhone Pro Max)
- Stack vertical con scroll natural
- Touch targets mínimos: 44px x 44px
- Sin sidebar, navegación bottom-bar o header fijo cuando sea necesario

---

## Estructura de Carpetas

```
frontend/src/
├── app/
│   ├── [restaurant]/[location]/[table]/
│   │   ├── page.tsx                    # Container: Orquesta vistas
│   │   └── loading.tsx                 # Loading skeleton
│   ├── confirmacion/[accountId]/
│   │   └── page.tsx                    # Página de confirmación
│   └── layout.tsx                      # Layout móvil base
│
├── components/
│   ├── ui/                             # shadcn/ui base (ya existe)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   │
│   ├── design-system/                  # Componentes del design system
│   │   ├── layout/
│   │   │   ├── mobile-container.tsx    # Container móvil (max-width, padding)
│   │   │   ├── page-header.tsx         # Header reutilizable
│   │   │   └── safe-area.tsx           # Safe area para notches
│   │   ├── typography/
│   │   │   ├── heading.tsx             # Variantes de headings
│   │   │   └── text.tsx                # Variantes de texto
│   │   └── spacing/
│   │       └── section.tsx             # Secciones con spacing consistente
│   │
│   └── payment/                        # Componentes de dominio Payment
│       ├── order-summary/              # Vista 1: Resumen del pedido
│       │   ├── order-summary-container.tsx  # Container
│       │   ├── order-summary-view.tsx       # Presentational
│       │   ├── order-item-card.tsx          # Sub-componente
│       │   └── order-item-skeleton.tsx      # Loading state
│       │
│       ├── tip-selector/               # Vista 2: Agregación de propina
│       │   ├── tip-selector-container.tsx   # Container
│       │   ├── tip-selector-view.tsx        # Presentational
│       │   ├── tip-preset-button.tsx        # Botón preset (0%, 10%, 15%, 20%)
│       │   └── tip-custom-input.tsx         # Input personalizado
│       │
│       └── checkout/                   # Vista 3: Checkout
│           ├── checkout-container.tsx        # Container
│           ├── checkout-view.tsx             # Presentational
│           ├── klap-elements-wrapper.tsx     # Wrapper Klap Elements
│           ├── payment-total-card.tsx        # Card con total
│           └── checkout-error-state.tsx      # Error handling
│
├── hooks/                              # Custom hooks (lógica reutilizable)
│   ├── payment/
│   │   ├── use-order.ts                # Hook para manejar orden (lógica de negocio)
│   │   ├── use-tip.ts                  # Hook para manejar propina (lógica de negocio)
│   │   └── use-checkout.ts              # Hook para checkout (lógica de negocio)
│   └── api/                            # Hooks de data fetching (TanStack Query)
│       ├── queries/
│       │   ├── use-account-query.ts    # Query para account data
│       │   └── use-account-query-key.ts # Query keys factory (centralizado)
│       └── mutations/
│           ├── use-tip-mutation.ts     # Mutation para actualizar propina
│           └── use-checkout-mutation.ts # Mutation para checkout
│
├── lib/
│   ├── api/                            # API clients (separados por feature - Repository Pattern)
│   │   ├── base/
│   │   │   ├── api-client.ts           # Cliente base con interceptors
│   │   │   ├── api-error.ts            # Error handling centralizado
│   │   │   └── api-types.ts            # Types base (Response, Error)
│   │   ├── repositories/               # Repositories (abstraen acceso a datos)
│   │   │   ├── account-repository.ts   # Repository para account
│   │   │   └── checkout-repository.ts  # Repository para checkout
│   │   └── clients/                    # Clients específicos (opcional, si necesitas múltiples)
│   │       └── account-client.ts       # Cliente específico account
│   ├── utils/
│   │   ├── currency.ts                 # Formateo CLP (pure functions)
│   │   ├── validation.ts               # Validaciones (pure functions)
│   │   └── formatters.ts               # Otros formatters
│   ├── constants/
│   │   ├── payment.ts                  # Constantes de payment domain
│   │   └── api.ts                      # Constantes de API (endpoints, timeouts)
│   └── providers/                      # React providers
│       └── query-provider.tsx          # TanStack Query provider setup
│
└── types/                              # TypeScript types
    ├── payment.ts                      # Types de payment domain
    └── api.ts                          # Types de API responses
```

---

## Flujo de Vistas MVP

### Vista 1: Resumen del Pedido (`OrderSummaryContainer`)

**Responsabilidades:**
- Cargar datos de la cuenta via `use-account-query`
- Mostrar items con imagen, nombre, cantidad, precio
- Calcular y mostrar subtotal, IVA (19%), total actual
- Navegar a Vista 2 (Tip Selector) al hacer click en "Agregar Propina"

**Componentes:**
- `OrderSummaryContainer`: Lógica y estado
- `OrderSummaryView`: Presentación (recibe account data)
- `OrderItemCard`: Item individual (presentational puro)

**Props Interface:**
```typescript
interface OrderSummaryViewProps {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  isLoading?: boolean;
  onAddTip?: () => void;
}
```

---

### Vista 2: Agregación de Propina (`TipSelectorContainer`)

**Responsabilidades:**
- Mostrar botones preset (0%, 10%, 15%, 20%)
- Permitir input personalizado
- Actualizar propina en backend via `use-tip`
- Recalcular total en tiempo real
- Navegar a Vista 3 (Checkout) al confirmar

**Componentes:**
- `TipSelectorContainer`: Lógica (actualización de propina)
- `TipSelectorView`: Presentación (presets + input)
- `TipPresetButton`: Botón preset reutilizable
- `TipCustomInput`: Input con validación

**Props Interface:**
```typescript
interface TipSelectorViewProps {
  subtotal: number;
  currentTip: number;
  presets: number[];
  onTipSelect: (amount: number, isPercentage: boolean) => void;
  isLoading?: boolean;
}
```

---

### Vista 3: Checkout (`CheckoutContainer`)

**Responsabilidades:**
- Inicializar checkout (crear orden Klap) via `use-checkout`
- Mostrar total final (con propina incluida)
- Renderizar Klap Elements (Apple Pay / Google Pay)
- Manejar estados: loading, success, error
- Navegar a confirmación después de pago exitoso

**Componentes:**
- `CheckoutContainer`: Lógica (checkout flow)
- `CheckoutView`: Presentación (total + payment buttons)
- `KlapElementsWrapper`: Integración Klap (aislado)
- `PaymentTotalCard`: Card destacado con total
- `CheckoutErrorState`: Manejo de errores

**Props Interface:**
```typescript
interface CheckoutViewProps {
  total: number;
  tip: number;
  orderId: string | null;
  isLoading: boolean;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}
```

---

## Layout Móvil

### MobileContainer Component

```typescript
// components/design-system/layout/mobile-container.tsx
interface MobileContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg'; // 320px, 375px, 428px
  padding?: boolean;
}

export function MobileContainer({ children, maxWidth = 'md', padding = true }: MobileContainerProps) {
  return (
    <div className={cn(
      "mx-auto w-full",
      maxWidth === 'sm' && "max-w-[320px]",
      maxWidth === 'md' && "max-w-[375px]",
      maxWidth === 'lg' && "max-w-[428px]",
      padding && "px-4 py-6"
    )}>
      {children}
    </div>
  );
}
```

### Estructura de Página Móvil

```tsx
<MobileContainer>
  <PageHeader title="Mesa 5" subtitle="Revisa tu cuenta" />
  
  <Section spacing="lg">
    <OrderSummaryView {...props} />
  </Section>
  
  <Section spacing="lg">
    <TipSelectorView {...props} />
  </Section>
  
  <StickyBottom>
    <CheckoutView {...props} />
  </StickyBottom>
</MobileContainer>
```

---

## Design System Tokens

### Spacing
```typescript
// lib/design-system/tokens.ts
export const spacing = {
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
} as const;
```

### Colors (ya definidos en globals.css via shadcn)
- Usar CSS variables: `--primary`, `--muted`, etc.
- Extender en `design-system/tokens.ts` si es necesario

### Typography
```typescript
export const typography = {
  h1: 'text-3xl font-bold',
  h2: 'text-2xl font-semibold',
  h3: 'text-xl font-semibold',
  body: 'text-base',
  bodySmall: 'text-sm',
  caption: 'text-xs text-muted-foreground',
} as const;
```

---

## Implementación por Fases

### Fase 1: Design System Base
1. Crear `MobileContainer`, `PageHeader`, `Section`
2. Crear utilities de currency (`formatCLP`)
3. Definir types base (`OrderItem`, `Account`, etc.)

### Fase 2: Vista 1 - Resumen del Pedido
1. `use-account-query` hook (React Query o SWR)
2. `OrderSummaryContainer` + `OrderSummaryView`
3. `OrderItemCard` component
4. Integrar en página `[restaurant]/[location]/[table]`

### Fase 3: Vista 2 - Agregación de Propina
1. `use-tip` hook
2. `TipSelectorContainer` + `TipSelectorView`
3. `TipPresetButton` + `TipCustomInput`
4. Navegación entre Vista 1 y Vista 2

### Fase 4: Vista 3 - Checkout
1. `use-checkout` hook
2. `CheckoutContainer` + `CheckoutView`
3. `KlapElementsWrapper` (integración Klap)
4. Flujo completo hasta confirmación

---

## Ejemplo de Componente Presentational

```tsx
// components/payment/order-summary/order-item-card.tsx
interface OrderItemCardProps {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl?: string | null;
}

export function OrderItemCard({
  name,
  quantity,
  unitPrice,
  totalPrice,
  imageUrl,
}: OrderItemCardProps) {
  return (
    <Card className="flex items-start gap-3 p-3">
      {imageUrl ? (
        <Image src={imageUrl} alt={name} width={64} height={64} className="rounded" />
      ) : (
        <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
          <Utensils className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <div className="flex-1">
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground">
          {quantity}x ${formatCLP(unitPrice)}
        </p>
      </div>
      <p className="font-semibold">${formatCLP(totalPrice)}</p>
    </Card>
  );
}
```

---

## Ejemplo Completo: Container + Presentational + Hooks

### Container Component (Orquestación)

```tsx
// components/payment/order-summary/order-summary-container.tsx
'use client';

import { useAccountQuery } from '@/hooks/api/queries/use-account-query';
import { OrderSummaryView } from './order-summary-view';
import { OrderSummarySkeleton } from './order-summary-skeleton';
import { ErrorState } from '@/components/design-system/error-state';

interface OrderSummaryContainerProps {
  restaurant: string;
  location: string;
  table: number;
  onAddTip?: () => void;
}

/**
 * Container component for Order Summary.
 * 
 * Responsibilities:
 * - Data fetching (via TanStack Query)
 * - State management (loading, error)
 * - Orchestration of presentational components
 * 
 * Follows Single Responsibility Principle: Only handles data and orchestration.
 */
export function OrderSummaryContainer({
  restaurant,
  location,
  table,
  onAddTip,
}: OrderSummaryContainerProps) {
  const { data: account, isLoading, error, refetch } = useAccountQuery({
    restaurant,
    location,
    table,
  });

  if (isLoading) return <OrderSummarySkeleton />;
  
  if (error) {
    return (
      <ErrorState
        message={error.message || 'Error al cargar la cuenta'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!account) {
    return <ErrorState message="No hay cuenta abierta para esta mesa" />;
  }

  return (
    <OrderSummaryView
      items={account.items}
      subtotal={account.subtotal}
      tax={account.tax}
      total={account.total}
      onAddTip={onAddTip}
    />
  );
}
```

### Presentational Component (UI Pura)

```tsx
// components/payment/order-summary/order-summary-view.tsx
import { OrderItemCard } from './order-item-card';
import { OrderSummaryCard } from './order-summary-card';
import { Button } from '@/components/ui/button';
import type { OrderItem } from '@/types/payment';

interface OrderSummaryViewProps {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  onAddTip?: () => void;
}

/**
 * Presentational component for Order Summary.
 * 
 * Responsibilities:
 * - Render UI only
 * - Receive data via props
 * - Call callbacks for user actions
 * 
 * Follows Single Responsibility Principle: Only renders UI.
 * Follows Dependency Inversion: Depends on props interface, not implementation.
 */
export function OrderSummaryView({
  items,
  subtotal,
  tax,
  total,
  onAddTip,
}: OrderSummaryViewProps) {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-4 text-lg font-semibold">Tu pedido</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <OrderItemCard key={item.id} {...item} />
          ))}
        </div>
      </section>

      <OrderSummaryCard
        subtotal={subtotal}
        tax={tax}
        total={total}
      />

      {onAddTip && (
        <Button onClick={onAddTip} className="w-full" size="lg">
          Agregar propina
        </Button>
      )}
    </div>
  );
}
```

---

## Reglas de Clean Code y Arquitectura

### Principios de Código Limpio

1. **Single Responsibility**: Un componente/hook/clase = Una responsabilidad
2. **Explicit Interfaces**: Props interfaces explícitas, no `any`
3. **Separation of Concerns**: Hooks para lógica, componentes para UI
4. **Error Boundaries**: En containers críticos
5. **Loading States**: Siempre presentes (TanStack Query los maneja automáticamente)
6. **Accesibilidad**: ARIA labels, semantic HTML, keyboard navigation
7. **TypeScript Estricto**: No `any`, tipos explícitos, strict mode

### Patrones de Diseño Aplicados

1. **Container/Presentational**: Separación clara de lógica y UI
2. **Repository Pattern**: Abstracción de acceso a datos
3. **Factory Pattern**: Query keys factory para centralización
4. **Observer Pattern**: TanStack Query observa cambios automáticamente
5. **Strategy Pattern**: Diferentes estrategias de refetch según necesidad

### Testing Strategy

```typescript
// Ejemplo: Testing de hook con TanStack Query
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAccountQuery } from './use-account-query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

test('fetches account data', async () => {
  const { result } = renderHook(
    () => useAccountQuery({ restaurant: 'demo', location: 'principal', table: 1 }),
    { wrapper: createWrapper() }
  );

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toBeDefined();
});
```

### Estructura de Tests

```
__tests__/
├── components/
│   └── payment/
│       └── order-summary/
│           ├── order-summary-container.test.tsx
│           └── order-summary-view.test.tsx
├── hooks/
│   └── api/
│       └── queries/
│           └── use-account-query.test.ts
└── lib/
    └── api/
        └── repositories/
            └── account-repository.test.ts
```

---

## Orden de Implementación Recomendado

### Fase 1: Fundación (Arquitectura Base)
1. ✅ **Setup TanStack Query**: Provider, configuración base
2. ✅ **API Base Layer**: `api-client.ts`, `api-error.ts`, types base
3. ✅ **Repository Pattern**: `account-repository.ts`, `checkout-repository.ts`
4. ✅ **Query Keys Factory**: Centralización de keys
5. ✅ **Design System Base**: `MobileContainer`, tokens, utilities

### Fase 2: Data Layer
6. ✅ **Query Hooks**: `use-account-query.ts` con TanStack Query
7. ✅ **Mutation Hooks**: `use-tip-mutation.ts` con optimistic updates
8. ✅ **Types**: Definir todos los types (`payment.ts`, `api.ts`)

### Fase 3: Componentes Base
9. ✅ **Presentational Components**: `OrderItemCard`, `TipPresetButton`, etc.
10. ✅ **Loading States**: Skeletons para cada vista
11. ✅ **Error States**: Componentes de error reutilizables

### Fase 4: Vistas MVP
12. ✅ **Vista 1: OrderSummary**: Container + View + integración
13. ✅ **Vista 2: TipSelector**: Container + View + mutation hook
14. ✅ **Vista 3: Checkout**: Container + View + Klap integration

### Fase 5: Integración y Polish
15. ✅ **Página Principal**: Orquestar las 3 vistas
16. ✅ **Navegación**: Flujo entre vistas (query params o state)
17. ✅ **Error Handling**: Error boundaries, retry logic
18. ✅ **Animaciones**: Transiciones suaves entre vistas
19. ✅ **Testing**: Tests unitarios de hooks y componentes críticos

### Fase 6: Optimización
20. ✅ **Performance**: Code splitting, lazy loading
21. ✅ **Accessibility**: ARIA labels, keyboard navigation
22. ✅ **Analytics**: Tracking de eventos importantes

---

## Arquitectura de Data Fetching con TanStack Query

### Setup del Query Client

```typescript
// lib/providers/query-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // 30 segundos
            refetchOnWindowFocus: true,
            retry: 1,
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
```

### Query Keys Factory (Centralizado)

```typescript
// hooks/api/queries/use-account-query-key.ts
export const accountQueryKeys = {
  all: ['account'] as const,
  detail: (restaurant: string, location: string, table: number) =>
    [...accountQueryKeys.all, restaurant, location, table] as const,
} as const;
```

### Repository Pattern para API

```typescript
// lib/api/repositories/account-repository.ts
import { apiClient } from '../base/api-client';
import type { Account } from '@/types/payment';

export class AccountRepository {
  async getAccount(params: {
    restaurant: string;
    location: string;
    table: number;
  }): Promise<Account> {
    return apiClient.get(
      `/${params.restaurant}/${params.location}/${params.table}`
    );
  }

  async updateTip(accountId: string, tip: { amount?: number; percentage?: number }): Promise<Account> {
    return apiClient.patch(`/accounts/${accountId}/tip`, tip);
  }
}

export const accountRepository = new AccountRepository();
```

### Query Hook con TanStack Query

```typescript
// hooks/api/queries/use-account-query.ts
import { useQuery } from '@tanstack/react-query';
import { accountRepository } from '@/lib/api/repositories/account-repository';
import { accountQueryKeys } from './use-account-query-key';

interface UseAccountQueryParams {
  restaurant: string;
  location: string;
  table: number;
  enabled?: boolean;
}

export function useAccountQuery({
  restaurant,
  location,
  table,
  enabled = true,
}: UseAccountQueryParams) {
  return useQuery({
    queryKey: accountQueryKeys.detail(restaurant, location, table),
    queryFn: () => accountRepository.getAccount({ restaurant, location, table }),
    enabled,
    staleTime: 30 * 1000, // 30 segundos
    refetchOnWindowFocus: true,
  });
}
```

### Mutation Hook con Optimistic Updates

```typescript
// hooks/api/mutations/use-tip-mutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountRepository } from '@/lib/api/repositories/account-repository';
import { accountQueryKeys } from '../queries/use-account-query-key';
import type { Account } from '@/types/payment';

interface TipUpdate {
  accountId: string;
  tipAmount?: number;
  tipPercentage?: number;
}

export function useTipMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accountId, tipAmount, tipPercentage }: TipUpdate) =>
      accountRepository.updateTip(accountId, { amount: tipAmount, percentage: tipPercentage }),

    // Optimistic update
    onMutate: async ({ accountId, tipAmount, tipPercentage }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: accountQueryKeys.all });

      // Snapshot previous value
      const previousAccounts = queryClient.getQueriesData<Account>({
        queryKey: accountQueryKeys.all,
      });

      // Optimistically update
      queryClient.setQueriesData<Account>(
        { queryKey: accountQueryKeys.all },
        (old) => {
          if (!old || old.id !== accountId) return old;
          
          const newTip = tipPercentage
            ? Math.round((old.subtotal * tipPercentage) / 100)
            : tipAmount ?? 0;

          return {
            ...old,
            tip: newTip,
            total: old.subtotal + old.tax + newTip,
          };
        }
      );

      return { previousAccounts };
    },

    // Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousAccounts) {
        context.previousAccounts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    // Refetch after success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: accountQueryKeys.all });
    },
  });
}
```

### Container Component usando Hooks

```typescript
// components/payment/order-summary/order-summary-container.tsx
'use client';

import { useAccountQuery } from '@/hooks/api/queries/use-account-query';
import { OrderSummaryView } from './order-summary-view';
import { OrderSummarySkeleton } from './order-summary-skeleton';
import { ErrorState } from '@/components/design-system/error-state';

interface OrderSummaryContainerProps {
  restaurant: string;
  location: string;
  table: number;
  onAddTip?: () => void;
}

export function OrderSummaryContainer({
  restaurant,
  location,
  table,
  onAddTip,
}: OrderSummaryContainerProps) {
  const { data: account, isLoading, error } = useAccountQuery({
    restaurant,
    location,
    table,
  });

  if (isLoading) return <OrderSummarySkeleton />;
  if (error) return <ErrorState message={error.message} />;
  if (!account) return <ErrorState message="No hay cuenta abierta" />;

  return (
    <OrderSummaryView
      items={account.items}
      subtotal={account.subtotal}
      tax={account.tax}
      total={account.total}
      onAddTip={onAddTip}
    />
  );
}
```

---

## Notas Técnicas

### Dependencias Necesarias

```json
{
  "@tanstack/react-query": "^5.x",
  "@tanstack/react-query-devtools": "^5.x"
}
```

### Principios Aplicados

1. **Repository Pattern**: Abstrae acceso a datos, facilita testing y cambios de API
2. **Query Keys Factory**: Centraliza keys, evita typos, facilita invalidación
3. **Optimistic Updates**: Mejor UX, rollback automático en errores
4. **Separation of Concerns**: Queries, mutations, y lógica de negocio separados
5. **Type Safety**: TypeScript estricto en todos los niveles

### Beneficios de esta Arquitectura

- ✅ **Escalable**: Fácil agregar nuevas queries/mutations
- ✅ **Testeable**: Repositories y hooks fácilmente mockeables
- ✅ **Mantenible**: Código organizado por responsabilidad
- ✅ **Type-safe**: TypeScript en toda la cadena
- ✅ **Performance**: Cache automático, refetch inteligente
- ✅ **UX**: Optimistic updates, loading states automáticos

### Formato CLP
- Función `formatCLP(amount: number) -> string` en `lib/utils/currency.ts`

### Validaciones
- Mínimo pago: 1,000 CLP
- Propina: >= 0
- Validaciones en `lib/utils/validation.ts` (pure functions)

### Klap Script
- Cargar dinámicamente solo en Vista 3 (Checkout)
- Usar Next.js `Script` component con `strategy="afterInteractive"`
