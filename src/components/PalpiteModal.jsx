import React from "react";

export default function PalpiteModal({
  aberto,
  jogoSelecionado,
  golsCasa,
  golsFora,
  setGolsCasa,
  setGolsFora,
  onClose,
  onSave
}) {
  if (
    !aberto ||
    !jogoSelecionado
  ) {
    return null;
  }

  return (
    <div
      style={styles.overlay}
      onClick={onClose}
    >
      <div
        style={styles.modal}
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <button
          style={styles.closeButton}
          onClick={onClose}
        >
          ✕
        </button>

        <h2 style={styles.title}>
          {
            jogoSelecionado.time_casa
          }{" "}
          X{" "}
          {
            jogoSelecionado.time_fora
          }
        </h2>

        <div
          style={styles.inputArea}
        >
          <input
            type="number"
            min="0"
            value={golsCasa}
            onChange={(e) =>
              setGolsCasa(
                e.target.value
              )
            }
            style={styles.input}
          />

          <span style={styles.x}>
            X
          </span>

          <input
            type="number"
            min="0"
            value={golsFora}
            onChange={(e) =>
              setGolsFora(
                e.target.value
              )
            }
            style={styles.input}
          />
        </div>

        <button
          style={styles.saveButton}
          onClick={onSave}
        >
          💾 Salvar Palpite
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(0,0,0,0.70)",
    display: "flex",
    justifyContent:
      "center",
    alignItems: "center",
    zIndex: 999
  },

  modal: {
    position: "relative",
    background: "#111",
    borderRadius: "24px",
    padding: "40px",
    minWidth: "420px",
    textAlign: "center"
  },

  closeButton: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "22px",
    cursor: "pointer"
  },

  title: {
    color: "white",
    marginBottom: "30px"
  },

  inputArea: {
    display: "flex",
    justifyContent:
      "center",
    alignItems: "center",
    gap: "20px",
    marginBottom: "25px"
  },

  x: {
    color: "white",
    fontSize: "24px",
    fontWeight: "bold"
  },

  input: {
    width: "70px",
    padding: "15px",
    fontSize: "22px",
    textAlign: "center",
    borderRadius: "12px"
  },

  saveButton: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "14px 24px",
    borderRadius: "12px",
    cursor: "pointer"
  }
};