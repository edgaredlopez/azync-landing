const API="https://coderadio-admin.freecodecamp.org/api/live/nowplaying/coderadio";

//Importar las etiquetas de HTML para poder usarlas
const cover = null || document.getElementById("cover");
const title = null || document.getElementById("title");
const artist = null || document.getElementById("artist");
const album = null || document.getElementById("album");
const direccionAudioRadio= null || document.getElementById("direccionAudioRadio");



const oyentes = null || document.getElementById("oyentes");
const CajitaRadio= null || document.getElementById("MainRadio__CajaReproductor--ContenidoCambiante");

const opciones = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"


    }
};

async function  ObtenerRadio ()
{
    const response = await fetch(API, opciones);
    const data = await response.json();
    return data;
};

let intervaloActualizacion = 5000; // Intervalo de actualización inicial de 5 segundos

async function Logica () 
{
    try
    {
        const DatosRadio = await ObtenerRadio();
        console.log(DatosRadio);
        let Cover=DatosRadio.now_playing.song.art;
        let Title=DatosRadio.now_playing.song.title;
        let Artist=DatosRadio.now_playing.song.artist;
        let Album=DatosRadio.now_playing.song.album;
        let Oyentes=DatosRadio.listeners.current;
        let direccionAudio=DatosRadio.station.listen_url;
        
        let remaining = DatosRadio.now_playing.remaining;

        cover.setAttribute("src", Cover);
        title.textContent=Title;
        artist.textContent=Artist;
        album.textContent=Album;
        oyentes.textContent=Oyentes;

        direccionAudioRadio.src = direccionAudio + "?rand=" + Math.random();

          // Ajustar intervalo de actualización en función de la cantidad de tiempo restante de la canción
          if (remaining <= 30) {
              intervaloActualizacion = 2000; // Actualizar cada 2 segundos cuando quede menos de 30 segundos
          } else if (remaining > 30 && remaining <= 120) {
              intervaloActualizacion = 5000; // Mantener intervalo de 5 segundos cuando quede entre 30 y 120 segundos
          } else {
              intervaloActualizacion = 10000; // Actualizar cada 10 segundos cuando quede más de 120 segundos
          }
        setTimeout(Logica, 5000);
    }
    catch(error)
    {
        console.log("Alguna de las peticiones devolvio un REJECT, se capturo y es : "+error);
    }
}
Logica();



