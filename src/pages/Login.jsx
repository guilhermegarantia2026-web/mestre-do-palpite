import { useState } from "react";

import { supabase } from "../services/supabase";

export default function Login({
  entrar
}) {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cpf, setCpf] = useState("");

  function formatarCPF(valor) {
    const numeros = valor.replace(/\D/g, "");

    return numeros
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2")
      .slice(0, 14);
  }

  function handleCpfChange(e) {
    setCpf(formatarCPF(e.target.value));
  }

  async function handleEntrar() {
    if (!nome || !whatsapp || !cpf) {
      alert("Preencha todos os campos.");
      return;
    }

    // =========================
    // BUSCA USUÁRIO
    // =========================
    const {
      data: usuarioExistente,
      error: erroBuscaUsuario
    } = await supabase
      .from("usuarios")
      .select("*")
      .eq("cpf", cpf)
      .maybeSingle();

    if (erroBuscaUsuario) {
      console.log(erroBuscaUsuario);
      alert("Erro ao buscar usuário.");
      return;
    }

    let usuarioFinal = usuarioExistente;

    // =========================
    // CRIA USUÁRIO SE NÃO EXISTIR
    // =========================
    if (!usuarioExistente) {
      const {
        data: novoUsuario,
        error: erroNovoUsuario
      } = await supabase
        .from("usuarios")
        .insert([
          {
            nome,
            whatsapp,
            cpf,
            tipo: "jogador",
            pontuacao_total: 0
          }
        ])
        .select()
        .single();

      if (erroNovoUsuario) {
        console.log(erroNovoUsuario);
        alert("Erro ao criar usuário.");
        return;
      }

      usuarioFinal = novoUsuario;
    }

    // =========================
    // VERIFICA PARTICIPANTE (SEMPRE)
    // =========================
    const {
      data: participanteExistente,
      error: erroBuscaParticipante
    } = await supabase
      .from("participantes")
      .select("*")
      .eq("nome", nome)
      .maybeSingle();

    if (erroBuscaParticipante) {
      console.log(erroBuscaParticipante);
    }

    if (!participanteExistente) {
      const { error: erroParticipante } = await supabase
        .from("participantes")
        .insert([
          {
            nome,
            email: cpf + "@bolao.com",
            categoria: "prata",
            pago: false,
            pontos: 0
          }
        ]);

      if (erroParticipante) {
        console.log(erroParticipante);
        alert("Erro ao criar participante.");
        return;
      }
    }

    // =========================
    // SALVA LOGIN
    // =========================
    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify(usuarioFinal)
    );

    // =========================
    // ENTRA NO SISTEMA
    // =========================
    if (entrar) {
      entrar(usuarioFinal);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial",
        padding: "20px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#1a1a1a",
          borderRadius: "20px",
          padding: "35px",
          boxShadow: "0 0 30px rgba(212,175,55,0.15)"
        }}
      >
        <h1 style={{ color: "#d4af37", textAlign: "center", marginBottom: "10px" }}>
          🏆 Mestre do Palpite
        </h1>

        <p style={{ color: "#bdbdbd", textAlign: "center", marginBottom: "30px" }}>
          Entre e mostre quem entende de futebol.
        </p>

        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="WhatsApp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={handleCpfChange}
          style={inputStyle}
        />

        <button onClick={handleEntrar} style={buttonStyle}>
          Entrar no Bolão
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid #333",
  background: "#111",
  color: "#fff",
  fontSize: "16px",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: "15px",
  borderRadius: "10px",
  border: "none",
  background: "#d4af37",
  color: "#000",
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer",
  marginTop: "10px"
};