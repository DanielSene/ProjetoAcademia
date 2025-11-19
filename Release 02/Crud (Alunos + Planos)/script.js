/* ============================
   PLANOS
============================ */
function cadastrarPlano() {
    const nome = document.getElementById("pl_nome").value.trim();
    const duracao = parseInt(document.getElementById("pl_duracao").value);
    const valor = parseFloat(document.getElementById("pl_valor").value);

    if (!nome || isNaN(duracao) || duracao <= 0 || isNaN(valor) || valor <= 0) {
        alert("Preencha tudo corretamente!");
        return;
    }

    const planos = JSON.parse(localStorage.getItem("planos")) || [];
    planos.push({ nome, duracao, valor });
    localStorage.setItem("planos", JSON.stringify(planos));

    alert("Plano cadastrado com sucesso!");
    document.getElementById("pl_nome").value = "";
    document.getElementById("pl_duracao").value = "";
    document.getElementById("pl_valor").value = "";

    mostrarPlanos(planos);
}

function mostrarPlanos(lista) {
    const div = document.getElementById("resultadoPlanos");
    if (!div) return;
    if (lista.length === 0) { div.innerHTML = "<p>Nenhum plano cadastrado.</p>"; return; }

    div.innerHTML = lista.map(p => `
        <div class="item-lista">
            <strong>${p.nome}</strong><br>
            Duração: ${p.duracao} meses<br>
            Valor: R$ ${p.valor.toFixed(2)}
        </div>
    `).join("");
}

function buscarPlano() {
    const termo = document.getElementById("searchPlano").value.trim().toLowerCase();
    const planos = JSON.parse(localStorage.getItem("planos")) || [];
    const filtrados = planos.filter(p => p.nome.toLowerCase().includes(termo));
    mostrarPlanos(filtrados);
}

/* ============================
   ALUNOS
============================ */
function cadastrarAluno() {
    const nome = document.getElementById("cad_nome").value.trim();
    const cpf = document.getElementById("cad_cpf").value.trim();
    const email = document.getElementById("cad_email").value.trim();
    const tel = document.getElementById("cad_tel").value.trim();
    const plano = document.getElementById("cad_plano").value;

    if (!nome || !cpf || !email || !plano) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    const alunos = JSON.parse(localStorage.getItem("alunos")) || [];
    alunos.push({ nome, cpf, email, tel, plano });
    localStorage.setItem("alunos", JSON.stringify(alunos));

    alert("Aluno cadastrado com sucesso!");
    document.getElementById("cad_nome").value = "";
    document.getElementById("cad_cpf").value = "";
    document.getElementById("cad_email").value = "";
    document.getElementById("cad_tel").value = "";
    document.getElementById("cad_plano").value = "";

    mostrarAlunos(alunos);
}

function mostrarAlunos(lista) {
    const div = document.getElementById("resultadoAlunos");
    if (!div) return;
    if (lista.length === 0) { div.innerHTML = "<p>Nenhum aluno cadastrado.</p>"; return; }

    const planos = JSON.parse(localStorage.getItem("planos")) || [];
    const aulas = JSON.parse(localStorage.getItem("aulas")) || [];

    div.innerHTML = lista.map(a => {
        const plano = planos.find(p => p.nome === a.plano);
        const aulasDoPlano = aulas.filter(au => au.plano === a.plano);
        const listaAulas = aulasDoPlano.length > 0
            ? aulasDoPlano.map(au => `<li>${au.nome} - ${au.dia} às ${au.horario} (${au.professor})</li>`).join("")
            : "<li>Sem aulas associadas a este plano</li>";

        return `
            <div class="item-lista">
                <strong>Nome:</strong> ${a.nome}<br>
                <strong>CPF:</strong> ${a.cpf}<br>
                <strong>Email:</strong> ${a.email}<br>
                <strong>Telefone:</strong> ${a.tel}<br>
                <strong>Plano:</strong> ${plano ? plano.nome + " - " + plano.duracao + " meses / R$ " + plano.valor.toFixed(2) : "Não encontrado"}<br>
                <strong>Aulas do Plano:</strong>
                <ul>${listaAulas}</ul>
            </div>
        `;
    }).join("");
}

function buscarAluno() {
    const termo = document.getElementById("searchInput").value.trim().toLowerCase();
    const alunos = JSON.parse(localStorage.getItem("alunos")) || [];
    const filtrados = alunos.filter(a => a.nome.toLowerCase().includes(termo));
    mostrarAlunos(filtrados);
}

/* ============================
   AULAS
============================ */
function cadastrarAula() {
    const nome = document.getElementById("au_nome").value.trim();
    const dia = document.getElementById("au_dia").value.trim();
    const horario = document.getElementById("au_horario").value.trim();
    const professor = document.getElementById("au_professor").value.trim();
    const capacidade = parseInt(document.getElementById("au_capacidade").value);
    const plano = document.getElementById("au_plano").value;

    if (!nome || !dia || !horario || !professor || isNaN(capacidade) || capacidade <= 0 || !plano) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    const aulas = JSON.parse(localStorage.getItem("aulas")) || [];
    aulas.push({ nome, dia, horario, professor, capacidade, plano });
    localStorage.setItem("aulas", JSON.stringify(aulas));

    alert("Aula cadastrada com sucesso!");
    document.getElementById("au_nome").value = "";
    document.getElementById("au_dia").value = "";
    document.getElementById("au_horario").value = "";
    document.getElementById("au_professor").value = "";
    document.getElementById("au_capacidade").value = "";
    document.getElementById("au_plano").value = "";

    mostrarAulas(aulas);
}

function mostrarAulas(lista) {
    const div = document.getElementById("resultadoAulas");
    if (!div) return;
    if (lista.length === 0) { div.innerHTML = "<p>Nenhuma aula cadastrada.</p>"; return; }

    div.innerHTML = lista.map(au => `
        <div class="item-lista">
            <strong>${au.nome}</strong><br>
            Dia: ${au.dia}<br>
            Horário: ${au.horario}<br>
            Professor: ${au.professor}<br>
            Capacidade: ${au.capacidade}<br>
            Plano: ${au.plano}
        </div>
    `).join("");
}

function buscarAula() {
    const termo = document.getElementById("searchAula").value.trim().toLowerCase();
    const aulas = JSON.parse(localStorage.getItem("aulas")) || [];
    const filtrados = aulas.filter(au => au.nome.toLowerCase().includes(termo));
    mostrarAulas(filtrados);
}

/* ============================
   FUNCIONÁRIOS
============================ */
function cadastrarFuncionario() {
    const nome = document.getElementById("fu_nome").value.trim();
    const cargo = document.getElementById("fu_cargo").value.trim();
    const salario = parseFloat(document.getElementById("fu_salario").value);

    if (!nome || !cargo || isNaN(salario) || salario <= 0) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    const funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
    funcionarios.push({ nome, cargo, salario });
    localStorage.setItem("funcionarios", JSON.stringify(funcionarios));

    alert("Funcionário cadastrado com sucesso!");
    document.getElementById("fu_nome").value = "";
    document.getElementById("fu_cargo").value = "";
    document.getElementById("fu_salario").value = "";

    mostrarFuncionarios(funcionarios);
}

function mostrarFuncionarios(lista) {
    const div = document.getElementById("resultadoFuncionarios");
    if (!div) return;
    if (lista.length === 0) { div.innerHTML = "<p>Nenhum funcionário cadastrado.</p>"; return; }

    div.innerHTML = lista.map(f => `
        <div class="item-lista">
            <strong>${f.nome}</strong><br>
            Cargo: ${f.cargo}<br>
            Salário: R$ ${f.salario.toFixed(2)}
        </div>
    `).join("");
}

function buscarFuncionario() {
    const termo = document.getElementById("searchFuncionario").value.trim().toLowerCase();
    const funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
    const filtrados = funcionarios.filter(f => f.nome.toLowerCase().includes(termo));
    mostrarFuncionarios(filtrados);
}

/* ============================
   CARREGA PÁGINA
============================ */
function loadPage(page) {
    const content = document.getElementById("content");
    const planos = JSON.parse(localStorage.getItem("planos")) || [];

    if (page === "aluno") {
        const listaPlanos = planos.map(p => `<option>${p.nome}</option>`).join("");
        content.innerHTML = `
            <h1 class="title">Cadastro de Aluno</h1>

            <div class="search-box">
                <input id="searchInput" type="text" placeholder="Buscar aluno por nome...">
                <i class="fa fa-search" onclick="buscarAluno()"></i>
            </div>

            <div class="card">
                <h3>Dados do Aluno</h3>
                <form id="form-aluno" onsubmit="event.preventDefault(); cadastrarAluno();">
                    <input id="cad_nome" type="text" placeholder="Nome" required>
                    <input id="cad_cpf" type="text" placeholder="CPF" required>
                    <input id="cad_email" type="email" placeholder="E-mail" required>
                    <input id="cad_tel" type="text" placeholder="Telefone">
                    <select id="cad_plano" required>
                        <option value="">Selecione o Plano</option>
                        ${listaPlanos}
                    </select>
                    <button type="submit">Cadastrar</button>
                </form>
            </div>

            <div class="card">
                <h3>Resultado da Busca</h3>
                <div id="resultadoAlunos"></div>
            </div>
        `;
        mostrarAlunos(JSON.parse(localStorage.getItem("alunos")) || []);
    }

    if (page === "aulas") {
        const listaPlanos = planos.map(p => `<option>${p.nome}</option>`).join("");
        content.innerHTML = `
            <h1 class="title">Gerenciar Aulas</h1>

            <div class="search-box">
                <input id="searchAula" type="text" placeholder="Buscar aula por nome...">
                <i class="fa fa-search" onclick="buscarAula()"></i>
            </div>

            <div class="card">
                <h3>Cadastrar Aula</h3>
                <form id="form-aula" onsubmit="event.preventDefault(); cadastrarAula();">
                    <input id="au_nome" type="text" placeholder="Nome da Aula" required>
                    <input id="au_dia" type="text" placeholder="Dia (ex: Segunda)" required>
                    <input id="au_horario" type="text" placeholder="Horário (ex: 18:00)" required>
                    <input id="au_professor" type="text" placeholder="Professor" required>
                    <input id="au_capacidade" type="number" placeholder="Capacidade" required>
                    <select id="au_plano" required>
                        <option value="">Selecione o Plano</option>
                        ${listaPlanos}
                    </select>
                    <button type="submit">Salvar Aula</button>
                </form>
            </div>

            <div class="card">
                <h3>Resultado da Busca</h3>
                <div id="resultadoAulas"></div>
            </div>
        `;
        mostrarAulas(JSON.parse(localStorage.getItem("aulas")) || []);
    }

    if (page === "planos") {
        content.innerHTML = `
            <h1 class="title">Planos</h1>

            <div class="search-box">
                <input id="searchPlano" type="text" placeholder="Buscar plano por nome...">
                <i class="fa fa-search" onclick="buscarPlano()"></i>
            </div>

            <div class="card">
                <h3>Cadastrar Plano</h3>
                <form id="form-plano" onsubmit="event.preventDefault(); cadastrarPlano();">
                    <input id="pl_nome" type="text" placeholder="Nome do Plano" required>
                    <input id="pl_duracao" type="number" placeholder="Duração (meses)" required>
                    <input id="pl_valor" type="number" placeholder="Valor Mensal" required>
                    <button type="submit">Salvar Plano</button>
                </form>
            </div>

            <div class="card">
                <h3>Resultado da Busca</h3>
                <div id="resultadoPlanos"></div>
            </div>
        `;
        mostrarPlanos(JSON.parse(localStorage.getItem("planos")) || []);
    }

    if (page === "funcionarios") {
        content.innerHTML = `
            <h1 class="title">Funcionários</h1>

            <div class="search-box">
                <input id="searchFuncionario" type="text" placeholder="Buscar funcionário por nome...">
                <i class="fa fa-search" onclick="buscarFuncionario()"></i>
            </div>

            <div class="card">
                <h3>Cadastrar Funcionário</h3>
                <form id="form-func" onsubmit="event.preventDefault(); cadastrarFuncionario();">
                    <input id="fu_nome" type="text" placeholder="Nome" required>
                    <input id="fu_cargo" type="text" placeholder="Cargo" required>
                    <input id="fu_salario" type="number" placeholder="Salário" required>
                    <button type="submit">Salvar Funcionário</button>
                </form>
            </div>

            <div class="card">
                <h3>Resultado da Busca</h3>
                <div id="resultadoFuncionarios"></div>
            </div>
        `;
        mostrarFuncionarios(JSON.parse(localStorage.getItem("funcionarios")) || []);
    }
}
