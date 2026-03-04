# 🔄 Actualización MercadoForzado → v1.3 (Safari compatible)

## 📂 Archivos a reemplazar:

### 1. `auth.js` (raíz del proyecto)
✅ **Reemplaza completamente** el archivo actual con el nuevo

**Cambio principal:**
- Fix de `crypto.randomUUID` → Compatible Safari iOS

---

### 2. `index.html` (raíz del proyecto - página de activación)
✅ **Reemplaza completamente** el archivo actual con el nuevo

**Cambios principales:**
- Sin módulos ES6 (`type="module"`)
- Funciones de auth inline
- Diseño mejorado con estilos
- Compatible Safari iOS

---

### 3. `core/index.html` (carpeta core)
✅ **Reemplaza completamente** el archivo actual con el nuevo

**Cambios principales:**
- Script de validación sin módulos ES6 (líneas 5-82)
- Todo el contenido de MercadoForzado se mantiene igual
- Compatible Safari iOS

---

## 🚀 Instrucciones de actualización:

### Paso 1: Backup (recomendado)
```bash
# Haz backup de tus archivos actuales
cp auth.js auth.js.backup
cp index.html index.html.backup
cp core/index.html core/index.html.backup
```

### Paso 2: Reemplazar archivos
1. Reemplaza `auth.js` con el nuevo
2. Reemplaza `index.html` con el nuevo  
3. Reemplaza `core/index.html` con el nuevo

### Paso 3: Subir a GitHub
```bash
git add auth.js index.html core/index.html
git commit -m "Update to v1.3 - Safari iOS compatible"
git push
```

### Paso 4: Probar
1. Abre en Chrome/Android → Debe seguir funcionando
2. Abre en Safari/iOS → **Debe funcionar ahora** ✅

---

## ✅ Verificación

Después de actualizar, verifica que:
- [ ] La activación funciona en Chrome
- [ ] La activación funciona en Safari iOS
- [ ] La app se carga correctamente
- [ ] La validación de sesión funciona
- [ ] El modo offline funciona
- [ ] Todas las funcionalidades de MercadoForzado siguen igual

---

## ⚠️ Notas importantes

1. **NO** modifiques el nuevo script de validación en `core/index.html` (líneas 5-82)
2. Todo tu código personalizado de MercadoForzado se mantiene intacto
3. Solo cambia el sistema de autenticación

---

## 🐛 Si algo sale mal

1. Restaura los backups:
```bash
cp auth.js.backup auth.js
cp index.html.backup index.html
cp core/index.html.backup core/index.html
```

2. Revisa los archivos y comparte el error

---

**✅ Después de esta actualización, MercadoForzado funcionará perfectamente en Safari iOS**
