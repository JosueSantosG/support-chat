# 🌐 Chat de Soporte en Línea

Esta aplicación permite una interacción en tiempo real entre clientes y asesores, mejorando la experiencia de comunicación a través de Socket.IO!.

---

## 🚀 Tecnologías Utilizadas
- **Socket.IO** - Comunicación en tiempo real
- **Node.js & Express** - Backend
- **Angular** - Frontend
- **Tailwind CSS** - Estilos

---

## 💻 Interfaz de Usuario
Los usuarios pueden iniciar un chat ingresando su nombre y comenzar una conversación.

1. **Inicio de Chat**: El cliente ingresa su nombre para acceder al chat.

   ![Inicio de Chat](https://github.com/user-attachments/assets/0454f0d2-4485-4e50-81a3-a0f1d13b1c5e)

2. **Chat en Proceso**: Una vez dentro, el cliente puede enviar mensajes, que serán recibidos por un asesor.

   ![Chat en Proceso](https://github.com/user-attachments/assets/fc762ed4-9c4e-40e7-ae8d-611520a841cd)

---

## 🧑‍💼 Interfaz del Asesor
El asesor tiene control completo sobre la gestión de los chats:

1. **Selección de Cliente**: Puede elegir a un cliente para comenzar la conversación, emitiendo un mensaje al cliente (como se muestra en la imagen de arriba).

   ![Selección de Cliente](https://github.com/user-attachments/assets/a1d3c725-dc24-4fc5-9c89-090c9dbe180f)

2. **Manejo de Salas de Chat**: Cada conversación ocurre en salas (rooms) individuales, asegurando la privacidad.

   ![Salas de Chat](https://github.com/user-attachments/assets/d588710d-3794-4f30-b2dd-6eba13d2bf12)

3. **Persistencia de Mensajes**: Los asesores pueden entrar y salir de una sala sin perder los mensajes previos, gracias a la persistencia de chat.

   ![Persistencia de Mensajes](https://github.com/user-attachments/assets/61d40ff7-f5b9-4777-a694-da2a90cc099d)

---

## 🛠️ Funcionalidades Clave
- **Comunicación en Tiempo Real**: Los mensajes se envían y reciben de forma instantánea.
- **Salas de Chat**: Cada cliente y asesor se comunican en salas independientes.
- **Persistencia de Datos**: Los mensajes permanecen intactos incluso si el asesor sale y vuelve a la sala.
- **Notificaciones Personalizadas**: Los usuarios son informados cuando un asesor se une al chat.

---

¡Dale un vistazo y pruébalo! 😉

## Próximamente
- **Login**: Antes de acceder al listado de clientes, el asesor deberá iniciar sesión.
