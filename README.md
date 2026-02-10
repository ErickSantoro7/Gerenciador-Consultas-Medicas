🏥 Projeto – Sistema de Consultas Médicas com MongoDB

Este projeto demonstra a modelagem, inserção, consulta, atualização e agregação de dados em MongoDB, utilizando dois conceitos importantes de bancos de dados NoSQL: Modelo Integrado (Embedded) e Modelo Normalizado (Referenciado).

O objetivo é simular um sistema simples de agendamento de consultas médicas, comparando abordagens de modelagem e suas implicações práticas.


🛠️ Tecnologias Utilizadas

MongoDB

MongoDB Shell (mongosh)

Conceitos de NoSQL

Aggregation Framework



📚 Estrutura do Projeto

O banco utiliza as seguintes coleções:


📌 consultas

Armazena informações sobre as consultas médicas.

Campos principais:

_id

paciente (objeto integrado)

nome

cpf

medico (modelo integrado)

nome

crm

especialidade

dataConsulta

horario

status

medico_id (usado no modelo normalizado)



📌 medicos

Coleção utilizada no modelo normalizado, armazenando apenas os dados dos médicos.

Campos principais:

_id

nome

crm

especialidade



🧠 Modelagem de Dados
🔹 Modelo Integrado (Embedded)

Os dados do médico são armazenados diretamente dentro do documento da consulta.

Vantagens:

Consultas mais simples

Menor uso de $lookup

Melhor performance para leitura

Desvantagens:

Redundância de dados

Atualizações podem afetar múltiplos documentos



🔹 Modelo Normalizado (Referenciado)

Os dados do médico ficam em uma coleção separada (medicos) e são referenciados por medico_id.

Vantagens:

Menor redundância

Atualizações centralizadas

Melhor manutenção dos dados

Desvantagens:

Consultas mais complexas

Necessidade de $lookup



⚙️ Funcionalidades Implementadas

✔️ Inserção de múltiplos documentos (insertMany)
✔️ Consultas simples (find)
✔️ Atualizações (updateOne e updateMany)
✔️ Agregações com $group, $lookup, $unwind e $project
✔️ Comparação prática entre modelos de dados
✔️ Contagem de consultas por médico



📊 Exemplos de Agregação
🔹 Quantidade de consultas por médico (Modelo Integrado)
db.consultas.aggregate([
  {
    $group: {
      _id: "$medico.nome",
      totalConsultas: { $sum: 1 }
    }
  }
]);


🔹 Quantidade de consultas por médico (Modelo Normalizado)
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


🎯 Objetivo do Projeto

Este projeto foi desenvolvido com foco em aprendizado prático de:

MongoDB

Modelagem NoSQL

Diferenças entre Embedded x Referenced

Operações CRUD

Agregações avançadas

Estruturação de dados para sistemas reais

É ideal para demonstrar conhecimentos em Banco de Dados, Back-end e Segurança da Informação, especialmente no que se refere à organização e integridade dos dados.
