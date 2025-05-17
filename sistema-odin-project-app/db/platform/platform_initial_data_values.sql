-- Insert roles into platform_user_roles
INSERT INTO public.platform_user_roles (id, name, created_at)
VALUES 
  (1, 'Estudiante', NOW()),
  (2, 'Profesor', NOW()),
  (3, 'Administrador (empresa)', NOW()),
  (4, 'root', NOW()),
  (5, 'Administrador (empresas)', NOW());

-- Insert user into platform_states
INSERT INTO public.platform_states (id, name, created_at) 
VALUES 
(1, 'Sin iniciar', NOW()),
(2, 'Pendiente', NOW()),
(3, 'Pagado', NOW()),
(4, 'Finalizado', NOW());

-- Insert user into platform_user_business
INSERT INTO public.platform_user_business (
  id,name) VALUES 
  (1,'Sistema Odin');

-- Insert data into currency_types
INSERT INTO public.currency_types (id, abbreviation, name) 
VALUES 
(1, 'No aplica', 'No aplica'),              -- Sin especificar
(2, 'ARS', 'Pesos Argentinos'),             -- Argentina
(3, 'BRL', 'Reales Brasileños'),            -- Brasil
(4, 'CRC', 'Colones Costarricenses'),       -- Costa Rica
(5, 'COP', 'Pesos Colombianos'),            -- Colombia
(6, 'EUR', 'Euro'),                         -- Euro
(7, 'GBP', 'Libra Esterlina'),              -- Libra Esterlina
(8, 'HNL', 'Lempiras Hondureños'),          -- Honduras
(9, 'MXN', 'Pesos Mexicanos'),              -- México
(10, 'PEN', 'Soles Peruanos'),              -- Perú
(11, 'CLP', 'Pesos Chilenos'),              -- Chile
(12, 'USD', 'Dólar Estadounidense'),        -- Estados Unidos
(13, 'UYU', 'Pesos Uruguayos');             -- Uruguay

-- Insert data into countries table
INSERT INTO public.countries (id, abbreviation, name, created_at) VALUES
(1, 'ARG', 'Argentina', NOW()),
(2, 'BRA', 'Brazil', NOW()),
(3, 'CRI', 'Costa Rica', NOW()),
(4, 'COL', 'Colombia', NOW()),
(5, 'EUR', 'European Union', NOW()),
(6, 'GBR', 'United Kingdom', NOW()),
(7, 'HND', 'Honduras', NOW()),
(8, 'MEX', 'Mexico', NOW()),
(9, 'PER', 'Peru', NOW()),
(10, 'CHL', 'Chile', NOW()),
(11, 'USA', 'United States', NOW()),
(12, 'URY', 'Uruguay', NOW());

-- Insert data into platform_user_genders table
INSERT INTO public.platform_user_genders (id, abbreviation, name, created_at) VALUES
(1, 'M', 'Masculino', NOW()),
(2, 'F', 'Femenino', NOW()),
(3, 'NB', 'No binario', NOW()),
(4, 'NA', 'Prefiero no responder', NOW());

-- Insert data into course_levels table
INSERT INTO public.course_levels (name) VALUES
('Inicial'),
('Principiante'),
('Intermedio'),
('Avanzado');

-- Insert data into payment_methods table
INSERT INTO public.payment_methods (name)
VALUES ('Mercado Pago');

-- Insert user into course_formats
INSERT INTO public.course_formats (id, name, created_at) 
VALUES 
(1, 'Teorico', NOW()),
(2, 'Practico', NOW()),
(3, 'Teorico - Practico', NOW());

-- Insert user into course_formats
INSERT INTO public.course_platform_tools (id, name, link, created_at) 
VALUES 
(1, 'No aplica', 'No aplica' , NOW()),
(2, 'Google Drive', 'https://www.drive.google.com/', NOW()),
(3, 'Canva', 'https://www.canva.com/', NOW());

-- Insert user into platform_users
INSERT INTO public.platform_users (
  first_name, last_name, phone, email, username, password, is_root, user_role_id, created_at, is_active, token, dni_ssn, country_id, platform_user_gender_id, birthdate
)
VALUES 
  ('Ezequiel', 'Tartaglia', '2216794817', 'ezequielmtartaglia@gmail.com', 'Ezequiel M. Tartaglia', '123123123', true, 4, NOW(), false, null, '12312312', 1, 1,'1994-08-18');

-- Insert user into platform_settings
INSERT INTO public.platform_settings (
  contact_number, developer_name, developer_contact_email
)
VALUES 
  ('', 'Ezequiel M. Tartaglia', 'ezequielmtartaglia@gmail.com');
