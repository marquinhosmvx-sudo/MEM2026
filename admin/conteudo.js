/* -------------------------
   FIREBASE CONFIG
------------------------- */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
    getFirestore, doc, getDoc, setDoc, updateDoc,
    collection, getDocs, addDoc, deleteDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import {
    getStorage, ref, uploadBytes, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyCTet1E68tHv4bkYo27EVkwW8y1GvRjb4U",
    authDomain: "mem2026-bfd73.firebaseapp.com",
    projectId: "mem2026-bfd73",
    storageBucket: "mem2026-bfd73.firebasestorage.app",
    messagingSenderId: "677143363652",
    appId: "1:677143363652:web:4cf76964c39e102804fc11"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

/* -------------------------
   LOGIN SIMPLES
------------------------- */

const USER = "marcos";
const PASS = "Mari2026";

window.login = function () {
    const u = document.getElementById("user").value.trim();
    const p = document.getElementById("pass").value.trim();

    if (u === USER && p === PASS) {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("panel").style.display = "block";
        carregarTudo();
    } else {
        document.getElementById("loginError").style.display = "block";
    }
};

/* -------------------------
   FUNÇÃO PRINCIPAL
------------------------- */

async function carregarTudo() {
    await carregarHero();
    await carregarCarta();
    await carregarMensagens();
    await carregarGaleria();
    await carregarTimeline();
    await carregarSurpresas();
    await carregarFraseFinal();
}

/* -------------------------
   HERO
------------------------- */

async function carregarHero() {
    const ref = doc(db, "noiva_conteudo", "hero");
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        await setDoc(ref, {
            titulo: "Bem-vinda à sua sala, MaiLov 💗",
            subtitulo: "Cada detalhe aqui é um pedacinho do meu amor por você…"
        });
    }

    const data = (await getDoc(ref)).data();

    document.getElementById("heroTitulo").value = data.titulo;
    document.getElementById("heroSubtitulo").value = data.subtitulo;
}

window.salvarHero = async function () {
    const ref = doc(db, "noiva_conteudo", "hero");

    await updateDoc(ref, {
        titulo: document.getElementById("heroTitulo").value,
        subtitulo: document.getElementById("heroSubtitulo").value
    });

    alert("Hero atualizado!");
};

/* -------------------------
   CARTA ESPECIAL
------------------------- */

async function carregarCarta() {
    const ref = doc(db, "noiva_conteudo", "carta");
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        await setDoc(ref, { texto: "Sua carta especial vai aqui..." });
    }

    const data = (await getDoc(ref)).data();

    document.getElementById("carta").value = data.texto;
}

window.salvarCarta = async function () {
    const ref = doc(db, "noiva_conteudo", "carta");

    await updateDoc(ref, {
        texto: document.getElementById("carta").value
    });

    alert("Carta atualizada!");
};

/* -------------------------
   MENSAGENS DO NOIVO
------------------------- */

async function carregarMensagens() {
    const lista = document.getElementById("listaMensagens");
    lista.innerHTML = "";

    const ref = collection(db, "noiva_conteudo", "mensagens", "itens");
    const snap = await getDocs(ref);

    snap.forEach(docItem => {
        const div = document.createElement("div");
        div.className = "list-item";

        div.innerHTML = `
            <input type="text" value="${docItem.data().texto}" 
                   onchange="editarMensagem('${docItem.id}', this.value)">
            <span class="delete-btn" onclick="removerMensagem('${docItem.id}')">Excluir</span>
        `;

        lista.appendChild(div);
    });
}

window.adicionarMensagem = async function () {
    const texto = document.getElementById("novaMensagem").value.trim();
    if (!texto) return;

    await addDoc(collection(db, "noiva_conteudo", "mensagens", "itens"), {
        texto: texto
    });

    document.getElementById("novaMensagem").value = "";
    carregarMensagens();
};

window.editarMensagem = async function (id, novoTexto) {
    const ref = doc(db, "noiva_conteudo", "mensagens", "itens", id);
    await updateDoc(ref, { texto: novoTexto });
};

window.removerMensagem = async function (id) {
    await deleteDoc(doc(db, "noiva_conteudo", "mensagens", "itens", id));
    carregarMensagens();
};

/* -------------------------
   GALERIA PRIVADA
------------------------- */

async function carregarGaleria() {
    const lista = document.getElementById("listaGaleria");
    lista.innerHTML = "";

    const ref = collection(db, "noiva_conteudo", "galeria", "fotos");
    const snap = await getDocs(ref);

    snap.forEach(docItem => {
        const div = document.createElement("div");
        div.className = "list-item";

        div.innerHTML = `
            <img src="${docItem.data().url}" class="preview-img">
            <span class="delete-btn" onclick="removerFoto('${docItem.id}', '${docItem.data().path}')">Excluir</span>
        `;

        lista.appendChild(div);
    });
}

document.getElementById("galeriaUpload").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const path = `galeria/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "noiva_conteudo", "galeria", "fotos"), {
        url: url,
        path: path
    });

    carregarGaleria();
});

window.removerFoto = async function (id, path) {
    await deleteDoc(doc(db, "noiva_conteudo", "galeria", "fotos", id));

    const storageRef = ref(storage, path);
    await deleteObject(storageRef);

    carregarGaleria();
};

/* -------------------------
   LINHA DO TEMPO
------------------------- */

async function carregarTimeline() {
    const lista = document.getElementById("listaTimeline");
    lista.innerHTML = "";

    const ref = collection(db, "noiva_conteudo", "timeline", "anos");
    const snap = await getDocs(ref);

    snap.forEach(docItem => {
        const div = document.createElement("div");
        div.className = "list-item";

        div.innerHTML = `
            <strong>${docItem.data().ano}</strong> — 
            <input type="text" value="${docItem.data().texto}" 
                   onchange="editarTimeline('${docItem.id}', this.value)">
            <span class="delete-btn" onclick="removerTimeline('${docItem.id}')">Excluir</span>
        `;

        lista.appendChild(div);
    });
}

window.addTimeline = async function () {
    const ano = document.getElementById("timelineAno").value.trim();
    const texto = document.getElementById("timelineTexto").value.trim();

    if (!ano || !texto) return;

    await addDoc(collection(db, "noiva_conteudo", "timeline", "anos"), {
        ano: ano,
        texto: texto
    });

    document.getElementById("timelineAno").value = "";
    document.getElementById("timelineTexto").value = "";

    carregarTimeline();
};

window.editarTimeline = async function (id, texto) {
    const ref = doc(db, "noiva_conteudo", "timeline", "anos", id);
    await updateDoc(ref, { texto: texto });
};

window.removerTimeline = async function (id) {
    await deleteDoc(doc(db, "noiva_conteudo", "timeline", "anos", id));
    carregarTimeline();
};

/* -------------------------
   SURPRESAS
------------------------- */

async function carregarSurpresas() {
    const ref = doc(db, "noiva_conteudo", "surpresas");
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        await setDoc(ref, {
            carta: "",
            audio: "",
            video: ""
        });
    }

    const data = (await getDoc(ref)).data();

    document.getElementById("surpresaCarta").value = data.carta || "";
}

document.getElementById("audioUpload").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const path = `surpresas/audio_${Date.now()}`;
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    const ref = doc(db, "noiva_conteudo", "surpresas");
    await updateDoc(ref, { audio: url });

    alert("Áudio enviado!");
});

document.getElementById("videoUpload").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const path = `surpresas/video_${Date.now()}`;
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    const ref = doc(db, "noiva_conteudo", "surpresas");
    await updateDoc(ref, { video: url });

    alert("Vídeo enviado!");
});

window.salvarSurpresas = async function () {
    const ref = doc(db, "noiva_conteudo", "surpresas");

    await updateDoc(ref, {
        carta: document.getElementById("surpresaCarta").value
    });

    alert("Surpresas atualizadas!");
};

/* -------------------------
   FRASE FINAL
------------------------- */

async function carregarFraseFinal() {
    const ref = doc(db, "noiva_conteudo", "fraseFinal");
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        await setDoc(ref, { texto: "Obrigado por ser a Rosa mais bonita do meu Jardim! 🌹" });
    }

    const data = (await getDoc(ref)).data();

    document.getElementById("fraseFinal").value = data.texto;
}

window.salvarFraseFinal = async function () {
    const ref = doc(db, "noiva_conteudo", "fraseFinal");

    await updateDoc(ref, {
        texto: document.getElementById("fraseFinal").value
    });

    alert("Frase final atualizada!");
};
