-- Insert roles into cc_user_roles
INSERT INTO public.cc_user_roles (id, name)
VALUES 
  (1, 'Auditor'),
  (2, 'Administrador (empresa)'),
  (3, 'Administrador (empresas)'),  -- Admin de empresas
  (4, 'root'),                      -- Super user (Developer)
  (5, 'Operador de Stock'),
  (6, 'Administrador de Stock (empresa)'),
  (7, 'Gerente general (empresa)');

-- Insert user into cc_states
INSERT INTO public.cc_states (id, name) 
VALUES 
(1, 'Sin iniciar'),
(2, 'Pendiente'),
(3, 'Pagado'),
(4, 'Finalizado'),
(5, 'En proceso');


-- Insert user into cc_currency_types
INSERT INTO public.cc_currency_types (id, abbreviation, name) 
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

-- Insert data into cc_countries table
INSERT INTO public.cc_countries (id, abbreviation, name) VALUES
(1, 'ARG', 'Argentina'),
(2, 'BRA', 'Brazil'),
(3, 'CRI', 'Costa Rica'),
(4, 'COL', 'Colombia'),
(5, 'EUR', 'European Union'),
(6, 'GBR', 'United Kingdom'),
(7, 'HND', 'Honduras'),
(8, 'MEX', 'Mexico'),
(9, 'PER', 'Peru'),
(10, 'CHL', 'Chile'),
(11, 'USA', 'United States'),
(12, 'URY', 'Uruguay');

-- Insert data into cc_user_genders table
INSERT INTO public.cc_user_genders (id, abbreviation, name) VALUES
(1, 'M', 'Masculino'),
(2, 'F', 'Femenino'),
(3, 'NB', 'No binario'),
(4, 'NA', 'Prefiero no responder');

-- Insert data into cc_payment_methods table
INSERT INTO public.cc_payment_methods (name)
VALUES ('Mercado Pago');

-- Insert user into cc_user_businesses
INSERT INTO public.cc_user_businesses (
  id,name, enabled_plugins) VALUES 
  (1,'Sistema Odin', '[1,2]');

-- Insert user into cc_plugins
INSERT INTO cc_plugins (id, name, description) VALUES 
(1,'Gestion de Auditorías', 'Permite gestionar auditorías internas de la empresa'),
(2,'Control de Stock', 'Permite gestionar y controlar el inventario de productos');

-- Insert user into cc_users
INSERT INTO public.cc_users (id,
  first_name, last_name, phone, email, username, password, is_root, cc_user_role_id, is_active, token, dni_ssn, cc_country_id, cc_user_gender_id, birthdate, cc_user_business_id, created_by_user_id
)
VALUES 
  (1,'Ezequiel', 'Tartaglia', '2216794817', 'ezequielmtartaglia@gmail.com', 'Ezequiel M. Tartaglia', '123123123', true, 4, false, null, '12312312', 1, 1,'1994-08-18',1,1);

-- Insert user into cc_settings
INSERT INTO public.cc_settings (
  contact_number, developer_name, developer_contact_email
)
VALUES 
  ('', 'Ezequiel M. Tartaglia', 'ezequielmtartaglia@gmail.com');

-- Insert cc_audit_document_template_checkpoint_type into cc_audit_document_template_checkpoint_types
INSERT INTO public.cc_audit_document_template_checkpoint_types (name, description)
VALUES
  ('Verificación', 'Este punto de control se utiliza para verificar si se está cumpliendo con los requisitos o estándares establecidos.'),
  ('Recomendación', 'Este punto de control se utiliza para proporcionar sugerencias o mejoras basadas en los hallazgos durante la auditoría.'),
  ('Evaluación', 'Este punto de control se utiliza para evaluar el desempeño de los procesos o sistemas auditados.'),
  ('Cumplimiento', 'Este punto de control se utiliza para asegurar que se cumplan todas las normativas legales o internas durante la auditoría.'),
  ('Riesgo', 'Este punto de control se utiliza para identificar y evaluar los riesgos potenciales en los procesos auditados.');

INSERT INTO public.cc_audit_document_rating_options (id, name)
VALUES
  (1, 'No verificado'),
  (2, 'Implementado'),
  (3, 'Parcialmente implementado'),
  (4, 'No implementado'),
  (5, 'No aplica');