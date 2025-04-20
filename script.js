document.addEventListener("DOMContentLoaded", () => {
    let palabraOculta = [];
    let letrasUsadas = [];
    let puntaje = 10;

    let palabrasPorCategoria = {};
    let palabraSeleccionada = "";
    let categoriaActual = "";

    function actualizarAhorcado() {
        const ahorcadoDiv = document.getElementById("ahorcadoVisual");
        const estados = [
          "😵",       // 0
          "😖",       // 1
          "😟",       // 2
          "😕",       // 3
          "😐",       // 4
          "😶",       // 5
          "🙂",       // 6
          "😀",       // 7
          "😁",       // 8
          "😃",       // 9
          "😄"        // 10
        ];
        ahorcadoDiv.textContent = estados[puntaje];
      }
      

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


    const btnRegistrar = document.getElementById("btnRegistrar");
    const btnIniciarJuego = document.getElementById("btnIniciarJuego");
    const btnIntentar = document.getElementById("btnIntentar");
  
    btnRegistrar.addEventListener("click", () => {
      // Próximamente: registrar jugador
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
        
        mostrarPalabraOculta(palabraSeleccionada);
        document.getElementById("juego").style.display = "block";

        //reiniciar valores
        puntaje = 10;
        letrasUsadas = [];
        document.getElementById("puntaje").textContent = `Puntos: ${puntaje}`;
        document.getElementById("letrasIngresadas").textContent = "";
        document.getElementById("mensajeResultado").textContent = "";
        document.getElementById("inputLetra").disabled = false;
        document.getElementById("btnIntentar").disabled = false;
        actualizarAhorcado();
        

      });

      //metodo para mostrar palabra oculta
      function mostrarPalabraOculta(palabra) {
        palabraOculta = palabra.split("").map(() => "_");
        actualizarPalabraEnPantalla();
      }
      
      function actualizarPalabraEnPantalla() {
        document.getElementById("palabraSecreta").textContent = palabraOculta.join(" ");
      }
      
      
      //metodo para intentar el boton intentar
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
      bloquearEntrada();
    }

  } else {
    // Letra incorrecta
    puntaje--;
    document.getElementById("puntaje").textContent = `Puntos: ${puntaje}`;
    actualizarAhorcado();

    if (puntaje <= 0) {
      document.getElementById("mensajeResultado").textContent = `¡Perdiste! La palabra era: ${palabraSeleccionada}`;
      bloquearEntrada();
    }
  }
});
//metodo bloquear entrada
function bloquearEntrada() {
    document.getElementById("inputLetra").disabled = true;
    document.getElementById("btnIntentar").disabled = true;
  }
  

});
  