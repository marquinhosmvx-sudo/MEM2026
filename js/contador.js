// Data da cerimônia — 16 de maio de 2026 às 14:15h
const dataAlvo = new Date("2026-05-16T14:15:00").getTime();

setInterval(() => {
    const agora = new Date().getTime();
    const distancia = dataAlvo - agora;

    document.getElementById("dias").innerText = Math.floor(distancia / (1000 * 60 * 60 * 24));
    document.getElementById("horas").innerText = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    document.getElementById("minutos").innerText = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    document.getElementById("segundos").innerText = Math.floor((distancia % (1000 * 60)) / 1000);
}, 1000);
