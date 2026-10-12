# ✨ StyleScribe

Micro app que genera **descripciones de productos atractivas para tiendas de ropa online**, usando IA.

Es un MVP (producto mínimo viable) pensado para lanzarse rápido y empezar a validar/monetizar.

---

## ¿Qué hace?

El usuario rellena los datos de un producto (nombre, categoría, material, color, tono…) y la app genera una descripción lista para copiar y pegar en su tienda.

- 🤖 **Modo IA real**: usa la API de OpenAI (necesita una API key).
- 🆓 **Modo demo**: si no hay API key, genera descripciones localmente para que puedas probar la app gratis al instante.

---

## Cómo ejecutarlo

```bash
# 1. Instalar dependencias
npm install

# 2. (Opcional) Activar la IA real
cp .env.example .env.local
# edita .env.local y pon tu OPENAI_API_KEY

# 3. Arrancar en desarrollo
npm run dev
```

Abre http://localhost:3000

> Sin configurar la API key, la app funciona igualmente en **modo demo**.

---

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- API de **OpenAI** (opcional, con fallback a demo)
- CSS puro (sin dependencias extra)

---

## Estructura

```
app/
  page.tsx           → interfaz (formulario + resultado)
  layout.tsx         → layout base
  globals.css        → estilos
  api/generar/route.ts → endpoint que llama a la IA
lib/
  generator.ts       → lógica de prompt + IA + modo demo
```

---

## 💰 Cómo monetizarlo (próximos pasos)

1. **Freemium**: X generaciones gratis al día, ilimitadas de pago.
2. **Suscripción** mensual con Stripe.
3. **Pago por uso** (créditos).

Ideas de mejoras para vender mejor:
- Guardar historial de descripciones por usuario (requiere login + base de datos).
- Generar varias variantes a la vez.
- Soporte multi-idioma.
- Exportar a CSV para subir en lote a la tienda.

---

## Desplegar

Pensado para desplegarse gratis en **Vercel**:

1. Sube el repo a GitHub.
2. Importa el proyecto en Vercel.
3. Añade la variable de entorno `OPENAI_API_KEY`.
4. Deploy.
