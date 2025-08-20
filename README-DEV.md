# 🚀 RutinaApp - Desarrollo Local

## 📋 **Requisitos Previos**

- **Python 3.x** o **Node.js** (para el servidor local)
- Navegador moderno (Chrome, Firefox, Safari, Edge)

## 🏃‍♂️ **Inicio Rápido**

### **Opción 1: Servidor Python (Recomendado)**

```bash
cd "C:\Users\Arian\Documents\RutinaApp_Nueva"
python -m http.server 8000
```

### **Opción 2: Servidor Node.js**

```bash
cd "C:\Users\Arian\Documents\RutinaApp_Nueva"
npx http-server -p 8000
```

### **Opción 3: Script Automático**

```bash
cd "C:\Users\Arian\Documents\RutinaApp_Nueva"
start-server.bat
```

## 🌐 **Acceso a la App**

Una vez que el servidor esté corriendo:
- **URL Local**: `http://localhost:8000`
- **Puerto**: 8000 (configurable)

## 🔧 **Configuración Automática**

La app detecta automáticamente si estás en:
- **Desarrollo Local** (`localhost` o `127.0.0.1`)
- **Producción** (GitHub Pages)

### **Archivos de Configuración**

- `config.js` - Configuración automática del entorno
- `sw-dev.js` - Service Worker para desarrollo local
- `sw.js` - Service Worker para producción

## 📁 **Estructura de Archivos**

```
RutinaApp_Nueva/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica principal
├── config.js           # Configuración automática
├── sw-dev.js           # Service Worker (desarrollo)
├── sw.js               # Service Worker (producción)
├── manifest.json       # PWA manifest
├── start-server.bat    # Script de inicio del servidor
└── README-DEV.md       # Este archivo
```

## 🐛 **Solución de Problemas**

### **Error 404 en Service Worker**
- **Causa**: Ejecutar la app con `file://` protocol
- **Solución**: Usar servidor local (`http://localhost:8000`)

### **Cambios No Se Guardan**
- **Causa**: Service Worker no registrado
- **Solución**: Verificar que estés en `localhost:8000`

### **Caché Persistente**
- **Solución**: Hard refresh (Ctrl+F5) o limpiar caché del navegador

## 🔍 **Debug y Logs**

La app incluye logs detallados en modo desarrollo:
- Abre la consola del navegador (F12)
- Busca mensajes con `(DEV)` para desarrollo local

## 📱 **PWA en Desarrollo Local**

- ✅ Service Worker funciona
- ✅ Caché offline funciona
- ✅ Notificaciones funcionan
- ✅ Instalación funciona

## 🚀 **Despliegue a Producción**

Para subir cambios a GitHub Pages:

```bash
git add .
git commit -m "Update: [descripción de cambios]"
git push origin main
```

## 📞 **Soporte**

Si tienes problemas:
1. Verifica que estés usando `http://localhost:8000`
2. Revisa la consola del navegador
3. Asegúrate de que Python/Node.js esté instalado
4. Reinicia el servidor local

---

**¡Disfruta desarrollando RutinaApp! 🎉**
