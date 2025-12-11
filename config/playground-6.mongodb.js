// =====================================================================
// 1) INSERÇÃO DE DADOS
// =====================================================================

// -------------------------------
// MODELO INTEGRADO — consultas
// -------------------------------
db.consultas.insertMany([
  {
    _id: ObjectId("6655b1f5c9e77a1234567001"),
    paciente: {
      nome: "Carlos Silva",
      cpf: "123.456.789-00"
    },
    medico: {
      nome: "Dra. Ana Souza SeuNome",
      crm: "123456-RJ",
      especialidade: "Cardiologia"
    },
    dataConsulta: "2025-05-25",
    horario: "14:00",
    status: "Agendada"
  },
  {
    _id: ObjectId("6655b1f5c9e77a1234567002"),
    paciente: {
      nome: "Fernanda Lima",
      cpf: "987.654.321-00"
    },
    medico: {
      nome: "Dr. Pedro Almeida SeuNome",
      crm: "654321-RJ",
      especialidade: "Dermatologia"
    },
    dataConsulta: "2025-05-26",
    horario: "10:00",
    status: "Confirmada"
  }
]);

// -------------------------------
// MODELO NORMALIZADO — médicos
// -------------------------------
db.medicos.insertMany([
  {
    _id: ObjectId("6655aab1c9e77a1234567001"),
    nome: "Dra. Ana Souza SeuNome",
    crm: "123456-RJ",
    especialidade: "Cardiologia"
  },
  {
    _id: ObjectId("6655aab1c9e77a1234567002"),
    nome: "Dr. Pedro Almeida SeuNome",
    crm: "654321-RJ",
    especialidade: "Dermatologia"
  }
]);

// =====================================================================
// 2) CONSULTAS (find)
// =====================================================================

// 1) Buscar todas as consultas do paciente "Alice"
db.consultas.find({
  "paciente.nome": "Alice"
});

// 2) Consultas associadas à médica — MODELO INTEGRADO
db.consultas.find({
  "medico.nome": "Dra. Ana Souza SeuNome"
});

// 3) MODELO NORMALIZADO — buscar médico (Passo A)
db.medicos.find({
  nome: "Dra. Ana Souza SeuNome"
});

// Supondo id:
ObjectId("6655aab1c9e77a1234567001");

// Passo B — buscar consultas do médico pelo medico_id:
db.consultas.find({
  medico_id: ObjectId("6655aab1c9e77a1234567001")
});

// =====================================================================
// 3) ATUALIZAÇÕES (update)
// =====================================================================

// Atualizar data da consulta da Alice
db.consultas.updateOne(
  { "paciente.nome": "Alice" },
  { $set: { dataConsulta: "2024-10-15" } }
);

// Atualizar especialidade — MODELO INTEGRADO
db.consultas.updateMany(
  { "medico.nome": "Dra. Ana Souza SeuNome" },
  { $set: { "medico.especialidade": "Cardiologista" } }
);

// Atualizar especialidade — MODELO NORMALIZADO
db.medicos.updateOne(
  { nome: "Dra. Ana Souza SeuNome" },
  { $set: { especialidade: "Cardiologista" } }
);

// =====================================================================
// 4) EXERCÍCIO — ATUALIZAÇÕES
// =====================================================================

// 1) Atualizar data da consulta de Alice
db.consultas.updateMany(
  { "paciente.nome": "Alice" },
  { $set: { dataConsulta: "15-10-2024" } }
);

// 2) Atualizar especialidade no Modelo Integrado
db.consultas.updateMany(
  { "medico.nome": "Dra. Ana Souza SeuNome" },
  { $set: { "medico.especialidade": "Cardiologista" } }
);

// 3) Atualizar especialidade no Modelo Normalizado
db.medicos.updateMany(
  { nome: "Dra. Ana Souza SeuNome" },
  { $set: { especialidade: "Cardiologista" } }
);


// =====================================================================
// 5) EXERCÍCIO — CONSULTAS (aggregate)
// =====================================================================

// 1) Quantas consultas cada médico realizou — Modelo Integrado
db.consultas.aggregate([
  {
    $group: {
      _id: "$medico.nome",
      totalConsultas: { $sum: 1 }
    }
  }
]);

// 2) Quantas consultas cada médico realizou — Modelo Normalizado
db.consultas.aggregate([
  {
    $group: {
      _id: "$medico_id",
      totalConsultas: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: "medicos",
      localField: "_id",
      foreignField: "_id",
      as: "medico"
    }
  },
  { $unwind: "$medico" },
  {
    $project: {
      medico: "$medico.nome",
      totalConsultas: 1,
      _id: 0
    }
  }
]);

// 3) Listar consultas realizadas por "Dr. Smith" — Integrado
db.consultas.find({
  "medico.nome": "Dr. Smith"
});

// 4) Listar consultas realizadas por "Dr. Smith" — Normalizado
// Passo A:
db.medicos.find({
  nome: "Dr. Smith"
});

// Passo B:
// db.consultas.find({ medico_id: ObjectId("ID_DO_DR_SMITH") });
