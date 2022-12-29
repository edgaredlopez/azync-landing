const API="https://coderadio-admin.freecodecamp.org/api/live/nowplaying/coderadio";

//Importar las etiquetas de HTML para poder usarlas
const cover = null || document.getElementById("cover");
const title = null || document.getElementById("title");
const artist = null || document.getElementById("artist");
const album = null || document.getElementById("album");
const EtiquetaAudioEdgar = null || document.getElementById("EtiquetaAudio");
const oyentes = null || document.getElementById("oyentes");

//Verificar si el navegador es firefox
if (!navigator.userAgent.includes('Firefox')) 
{
    EtiquetaAudioEdgar.style.backgroundColor = 'transparent';
}

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
let PermisoActulizar = false; // Permiso para actualizar la canción
let RadioPausado = true; // Si la radio esta pausada


async function Logica() 
{
    if (PermisoActulizar == true) 
    {
        try
        {
            const DatosRadio = await ObtenerRadio();

            //Guardar los datos de la api en variables
            let IDCancionAPI = DatosRadio.now_playing.song.id;
            let Cover = DatosRadio.now_playing.song.art;
            let Title = DatosRadio.now_playing.song.title;
            let Artist = DatosRadio.now_playing.song.artist;
            let Album = DatosRadio.now_playing.song.album;
            let direccionAudio = DatosRadio.station.listen_url;
            let Oyentes = DatosRadio.listeners.current;

            let remaining = DatosRadio.now_playing.remaining;

            if (remaining > 30) 
            {
                intervaloActualizacion = 10000;
            } else if (remaining <= 30)
            {
                intervaloActualizacion = 5000;
            }
            //Verificar si es la primera cancion que se reproduce la radio actual
            if(IDCancionActual==0)
            {
                EtiquetaAudioEdgar.src = null;
                EtiquetaAudioEdgar.src = direccionAudio + "?rand=" + Math.random();
                EtiquetaAudioEdgar.load();
                EtiquetaAudioEdgar.play();
            }

            //Verificar si la cancion actual es diferente a la cancion que esta sonando en la radio
            if (IDCancionActual != IDCancionAPI) 
            {
                cover.setAttribute("src", Cover);
                title.textContent = Title;
                artist.textContent = Artist;
                album.textContent = Album;

                //Evaluar si el tiempo reproducido es mayor que 10 minutos para reiniciar el progreso de la barra
                if(EtiquetaAudioEdgar.currentTime > 600)
                {
                    EtiquetaAudioEdgar.src = null;
                    EtiquetaAudioEdgar.src = direccionAudio + "?rand=" + Math.random();
                    EtiquetaAudioEdgar.load();
                    EtiquetaAudioEdgar.play(); //aqui se reproduce la nueva cancion
                }
            }
            IDCancionActual = IDCancionAPI;
            oyentes.textContent = Oyentes; //Actualizar los datos de los oyentes

            //Consultar la API de la radio cada cierto tiempo dependiendo del tiempo que le quede a la cancion
            setTimeout(() =>
            {
                Logica();
            }, intervaloActualizacion);

        } catch (error) {
            console.log("La petición generó un REJECT: " + error);
        }
    }
}
//Ejecutar la logica de la radio al cargar la pagina
Logica();


//Detectar cuando el usuario le da pausa a la radio
EtiquetaAudioEdgar.addEventListener("pause", ()=> 
{
    EtiquetaAudioEdgar.src = null; //Mandar null al src para que no se siga reproduciendo la cancion
    EtiquetaAudioEdgar.src = 'https://coderadio-relay-nyc.freecodecamp.org/radio/8010/low.mp3' + "?rand=" + Math.random();
    EtiquetaAudioEdgar.currentTime = 0;
    PermisoActulizar = false;
    RadioPausado = true;
});

//Detectar cuando el usuario le da play a la radio
EtiquetaAudioEdgar.addEventListener("play", ()=> 
{
    if (RadioPausado == true) 
    {
        PermisoActulizar = true;
        RadioPausado = false;
        Logica();
    }
});


// Detecta cuando el usuario abandona la página o cambia a otra pestaña
document.addEventListener("visibilitychange", function()
 {
    if (document.hidden && PermisoActulizar == true  && RadioPausado == false) 
    {
        EtiquetaAudioEdgar.play();
    }
});
