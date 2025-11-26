js
// ======== helpers: localStorage =========
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ======== página loader =========
function loadPage(page) {
  const content = document.getElementById("content");
  content.innerHTML = "";
  if (page === "aluno") renderPageAluno();
  else if (page === "planos") renderPagePlanos();
  else if (page === "aulas") renderPageAulas();
  else if (page === "funcionarios") renderPageFuncionarios();
  else if (page === "avaliacao") renderPageAvaliacao();
  else {
    // página inicial padrão
    document.getElementById("content").innerHTML = `
      <h1 class="title text-info fw-bold">Bem-vindo ao Sistema da Academia</h1>
      <div class="card bg-secondary text-light mt-4 p-4 shadow">
        <h3>Selecione uma opção no menu ao lado.</h3>
        <p>O conteúdo aparecerá aqui.</p>
      </div>
    `;
  }
}

/* ======================================================
   ALUNOS
   ====================================================== */
function renderPageAluno() {
  const planos = getData("planos");
  document.getElementById("content").innerHTML = `
    <h1 class="title">Alunos</h1>

    <div class="search-box">
        <input id="searchAluno" type="text" placeholder="Buscar por nome ou matrícula...">
        <i class="fa fa-search" onclick="buscarAluno()"></i>
    </div>

    <div class="card">
        <h3>Cadastrar / Editar Aluno</h3>
        <form id="form-aluno" onsubmit="event.preventDefault(); salvarAluno();">
            <input id="aluno_id" type="hidden">

            <input id="aluno_nome" class="form-control" type="text" placeholder="Nome" required>
            <input id="aluno_cpf" class="form-control" type="text" placeholder="CPF" required>
            <input id="aluno_email" class="form-control" type="email" placeholder="E-mail" required>
            <input id="aluno_tel" class="form-control" type="text" placeholder="Telefone">
            <input id="aluno_nascimento" class="form-control" type="date" placeholder="Data de Nascimento">
            <input id="aluno_matricula" class="form-control" type="text" placeholder="Matrícula (opcional)">
            
            <select id="aluno_plano" class="form-select" required>
                <option value="">Selecione um plano</option>
                ${planos.map(p => `<option value="${p.id}">${p.nome}</option>`).join("")}
            </select>

            <button class="btn btn-primary mt-2" type="submit">Salvar</button>
        </form>
    </div>

    <div class="card">
        <h3>Resultado</h3>
        <div id="resultadoAlunos"></div>
    </div>
  `;
  mostrarAlunos(getData("alunos"));
}

function salvarAluno() {
  let alunos = getData("alunos");

  const id = document.getElementById("aluno_id").value;
  const nome = document.getElementById("aluno_nome").value.trim();
  const cpf = document.getElementById("aluno_cpf").value.trim();
  const email = document.getElementById("aluno_email").value.trim();
  const tel = document.getElementById("aluno_tel").value.trim();
  const nascimento = document.getElementById("aluno_nascimento").value;
  const matricula = document.getElementById("aluno_matricula").value.trim();
  const plano = document.getElementById("aluno_plano").value;

  if (!nome || !cpf || !email || !plano) {
    alert("Preencha nome, CPF, email e plano.");
    return;
  }

  if (id) {
    const i = alunos.findIndex(a => a.id == id);
    if (i >= 0) alunos[i] = { id, nome, cpf, email, tel, nascimento, matricula, plano };
  } else {
    const newId = Date.now();
    const genMatricula = matricula || `M-${newId.toString().slice(-6)}`;
    alunos.push({ id: newId, nome, cpf, email, tel, nascimento, matricula: genMatricula, plano });
  }

  saveData("alunos", alunos);
  renderPageAluno();
}

function mostrarAlunos(lista) {
  const container = document.getElementById("resultadoAlunos");
  const planos = getData("planos");
  const aulas = getData("aulas");

  if (!lista || lista.length === 0) {
    container.innerHTML = "<p>Nenhum aluno cadastrado.</p>";
    return;
  }

  container.innerHTML = lista.map(a => {
    const planoObj = planos.find(p => p.id == a.plano);
    const aulasPlano = aulas.filter(x => x.plano == a.plano);
    const nascimentoTxt = a.nascimento ? new Date(a.nascimento).toLocaleDateString() : "-";

    return `
      <div class="result-item d-flex align-items-start">
        <div style="flex:1">
          <b class="d-block">${a.nome}</b>
          <small class="text-muted">Matrícula: ${a.matricula} • CPF: ${a.cpf}</small><br>
          <small class="text-muted">Email: ${a.email} • Tel: ${a.tel || "-"}</small><br>
          <small class="text-muted">Nasc.: ${nascimentoTxt}</small><br>
          <small class="text-muted">Plano: ${planoObj ? planoObj.nome : "N/A"}</small>

          <div class="mt-2">
            <b>Aulas do plano:</b><br>
            ${aulasPlano.length > 0 ? aulasPlano.map(x => `<small class="d-block">• ${x.nome} ${x.dia ? "• " + x.dia : ""} ${x.horario ? "• " + x.horario : ""}</small>`).join("") : '<small class="text-muted">Nenhuma aula vinculada</small>'}
          </div>
        </div>

        <div class="ms-3 text-end">
          <button class="edit-btn btn btn-warning btn-sm mb-2" onclick="editarAluno(${a.id})"><i class="fa fa-pen"></i> Editar</button><br>
          <button class="delete-btn btn btn-danger btn-sm" onclick="excluirAluno(${a.id})"><i class="fa fa-trash"></i> Excluir</button>
        </div>
      </div>
    `;
  }).join("");
}

function buscarAluno() {
  const termo = document.getElementById("searchAluno").value.toLowerCase().trim();
  const alunos = getData("alunos");

  const filtrados = alunos.filter(a =>
    (a.nome && a.nome.toLowerCase().includes(termo)) ||
    (a.matricula && a.matricula.toLowerCase().includes(termo))
  );

  mostrarAlunos(filtrados);
}

function editarAluno(id) {
  const a = getData("alunos").find(x => x.id == id);
  if (!a) return alert("Aluno não encontrado.");

  document.getElementById("aluno_id").value = a.id;
  document.getElementById("aluno_nome").value = a.nome;
  document.getElementById("aluno_cpf").value = a.cpf;
  document.getElementById("aluno_email").value = a.email;
  document.getElementById("aluno_tel").value = a.tel;
  document.getElementById("aluno_nascimento").value = a.nascimento || "";
  document.getElementById("aluno_matricula").value = a.matricula || "";
  document.getElementById("aluno_plano").value = a.plano;
}

function excluirAluno(id) {
  if (!confirm("Deseja realmente excluir este aluno?")) return;
  const updated = getData("alunos").filter(a => a.id != id);
  saveData("alunos", updated);
  renderPageAluno();
}

/* ======================================================
   PLANOS
   ====================================================== */
function renderPagePlanos() {
  document.getElementById("content").innerHTML = `
    <h1 class="title">Planos</h1>

    <div class="search-box">
        <input id="searchPlano" type="text" placeholder="Buscar plano por nome...">
        <i class="fa fa-search" onclick="buscarPlano()"></i>
    </div>

    <div class="card">
        <h3>Cadastrar / Editar Plano</h3>
        <form id="form-plano" onsubmit="event.preventDefault(); salvarPlano();">
            <input id="plano_id" type="hidden">

            <input id="plano_nome" class="form-control" type="text" placeholder="Nome do plano" required>
            <input id="plano_duracao" class="form-control" type="number" min="1" placeholder="Duração (meses)" required>
            <input id="plano_valor" class="form-control" type="number" step="0.01" min="0" placeholder="Valor mensal (R$)" required>

            <button class="btn btn-primary mt-2" type="submit">Salvar</button>
        </form>
    </div>

    <div class="card">
        <h3>Resultado</h3>
        <div id="resultadoPlanos"></div>
    </div>
  `;
  mostrarPlanos(getData("planos"));
}

function salvarPlano() {
  let planos = getData("planos");

  const id = document.getElementById("plano_id").value;
  const nome = document.getElementById("plano_nome").value.trim();
  const duracao = parseInt(document.getElementById("plano_duracao").value);
  const valor = parseFloat(document.getElementById("plano_valor").value);

  if (!nome || isNaN(duracao) || duracao <= 0 || isNaN(valor) || valor < 0) {
    alert("Preencha nome, duração e valor corretamente.");
    return;
  }

  if (id) {
    const idx = planos.findIndex(p => p.id == id);
    if (idx >= 0) planos[idx] = { id, nome, duracao, valor };
  } else {
    planos.push({ id: Date.now(), nome, duracao, valor });
  }

  saveData("planos", planos);
  renderPagePlanos();
}

function mostrarPlanos(lista) {
  const container = document.getElementById("resultadoPlanos");
  if (!lista || lista.length === 0) {
    container.innerHTML = "<p>Nenhum plano cadastrado.</p>";
    return;
  }

  container.innerHTML = `
    <div class="cards-grid">
      ${lista.map(p => `
        <div class="card-box">
          <h3>${p.nome}</h3>
          <p>${p.duracao} meses • R$ ${Number(p.valor).toFixed(2)}</p>
          <div class="mt-3">
            <button class="btn btn-warning btn-sm" onclick="editarPlano(${p.id})"><i class="fa fa-pen"></i> Editar</button>
            <button class="btn btn-danger btn-sm" onclick="excluirPlano(${p.id})"><i class="fa fa-trash"></i> Excluir</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function buscarPlano() {
  const termo = document.getElementById("searchPlano").value.trim().toLowerCase();
  const planos = getData("planos");
  mostrarPlanos(planos.filter(p => p.nome.toLowerCase().includes(termo)));
}

function editarPlano(id) {
  const p = getData("planos").find(x => x.id == id);
  if (!p) return alert("Plano não encontrado.");
  document.getElementById("plano_id").value = p.id;
  document.getElementById("plano_nome").value = p.nome;
  document.getElementById("plano_duracao").value = p.duracao;
  document.getElementById("plano_valor").value = p.valor;
}

function excluirPlano(id) {
  if (!confirm("Deseja realmente excluir este plano? Isso removerá vínculo dos alunos a este plano.")) return;
  // remover plano
  let planos = getData("planos").filter(p => p.id != id);
  saveData("planos", planos);

  // remover vínculo do plano nos alunos (definir plano = "")
  let alunos = getData("alunos").map(a => a.plano == id ? { ...a, plano: "" } : a);
  saveData("alunos", alunos);

  renderPagePlanos();
}
/* ======================================================
   AULAS
   ====================================================== */
function renderPageAulas() {
  const planos = getData("planos");
  document.getElementById("content").innerHTML = `
    <h1 class="title">Aulas</h1>

    <div class="search-box">
        <input id="searchAula" type="text" placeholder="Buscar aula por nome...">
        <i class="fa fa-search" onclick="buscarAula()"></i>
    </div>

    <div class="card">
        <h3>Cadastrar / Editar Aula</h3>
        <form id="form-aula" onsubmit="event.preventDefault(); salvarAula();">
            <input id="aula_id" type="hidden">

            <input id="aula_nome" class="form-control" type="text" placeholder="Nome da aula" required>
            <input id="aula_dia" class="form-control" type="text" placeholder="Dia (ex: Segunda)">
            <input id="aula_horario" class="form-control" type="time" placeholder="Horário">
            <input id="aula_professor" class="form-control" type="text" placeholder="Professor">
            <input id="aula_capacidade" class="form-control" type="number" min="1" placeholder="Capacidade">

            <select id="aula_plano" class="form-select" required>
                <option value="">Selecione um plano</option>
                ${planos.map(p => `<option value="${p.id}">${p.nome}</option>`).join("")}
            </select>

            <button class="btn btn-primary mt-2" type="submit">Salvar</button>
        </form>
    </div>

    <div class="card">
        <h3>Resultado</h3>
        <div id="resultadoAulas"></div>
    </div>
  `;
  mostrarAulas(getData("aulas"));
}

function salvarAula() {
  let aulas = getData("aulas");

  const id = document.getElementById("aula_id").value;
  const nome = document.getElementById("aula_nome").value.trim();
  const dia = document.getElementById("aula_dia").value.trim();
  const horario = document.getElementById("aula_horario").value;
  const professor = document.getElementById("aula_professor").value.trim();
  const capacidade = parseInt(document.getElementById("aula_capacidade").value) || 0;
  const plano = document.getElementById("aula_plano").value;

  if (!nome || !plano) {
    alert("Preencha ao menos nome e plano da aula.");
    return;
  }

  if (id) {
    const idx = aulas.findIndex(x => x.id == id);
    if (idx >= 0) aulas[idx] = { id, nome, dia, horario, professor, capacidade, plano };
  } else {
    aulas.push({ id: Date.now(), nome, dia, horario, professor, capacidade, plano });
  }

  saveData("aulas", aulas);
  renderPageAulas();
}

function mostrarAulas(lista) {
  const container = document.getElementById("resultadoAulas");
  const planos = getData("planos");
  if (!lista || lista.length === 0) {
    container.innerHTML = "<p>Nenhuma aula cadastrada.</p>";
    return;
  }

  container.innerHTML = lista.map(a => {
    const plano = planos.find(p => p.id == a.plano);
    return `
      <div class="result-item">
        <div style="flex:1">
          <b>${a.nome}</b><br>
          <small class="text-muted">${a.dia || ""} ${a.horario ? "• " + a.horario : ""} • Prof: ${a.professor || "-"}</small><br>
          <small class="text-muted">Capacidade: ${a.capacidade || "-"}</small><br>
          <small class="text-muted">Plano: ${plano ? plano.nome : "N/A"}</small>
        </div>
        <div class="ms-3 text-end">
          <button class="btn btn-warning btn-sm mb-2" onclick="editarAula(${a.id})"><i class="fa fa-pen"></i> Editar</button><br>
          <button class="btn btn-danger btn-sm" onclick="excluirAula(${a.id})"><i class="fa fa-trash"></i> Excluir</button>
        </div>
      </div>
    `;
  }).join("");
}

function buscarAula() {
  const termo = document.getElementById("searchAula").value.trim().toLowerCase();
  const aulas = getData("aulas");
  mostrarAulas(aulas.filter(a => a.nome.toLowerCase().includes(termo)));
}

function editarAula(id) {
  const a = getData("aulas").find(x => x.id == id);
  if (!a) return;
  document.getElementById("aula_id").value = a.id;
  document.getElementById("aula_nome").value = a.nome;
  document.getElementById("aula_dia").value = a.dia || "";
  document.getElementById("aula_horario").value = a.horario || "";
  document.getElementById("aula_professor").value = a.professor || "";
  document.getElementById("aula_capacidade").value = a.capacidade || "";
  document.getElementById("aula_plano").value = a.plano;
}

function excluirAula(id) {
  if (!confirm("Deseja excluir esta aula?")) return;
  const updated = getData("aulas").filter(a => a.id != id);
  saveData("aulas", updated);
  renderPageAulas();
}

/* ======================================================
   FUNCIONÁRIOS
   ====================================================== */
function renderPageFuncionarios() {
  document.getElementById("content").innerHTML = `
    <h1 class="title">Funcionários</h1>

    <div class="search-box">
        <input id="searchFuncionario" type="text" placeholder="Buscar funcionário por nome...">
        <i class="fa fa-search" onclick="buscarFuncionario()"></i>
    </div>

    <div class="card">
        <h3>Cadastrar / Editar Funcionário</h3>
        <form id="form-funcionario" onsubmit="event.preventDefault(); salvarFuncionario();">
            <input id="func_id" type="hidden">

            <input id="func_nome" class="form-control" type="text" placeholder="Nome" required>
            <input id="func_cargo" class="form-control" type="text" placeholder="Cargo" required>
            <input id="func_salario" class="form-control" type="number" step="0.01" placeholder="Salário" required>

            <button class="btn btn-primary mt-2" type="submit">Salvar</button>
        </form>
    </div>

    <div class="card">
        <h3>Resultado</h3>
        <div id="resultadoFuncionarios"></div>
    </div>
  `;
  mostrarFuncionarios(getData("funcionarios"));
}

function salvarFuncionario() {
  let funcionarios = getData("funcionarios");
  const id = document.getElementById("func_id").value;
  const nome = document.getElementById("func_nome").value.trim();
  const cargo = document.getElementById("func_cargo").value.trim();
  const salario = parseFloat(document.getElementById("func_salario").value);

  if (!nome || !cargo || isNaN(salario)) {
    alert("Preencha corretamente os dados do funcionário.");
    return;
  }

  if (id) {
    const idx = funcionarios.findIndex(f => f.id == id);
    if (idx >= 0) funcionarios[idx] = { id, nome, cargo, salario };
  } else {
    funcionarios.push({ id: Date.now(), nome, cargo, salario });
  }

  saveData("funcionarios", funcionarios);
  renderPageFuncionarios();
}

function mostrarFuncionarios(lista) {
  const container = document.getElementById("resultadoFuncionarios");
  if (!lista || lista.length === 0) {
    container.innerHTML = "<p>Nenhum funcionário cadastrado.</p>";
    return;
  }

  container.innerHTML = lista.map(f => `
    <div class="result-item d-flex align-items-center justify-content-between">
      <div>
        <b>${f.nome}</b><br>
        <small class="text-muted">Cargo: ${f.cargo} • Salário: R$ ${Number(f.salario).toFixed(2)}</small>
      </div>
      <div>
        <button class="btn btn-warning btn-sm mb-1" onclick="editarFuncionario(${f.id})"><i class="fa fa-pen"></i></button>
        <button class="btn btn-danger btn-sm" onclick="excluirFuncionario(${f.id})"><i class="fa fa-trash"></i></button>
      </div>
    </div>
  `).join("");
}

function buscarFuncionario() {
  const termo = document.getElementById("searchFuncionario").value.trim().toLowerCase();
  const funcionarios = getData("funcionarios");
  mostrarFuncionarios(funcionarios.filter(f => f.nome.toLowerCase().includes(termo)));
}

function editarFuncionario(id) {
  const f = getData("funcionarios").find(x => x.id == id);
  if (!f) return;
  document.getElementById("func_id").value = f.id;
  document.getElementById("func_nome").value = f.nome;
  document.getElementById("func_cargo").value = f.cargo;
  document.getElementById("func_salario").value = f.salario;
}

function excluirFuncionario(id) {
  if (!confirm("Deseja excluir este funcionário?")) return;
  const updated = getData("funcionarios").filter(f => f.id != id);
  saveData("funcionarios", updated);
  renderPageFuncionarios();
}
/* ======================================================
   AVALIAÇÃO FÍSICA (simples: realizada ou não)
   ====================================================== */
/* =============================
   AVALIAÇÃO FÍSICA
============================= */

function renderPageAvaliacao() {
  const content = document.getElementById("content");

  content.innerHTML = `
    <h1 class="text-info fw-bold mb-4">Avaliação Física</h1>

    <div class="card bg-secondary text-light p-4 shadow mb-4">
      <h4 class="mb-3"><i class="fa-solid fa-heart-pulse"></i> Registrar Avaliação</h4>

      <input type="hidden" id="avaliacao_id">

      <!-- Seleção do aluno -->
      <div class="mb-3">
        <label class="form-label">Aluno:</label>
        <select class="form-select" id="avaliacao_aluno">
          <option value="">Selecione um aluno</option>
          ${getData("alunos")
            .map(a => `<option value="${a.id}">${a.nome}</option>`)
            .join("")}
        </select>
      </div>

      <!-- Status Realizada -->
      <div class="mb-3">
        <label class="form-label">Avaliação realizada?</label>
        <select class="form-select" id="avaliacao_realizada">
          <option value="Sim">Sim</option>
          <option value="Não">Não</option>
        </select>
      </div>

      <button class="btn btn-info w-100" onclick="salvarAvaliacao()">
        <i class="fa-solid fa-check"></i> Salvar Avaliação
      </button>
    </div>

    <!-- BUSCA -->
    <div class="input-group mb-3">
      <input type="text" id="searchAvaliacao" class="form-control"
             placeholder="Buscar por aluno...">
      <button class="btn btn-outline-info" onclick="buscarAvaliacao()">
        <i class="fa fa-search"></i>
      </button>
    </div>

    <!-- RESULTADOS -->
    <div class="card bg-secondary p-4 shadow">
      <h4 class="mb-3">Resultados</h4>
      <div id="resultadoAvaliacao" class="table-container"></div>
    </div>
  `;

  mostrarAvaliacoes(getData("avaliacoes"));
}

function salvarAvaliacao() {
  const avaliacoes = getData("avaliacoes");

  const id = document.getElementById("avaliacao_id").value;
  const aluno = document.getElementById("avaliacao_aluno").value;
  const realizada = document.getElementById("avaliacao_realizada").value;

  if (!aluno) {
    alert("Selecione um aluno.");
    return;
  }

  if (id) {
    // Atualizar
    const idx = avaliacoes.findIndex(a => a.id == id);
    if (idx >= 0) {
      avaliacoes[idx] = { id, aluno, realizada };
    }
  } else {
    // Criar novo
    avaliacoes.push({
      id: Date.now(),
      aluno,
      realizada
    });
  }

  saveData("avaliacoes", avaliacoes);
  renderPageAvaliacao();
}

function mostrarAvaliacoes(lista) {
  const container = document.getElementById("resultadoAvaliacao");
  const alunos = getData("alunos");

  if (!lista || lista.length === 0) {
    container.innerHTML = `<p class="text-light">Nenhuma avaliação registrada.</p>`;
    return;
  }

  container.innerHTML = `
    <table class="table table-dark table-striped table-hover">
      <thead>
        <tr>
          <th>Aluno</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${lista
          .map(a => {
            const alunoObj = alunos.find(x => x.id == a.aluno);

            return `
              <tr>
                <td>${alunoObj ? alunoObj.nome : "N/A"}</td>
                <td>
                  <span class="badge ${a.realizada === "Sim" ? "bg-success" : "bg-danger"}">
                    ${a.realizada}
                  </span>
                </td>
                <td>
                  <button class="btn btn-warning btn-sm" onclick="editarAvaliacao(${a.id})">
                    <i class="fa fa-pen"></i>
                  </button>
                  <button class="btn btn-danger btn-sm" onclick="excluirAvaliacao(${a.id})">
                    <i class="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;
}

function buscarAvaliacao() {
  const termo = document.getElementById("searchAvaliacao").value.trim().toLowerCase();
  const avaliacoes = getData("avaliacoes");
  const alunos = getData("alunos");

  const filtrado = avaliacoes.filter(a => {
    const alunoObj = alunos.find(x => x.id == a.aluno);
    return alunoObj && alunoObj.nome.toLowerCase().includes(termo);
  });

  mostrarAvaliacoes(filtrado);
}

function editarAvaliacao(id) {
  const a = getData("avaliacoes").find(x => x.id == id);
  if (!a) return;

  document.getElementById("avaliacao_id").value = a.id;
  document.getElementById("avaliacao_aluno").value = a.aluno;
  document.getElementById("avaliacao_realizada").value = a.realizada;
}

function excluirAvaliacao(id) {
  if (!confirm("Excluir esta avaliação?")) return;

  const updated = getData("avaliacoes").filter(a => a.id != id);
  saveData("avaliacoes", updated);
  renderPageAvaliacao();
}