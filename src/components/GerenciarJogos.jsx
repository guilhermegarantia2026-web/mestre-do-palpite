import React, { useState } from "react";
import { supabase } from "../services/supabase";

export default function GerenciarJogos({
  jogos,
  buscarJogos
}) {
  const [placares, setPlacares] =
    useState({});

  function alterarPlacar(
    jogoId,
    campo,
    valor
  ) {
    setPlacares((anterior) => ({
      ...anterior,
      [jogoId]: {
        ...anterior[jogoId],
        [campo]: Number(valor)
      }
    }));
  }

  async function atualizarPontuacaoUsuario(
    usuarioId
  ) {
    // soma todos os pontos do usuário
    const {
      data: palpites
    } = await supabase
      .from("palpites")
      .select("pontos")
      .eq(
        "usuario_id",
        usuarioId
      );

    const total =
      (palpites || []).reduce(
        (
          soma,
          item
        ) =>
          soma +
          (item.pontos || 0),
        0
      );

    // salva total no usuário
    await supabase
      .from("usuarios")
      .update({
        pontuacao_total:
          total
      })
      .eq(
        "id",
        usuarioId
      );
  }

  async function encerrarJogo(
    jogo
  ) {
    const golsCasa =
      placares[jogo.id]
        ?.gols_casa || 0;

    const golsFora =
      placares[jogo.id]
        ?.gols_fora || 0;

    // encerra jogo
    const { error } =
      await supabase
        .from("jogos")
        .update({
          gols_casa:
            golsCasa,
          gols_fora:
            golsFora,
          status:
            "finalizado"
        })
        .eq("id", jogo.id);

    if (error) {
      console.log(error);
      alert(
        "Erro ao encerrar jogo"
      );
      return;
    }

    // busca palpites
    const {
      data: palpites
    } = await supabase
      .from("palpites")
      .select("*")
      .eq(
        "jogo_id",
        jogo.id
      );

    // calcula pontos
    for (
      const palpite of
      palpites || []
    ) {
      let pontos = 0;

      const pCasa =
        palpite.gols_casa;

      const pFora =
        palpite.gols_fora;

      // 10 = placar exato
      if (
        pCasa === golsCasa &&
        pFora === golsFora
      ) {
        pontos = 10;
      }

      // 3 = empate
      else if (
        golsCasa === golsFora &&
        pCasa === pFora
      ) {
        pontos = 3;
      }

      // 5 = vencedor
      else if (
        (
          golsCasa >
            golsFora &&
          pCasa > pFora
        ) ||
        (
          golsCasa <
            golsFora &&
          pCasa < pFora
        )
      ) {
        pontos = 5;
      }

      // 2 = um placar correto
      else if (
        pCasa ===
          golsCasa ||
        pFora ===
          golsFora
      ) {
        pontos = 2;
      }

      // salva pontos do palpite
      await supabase
        .from("palpites")
        .update({
          pontos
        })
        .eq(
          "id",
          palpite.id
        );

      // atualiza ranking do jogador
      await atualizarPontuacaoUsuario(
        palpite.usuario_id
      );
    }

    alert(
      "Jogo encerrado e ranking atualizado!"
    );

    buscarJogos();
  }

  return (
    <div
      style={{
        marginTop: "40px"
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          color: "white"
        }}
      >
        Encerrar Jogos
      </h2>

      {jogos
        .filter(
          (jogo) =>
            jogo.status ===
            "aberto"
        )
        .map((jogo) => (
          <div
            key={jogo.id}
            style={{
              background:
                "#1F2937",
              padding: "20px",
              borderRadius:
                "15px",
              marginBottom:
                "15px"
            }}
          >
            <h3
              style={{
                color: "white",
                marginBottom:
                  "20px"
              }}
            >
              {
                jogo.time_casa
              }{" "}
              x{" "}
              {
                jogo.time_fora
              }
            </h3>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom:
                  "15px"
              }}
            >
              <input
                type="number"
                placeholder="Gols casa"
                onChange={(
                  e
                ) =>
                  alterarPlacar(
                    jogo.id,
                    "gols_casa",
                    e.target
                      .value
                  )
                }
                style={
                  inputStyle
                }
              />

              <input
                type="number"
                placeholder="Gols fora"
                onChange={(
                  e
                ) =>
                  alterarPlacar(
                    jogo.id,
                    "gols_fora",
                    e.target
                      .value
                  )
                }
                style={
                  inputStyle
                }
              />
            </div>

            <button
              onClick={() =>
                encerrarJogo(
                  jogo
                )
              }
              style={{
                background:
                  "#FF6B00",
                color: "white",
                border: "none",
                padding:
                  "12px 20px",
                borderRadius:
                  "10px",
                fontWeight:
                  "bold",
                cursor:
                  "pointer"
              }}
            >
              Encerrar jogo
            </button>
          </div>
        ))}
    </div>
  );
}

const inputStyle = {
  flex: 1,
  padding: "12px",
  borderRadius: "10px",
  border:
    "1px solid #374151",
  background:
    "#0B0F14",
  color: "white"
};