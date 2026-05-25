import React from "react";

export default function Pontuacao({
  pontos
}) {
  return (
    <div style={styles.box}>
      <h2 style={styles.title}>
        ⭐ Minha Pontuação
      </h2>

      <div style={styles.card}>
        <div style={styles.bigNumber}>
          {pontos}
        </div>

        <div style={styles.label}>
          pontos acumulados
        </div>
      </div>
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

  card: {
    background: "rgba(0,0,0,0.35)",
    borderRadius: "18px",
    padding: "40px",
    textAlign: "center"
  },

  bigNumber: {
    fontSize: "50px",
    fontWeight: "bold",
    color: "#22c55e"
  },

  label: {
    color: "white",
    marginTop: "10px",
    fontSize: "18px"
  }
};