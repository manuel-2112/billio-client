/**
 * Home / Demo Page
 * 
 * Landing page with demo routes and QR code examples.
 */

'use client';

import Link from 'next/link';
import { QrCode, Smartphone, CreditCard, CheckCircle } from 'lucide-react';
import { Card } from '@/registry/new-york-v4/ui/card';
import { Button } from '@/registry/new-york-v4/ui/button';
import { MobileContainer, PageHeader } from '@/components/design-system/layout';

/**
 * Home Page
 * 
 * Displays available routes and demo links.
 */
export default function HomePage() {
  // Demo routes based on seed data
  const demoRoutes = [
    {
      restaurant: 'demo',
      location: 'principal',
      table: 1,
      description: 'Mesa 1 - Demo Restaurant',
    },
    {
      restaurant: 'demo',
      location: 'principal',
      table: 2,
      description: 'Mesa 2 - Demo Restaurant',
    },
    {
      restaurant: 'demo',
      location: 'principal',
      table: 3,
      description: 'Mesa 3 - Demo Restaurant',
    },
    {
      restaurant: 'demo',
      location: 'principal',
      table: 4,
      description: 'Mesa 4 - Demo Restaurant',
    },
    {
      restaurant: 'demo',
      location: 'principal',
      table: 5,
      description: 'Mesa 5 - Demo Restaurant',
    },
  ];

  return (
    <MobileContainer>
      <div className="min-h-screen space-y-8 py-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold">PayInTable</h1>
          <p className="text-lg text-muted-foreground">
            Pago rápido en mesa con Apple Pay y Google Pay
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <QrCode className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Escanea el QR</h3>
                <p className="text-sm text-muted-foreground">
                  Cada mesa tiene un código QR único que te lleva directamente a tu cuenta
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Revisa y paga</h3>
                <p className="text-sm text-muted-foreground">
                  Revisa tu pedido, agrega propina y paga con Apple Pay o Google Pay
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Pago seguro</h3>
                <p className="text-sm text-muted-foreground">
                  Procesado por Klap, el sistema de pagos más seguro de Chile
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Confirmación</h3>
                <p className="text-sm text-muted-foreground">
                  Recibe confirmación instantánea y comprobante por email
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Hero Scroll Demo */}
        <div className="space-y-4">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Diseño Hero Scroll</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Vista previa del diseño del primer paso con animación de scroll.
            </p>
            <Button asChild variant="outline" className="w-full md:w-auto">
              <Link href="/demo/hero-scroll">Ver Diseño Hero Scroll</Link>
            </Button>
          </div>
        </div>

        {/* Demo Routes */}
        <div className="space-y-4">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Rutas Demo</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Prueba el sistema con estas rutas de ejemplo. Asegúrate de tener el backend
              corriendo y datos de prueba en la base de datos.
            </p>
          </div>

          <div className="space-y-3">
            {demoRoutes.map((route) => {
              const href = `/${route.restaurant}/${route.location}/${route.table}`;
              
return (
                <Card key={href} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{route.description}</h3>
                      <p className="mt-1 font-mono text-sm text-muted-foreground">
                        {href}
                      </p>
                    </div>
                    <Button asChild>
                      <Link href={href}>Abrir</Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Route Information */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">Estructura de Rutas</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-mono font-semibold">
                /{'{'}restaurant{'}'}/{'{'}location{'}'}/{'{'}table{'}'}
              </p>
              <p className="mt-1 text-muted-foreground">
                Página principal del cliente. Muestra el resumen del pedido, permite agregar
                propina y realizar el pago.
              </p>
            </div>
            <div>
              <p className="font-mono font-semibold">
                /confirmacion/{'{'}accountId{'}'}
              </p>
              <p className="mt-1 text-muted-foreground">
                Página de confirmación después de un pago exitoso.
              </p>
            </div>
          </div>
        </Card>

        {/* Backend Info */}
        <Card className="border-dashed p-6">
          <h3 className="mb-2 font-semibold">Configuración</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Backend URL:</strong>{' '}
              {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
            </p>
            <p>
              <strong>Restaurante Demo:</strong> demo / principal
            </p>
            <p>
              <strong>Mesas disponibles:</strong> 1, 2, 3, 4, 5
            </p>
          </div>
        </Card>
      </div>
    </MobileContainer>
  );
}
