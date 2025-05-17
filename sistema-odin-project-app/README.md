Create NextJS project with PostgreSQL

1) Download and install Node.js.

2) Create NextJS working environment with the command: npx create-next-app "project name"

3) Create database in Supabase.

4) Configure the connection in utils and set up .env variables

//desarrollos.odin@gmail.com
//sistema_odin_db_Developer.500

5) Create an IMGBB account and assign the apikey to NEXT_PUBLIC_IMGBB_API_KEY
    - Create account at https://imgbb.com/
    - Get api_key at https://api.imgbb.com/
    - Assign it to NEXT_PUBLIC_IMGBB_API_KEY

6) Create manifest file to transform the web into a progressive web app (PWA)
    - Generate manifest at https://www.simicart.com/manifest-generator.html/ (or another generator)
    - Unzip the file in /public
    - Change manifest.webmanifest name to manifest.json

7) Create a Resend account (with the email that will receive messages) and assign the apikey to NEXT_PUBLIC_EMAIL_API_KEY

    - Create account at https://resend.com/login
    - Get api_key
    - Assign it to NEXT_PUBLIC_EMAIL_API_KEY
