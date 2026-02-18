# Error ENETUNREACH en Render con Supabase

El error `connect ENETUNREACH ... 5432` **no** se debe a Prisma generate ni a db pull.  
Ocurre porque la **conexión de red** desde Render hacia la base de datos (Supabase, puerto 5432) no se puede establecer.

## Causa

- En Render usas `DATABASE_URL` con la conexión **directa** de Supabase: `db.xxx.supabase.co:5432`.
- Ese host suele resolverse a **IPv6** y desde los servidores de Render esa ruta no es alcanzable → **ENETUNREACH**.

## Solución: usar Connection Pooler de Supabase

1. Entra en [Supabase Dashboard](https://supabase.com/dashboard) → tu proyecto.
2. **Project Settings** (engranaje) → **Database**.
3. En **Connection string** elige **Connection pooling** → modo **Session**.
4. Copia la URI. Será algo como:
   ```text
   postgresql://postgres.[PROJECT-REF]:[TU_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
   (puerto **6543**, no 5432).
5. En **Render** → tu Web Service → **Environment**:
   - Variable `DATABASE_URL` = esa URI del pooler (con la contraseña real).
6. **Save** y **Redeploy** del servicio.

Tras el redeploy, la app usará el pooler (puerto 6543), que suele ser accesible desde Render, y el error ENETUNREACH debería desaparecer.

---

## Error 28P01 / P1000: "password authentication failed for user postgres"

Si la conexión ya llega al servidor pero falla la autenticación:

- **Causa:** La URL del pooler **no** usa el usuario `postgres` solo. Usa **`postgres.[PROJECT-REF]`** (ej: `postgres.abcdefghijklmnop`). Si en Render pusiste solo `postgres` o una URI de conexión directa, el pooler rechazará la conexión.
- **Contraseña:** Debe ser la **Database password** de Supabase (Project Settings → Database → Database password), no la anon key ni el service role key.

**Qué hacer:**

1. En Supabase → **Project Settings** → **Database**.
2. En **Connection string** elige **Connection pooling** → **Session mode**.
3. Copia la URI **tal cual** (incluye `postgres.[ref]` como usuario, host pooler y puerto 6543).
4. Sustituye `[YOUR-PASSWORD]` por tu contraseña de base de datos (la misma que en "Database password"). Si no la recuerdas, puedes resetearla en esa misma página.
5. Pega esa URI completa en **Render** → Environment → `DATABASE_URL` → Save y Redeploy.

Ejemplo de URI correcta del pooler:

```text
postgresql://postgres.abcdefghijklmnop:TuPasswordAqui@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

El usuario es `postgres.abcdefghijklmnop`, no `postgres`.

## Resumen

| Qué                     | ¿Ayuda? |
|-------------------------|---------|
| `prisma generate`       | No (solo genera el cliente) |
| `prisma db pull`        | No (solo obtiene el schema) |
| URL pooler 6543         | **Sí** para ENETUNREACH (conexión alcanzable) |
| Usuario `postgres.[ref]` + DB password | **Sí** para 28P01/P1000 (auth correcta con pooler) |
