import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { selecoes } from "../data/selecoes";
import MeusPalpites from "../components/MeusPalpites";
import Ranking from "../components/Ranking";
import Pontuacao from "../components/Pontuacao";
import Perfil from "../components/Perfil";
import RankingJogadores from "../components/RankingJogadores";
import PalpiteModal from "../components/PalpiteModal";
import logo from "../assets/logo.png";
export default function PlayerDashboard({
  usuario,
  onLogout
}) {
  const [jogos, setJogos] = useState([]);

  const [totalPalpites, setTotalPalpites] =
    useState(0);

  const [pontos, setPontos] =
    useState(0);

  const [ranking, setRanking] =
    useState("-");

  const [telaAtual, setTelaAtual] =
    useState("inicio");

  const [modalAberto, setModalAberto] =
    useState(false);

  const [jogoSelecionado, setJogoSelecionado] =
    useState(null);

  const [golsCasa, setGolsCasa] =
    useState("");

  const [golsFora, setGolsFora] =
    useState("");

  useEffect(() => {
    carregarJogos();

    if (usuario?.id) {
      carregarPalpites();
      carregarRanking();
    }
  }, []);

  async function carregarJogos() {
    const { data, error } = await supabase
      .from("jogos")
      .select("*")
      .eq("status", "aberto")
      .order("id");

    if (error) {
      console.log(error);
      return;
    }

    setJogos(data || []);
  }

  async function carregarPalpites() {
    const { data, error } = await supabase
      .from("palpites")
      .select("*")
      .eq("usuario_id", usuario.id);

    if (error) {
      console.log(error);
      return;
    }

    setTotalPalpites(
      data?.length || 0
    );

    const somaPontos =
      (data || []).reduce(
        (total, item) =>
          total + (item.pontos || 0),
        0
      );

    setPontos(somaPontos);
  }

  async function carregarRanking() {
    const { data, error } = await supabase
      .from("palpites")
      .select(`
        usuario_id,
        pontos
      `);

    if (error) {
      console.log(error);
      return;
    }

    const rankingMap = {};

    (data || []).forEach(
      (item) => {
        if (
          !rankingMap[
            item.usuario_id
          ]
        ) {
          rankingMap[
            item.usuario_id
          ] = 0;
        }

        rankingMap[
          item.usuario_id
        ] +=
          item.pontos || 0;
      }
    );

    const rankingArray =
      Object.entries(
        rankingMap
      )
        .map(
          ([usuarioId, pontos]) => ({
            usuarioId,
            pontos
          })
        )
        .sort(
          (a, b) =>
            b.pontos -
            a.pontos
        );

    const minhaPosicao =
      rankingArray.findIndex(
        (item) =>
          item.usuarioId ===
          usuario.id
      );

    setRanking(
      minhaPosicao >= 0
        ? `${minhaPosicao + 1}º`
        : "-"
    );
  }

  function abrirModal(jogo) {
    setJogoSelecionado(jogo);
    setGolsCasa("");
    setGolsFora("");
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);

    setJogoSelecionado(null);

    setGolsCasa("");

    setGolsFora("");
  }

  async function salvarPalpite() {
    if (
      golsCasa === "" ||
      golsFora === ""
    ) {
      alert(
        "Preencha os placares."
      );
      return;
    }

    const {
      data: palpiteExistente
    } = await supabase
      .from("palpites")
      .select("*")
      .eq(
        "usuario_id",
        usuario.id
      )
      .eq(
        "jogo_id",
        jogoSelecionado.id
      )
      .maybeSingle();

    if (palpiteExistente) {
      alert(
        "Você já deu palpite neste jogo."
      );

      fecharModal();

      return;
    }

    const { error } =
      await supabase
        .from("palpites")
        .insert([
          {
            usuario_id:
              usuario.id,

            jogo_id:
              jogoSelecionado.id,

            gols_casa:
              Number(
                golsCasa
              ),

            gols_fora:
              Number(
                golsFora
              )
          }
        ]);

    if (error) {
      console.log(error);

      alert(
        "Erro ao salvar palpite"
      );

      return;
    }

    alert(
      "Palpite salvo com sucesso!"
    );

    fecharModal();

    carregarPalpites();

    carregarRanking();
  }

  function pegarBandeira(
    nomeTime
  ) {
    const selecao =
      selecoes.find(
        (item) =>
          item.nome.toLowerCase() ===
          nomeTime.toLowerCase()
      );

    return (
      selecao?.bandeira ||
      ""
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div style={styles.logoContainer}>
  <img
    src={logo}
    alt="Logo"
    style={styles.logoImage}
  />
</div>

        <button
  style={styles.menuButton}
  onClick={() =>
    setTelaAtual("inicio")
  }
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#ff6b00";
    e.currentTarget.style.transform = "translateX(6px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#11264d";
    e.currentTarget.style.transform = "translateX(0px)";
  }}
>
  🏠 Início
</button>

        <button
  style={styles.menuButton}
  onClick={() =>
    setTelaAtual("palpites")
  }
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#ff6b00";
    e.currentTarget.style.transform = "translateX(6px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#11264d";
    e.currentTarget.style.transform = "translateX(0px)";
  }}
>
  🎯 Meus Palpites
</button>
        <button
  style={styles.menuButton}
  onClick={() =>
    setTelaAtual("ranking")
  }
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#ff6b00";
    e.currentTarget.style.transform = "translateX(6px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#11264d";
    e.currentTarget.style.transform = "translateX(0px)";
  }}
>
  🏆 Ranking
</button>

        <button
  style={styles.menuButton}
  onClick={() =>
    setTelaAtual("pontuacao")
  }
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#ff6b00";
    e.currentTarget.style.transform = "translateX(6px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#11264d";
    e.currentTarget.style.transform = "translateX(0px)";
  }}
>
  ⭐ Minha Pontuação
</button>

        <button
  style={styles.menuButton}
  onClick={() =>
    setTelaAtual("perfil")
  }
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#ff6b00";
    e.currentTarget.style.transform = "translateX(6px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#11264d";
    e.currentTarget.style.transform = "translateX(0px)";
  }}
>
  👤 Perfil
</button>
        <button
  style={styles.logout}
  onClick={onLogout}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#ff6b00";
    e.currentTarget.style.transform = "translateX(6px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#ff5c00";
    e.currentTarget.style.transform = "translateX(0px)";
  }}
>
  🚪 Sair
</button>
      </div>

     <div style={styles.content}>

  {telaAtual === "inicio" && (
    <>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Bem-vindo ao Bolão 🔥
          </h1>

          <p style={styles.subtitle}>
            Faça seus palpites e suba no ranking
          </p>
        </div>

        <div style={styles.userBox}>
          <div style={styles.avatar}>
            👤
          </div>

          <div>
            <div style={styles.userName}>
              {usuario?.nome || "Jogador"}
            </div>

            <div style={styles.online}>
              ● Online
            </div>
          </div>
        </div>
      </div>

      <div style={styles.cards}>
        <div style={styles.orangeCard}>
          <h2>{jogos.length}</h2>
          <p>Jogos disponíveis</p>
        </div>

        <div style={styles.blueCard}>
          <h2>{pontos}</h2>
          <p>Pontuação</p>
        </div>

        <div style={styles.orangeCard}>
          <h2>{ranking}</h2>
          <p>Ranking</p>
        </div>

        <div style={styles.blueCard}>
          <h2>{totalPalpites}</h2>
          <p>Palpites feitos</p>
        </div>
      </div>

      <div style={styles.gamesBox}>
        <h2 style={styles.sectionTitle}>
          ⚽ Jogos da Rodada
        </h2>

        {jogos.map((jogo) => (
          <div
            key={jogo.id}
            style={styles.match}
          >
            <div style={styles.team}>
              <img
                src={pegarBandeira(
                  jogo.time_casa
                )}
                alt=""
                style={styles.flag}
              />

              <span>
                {jogo.time_casa}
              </span>
            </div>

            <span style={styles.x}>
              X
            </span>

            <div style={styles.team}>
              <img
                src={pegarBandeira(
                  jogo.time_fora
                )}
                alt=""
                style={styles.flag}
              />

              <span>
                {jogo.time_fora}
              </span>
            </div>

            <button
              style={styles.betButton}
              onClick={() =>
                abrirModal(jogo)
              }
            >
              Dar Palpite
            </button>
          </div>
        ))}
      </div>
    </>
  )}

  {telaAtual === "palpites" && (
    <MeusPalpites
      usuario={usuario}
    />
  )}

  {telaAtual === "ranking" && (
    <Ranking
      usuario={usuario}
    />
  )}

  {telaAtual === "pontuacao" && (
    <Pontuacao
      pontos={pontos}
    />
  )}

  {telaAtual === "perfil" && (
    <Perfil
      usuario={usuario}
    />
  )}

  <PalpiteModal
    aberto={modalAberto}
    jogoSelecionado={
      jogoSelecionado
    }
    golsCasa={golsCasa}
    golsFora={golsFora}
    setGolsCasa={
      setGolsCasa
    }
    setGolsFora={
      setGolsFora
    }
    onClose={fecharModal}
    onSave={salvarPalpite}
  />

</div>
</div>
);
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial"
  },

  sidebar: {
    width: "280px",
    minWidth: "280px",
    padding: "30px 20px",
    background: "#02142e",
    display: "flex",
    flexDirection: "column"
  },

  logo: {
    color: "#ff6b00",
    fontSize: "30px",
    marginBottom: "40px"
  },

  logoImage: {
    width: "180px",
    height: "auto",
    marginBottom: "30px",
    marginLeft: "auto",
    marginRight: "auto",
    display: "block"
  },

  menuButton: {
    backgroundColor: "#11264d",
    color: "white",
    border: "none",
    borderRadius: "14px",
    padding: "16px 20px",
    marginBottom: "16px",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "16px",
    fontWeight: "600",
    width: "100%",
    transition: "all 0.3s ease"
  },

  logout: {
    width: "100%",
    marginTop: "30px",
    padding: "16px",
    background: "#ff5c00",
    color: "white",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer"
  },

  content: {
    flex: 1,
    padding: "35px",
    background:
      "linear-gradient(135deg,#081b3d,#ff5c00)"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "40px"
  },

  title: {
    color: "white"
  },

  subtitle: {
    color: "white"
  },

  userBox: {
    display: "flex",
    gap: "12px",
    color: "white"
  },

  avatar: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    background: "#ff6b00",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  userName: {
    fontWeight: "bold"
  },

  online: {
    color: "#4ade80"
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4,1fr)",
    gap: "20px",
    marginBottom: "30px"
  },

  orangeCard: {
    padding: "30px",
    borderRadius: "20px",
    color: "white",
    background: "#ff6b00"
  },

  blueCard: {
    padding: "30px",
    borderRadius: "20px",
    color: "white",
    background: "#005eff"
  },

  gamesBox: {
    padding: "30px",
    borderRadius: "20px",
    background:
      "rgba(0,0,0,0.25)"
  },

  sectionTitle: {
    color: "white"
  },

  match: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    color: "white",
    padding: "20px",
    marginTop: "15px",
    background:
      "rgba(0,0,0,0.25)",
    borderRadius: "16px"
  },

  team: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "220px"
  },

  flag: {
    width: "32px",
    height: "32px",
    borderRadius: "50%"
  },

  x: {
    fontWeight: "bold"
  },

  betButton: {
    background: "#ff6b00",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "12px",
    cursor: "pointer"
  }
};