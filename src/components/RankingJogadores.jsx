import React, {
  useEffect,
  useState
} from "react";

import { supabase } from "../services/supabase";

export default function RankingJogadores() {
  const [ranking, setRanking] =
    useState([]);

  useEffect(() => {
    carregarRanking();
  }, []);

  async function carregarRanking() {

    const {
      data: usuarios
    } = await supabase
      .from("usuarios")
      .select("*");

    const {
      data: palpites
    } = await supabase
      .from("palpites")
      .select("*");

    const rankingFinal =
      (usuarios || []).map(
        (usuario) => {

          const meusPalpites =
            (palpites || []).filter(
              (item) =>
                item.usuario_id ===
                usuario.id
            );

          const pontos =
            meusPalpites.reduce(
              (total, item) =>
                total +
                (item.pontos || 0),
              0
            );

          return {
            ...usuario,
            pontos
          };
        }
      );

    rankingFinal.sort(
      (a, b) =>
        b.pontos - a.pontos
    );

    setRanking(
      rankingFinal
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        borderRadius: "20px",
        background:
          "rgba(0,0,0,0.25)"
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: "20px"
        }}
      >
        🏆 Ranking Geral
      </h2>

      {ranking.map(
        (
          jogador,
          index
        ) => (
          <div
            key={jogador.id}
            style={{
              background:
                "rgba(255,255,255,0.08)",
              color: "white",
              padding: "18px",
              borderRadius:
                "14px",
              marginBottom:
                "12px",
              display: "flex",
              justifyContent:
                "space-between"
            }}
          >
            <span>
              #{index + 1} • {jogador.nome}
            </span>

            <strong>
              {jogador.pontos} pts
            </strong>
          </div>
        )
      )}
    </div>
  );
}