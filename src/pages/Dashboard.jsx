import React, {
  useState,
  useEffect
} from "react";

import { supabase } from "../services/supabase";

import { selecoes } from "../data/selecoes";

import GerenciarJogos from "../components/GerenciarJogos";

import PalpitesAdmin from "../components/PalpitesAdmin";

export default function Dashboard() {
  const [menu, setMenu] =
    useState("Dashboard");

  const [jogos, setJogos] =
    useState([]);

  const [
    participantes,
    setParticipantes
  ] = useState([]);

  const [timeCasa, setTimeCasa] =
    useState("");

  const [timeFora, setTimeFora] =
    useState("");

  const [dataJogo, setDataJogo] =
    useState("");

  const [horaJogo, setHoraJogo] =
    useState("");

  const [rodada, setRodada] =
    useState("");

 

  useEffect(() => {
    buscarJogos();

    buscarParticipantes();
  }, []);

  async function buscarJogos() {
    const { data, error } =
      await supabase
        .from("jogos")
        .select("*")
        .order("id", {
          ascending: false
        });

    if (error) {
      console.log(error);
      return;
    }

    setJogos(data || []);
  }

 async function buscarParticipantes() {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("tipo", "jogador")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  setParticipantes(data || []);
}

  async function salvarJogo() {
    if (
      !timeCasa ||
      !timeFora ||
      !dataJogo ||
      !horaJogo ||
      !rodada
    ) {
      alert(
        "Preencha todos os campos"
      );

      return;
    }

    if (timeCasa === timeFora) {
      alert(
        "Escolha seleções diferentes"
      );

      return;
    }

    const { error } =
      await supabase
        .from("jogos")
        .insert([
          {
            time_casa:
              timeCasa,

            time_fora:
              timeFora,

            data_jogo:
              dataJogo,

            hora_jogo:
              horaJogo,

            rodada:
              Number(rodada),

            status: "aberto"
          }
        ]);

    if (error) {
      console.log(error);

      alert(
        "Erro ao salvar jogo"
      );

      return;
    }

    setTimeCasa("");

    setTimeFora("");

    setDataJogo("");

    setHoraJogo("");

    setRodada("");

    buscarJogos();
  }

  function pegarSelecao(nome) {
    if (!nome) return null;

    return selecoes.find(
      (item) =>
        item.nome.toLowerCase() ===
        nome.toLowerCase()
    );
  }

  const jogosConcluidos =
    jogos.filter(
      (jogo) =>
        jogo.status ===
        "finalizado"
    ).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0B0F14",
        color: "white",
        display: "flex",
        fontFamily: "Arial"
      }}
    >
      {/* MENU */}
      <div
        style={{
          width: "260px",
          background: "#111827",
          padding: "25px"
        }}
      >
        <h2
          style={{
            color: "#FF6B00",
            marginBottom: "25px"
          }}
        >
          🏆 Mestre do Palpite
        </h2>

        {[
          "Dashboard",
          "Jogos",
          "Jogos Encerrados",
          "Participantes",
          "Financeiro",
          "Palpites",
          "Ranking",
          "Meu Perfil",
          "Sair"
        ].map((item) => (
          <div
            key={item}
            onClick={() => {
              if (
                item === "Sair"
              ) {
                localStorage.removeItem(
                  "usuarioLogado"
                );

                window.location.href =
                  "/";

                return;
              }

              setMenu(item);
            }}
            style={{
              padding: "14px",
              marginTop: "10px",

              background:
                menu === item
                  ? "#FF6B00"
                  : item === "Sair"
                  ? "#991B1B"
                  : "#1F2937",

              borderRadius: "10px",

              cursor: "pointer",

              fontWeight: "bold"
            }}
          >
            {item === "Sair"
              ? "🚪 Sair"
              : item}
          </div>
        ))}
      </div>

      {/* CONTEÚDO */}
      <div
        style={{
          flex: 1,
          padding: "30px"
        }}
      >
        {/* BANNER */}
        <div
          style={{
            background:
              "linear-gradient(90deg,#003DA5,#FF6B00)",

            padding: "25px",

            borderRadius: "20px",

            marginBottom: "25px"
          }}
        >
          <h1 style={{ margin: 0 }}>
            ⚽ Copa do Mundo 2026
          </h1>

          <p>
            Gerencie seu bolão
            profissionalmente.
          </p>
        </div>

        {/* DASHBOARD */}
        {menu === "Dashboard" && (
          <>
            <div
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(4,1fr)",

                gap: "15px",

                marginBottom:
                  "30px"
              }}
            >
              <Card
                titulo="Jogos"
                valor={jogos.length}
                cor="#003DA5"
              />

              <Card
                titulo="Participantes"
                valor={
                  participantes.length
                }
                cor="#FF6B00"
              />

              <Card
                titulo="Concluídos"
                valor={
                  jogosConcluidos
                }
                cor="#16A34A"
              />

              <Card
                titulo="Seleções"
                valor={
                  selecoes.length
                }
                cor="#9333EA"
              />
            </div>
          </>
        )}

{/* FINANCEIRO NOVO */}
{menu === "Financeiro" && (
  <div
    style={{
      background: "#111827",
      padding: "30px",
      borderRadius: "20px"
    }}
  >
    <h2 style={{ color: "#FF6B00" }}>
      💰 Financeiro do Bolão
    </h2>

    {(() => {
      const VALOR = 50;

      // TODOS JOGADORES = PAGOS
      const jogadores = participantes;

      const totalArrecadado = jogadores.length * VALOR;

      const taxaBanca = totalArrecadado * 0.2; // 20%
      const premioFinal = totalArrecadado - taxaBanca;

      return (
        <>
          <div
            style={{
              marginTop: "20px",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "15px"
            }}
          >
            <Card
              titulo="Jogadores"
              valor={jogadores.length}
              cor="#003DA5"
            />

            <Card
              titulo="Valor por Jogador"
              valor={`R$ ${VALOR}`}
              cor="#FFD700"
            />

            <Card
              titulo="Total Arrecadado"
              valor={`R$ ${totalArrecadado}`}
              cor="#16A34A"
            />

            <Card
              titulo="Taxa da Banca (20%)"
              valor={`R$ ${taxaBanca}`}
              cor="#FF6B00"
            />

            <Card
              titulo="Prêmio Final"
              valor={`R$ ${premioFinal}`}
              cor="#9333EA"
            />
          </div>

          {/* LISTA POR JOGADOR */}
          <div style={{ marginTop: "30px" }}>
            <h3 style={{ color: "#9CA3AF" }}>
              Detalhe por jogador
            </h3>

            {jogadores.map((p) => {
              const banca = VALOR * 0.2;
              const premio = VALOR - banca;

              return (
                <div
                  key={p.id}
                  style={{
                    background: "#1F2937",
                    padding: "15px",
                    borderRadius: "12px",
                    marginTop: "10px",
                    display: "flex",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "bold" }}>
                      {p.nome}
                    </div>
                    <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
                      {p.email}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div>💰 Pago: R$ {VALOR}</div>
                    <div>🏦 Banca: R$ {banca}</div>
                    <div style={{ color: "#16A34A" }}>
                      🎯 Prêmio: R$ {premio}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      );
    })()}
  </div>
)}

{/* RANKING */}
{menu === "Ranking" && (
  <div
    style={{
      background: "#111827",
      padding: "30px",
      borderRadius: "20px"
    }}
  >
    <h2 style={{ color: "#FF6B00" }}>
      🏆 Ranking dos Jogadores
    </h2>

    {(() => {
      const ranking = [...participantes]
        .sort((a, b) => (b.pontuacao_total || 0) - (a.pontuacao_total || 0));

      const getMedalha = (index) => {
        if (index === 0) return "🥇";
        if (index === 1) return "🥈";
        if (index === 2) return "🥉";
        return "";
      };

      return (
        <div style={{ marginTop: "20px" }}>
          {ranking.map((p, index) => (
            <div
              key={p.id}
              style={{
                background: "#1F2937",
                padding: "15px",
                borderRadius: "12px",
                marginTop: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              {/* LADO ESQUERDO */}
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div style={{ fontSize: "20px" }}>
                  {getMedalha(index)}
                </div>

                <div>
                  <div style={{ fontWeight: "bold" }}>
                    {index + 1}º - {p.nome}
                  </div>

                  <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
                    {p.email}
                  </div>
                </div>
              </div>

              {/* PONTUAÇÃO */}
              <div style={{ fontWeight: "bold", color: "#16A34A" }}>
                {p.pontuacao_total || 0} pts
              </div>
            </div>
          ))}
        </div>
      );
    })()}
  </div>
)}

        {/* PARTICIPANTES */}
        {menu ===
          "Participantes" && (
          <div
            style={{
              background:
                "#111827",

              padding: "30px",

              borderRadius:
                "20px"
            }}
          >
            <h2
              style={{
                color:
                  "#FF6B00"
              }}
            >
              👥 Participantes
            </h2>

            {participantes.map(
              (
                participante
              ) => (
                <div
                  key={
                    participante.id
                  }
                  style={{
                    background:
                      "#1F2937",

                    padding:
                      "18px",

                    borderRadius:
                      "12px",

                    marginTop:
                      "12px",

                    display:
                      "flex",

                    justifyContent:
                      "space-between"
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight:
                          "bold"
                      }}
                    >
                      {
                        participante.nome
                      }
                    </div>

                    <div
                      style={{
                        color:
                          "#9CA3AF",

                        fontSize:
                          "14px"
                      }}
                    >
                      {
                        participante.email
                      }
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign:
                        "right"
                    }}
                  >
                    <div>
                      {participante.pago
                        ? "💰 Pago"
                        : "⏳ Pendente"}
                    </div>

                    <div>
                      {participante.categoria ===
                      "ouro"
                        ? "🥇 Ouro"
                        : "🥈 Prata"}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* PALPITES */}
        {menu ===
          "Palpites" && (
          <PalpitesAdmin />
        )}

        {/* JOGOS */}
        {menu === "Jogos" && (
          <div
            style={{
              background:
                "#111827",

              padding: "30px",

              borderRadius:
                "20px"
            }}
          >
            <h2
              style={{
                color:
                  "#FF6B00"
              }}
            >
              ⚽ Cadastro de Jogos
            </h2>

            <select
              value={timeCasa}
              onChange={(e) =>
                setTimeCasa(
                  e.target.value
                )
              }
              style={inputStyle}
            >
              <option value="">
                Time da casa
              </option>

              {selecoes.map(
                (time) => (
                  <option
                    key={
                      time.nome
                    }
                    value={
                      time.nome
                    }
                  >
                    {time.nome}
                  </option>
                )
              )}
            </select>

            <select
              value={timeFora}
              onChange={(e) =>
                setTimeFora(
                  e.target.value
                )
              }
              style={inputStyle}
            >
              <option value="">
                Time visitante
              </option>

              {selecoes.map(
                (time) => (
                  <option
                    key={
                      time.nome
                    }
                    value={
                      time.nome
                    }
                  >
                    {time.nome}
                  </option>
                )
              )}
            </select>

            <input
              type="date"
              value={dataJogo}
              onChange={(e) =>
                setDataJogo(
                  e.target.value
                )
              }
              style={inputStyle}
            />

            <input
              type="time"
              value={horaJogo}
              onChange={(e) =>
                setHoraJogo(
                  e.target.value
                )
              }
              style={inputStyle}
            />

            {/* RODADA */}
            <input
              type="number"
              placeholder="Número da rodada"
              value={rodada}
              onChange={(e) =>
                setRodada(
                  e.target.value
                )
              }
              style={inputStyle}
            />

            <button
              onClick={
                salvarJogo
              }
              style={{
                ...inputStyle,

                background:
                  "#FF6B00",

                border: "none",

                fontWeight:
                  "bold"
              }}
            >
              Salvar jogo
            </button>

            {/* LISTA JOGOS */}
            <div
              style={{
                marginTop: "30px"
              }}
            >
              {jogos
                .filter(
                  (jogo) =>
                    jogo.status !==
                    "finalizado"
                )
                .map((jogo) => {
                  const casa =
                    pegarSelecao(
                      jogo.time_casa
                    );

                  const fora =
                    pegarSelecao(
                      jogo.time_fora
                    );

                  return (
                    <div
                      key={jogo.id}
                      style={{
                        background:
                          "#1F2937",

                        padding:
                          "18px",

                        borderRadius:
                          "12px",

                        marginBottom:
                          "12px",

                        display:
                          "flex",

                        justifyContent:
                          "space-between",

                        alignItems:
                          "center"
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",

                          alignItems:
                            "center",

                          gap: "8px",

                          fontWeight:
                            "bold"
                        }}
                      >
                        <img
                          src={
                            casa?.bandeira
                          }
                          width="28"
                          alt=""
                        />

                        {
                          jogo.time_casa
                        }

                        <span
                          style={{
                            color:
                              "#FF6B00"
                          }}
                        >
                          x
                        </span>

                        <img
                          src={
                            fora?.bandeira
                          }
                          width="28"
                          alt=""
                        />

                        {
                          jogo.time_fora
                        }
                      </div>

                      <div
                        style={{
                          textAlign:
                            "right"
                        }}
                      >
                        <div>
                          📅{" "}
                          {
                            jogo.data_jogo
                          }
                        </div>

                        <div>
                          🕒{" "}
                          {
                            jogo.hora_jogo
                          }
                        </div>

                        <div
                          style={{
                            color:
                              "#FF6B00",
                            fontWeight:
                              "bold"
                          }}
                        >
                          🏆 Rodada{" "}
                          {
                            jogo.rodada
                          }
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            <GerenciarJogos
              jogos={jogos.filter(
                (jogo) =>
                  jogo.status !==
                  "finalizado"
              )}
              buscarJogos={
                buscarJogos
              }
            />
          </div>
        )}

        {/* JOGOS ENCERRADOS */}
        {menu ===
          "Jogos Encerrados" && (
          <div
            style={{
              background:
                "#111827",

              padding: "30px",

              borderRadius:
                "20px"
            }}
          >
            <h2
              style={{
                color:
                  "#FF6B00",

                marginBottom:
                  "20px"
              }}
            >
              📋 Jogos Encerrados
            </h2>

            {jogos
              .filter(
                (jogo) =>
                  jogo.status ===
                  "finalizado"
              )
              .map((jogo) => {
                const casa =
                  pegarSelecao(
                    jogo.time_casa
                  );

                const fora =
                  pegarSelecao(
                    jogo.time_fora
                  );

                return (
                  <div
                    key={jogo.id}
                    style={{
                      background:
                        "#1F2937",

                      padding:
                        "15px",

                      borderRadius:
                        "12px",

                      marginBottom:
                        "10px"
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "space-between"
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",

                          alignItems:
                            "center",

                          gap: "8px",

                          fontWeight:
                            "bold"
                        }}
                      >
                        <img
                          src={
                            casa?.bandeira
                          }
                          width="24"
                          alt=""
                        />

                        {
                          jogo.time_casa
                        }

                        <span
                          style={{
                            color:
                              "#FF6B00"
                          }}
                        >
                          {
                            jogo.gols_casa
                          }{" "}
                          x{" "}
                          {
                            jogo.gols_fora
                          }
                        </span>

                        <img
                          src={
                            fora?.bandeira
                          }
                          width="24"
                          alt=""
                        />

                        {
                          jogo.time_fora
                        }
                      </div>

                      <div
                        style={{
                          textAlign:
                            "right"
                        }}
                      >
                        <div>
                          📅{" "}
                          {
                            jogo.data_jogo
                          }
                        </div>

                        <div>
                          🕒{" "}
                          {
                            jogo.hora_jogo
                          }
                        </div>

                        <div
                          style={{
                            color:
                              "#16A34A",
                            fontWeight:
                              "bold"
                          }}
                        >
                          🏆 Rodada{" "}
                          {
                            jogo.rodada
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

function Card({
  titulo,
  valor,
  cor
}) {
  return (
    <div
      style={{
        background: "#111827",

        padding: "20px",

        borderRadius: "18px",

        borderTop: `4px solid ${cor}`
      }}
    >
      <p
        style={{
          color: "#9CA3AF",

          margin: 0
        }}
      >
        {titulo}
      </p>

      <h1
        style={{
          margin:
            "10px 0 0 0"
        }}
      >
        {valor}
      </h1>
    </div>
  );
}

const inputStyle = {
  width: "100%",

  padding: "14px",

  marginTop: "15px",

  borderRadius: "10px",

  border:
    "1px solid #374151",

  background: "#0B0F14",

  color: "white",

  boxSizing: "border-box"
};