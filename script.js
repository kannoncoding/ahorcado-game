document.addEventListener("DOMContentLoaded", () => {
    // Variables globales
    let palabraOculta = [];
    let letrasUsadas = [];
    let puntaje = 10;
  
    let palabrasPorCategoria = {};
    let palabraSeleccionada = "";
    let categoriaActual = "";
  
    let jugadores = [];
    let jugadorActual = null;
  
    const btnRegistrar = document.getElementById("btnRegistrar");
    const btnIniciarJuego = document.getElementById("btnIniciarJuego");
    const btnIntentar = document.getElementById("btnIntentar");
    const btnReiniciar = document.getElementById("btnReiniciar");

    const selectorJugador = document.getElementById("selectorJugador");
      selectorJugador.addEventListener("change", () => {
        const nombre = selectorJugador.value;
        generarTablaHistorial(nombre);
      });

  
    // =========================
    // CARGA DE DATOS Y CATEGORÍAS
    // =========================
  
    fetch("./data/palabras.json")
      .then(response => response.json())
      .then(data => {
        palabrasPorCategoria = data;
        cargarCategorias(data);
      })
      .catch(error => {
        console.error("Error al cargar el archivo de palabras:", error);
      });
  
    function cargarCategorias(data) {
      const select = document.getElementById("selectCategoria");
      for (const categoria in data) {
        const option = document.createElement("option");
        option.value = categoria;
        option.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
        select.appendChild(option);
      }
    }
  
    // =========================
    // FUNCIONES DE INTERFAZ Y JUEGO
    // =========================
  
    function mostrarPalabraOculta(palabra) {
      palabraOculta = palabra.split("").map(() => "_");
      actualizarPalabraEnPantalla();
    }
  
    function actualizarPalabraEnPantalla() {
      document.getElementById("palabraSecreta").textContent = palabraOculta.join(" ");
    }
  
    function actualizarAhorcado() {
      const ahorcadoDiv = document.getElementById("ahorcadoVisual");
      const estados = [
        "😵", "😖", "😟", "😕", "😐",
        "😶", "🙂", "😀", "😁", "😃", "😄"
      ];
      ahorcadoDiv.textContent = estados[puntaje];
    }
  
    function bloquearEntrada() {
      document.getElementById("inputLetra").disabled = true;
      document.getElementById("btnIntentar").disabled = true;
    }
  
    // =========================
    // JUGADORES Y REGISTRO
    // =========================
  
    function guardarJugadores() {
      localStorage.setItem("jugadoresAhorcado", JSON.stringify(jugadores));
    }
  
    function cargarJugadores() {
      const data = localStorage.getItem("jugadoresAhorcado");
      if (data) {
        jugadores = JSON.parse(data);
      }
    }
  
    function registrarPartida(resultado) {
      if (!jugadorActual) return;
  
      const partida = {
        categoria: categoriaActual,
        palabra: palabraSeleccionada,
        resultado: resultado,
        puntosFinales: puntaje
      };
  
      jugadorActual.partidas.push(partida);
      guardarJugadores();
      mostrarHistorialJugador();
    }
  
    function mostrarHistorialJugador() {
      generarTablaHistorial();
      }
  
      let html = `<h3>Historial de ${jugadorActual.nombre}:</h3><ul>`;
      jugadorActual.partidas.forEach(p => {
        html += `<li>[${p.resultado.toUpperCase()}] ${p.categoria} – "${p.palabra}" (${p.puntosFinales} pts)</li>`;
      });
      html += "</ul>";
      div.innerHTML = html;
    }

    //Funcion para actualizar seleccion de jugadores
    function actualizarSelectorJugadores() {
      const select = document.getElementById("selectorJugador");
      select.innerHTML = `<option value="">-- Todos los jugadores --</option>`;
      jugadores.forEach(j => {
        const opt = document.createElement("option");
        opt.value = j.nombre;
        opt.textContent = j.nombre;
        select.appendChild(opt);
      });
    }
    

    //Funcion para construir tabla historial

    function generarTablaHistorial(jugadorFiltrado = "") {
      const wrapper = document.getElementById("tablaHistorialWrapper");
      if (jugadores.length === 0) {
        wrapper.innerHTML = "<p>No hay jugadores registrados aún.</p>";
        return;
      }
    
      // Recolectar todas las palabras únicas jugadas
      const palabrasUnicas = new Set();
      jugadores.forEach(j => {
        j.partidas.forEach(p => palabrasUnicas.add(p.palabra));
      });
      const palabras = Array.from(palabrasUnicas);
    
      // Crear cabecera de la tabla
      let html = "<table><thead><tr><th>Palabra</th>";
      jugadores.forEach(j => {
        if (!jugadorFiltrado || j.nombre === jugadorFiltrado) {
          html += `<th>${j.nombre}</th>`;
        }
      });
      html += "</tr></thead><tbody>";
    
      // Crear filas con los resultados por palabra
      palabras.forEach(palabra => {
        html += `<tr><td>${palabra}</td>`;
        jugadores.forEach(j => {
          if (!jugadorFiltrado || j.nombre === jugadorFiltrado) {
            const partida = j.partidas.find(p => p.palabra === palabra);
            if (partida) {
              const clase = partida.resultado === "victoria" ? "victoria" : "derrota";
              html += `<td class="${clase}">${partida.puntosFinales} pts</td>`;
            } else {
              html += "<td>-</td>";
            }
          }
        });
        html += "</tr>";
      });
    
      // Fila de totales
      html += `<tr><td><strong>Total</strong></td>`;
      jugadores.forEach(j => {
        if (!jugadorFiltrado || j.nombre === jugadorFiltrado) {
          const total = j.partidas.reduce((sum, p) => sum + p.puntosFinales, 0);
          html += `<td><strong>${total} pts</strong></td>`;
        }
      });
      html += "</tr></tbody></table>";
    
      wrapper.innerHTML = html;
    }
    
  
    // =========================
    // EVENTOS DE BOTONES
    // =========================
  
    btnRegistrar.addEventListener("click", () => {
      const nombre = document.getElementById("nombreJugador").value.trim();
      if (!nombre) {
        alert("Ingresa un nombre válido.");
        return;
      }
  
      const jugadorExistente = jugadores.find(j => j.nombre === nombre);
      if (jugadorExistente) {
        jugadorActual = jugadorExistente;
      } else {
        jugadorActual = { nombre: nombre, partidas: [] };
        jugadores.push(jugadorActual);
      }
  
      guardarJugadores();
      actualizarSelectorJugadores();
      alert(`Jugador registrado: ${jugadorActual.nombre}`);
      mostrarHistorialJugador();
    });

    btnReiniciar.addEventListener("click", () => {
        document.getElementById("juego").style.display = "none";
        document.getElementById("inputLetra").value = "";
      });
  
    btnIniciarJuego.addEventListener("click", () => {
      const select = document.getElementById("selectCategoria");
      categoriaActual = select.value;
  
      if (!categoriaActual) {
        alert("Debes seleccionar una categoría.");
        return;
      }
  
      const listaPalabras = palabrasPorCategoria[categoriaActual];
      palabraSeleccionada = listaPalabras[Math.floor(Math.random() * listaPalabras.length)];
  
      // Reiniciar valores
      puntaje = 10;
      letrasUsadas = [];
      mostrarPalabraOculta(palabraSeleccionada);
  
      document.getElementById("puntaje").textContent = `Puntos: ${puntaje}`;
      document.getElementById("letrasIngresadas").textContent = "";
      document.getElementById("mensajeResultado").textContent = "";
      document.getElementById("inputLetra").disabled = false;
      document.getElementById("btnIntentar").disabled = false;
      document.getElementById("juego").style.display = "block";
      actualizarAhorcado();
    });
  
    btnIntentar.addEventListener("click", () => {
      const input = document.getElementById("inputLetra");
      const letra = input.value.toLowerCase();
      input.value = "";
  
      if (!letra.match(/^[a-zñáéíóúü]$/i)) {
        alert("Ingresa una letra válida.");
        return;
      }
  
      if (letrasUsadas.includes(letra)) {
        alert("Ya intentaste con esa letra.");
        return;
      }
  
      letrasUsadas.push(letra);
      document.getElementById("letrasIngresadas").textContent = "Letras usadas: " + letrasUsadas.join(", ");
  
      if (palabraSeleccionada.includes(letra)) {
        // Letra correcta
        palabraSeleccionada.split("").forEach((char, index) => {
          if (char === letra) {
            palabraOculta[index] = letra;
          }
        });
  
        actualizarPalabraEnPantalla();
  
        if (!palabraOculta.includes("_")) {
          document.getElementById("mensajeResultado").textContent = "¡Ganaste!";
          document.getElementById("mensajeResultado").style.color = "var(--correct)";
          registrarPartida("victoria");
          bloquearEntrada();
        }
      } else {
        // Letra incorrecta
        puntaje--;
        document.getElementById("puntaje").textContent = `Puntos: ${puntaje}`;
        actualizarAhorcado();
  
        if (puntaje <= 0) {
          document.getElementById("mensajeResultado").textContent = `¡Perdiste! La palabra era: ${palabraSeleccionada}`;
          document.getElementById("mensajeResultado").style.color = "var(--danger)";
          registrarPartida("derrota");
          bloquearEntrada();
        }
      }
    });

    // letra N

    const botonÑ = document.getElementById("botonÑ");
botonÑ.addEventListener("click", () => {
  navigator.clipboard.writeText("ñ")
    .then(() => {
      botonÑ.textContent = "¡copiado!";
      setTimeout(() => {
        botonÑ.textContent = "ñ";
      }, 1000);
    })
    .catch(err => {
      console.error("Error al copiar la ñ:", err);
    });
});

    // Inicializar jugadores al cargar la página
    cargarJugadores();
  });
  