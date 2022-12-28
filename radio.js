const API="https://coderadio-admin.freecodecamp.org/api/live/nowplaying/coderadio";

//Importar las etiquetas de HTML para poder usarlas
const cover = null || document.getElementById("cover");
const title = null || document.getElementById("title");
const artist = null || document.getElementById("artist");
const album = null || document.getElementById("album");
const direccionAudioRadio= null || document.getElementById("EtiquetaSource");
const EtiquetaAudioEdgar= null || document.getElementById("EtiquetaAudio");
const oyentes = null || document.getElementById("oyentes");

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
let IDCancionActual = 0; // ID de la canción actual
let PermisoActulizar = true; // Permiso para actualizar la canción


async function Logica() {
    if (PermisoActulizar == true) {
        try {
            const DatosRadio = await ObtenerRadio();

            //Guardar los datos de la api en variables
            let Cover = DatosRadio.now_playing.song.art;
            let Title = DatosRadio.now_playing.song.title;
            let Artist = DatosRadio.now_playing.song.artist;
            let Album = DatosRadio.now_playing.song.album;
            let Oyentes = DatosRadio.listeners.current;
            let direccionAudio = DatosRadio.station.listen_url;

            let elapsed = DatosRadio.now_playing.elapsed;
            let remaining = DatosRadio.now_playing.remaining;
            let duration = DatosRadio.now_playing.duration;
            let IDCancionAPI = DatosRadio.now_playing.song.id;


            if (IDCancionActual != IDCancionAPI) {
                //Asignar los datos a las etiquetas de HTML
                cover.setAttribute("src", Cover);
                title.textContent = Title;
                artist.textContent = Artist;
                album.textContent = Album;

                //Actualizamos el src de la radio
                EtiquetaAudioEdgar.src = null;
                EtiquetaAudioEdgar.src = direccionAudio + "?rand=" + Math.random();
                if (IDCancionActual != 0) {
                    EtiquetaAudioEdgar.play(); //aqui se reproduce la nueva cancion
                }
                IDCancionActual = IDCancionAPI;
            }

            oyentes.textContent = Oyentes;
            if (remaining >= 20) {
                intervaloActualizacion = 20000;
            } else if (remaining <= 30) {
                intervaloActualizacion = 5000;
            }

            setTimeout(() => {
                Logica();
                console.log("Se actualizo la radio " + intervaloActualizacion + "  Restante " + remaining);
            }, intervaloActualizacion);

        } catch (error) {
            console.log("Alguna de las peticiones devolvio un REJECT, se capturo y es : " + error);
        }
    }
}
Logica();

//Detectar cuando el usuario le da pausa a la radio
EtiquetaAudioEdgar.addEventListener("pause", ()=> 
{
    console.log("Se pauso la radio");
    EtiquetaAudioEdgar.pause();
    PermisoActulizar = false;
});
//Detectar cuando el usuario le da play a la radio
EtiquetaAudioEdgar.addEventListener("play", ()=> 
{
    console.log("Se reproducio la radio");
    EtiquetaAudioEdgar.play();
    PermisoActulizar = true;
    Logica();
});


