document.addEventListener("DOMContentLoaded", () => {
    let palabrasPorCategoria = {};
    let palabraSeleccionada = "";
    let categoriaActual = "";

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
      });
      
      function mostrarPalabraOculta(palabra) {
        const oculto = palabra.split("").map(() => "_").join(" ");
        document.getElementById("palabraSecreta").textContent = oculto;
      }
      
  
    btnIntentar.addEventListener("click", () => {
      // Próximamente: lógica de letras
    });
  });
  