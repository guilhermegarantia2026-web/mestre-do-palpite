import React, {
  useEffect,
  useState
} from "react";

import { supabase } from "../services/supabase";

export default function PalpitesAdmin() {
  const [palpites, setPalpites] =
    useState([]);

  useEffect(() => {
    carregarPalpites();

    const canal =
      supabase
        .channel(
          "palpites-realtime"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "palpites"
          },
          () => {
            carregarPalpites();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        canal
      );
    };
  }, []);

  async function carregarPalpites() {
    const { data, error } =
      await supabase
        .from("palpites")
        .select(`
          id,
          gols_casa,
          gols_fora,
          pontos,
          created_at,

          usuarios (
            nome
          ),

          jogos (
            id,
            rodada,
            data_jogo,
            hora_jogo,
            time_casa,
            time_fora,
            gols_casa,
            gols_fora,
            status
          )
        `)
        .order("id", {
          ascending: false
        });

    if (error) {
      console.log(error);
      return;
    }

    setPalpites(data || []);
  }

  function gerarNumeroBilhete() {
    return Math.floor(
      100000 + Math.random() * 900000
    );
  }

  function imprimirBilhete(
    jogador
  ) {
    const apostasJogador =
      palpites.filter(
        (item) =>
          item.usuarios?.nome ===
          jogador
      );

    if (
      apostasJogador.length === 0
    ) {
      alert(
        "Nenhum palpite encontrado."
      );
      return;
    }

    const jogosFinalizados =
      apostasJogador.filter(
        (item) =>
          item.jogos?.status ===
          "finalizado"
      );

    if (
      jogosFinalizados.length === 0
    ) {
      alert(
        "Esse jogador ainda não possui jogos finalizados."
      );
      return;
    }

    const numeroBilhete =
      gerarNumeroBilhete();

    const rodada =
      jogosFinalizados[0]
        ?.jogos?.rodada || 1;

    const totalPontos =
      jogosFinalizados.reduce(
        (total, item) =>
          total +
          (item.pontos || 0),
        0
      );

    const linhas =
      jogosFinalizados
        .map(
          (item) => `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #ddd;">
            ${item.jogos?.data_jogo || "-"}
          </td>

          <td style="padding:10px;border-bottom:1px solid #ddd;">
            ${item.jogos?.hora_jogo || "-"}
          </td>

          <td style="padding:10px;border-bottom:1px solid #ddd;">
            ${item.jogos?.time_casa} x ${item.jogos?.time_fora}
          </td>

          <td style="padding:10px;border-bottom:1px solid #ddd;text-align:center;">
            ${item.gols_casa} x ${item.gols_fora}
          </td>

          <td style="padding:10px;border-bottom:1px solid #ddd;text-align:center;">
            ${item.jogos?.gols_casa ?? "-"} x ${item.jogos?.gols_fora ?? "-"}
          </td>

          <td style="padding:10px;border-bottom:1px solid #ddd;text-align:center;font-weight:bold;color:#16A34A;">
            ${item.pontos || 0}
          </td>
        </tr>
      `
        )
        .join("");

    const tela =
      window.open(
        "",
        "_blank"
      );

    tela.document.write(`
      <html>
        <head>
          <title>
            Bilhete do Jogador
          </title>
        </head>

        <body style="
          font-family: Arial;
          padding: 30px;
          background: #f3f4f6;
        ">

          <div style="
            max-width: 1000px;
            margin: auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0,0,0,0.15);
          ">

            <div style="
              background: linear-gradient(90deg,#003DA5,#FF6B00);
              padding: 30px;
              color: white;
            ">
              <h1 style="margin:0;">
                🎟️ Bilhete Oficial
              </h1>

              <p style="margin-top:10px;">
                Mestre do Palpite
              </p>
            </div>

            <div style="padding:30px;">

              <div style="
                display:flex;
                justify-content:space-between;
                margin-bottom:25px;
              ">
                <div>
                  <h2 style="margin:0;">
                    👤 ${jogador}
                  </h2>

                  <p>
                    Rodada: ${rodada}
                  </p>
                </div>

                <div style="
                  text-align:right;
                ">
                  <h2 style="
                    margin:0;
                    color:#FF6B00;
                  ">
                    #${numeroBilhete}
                  </h2>

                  <p>
                    ${new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              <table style="
                width:100%;
                border-collapse:collapse;
              ">
                <thead>
                  <tr style="
                    background:#111827;
                    color:white;
                  ">
                    <th style="padding:12px;">
                      Data
                    </th>

                    <th style="padding:12px;">
                      Hora
                    </th>

                    <th style="padding:12px;">
                      Jogo
                    </th>

                    <th style="padding:12px;">
                      Palpite
                    </th>

                    <th style="padding:12px;">
                      Resultado
                    </th>

                    <th style="padding:12px;">
                      Pontos
                    </th>
                  </tr>
                </thead>

                <tbody>
                  ${linhas}
                </tbody>
              </table>

              <div style="
                margin-top:30px;
                padding:20px;
                border-radius:12px;
                background:#f3f4f6;
                display:flex;
                justify-content:space-between;
                align-items:center;
              ">
                <h2 style="margin:0;">
                  ⭐ Total da Rodada
                </h2>

                <h1 style="
                  margin:0;
                  color:#16A34A;
                ">
                  ${totalPontos} pts
                </h1>
              </div>

            </div>
          </div>

          <script>
            window.onload = () => {
              window.print();
            }
          </script>

        </body>
      </html>
    `);

    tela.document.close();
  }

  const jogadoresUnicos = [
    ...new Set(
      palpites.map(
        (item) =>
          item.usuarios?.nome
      )
    )
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        🎯 Palpites dos Jogadores
      </h1>

      <div style={styles.bilhetesBox}>
        <h2 style={styles.subTitle}>
          🖨️ Gerar Bilhete
        </h2>

        <div style={styles.playersGrid}>
          {jogadoresUnicos.map(
            (jogador) => (
              <button
                key={jogador}
                style={
                  styles.printButton
                }
                onClick={() =>
                  imprimirBilhete(
                    jogador
                  )
                }
              >
                🧾 {jogador}
              </button>
            )
          )}
        </div>
      </div>

      <div style={styles.table}>
        <div style={styles.header}>
          <span>
            Jogador
          </span>

          <span>
            Jogo
          </span>

          <span>
            Palpite
          </span>

          <span>
            Pontos
          </span>
        </div>

        {palpites.map(
          (item) => (
            <div
              key={item.id}
              style={styles.row}
            >
              <span>
                {
                  item.usuarios
                    ?.nome
                }
              </span>

              <span>
                {
                  item.jogos
                    ?.time_casa
                }{" "}
                x{" "}
                {
                  item.jogos
                    ?.time_fora
                }
              </span>

              <span>
                {
                  item.gols_casa
                }{" "}
                x{" "}
                {
                  item.gols_fora
                }
              </span>

              <span>
                {item.pontos ||
                  0}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    color: "white"
  },

  title: {
    marginBottom: "25px",
    fontSize: "30px"
  },

  subTitle: {
    marginBottom: "20px"
  },

  bilhetesBox: {
    background:
      "rgba(255,255,255,0.05)",
    padding: "25px",
    borderRadius: "20px",
    marginBottom: "25px"
  },

  playersGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px"
  },

  printButton: {
    background: "#FF6B00",
    border: "none",
    color: "white",
    padding: "14px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  table: {
    background:
      "rgba(255,255,255,0.05)",
    borderRadius: "20px",
    overflow: "hidden"
  },

  header: {
    display: "grid",
    gridTemplateColumns:
      "1fr 2fr 1fr 1fr",
    padding: "18px",
    background: "#ff6b00",
    fontWeight: "bold"
  },

  row: {
    display: "grid",
    gridTemplateColumns:
      "1fr 2fr 1fr 1fr",
    padding: "18px",
    borderBottom:
      "1px solid rgba(255,255,255,0.08)"
  }
};