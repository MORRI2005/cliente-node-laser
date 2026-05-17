**_ EXPLICACIÓN _**

Este es el codigo del cliente de node laser, aquí es donde recibimos la información del cliente de astro. Lo primero de todo recibimos la información del usuario a partir de socket.io, buscamos el paquete updeatePosition y nos gardamos
la info, después comienza la logica del laser, creamos una nueva escena y ahí es donde vamos a pintar, creamos un bucle que por cada usuario pinte por cada frame. Para poder pintar bien normalizamos los valores que nos llegan al tamaño del simulator,
después establecemos el color que se va a utilizar a partir de lo que nos llega por el paquete y después creamos diferentes condiciones dependiendo de la forma que ha escogido el usuario. De esa forma podemos pintar por pantalla lo que el cliente de astro quiera.

**_ INSTALACIÓN _**

Para poder instalar el proyecto primero de todo se tiene que utilizar el comando "npm i" para descargar todos los paquetes y npm run dev para iniciar el proyecto.
