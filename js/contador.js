// Executa somente depois que a página terminou de carregar
window.addEventListener("DOMContentLoaded", function () {

    // DATA DO CASAMENTO – 16/05/2026 às 14:15hh
    const dataCasamento = new Date("2026-05-16T14:15:00").getTime();

    // ELEMENTOS DO HTML
    const diasEl = document.getElementById("dias");
    const horasEl = document.getElementById("horas");
    const minutosEl = document.getElementById("minutos");
    const segundosEl = document.getElementById("segundos");

    function atualizarContador() {
        const agora = new Date().getTime();
        const distancia = dataCasamento - agora;

        // Caso a data já tenha passado
        if (distancia <= 0) {
            diasEl.innerText = "00";
            horasEl.innerText = "00";
            minutosEl.innerText = "00";
            segundosEl.innerText = "00";
            clearInterval(intervalo);
            return;
        }

        // Cálculo do contador
        const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
        const horas = Math.floor(
            (distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutos = Math.floor(
            (distancia % (1000 * 60 * 60)) / (1000 * 60)
        );
        const segundos = Math.floor(
            (distancia % (1000 * 60)) / 1000
        );

        // Atualiza tela com 2 dígitos
        diasEl.innerText = String(dias).padStart(2, "0");
        horasEl.innerText = String(horas).padStart(2, "0");
        minutosEl.innerText = String(minutos).padStart(2, "0");
        segundosEl.innerText = String(segundos).padStart(2, "0");
    }

    // Atualiza imediatamente ao carregar
    atualizarContador();

    // Atualiza a cada segundo
    const intervalo = setInterval(atualizarContador, 1000);
});
