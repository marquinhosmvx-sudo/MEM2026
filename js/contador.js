const dataAlvo = new Date("2026-06-20T16:00:00").getTime();

setInterval(() => {
    const agora = new Date().getTime();
    const distancia = dataAlvo - agora;

    document.getElementById("dias").innerText = Math.floor(distancia / (1000 * 60 * 60 * 24));
    document.getElementById("horas").innerText = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    document.getElementById("minutos").innerText = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    document.getElementById("segundos").innerText = Math.floor((distancia % (1000 * 60)) / 1000);
}, 1000);
