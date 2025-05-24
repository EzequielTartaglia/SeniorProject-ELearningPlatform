import mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

const mercadoPagoConfig = mercadopago
export default mercadoPagoConfig;
