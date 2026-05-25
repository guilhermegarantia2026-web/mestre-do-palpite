import React from "react";

export default function Perfil({
  usuario
}) {
  return (
    <div style={styles.box}>
      <h2 style={styles.title}>
        👤 Meu Perfil
      </h2>

      <div style={styles.card}>
        <div style={styles.avatar}>
          👤
        </div>

        <div style={styles.info}>
          <p>
            <strong>Nome:</strong>{" "}
            {usuario?.nome}
          </p>

          <p>
            <strong>Tipo:</strong>{" "}
            {usuario?.tipo}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            Online
          </p>
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
    display: "flex",
    alignItems: "center",
    gap: "30px",
    background: "rgba(0,0,0,0.35)",
    borderRadius: "18px",
    padding: "35px"
  },

  avatar: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: "#ff6b00",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "35px"
  },

  info: {
    color: "white",
    fontSize: "18px",
    lineHeight: "35px"
  }
};