// ===================== "BANCO DE DADOS" EM MEMÓRIA =====================
const alunos = [];
const planos = [];

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div style="text-align:center; margin-bottom:20px;">
      <button id="btnAlunos">Gerenciar Alunos</button>
      <button id="btnPlanos">Gerenciar Planos</button>
    </div>
    <div id="conteudo"></div>
  `;

  document.getElementById("btnAlunos").addEventListener("click", mostrarCrudAlunos);
  document.getElementById("btnPlanos").addEventListener("click", mostrarCrudPlanos);
});

// ===================== CRUD ALUNOS =====================

function mostrarCrudAlunos() {
  const conteudo = document.getElementById("conteudo");
  conteudo.innerHTML = `
    <h2>CRUD de Alunos</h2>
    <input type="hidden" id="indiceAluno">
    <input type="text" id="nome" placeholder="Nome completo">
    <input type="text" id="cpf" placeholder="CPF">
    <input type="date" id="nascimento" placeholder="Data de nascimento">
    <input type="email" id="email" placeholder="E-mail">
    <input type="text" id="telefone" placeholder="Telefone">
    <input type="text" id="endereco" placeholder="Endereço">
    <select id="plano">
      ${planos.length ? planos.map(p => `<option value="${p.nome}">${p.nome}</option>`).join('') : '<option>Nenhum plano cadastrado</option>'}
    </select>
    <button onclick="salvarAluno()">Salvar</button>

    <h3>Lista de Alunos</h3>
    <ul id="listaAlunos"></ul>
  `;
  listarAlunos();
}

function salvarAluno() {
  const nome = document.getElementById("nome").value;
  const cpf = document.getElementById("cpf").value;
  const nascimentoInput = document.getElementById("nascimento").value;
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;
  const endereco = document.getElementById("endereco").value;
  const plano = document.getElementById("plano").value;
  const indice = document.getElementById("indiceAluno").value;

  if (!nome || !cpf || !nascimentoInput) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  const nascimento = new Date(nascimentoInput);
  const idade = new Date().getFullYear() - nascimento.getFullYear();
  if (idade < 16) {
    alert("Aluno deve ter pelo menos 16 anos!");
    return;
  }

  // UPDATE
  if (indice !== "") {
    alunos[indice] = { ...alunos[indice], nome, cpf, nascimento: nascimentoInput, email, telefone, endereco, plano };
    alert("Aluno atualizado com sucesso!");
  } 
  // CREATE
  else {
    if (alunos.find(a => a.cpf === cpf)) {
      alert("CPF já cadastrado!");
      return;
    }
    alunos.push({
      nome, cpf, nascimento: nascimentoInput, email, telefone, endereco, plano,
      status: "Ativo", dataMatricula: new Date().toLocaleDateString()
    });
    alert("Aluno cadastrado com sucesso!");
  }

  document.getElementById("indiceAluno").value = "";
  listarAlunos();
}

function listarAlunos() {
  const lista = document.getElementById("listaAlunos");
  if (!lista) return;

  if (alunos.length === 0) {
    lista.innerHTML = "<p>Nenhum aluno cadastrado.</p>";
    return;
  }

  lista.innerHTML = alunos.map((a, i) => `
    <li>
      <b>${a.nome}</b> - ${a.plano} - <i>${a.status}</i><br>
      CPF: ${a.cpf} | E-mail: ${a.email} | Telefone: ${a.telefone}<br>
      Matrícula: ${a.dataMatricula}<br>
      <button onclick="editarAluno(${i})">Editar</button>
      <button onclick="excluirAluno('${a.cpf}')">Excluir</button>
    </li>
  `).join('');
}

function editarAluno(i) {
  const a = alunos[i];
  document.getElementById("indiceAluno").value = i;
  document.getElementById("nome").value = a.nome;
  document.getElementById("cpf").value = a.cpf;
  document.getElementById("nascimento").value = a.nascimento;
  document.getElementById("email").value = a.email;
  document.getElementById("telefone").value = a.telefone;
  document.getElementById("endereco").value = a.endereco;
  document.getElementById("plano").value = a.plano;
}

function excluirAluno(cpf) {
  const aluno = alunos.find(a => a.cpf === cpf);
  if (!aluno) return;
  aluno.status = "Inativo";
  listarAlunos();
  alert("Aluno marcado como inativo (exclusão lógica).");
}


// ===================== CRUD PLANOS =====================

function mostrarCrudPlanos() {
  const conteudo = document.getElementById("conteudo");
  conteudo.innerHTML = `
    <h2>CRUD de Planos</h2>
    <input type="hidden" id="indicePlano">
    <input type="text" id="nomePlano" placeholder="Nome do plano">
    <input type="number" id="duracao" placeholder="Duração (meses)">
    <input type="number" id="valor" placeholder="Valor mensal (R$)">
    <input type="text" id="descricao" placeholder="Descrição do plano">
    <button onclick="salvarPlano()">Salvar</button>

    <h3>Lista de Planos</h3>
    <ul id="listaPlanos"></ul>
  `;
  listarPlanos();
}

function salvarPlano() {
  const nome = document.getElementById("nomePlano").value;
  const duracao = parseInt(document.getElementById("duracao").value);
  const valor = parseFloat(document.getElementById("valor").value);
  const descricao = document.getElementById("descricao").value;
  const indice = document.getElementById("indicePlano").value;

  if (!nome || !duracao || !valor) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  if (duracao <= 0) {
    alert("A duração deve ser maior que 0!");
    return;
  }

  // UPDATE
  if (indice !== "") {
    planos[indice] = { ...planos[indice], nome, duracao, valor, descricao };
    alert("Plano atualizado com sucesso!");
  }
  // CREATE
  else {
    if (planos.find(p => p.nome === nome)) {
      alert("Nome de plano já existe!");
      return;
    }

    planos.push({ nome, duracao, valor, descricao, status: "Ativo" });
    alert("Plano cadastrado com sucesso!");
  }

  document.getElementById("indicePlano").value = "";
  listarPlanos();
}

function listarPlanos() {
  const lista = document.getElementById("listaPlanos");
  if (!lista) return;

  if (planos.length === 0) {
    lista.innerHTML = "<p>Nenhum plano cadastrado.</p>";
    return;
  }

  lista.innerHTML = planos.map((p, i) => `
    <li>
      <b>${p.nome}</b> - ${p.duracao} meses - R$${p.valor}<br>
      ${p.descricao}<br>
      Status: ${p.status}<br>
      <button onclick="editarPlano(${i})">Editar</button>
      <button onclick="excluirPlano('${p.nome}')">Excluir</button>
    </li>
  `).join('');
}

function editarPlano(i) {
  const p = planos[i];
  document.getElementById("indicePlano").value = i;
  document.getElementById("nomePlano").value = p.nome;
  document.getElementById("duracao").value = p.duracao;
  document.getElementById("valor").value = p.valor;
  document.getElementById("descricao").value = p.descricao;
}

function excluirPlano(nome) {
  const plano = planos.find(p => p.nome === nome);
  if (!plano) return;
  plano.status = "Inativo";
  listarPlanos();
  alert("Plano marcado como inativo (exclusão lógica).");
}