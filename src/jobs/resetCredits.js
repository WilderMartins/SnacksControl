const User = require('../models/User');

async function resetCredits() {
  console.log('Running credit reset job...');
  // Na abordagem atual, não há nada a ser feito aqui,
  // pois a verificação de crédito é feita sob demanda
  // comparando o número de consumos no dia com o limite de `daily_credits`.
  // Se tivéssemos um campo `credits_left`, a lógica de reset seria:
  // await User.update({ credits_left: 4 }, { where: {} });
  console.log('Credit reset job finished. No action needed with current logic.');
}

resetCredits();
