import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
export default function Ranking() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    carregarRanking();
  }, []);

  async function carregarRanking() {
    const { data, error } = await supabase
      .from("palpites")
      .select(`
        pontos,
        usuarios (
          nome
        )
      `);

    if (error) {
      console.log(error);
      return;
    }

    const jogadores = {};

    (data || []).forEach((item) => {
      const nome =
        item.usuarios?.nome || "Jogador";

      if (!jogadores[nome]) {
        jogadores[nome] = 0;
      }

      jogadores[nome] +=
        item.pontos || 0;
    });

    const rankingFinal =
      Object.entries(jogadores)
        .map(([nome, pontos]) => ({
          nome,
          pontos
        }))
        .sort(
          (a, b) =>
            b.pontos - a.pontos
        );

    setRanking(rankingFinal);
  }

  function medalha(posicao) {
    if (posicao === 0) return "🥇";
    if (posicao === 1) return "🥈";
    if (posicao === 2) return "🥉";
    return "🏅";
  }

  return (
    <div style={styles.box}>
      <h2 style={styles.title}>
        🏆 Ranking Geral
      </h2>

      {ranking.map((jogador, index) => (
        <div
          key={index}
          style={styles.item}
        >
          <div>
            {medalha(index)} {index + 1}º — {jogador.nome}
          </div>

          <div style={styles.points}>
            {jogador.pontos} pts
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  box: {
    padding: "30px",
    borderRadius: "20px",
    background: "rgba(0,0,0,0.25)"
  },

  title: {
    color: "white",
    marginBottom: "25px"
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
    padding: "20px",
    marginBottom: "15px",
    borderRadius: "16px",
    background: "rgba(0,0,0,0.25)"
  },

  points: {
    color: "#4ade80",
    fontWeight: "bold"
  }
};