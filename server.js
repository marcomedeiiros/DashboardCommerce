const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('analytics-dashboard'));

const defaultVendas = [
  { data: '2025-07-20', valor: 1250 },
  { data: '2025-07-21', valor: 1380 },
  { data: '2025-07-22', valor: 980 },
  { data: '2025-07-23', valor: 1540 },
];

const defaultAvaliacoes = [
  { nome: 'Ana Paula', nota: 5, comentario: 'Excelente atendimento!' },
  { nome: 'Carlos Silva', nota: 4, comentario: 'Produto de qualidade!' },
];

function readJSON(fileName, defaultData) {
  const filePath = path.join(__dirname, 'data', fileName);
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.warn(`Arquivo ${fileName} não encontrado, usando dados padrão.`);
    return defaultData;
  }
}

app.get('/api/vendas', (req, res) => {
  const vendas = readJSON('vendas.json', defaultVendas);
  res.json(vendas);
});

app.get('/api/avaliacoes', (req, res) => {
  const avaliacoes = readJSON('avaliacoes.json', defaultAvaliacoes);
  res.json(avaliacoes);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});