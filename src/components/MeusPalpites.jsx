import React, {
  useEffect,
  useState
} from "react";

import { supabase } from "../services/supabase";
import { selecoes } from "../data/selecoes";

export default function MeusPalpites({
  usuario
}) {
  const [palpites, setPalpites] =
    useState([]);

  useEffect(() => {
    if (usuario?.id) {
      carregarPalpites();
    }
  }, []);

  async function carregarPalpites() {
    const { data, error } =
      await supabase
        .from("palpites")
        .select(`
          *,
          jogos (*)
        `)
        .eq(
          "usuario_id",
          usuario.id
        );

    if (error) {
      console.log(error);
      return;
    }

    setPalpites(data || []);
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
        🎯 Meus Palpites
      </h2>

      {palpites.length === 0 && (
        <p style={{ color: "white" }}>
          Nenhum palpite ainda.
        </p>
      )}

      {palpites.map(
        (palpite) => (
          <div
            key={palpite.id}
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              padding: "20px",
              marginBottom: "15px",
              borderRadius: "16px",
              background:
                "rgba(0,0,0,0.25)",
              color: "white"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                gap: "10px"
              }}
            >
              <img
                src={pegarBandeira(
                  palpite.jogos
                    .time_casa
                )}
                width="30"
                alt=""
              />

              <span>
                {
                  palpite.jogos
                    .time_casa
                }
              </span>
            </div>

            <strong>
              {
                palpite.gols_casa
              }{" "}
              X{" "}
              {
                palpite.gols_fora
              }
            </strong>

            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                gap: "10px"
              }}
            >
              <span>
                {
                  palpite.jogos
                    .time_fora
                }
              </span>

              <img
                src={pegarBandeira(
                  palpite.jogos
                    .time_fora
                )}
                width="30"
                alt=""
              />
            </div>

            <div
              style={{
                color:
                  "#4ade80",
                fontWeight:
                  "bold"
              }}
            >
              +
              {
                palpite.pontos ||
                0
              } pts
            </div>
          </div>
        )
      )}
    </div>
  );
}