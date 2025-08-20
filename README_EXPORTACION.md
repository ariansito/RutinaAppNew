# 📱 Exportación de Rutina App para iOS y Android

## 🚀 Requisitos Previos

### Para iOS:
- **Mac con macOS** (requerido para desarrollo iOS)
- **Xcode** instalado desde App Store
- **Node.js** y **npm** instalados

### Para Android:
- **Windows, macOS o Linux**
- **Android Studio** instalado
- **Node.js** y **npm** instalados

## 📋 Pasos para Exportar

### 1. Instalar Dependencias
```bash
# Navegar a la carpeta del proyecto
cd "C:\Users\Arian\Documents\RutinaApp_Nueva"

# Instalar dependencias de Node.js
npm install

# Instalar Capacitor CLI globalmente
npm install -g @capacitor/cli
```

### 2. Inicializar Capacitor
```bash
# Inicializar Capacitor en el proyecto
npx cap init

# Agregar plataforma iOS
npm run add-ios

# Agregar plataforma Android
npm run add-android
```

### 3. Sincronizar Proyecto
```bash
# Sincronizar archivos web con las plataformas nativas
npm run sync
```

## 🍎 Exportar para iOS

### Opción 1: Usando Xcode (Recomendado)
```bash
# Abrir proyecto en Xcode
npx cap open ios

# En Xcode:
# 1. Seleccionar tu dispositivo o simulador
# 2. Hacer clic en "Product" → "Archive"
# 3. Seguir el asistente de distribución
# 4. Exportar como .ipa
```

### Opción 2: Build desde Terminal
```bash
# Build para simulador
npx cap run ios

# Build para dispositivo físico
npx cap run ios --target="Tu Dispositivo"
```

## 🤖 Exportar para Android

### Opción 1: Usando Android Studio
```bash
# Abrir proyecto en Android Studio
npx cap open android

# En Android Studio:
# 1. Build → Build Bundle(s) / APK(s)
# 2. Build APK(s)
# 3. El APK se generará en app/build/outputs/apk/debug/
```

### Opción 2: Build desde Terminal
```bash
# Build APK de debug
npx cap run android

# Build APK de release (requiere configuración de firma)
cd android
./gradlew assembleRelease
```

## 📁 Ubicaciones de Archivos Exportados

### iOS:
- **Simulador**: `.ipa` en Xcode → Window → Devices and Simulators
- **Dispositivo**: Archivo `.ipa` descargado

### Android:
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`

## 🔧 Configuración Adicional

### Para iOS (en Xcode):
1. **Bundle Identifier**: Cambiar a tu identificador único
2. **Team**: Seleccionar tu equipo de desarrollo
3. **Capabilities**: Activar Push Notifications si es necesario

### Para Android (en Android Studio):
1. **Package Name**: Cambiar en `android/app/src/main/AndroidManifest.xml`
2. **Version Code**: Actualizar en `android/app/build.gradle`
3. **Signing Config**: Configurar para builds de release

## 📱 Instalación en Dispositivos

### iOS:
- **Simulador**: Arrastrar .ipa al simulador
- **Dispositivo**: Usar TestFlight o instalación directa

### Android:
- **APK**: Transferir archivo .apk al dispositivo e instalar
- **Google Play**: Subir APK firmado a Google Play Console

## 🚨 Solución de Problemas

### Error "Command not found: cap"
```bash
npm install -g @capacitor/cli
```

### Error de permisos en iOS
- Verificar que el Bundle ID sea único
- Confirmar que el Team esté configurado correctamente

### Error de build en Android
- Verificar que Android SDK esté instalado
- Confirmar que JAVA_HOME esté configurado

## 📞 Soporte

Si encuentras problemas durante la exportación:
1. Verificar que todas las dependencias estén instaladas
2. Revisar la consola para mensajes de error específicos
3. Asegurarte de que las herramientas de desarrollo estén actualizadas

## 🎯 Resultado Final

Después de completar estos pasos, tendrás:
- **Archivo .ipa** para iOS (instalable en iPhone/iPad)
- **Archivo .apk** para Android (instalable en dispositivos Android)
- **Aplicación nativa** con todas las funcionalidades de tu app web
