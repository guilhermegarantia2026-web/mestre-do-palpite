import React from "react";

export default function BilhetePalpite({
  participante,
  rodada,
  palpites
}) {
  const numeroBilhete =
    Math.floor(
      100000 +
        Math.random() * 900000
    );

  const totalPontos =
    palpites.reduce(
      (total, item) =>
        total + (item.pontos || 0),
      0
    );

  function imprimirBilhete() {
    window.print();
  }

  return (
    <div style={styles.page}>
      <div style={styles.ticket}>
        {/* TOPO */}
        <div style={styles.header}>
          <h1 style={styles.logo}>
            🏆 Mestre do Palpite
          </h1>

          <div style={styles.info}>
            <div>
              🎟️ Bilhete:
              <strong>
                {" "}
                #{numeroBilhete}
              </strong>
            </div>

            <div>
              🏆 Rodada:
              <strong>
                {" "}
                {rodada}
              </strong>
            </div>
          </div>
        </div>

        {/* PARTICIPANTE */}
        <div style={styles.userBox}>
          <div>
            👤 Participante:
            <strong>
              {" "}
              {participante}
            </strong>
          </div>

          <div>
            ⭐ Pontos:
            <strong>
              {" "}
              {totalPontos}
            </strong>
          </div>
        </div>

        {/* TABELA */}
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span>
              Jogo
            </span>

            <span>
              Data
            </span>

            <span>
              Hora
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
                    item.jogos
                      ?.data_jogo
                  }
                </span>

                <span>
                  {
                    item.jogos
                      ?.hora_jogo
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
                  {item.pontos || 0}
                </span>
              </div>
            )
          )}
        </div>

        {/* RODAPÉ */}
        <div style={styles.footer}>
          Sistema oficial de
          gerenciamento de bolão
        </div>

        {/* BOTÃO */}
        <button
          onClick={
            imprimirBilhete
          }
          style={styles.printButton}
        >
          🖨️ Imprimir Bilhete
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "30px",
    display: "flex",
    justifyContent:
      "center"
  },

  ticket: {
    width: "100%",
    maxWidth: "1100px",
    background: "white",
    borderRadius: "20px",
    overflow: "hidden",
    color: "#111"
  },

  header: {
    background:
      "linear-gradient(90deg,#003DA5,#FF6B00)",
    padding: "25px",
    color: "white",
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center"
  },

  logo: {
    margin: 0
  },

  info: {
    textAlign: "right",
    lineHeight: "28px"
  },

  userBox: {
    padding: "20px 25px",
    display: "flex",
    justifyContent:
      "space-between",
    background: "#F3F4F6",
    fontSize: "18px"
  },

  table: {
    padding: "20px"
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns:
      "2fr 1fr 1fr 1fr 1fr",
    background: "#111827",
    color: "white",
    padding: "15px",
    borderRadius: "12px",
    fontWeight: "bold"
  },

  row: {
    display: "grid",
    gridTemplateColumns:
      "2fr 1fr 1fr 1fr 1fr",
    padding: "15px",
    borderBottom:
      "1px solid #E5E7EB"
  },

  footer: {
    padding: "20px",
    textAlign: "center",
    color: "#6B7280"
  },

  printButton: {
    margin: "20px",
    padding: "15px",
    width: "calc(100% - 40px)",
    border: "none",
    borderRadius: "12px",
    background: "#FF6B00",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px"
  }
};