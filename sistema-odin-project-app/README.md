Crear projecto en nextjs con PostgreSQL

1) Descargar node.js e instalar.

2) crear entorno de trabajo de nextjs con el comando:  npx create-next-app "nombre del projecto"

3) Crear db en supabase.

4) Configurar la conexion en utils y asignar las .envs

//desarrollos.odin@gmail.com
//sistema_odin_db_Developer.500

//sistemas.bohemian@gmail.com
//bohemian_db_Developer.500

//sistemas.daslabor@gmail.com
//das_labor_db_Developer.500

5) Crear una cuenta en IMGBB y asignar la apikey a NEXT_PUBLIC_IMGBB_API_KEY
    - Crear cuenta en https://imgbb.com/
    - Obtener api_key en https://api.imgbb.com/
    - Asignarla a NEXT_PUBLIC_IMGBB_API_KEY

6) Crear el archivo manifest para transformar la web a web progresiva (pwa) 
    - Generar el manifest en https://www.simicart.com/manifest-generator.html/ (u otro generador)
    - Descomprimir el archivo en /public
    - Cambiar el nombre de manifest.webmaniest a manifest.json

7) Crear una cuenta en resend (con el mail al cual llegaran los mensajes) y asignar la apikey a NEXT_PUBLIC_EMAIL_API_KEY

    - Crear cuenta en https://resend.com/login
    - Obtener api_key 
    - Asignarla a NEXT_PUBLIC_EMAIL_API_KEY
