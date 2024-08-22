import axios from 'axios';

const MERCADO_PAGO_ACCESS_TOKEN = 'SEU_ACCESS_TOKEN';

const api = axios.create({
  baseURL: 'https://api.mercadopago.com/v1',
  headers: {
    Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
  },
});

async function criarPagamento() {
  try {
    const pagamentoData = {
      transaction_amount: 100.0,
      description: 'Compra Teste',
      payment_method_id: 'pix',
      payer: {
        email: 'email_teste@exemplo.com',
        first_name: 'Nome',
        last_name: 'Sobrenome',
        identification: {
          type: 'CPF',
          number: '12345678900',
        },
        address: {
          zip_code: '12345678',
          street_name: 'Rua Exemplo',
          street_number: '123',
          neighborhood: 'Bairro Exemplo',
          city: 'São Paulo',
          federal_unit: 'SP',
        },
      },
    };

    const respostaPagamento = await api.post('/payments', pagamentoData);
    const { id, point_of_interaction } = respostaPagamento.data;

    console.log('Pagamento criado com sucesso:', id);
    console.log('QR Code disponível em:', point_of_interaction.transaction_data.qr_code);
    console.log('Imagem do QR Code:', point_of_interaction.transaction_data.qr_code_base64);

    return id;
  } catch (error) {
    console.error('Erro ao criar pagamento:', error.response?.data || error.message);
    throw error;
  }
}

async function verificarPagamento(id: string) {
  try {
    const respostaPagamento = await api.get(`/payments/${id}`);
    console.log('Detalhes do pagamento:', respostaPagamento.data);

    const status = respostaPagamento.data.status;
    console.log('Status do pagamento:', status);

    if (status === 'approved') {
      console.log('Pagamento aprovado!');
    } else {
      console.log('Pagamento ainda não aprovado.');
    }
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error.response?.data || error.message);
    throw error;
  }
}

async function main() {
  const id = await criarPagamento();
  // Aguarde alguns segundos antes de verificar o status do pagamento
  setTimeout(async () => {
    await verificarPagamento(id);
  }, 10000); // 10 segundos
}

main().catch((error) => console.error('Erro na execução:', error.message));
