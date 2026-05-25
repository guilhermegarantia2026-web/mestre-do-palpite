import React, { useState } from "react";
import { supabase } from "./services/supabase";

import Dashboard from "./pages/Dashboard";
import PlayerDashboard from "./pages/PlayerDashboard";

export default function App() {
  const [screen, setScreen] = useState("home");

  // USUÁRIO LOGADO
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  // CAMPOS
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [senha, setSenha] = useState("");

  function limparCampos() {
    setNome("");
    setCpf("");
    setWhatsapp("");
    setSenha("");
  }

  // =========================
  // CADASTRAR JOGADOR
  // =========================
  async function cadastrarJogador() {
    const { error } = await supabase
      .from("usuarios")
      .insert([
        {
          nome,
          cpf,
          whatsapp,
          senha,
          tipo: "jogador"
        }
      ]);

    if (error) {
      console.log(error);
      alert("Erro ao cadastrar");
      return;
    }

    alert("Conta criada com sucesso!");
    limparCampos();
    setScreen("login");
  }

  // =========================
  // LOGIN
  // =========================
  async function fazerLogin(tipoEsperado) {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("whatsapp", whatsapp)
      .eq("senha", senha)
      .single();

    if (error || !data) {
      console.log(error);
      alert("Usuário não encontrado");
      return;
    }

    if (data.tipo !== tipoEsperado) {
      alert("Você não tem permissão para entrar aqui");
      return;
    }

    // SALVA USUÁRIO LOGADO
    setUsuarioLogado(data);

    // BACKUP EM LOCAL STORAGE
    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify(data)
    );

    // ADMIN
    if (data.tipo === "administrador") {
      limparCampos();
      setScreen("dashboard");
      return;
    }

    // JOGADOR
    if (data.tipo === "jogador") {
      limparCampos();
      setScreen("dashboardPlayer");
      return;
    }
  }

  // =========================
  // DASHBOARD ADMIN
  // =========================
  if (screen === "dashboard") {
    return <Dashboard />;
  }

  // =========================
  // DASHBOARD JOGADOR
  // =========================
  if (screen === "dashboardPlayer") {
    return (
      <PlayerDashboard
        usuario={usuarioLogado}
        onLogout={() => {
          localStorage.removeItem("usuarioLogado");
          setUsuarioLogado(null);
          setScreen("home");
        }}
      />
    );
  }

  // =========================
  // HOME
  // =========================
  if (screen === "home") {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>🏆 Mestre do Palpite</h1>

          <p style={styles.subtitle}>
            Escolha como deseja entrar:
          </p>

          <button
            style={styles.adminButton}
            onClick={() => setScreen("admin")}
          >
            Entrar como Admin
          </button>

          <button
            style={styles.playerButton}
            onClick={() => setScreen("player")}
          >
            Entrar como Jogador
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // LOGIN ADMIN
  // =========================
  if (screen === "admin") {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>🔐 Área Administrativa</h1>

          <input
            style={styles.input}
            placeholder="WhatsApp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button
            style={styles.adminButton}
            onClick={() => fazerLogin("administrador")}
          >
            Entrar
          </button>

          <button
            style={styles.backButton}
            onClick={() => setScreen("home")}
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // MENU JOGADOR
  // =========================
  if (screen === "player") {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>⚽ Área do Jogador</h1>

          <button
            style={styles.playerButton}
            onClick={() => setScreen("register")}
          >
            Cadastrar
          </button>

          <button
            style={styles.goldButton}
            onClick={() => setScreen("login")}
          >
            Login
          </button>

          <button
            style={styles.backButton}
            onClick={() => setScreen("home")}
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // CADASTRO
  // =========================
  if (screen === "register") {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>📝 Criar Conta</h1>

          <input
            style={styles.input}
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="WhatsApp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button
            style={styles.playerButton}
            onClick={cadastrarJogador}
          >
            Criar Conta
          </button>

          <button
            style={styles.backButton}
            onClick={() => setScreen("player")}
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // LOGIN JOGADOR
  // =========================
  if (screen === "login") {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>🔑 Login do Jogador</h1>

          <input
            style={styles.input}
            placeholder="WhatsApp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button
            style={styles.goldButton}
            onClick={() => fazerLogin("jogador")}
          >
            Entrar
          </button>

          <button
            style={styles.backButton}
            onClick={() => setScreen("player")}
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return null;
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#050505",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial"
  },

  card: {
    background: "#111",
    width: "420px",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 0 40px rgba(255,215,0,0.12)",
    textAlign: "center"
  },

  title: {
    color: "#d4af37",
    marginBottom: "20px"
  },

  subtitle: {
    color: "#fff",
    marginBottom: "30px"
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #333",
    background: "#0b0b0b",
    color: "#fff",
    boxSizing: "border-box"
  },

  adminButton: {
    width: "100%",
    padding: "14px",
    marginBottom: "12px",
    background: "#d4af37",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer"
  },

  playerButton: {
    width: "100%",
    padding: "14px",
    marginBottom: "12px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer"
  },

  goldButton: {
    width: "100%",
    padding: "14px",
    marginBottom: "12px",
    background: "#d4af37",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer"
  },

  backButton: {
    width: "100%",
    padding: "12px",
    background: "#222",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer"
  }
};