const listaCores = [
  { nome: "vermelho", cor: "red" },
  { nome: "azul", cor: "blue" },
  { nome: "verde", cor: "green" },
  { nome: "amarelo", cor: "yellow" },
  { nome: "roxo", cor: "purple" },
  { nome: "laranja", cor: "orange" },
  { nome: "rosa", cor: "pink" },
  { nome: "ciano", cor: "cyan" },
  { nome: "marrom", cor: "brown" }
];

let corCerta = "";
let nomeCorCerta = "";
let pontos = 0;
let tempo = 20;
let contagem;

const grade = document.getElementById("colorGrid");
const mostrarCor = document.getElementById("targetColor");
const mostrarPontos = document.getElementById("score");
const mostrarTempo = document.getElementById("timer");
const botaoJogar = document.getElementById("startButton");
const inputNome = document.getElementById("playerName");
const telaFinal = document.getElementById("endScreen");
const textoFinal = document.getElementById("finalMessage");
const botaoReiniciar = document.getElementById("restartButton");

botaoJogar.addEventListener("click", iniciarJogo);
botaoReiniciar.addEventListener("click", () => location.reload());

function iniciarJogo() {
  const nome = inputNome.value.trim();

  if (nome === "") {
    alert("Ei! Digite seu nome antes de jogar 😅");
    return;
  }

  botaoJogar.disabled = true;
  inputNome.disabled = true;
  grade.style.display = "grid";
  criarGrade();
  escolherCor();
  contagem = setInterval(atualizarTempo, 1000);
}

function criarGrade() {
  grade.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const cor = listaCores[Math.floor(Math.random() * listaCores.length)];
    const caixinha = document.createElement("div");
    caixinha.style.backgroundColor = cor.cor;
    caixinha.dataset.cor = cor.cor;
    caixinha.addEventListener("click", clicouNaCor);
    grade.appendChild(caixinha);
  }
}

function escolherCor() {
  const todosQuadrados = Array.from(grade.children);
  const aleatorio = todosQuadrados[Math.floor(Math.random() * todosQuadrados.length)];
  corCerta = aleatorio.style.backgroundColor;

  const corEncontrada = listaCores.find(c => c.cor === corCerta);
  nomeCorCerta = corEncontrada ? corEncontrada.nome : corCerta;

  mostrarCor.textContent = nomeCorCerta;
}

function clicouNaCor(e) {
  const clicada = e.target.style.backgroundColor;

  if (clicada === corCerta) {
    pontos += 10;
  } else {
    pontos -= 5;
    if (pontos < 0) pontos = 0;
  }

  mostrarPontos.textContent = pontos;
  criarGrade();
  escolherCor();
}

function atualizarTempo() {
  tempo--;
  mostrarTempo.textContent = tempo;

  if (tempo <= 0) {
    clearInterval(contagem);
    finalizarJogo();
  }
}

function finalizarJogo() {
  grade.style.display = "none";
  telaFinal.style.display = "block";
  const nome = inputNome.value;
  textoFinal.textContent = `Fim de jogo, ${nome}! Você fez ${pontos} pontos.`;

  salvarRanking(nome, pontos);
  mostrarRanking();
}

function salvarRanking(nome, pontos) {
  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.push({ nome: nome, pontuacao: pontos });

  
  ranking.sort((a, b) => b.pontuacao - a.pontuacao);
  ranking = ranking.slice(0, 5);

  localStorage.setItem("ranking", JSON.stringify(ranking));
}

function mostrarRanking() {
  const divRanking = document.createElement("div");
  divRanking.classList.add("ranking");
  divRanking.innerHTML = "<h2> Ranking dos Melhores</h2>";

  const rankingSalvo = JSON.parse(localStorage.getItem("ranking")) || [];

  if (rankingSalvo.length === 0) {
    divRanking.innerHTML += "<p>Nenhum jogador ainda.</p>";
  } else {
    const lista = document.createElement("ol");

    for (let i = 0; i < rankingSalvo.length; i++) {
      const jogador = rankingSalvo[i];
      const item = document.createElement("li");
      item.textContent = `${jogador.nome} - ${jogador.pontuacao} pontos`;
      lista.appendChild(item);
    }

    divRanking.appendChild(lista);
  }

  telaFinal.appendChild(divRanking);
}
