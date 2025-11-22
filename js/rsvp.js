const presenca = document.getElementById("presenca");
const acompanhantesSection = document.getElementById("acompanhantesSection");
const qtdAcompanhantes = document.getElementById("qtdAcompanhantes");
const acompanhantesContainer = document.getElementById("acompanhantesContainer");

const temRestricoes = document.getElementById("temRestricoes");
const restricoesTexto = document.getElementById("restricoesTexto");

const btnResumo = document.getElementById("btnResumo");
const btnEnviar = document.getElementById("btnEnviar");
const resumoSection = document.getElementById("resumoSection");
const resumoConteudo = document.getElementById("resumoConteudo");

const form = document.getElementById("rsvpForm");
const status = document.getElementById("status");

// Mostrar campo de acompanhantes
presenca.addEventListener("change", () => {
    if (presenca.value === "Sim") {
        acompanhantesSection.classList.remove("hidden");
    } else {
        acompanhantesSection.classList.add("hidden");
    }
});

// Criar inputs dos acompanhantes
qtdAcompanhantes.addEventListener("input", () => {
    acompanhantesContainer.innerHTML = "";
    const qtd = Number(qtdAcompanhantes.value);

    for (let i = 1; i <= qtd; i++) {
        const label = document.createElement("label");
        label.innerHTML = `Nome do acompanhante ${i}: <input type="text" name="acompanhante${i}" required>`;
        acompanhantesContainer.appendChild(label);
    }
});

// Restrições alimentares
temRestricoes.addEventListener("change", () => {
    if (temRestricoes.checked) {
        restricoesTexto.classList.remove("hidden");
    } else {
        restricoesTexto.classList.add("hidden");
    }
});

// Criar resumo
btnResumo.addEventListener("click", () => {
    resumoConteudo.innerHTML = "";

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const mensagem = document.getElementById("mensagem").value;

    let html = `
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${telefone}</p>
        <p><strong>Presença:</strong> ${presenca.value}</p>
    `;

    if (presenca.value === "Sim") {
        html += `<p><strong>Acompanhantes:</strong> ${qtdAcompanhantes.value}</p>`;

        for (let i = 1; i <= Number(qtdAcompanhantes.value); i++) {
            const field = document.querySelector(`input[name="acompanhante${i}"]`);
            html += `<p>- ${field.value}</p>`;
        }
    }

    if (temRestricoes.checked) {
        html += `<p><strong>Restrições:</strong> ${restricoesTexto.value}</p>`;
    }

    if (mensagem.trim() !== "") {
        html += `<p><strong>Mensagem ao casal:</strong> ${mensagem}</p>`;
    }

    resumoConteudo.innerHTML = html;

    resumoSection.classList.remove("hidden");
    btnEnviar.classList.remove("hidden");
});

// Enviar dados
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.innerText = "Enviando...";

    const formData = new FormData(form);

    // Envio para Google Apps Script
    fetch("https://script.google.com/macros/s/AKfycbxBw9OCxJ-iB-4NZCBMiSFV7S-Rl_Anxvt87UU_tHRBpRi9j5-r3p3D0Q8ahEOsoWMqxA/exec", {
        method: "POST",
        body: formData
    })
    .then(() => {
        status.innerText = "Confirmação enviada com sucesso! ❤️";
        form.reset();
        resumoSection.classList.add("hidden");
        btnEnviar.classList.add("hidden");
    })
    .catch(() => {
        status.innerText = "Erro ao enviar. Tente novamente.";
    });
});
