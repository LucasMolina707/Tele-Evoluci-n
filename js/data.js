/* =========================================
   BASE DE DATOS HISTÓRICA DEL JUEGO
========================================= */

const gameData = [
    {
        level: 1,
        era: "Finales del Siglo XIX - 1920s",
        context: "A finales del siglo XIX, la idea de transmitir imágenes a distancia parecía magia. Los primeros pioneros no usaban pantallas digitales ni píxeles, sino sistemas mecánicos muy ruidosos. Tu misión: Busca al inventor alemán que ideó un disco perforado giratorio, el cual, al girar frente a una luz, permitió escanear y enviar la primera silueta humana en movimiento.",
        story: "Antes de los píxeles, la imagen se 'cortaba' mecánicamente. A través de un disco con agujeros en espiral que giraba rápidamente frente a una luz, se lograba escanear y proyectar una imagen línea por línea. Era ruidoso y tosco, pero fue el primer paso real hacia la transmisión de video.",
        clues: [
            { id: "l1_c1", type: "inventor", text: "Paul Nipkow", img: "nipkow.png", isCorrect: true },
            { id: "l1_c2", type: "tecnologia", text: "Disco electromecánico", img: "disco-mecanico.png", isCorrect: true },
            { id: "l1_c3", type: "hito", text: "Silueta en movimiento", img: "silueta.png", isCorrect: true },
            { id: "l1_d1", type: "inventor", text: "Philo Farnsworth", img: "farnsworth.png", isCorrect: false },
            { id: "l1_d2", type: "tecnologia", text: "Tubo de Rayos Catódicos", img: "tubo-crt.png", isCorrect: false },
            { id: "l1_d3", type: "tecnologia", text: "Fósforo RGB", img: "rgb.png", isCorrect: false },
            { id: "l1_d4", type: "hito", text: "Transmisión del alunizaje", img: "luna.png", isCorrect: false },
            { id: "l1_d5", type: "hito", text: "Estándar NTSC", img: "ntsc.png", isCorrect: false }
        ]
    },
    {
        level: 2,
        era: "1927 - Década de 1930",
        context: "Los sistemas mecánicos eran muy limitados y se averiaban rápido. En los años 20, un joven visionario se dio cuenta de que la respuesta estaba en la física cuántica: manipular electrones con imanes dentro de un tubo de vacío de cristal. Busca al inventor de este tubo que permitió la primera transmisión totalmente libre de partes móviles.",
        story: "La mecánica quedó obsoleta ante la física cuántica y el electromagnetismo. Farnsworth logró usar campos magnéticos para dirigir un haz de electrones dentro de un tubo de vacío, 'pintando' la imagen en una pantalla recubierta de fósforo a la velocidad de la luz. Nace la TV moderna.",
        clues: [
            { id: "l2_c1", type: "inventor", text: "Philo Farnsworth", img: "farnsworth.png", isCorrect: true },
            { id: "l2_c2", type: "tecnologia", text: "Tubo de Rayos Catódicos", img: "tubo-crt.png", isCorrect: true },
            { id: "l2_c3", type: "hito", text: "TV 100% electrónica", img: "tv-electronica.png", isCorrect: true },
            { id: "l2_d1", type: "inventor", text: "Guillermo G. Camarena", img: "camarena.png", isCorrect: false },
            { id: "l2_d2", type: "tecnologia", text: "Disco de Nipkow", img: "disco-mecanico.png", isCorrect: false },
            { id: "l2_d3", type: "tecnologia", text: "Compresión MPEG-2", img: "mpeg.png", isCorrect: false },
            { id: "l2_d4", type: "hito", text: "Apagón analógico", img: "apagon.png", isCorrect: false },
            { id: "l2_d5", type: "hito", text: "Emisión a todo color", img: "color-tv.png", isCorrect: false }
        ]
    },
    {
        level: 3,
        era: "1940 - Década de 1950",
        context: "Después de la Segunda Guerra Mundial, el público quería ver el mundo como realmente es: a color. Un brillante ingeniero mexicano patentó un sistema engañando al ojo humano mediante filtros de colores primarios giratorios. Esto obligó a la industria a crear un estándar de transmisión retrocompatible. Identifica estas tres piezas clave.",
        story: "El mundo no es en blanco y negro. Mediante la superposición rápida de filtros rojos, verdes y azules (RGB) frente a la cámara y el receptor, se engañaba al ojo humano para percibir un espectro completo de colores, obligando a crear el estándar NTSC para que las teles viejas no perdieran la señal.",
        clues: [
            { id: "l3_c1", type: "inventor", text: "Guillermo G. Camarena", img: "camarena.png", isCorrect: true },
            { id: "l3_c2", type: "tecnologia", text: "Filtros RGB giratorios", img: "filtros-rgb.png", isCorrect: true },
            { id: "l3_c3", type: "hito", text: "Estándar NTSC a color", img: "ntsc.png", isCorrect: true },
            { id: "l3_d1", type: "inventor", text: "John Logie Baird", img: "baird.png", isCorrect: false },
            { id: "l3_d2", type: "tecnologia", text: "Satélite de comunicaciones", img: "satelite.png", isCorrect: false },
            { id: "l3_d3", type: "tecnologia", text: "Paneles LCD", img: "lcd.png", isCorrect: false },
            { id: "l3_d4", type: "hito", text: "Señal transatlántica", img: "globo-terraqueo.png", isCorrect: false },
            { id: "l3_d5", type: "hito", text: "Creación de Netflix", img: "netflix.png", isCorrect: false }
        ]
    },
    {
        level: 4,
        era: "1962 - Década de 1970",
        context: "En plena Guerra Fría, las torres terrestres ya no eran suficientes para cruzar océanos debido a la curvatura de la Tierra. La carrera espacial dio la solución: colocar enormes espejos repetidores en órbita. Encuentra la tecnología y los responsables que permitieron unir al mundo en vivo, justo a tiempo para ver a la humanidad pisar otro cuerpo celeste.",
        story: "La televisión rompe las fronteras terrestres. En lugar de depender de torres de antenas locales, se lanzaron satélites que recibían señales de microondas desde la Tierra, las amplificaban y las rebotaban hacia otro continente, logrando transmisiones globales en vivo, como el histórico Apolo 11.",
        clues: [
            { id: "l4_c1", type: "inventor", text: "NASA / Bell Labs", img: "nasa.png", isCorrect: true },
            { id: "l4_c2", type: "tecnologia", text: "Satélite Telstar 1", img: "satelite.png", isCorrect: true },
            { id: "l4_c3", type: "hito", text: "Transmisión del alunizaje", img: "luna.png", isCorrect: true },
            { id: "l4_d1", type: "inventor", text: "Paul Nipkow", img: "nipkow.png", isCorrect: false },
            { id: "l4_d2", type: "tecnologia", text: "Protocolos OTT", img: "ott.png", isCorrect: false },
            { id: "l4_d3", type: "tecnologia", text: "Tubo de vacío", img: "tubo-vacio.png", isCorrect: false },
            { id: "l4_d4", type: "hito", text: "Primera silueta", img: "silueta.png", isCorrect: false },
            { id: "l4_d5", type: "hito", text: "Estandarización 4K", img: "4k.png", isCorrect: false }
        ]
    },
    {
        level: 5,
        era: "1990s - Actualidad",
        context: "Con la llegada del nuevo milenio, las ondas de radio continuas se volvieron ineficientes. Especialistas en redes crearon protocolos para empaquetar el video en código binario (ceros y unos) viajando por redes IP. Identifica a los arquitectos modernos y la tecnología que nos liberó de los horarios fijos de la televisión tradicional.",
        story: "La televisión dejó de ser una onda de radio para convertirse en código binario puro. Gracias a los algoritmos de compresión y la arquitectura de Internet, el video ahora se transmite en paquetes de red (IP), liberando al espectador de los horarios fijos y dando paso al dominio del Streaming.",
        clues: [
            { id: "l5_c1", type: "inventor", text: "Ingenieros de Red", img: "ingeniero.png", isCorrect: true },
            { id: "l5_c2", type: "tecnologia", text: "Compresión Digital / IP", img: "ip-network.png", isCorrect: true },
            { id: "l5_c3", type: "hito", text: "Video On Demand (Streaming)", img: "streaming.png", isCorrect: true },
            { id: "l5_d1", type: "inventor", text: "Vladimir Zworykin", img: "zworykin.png", isCorrect: false },
            { id: "l5_d2", type: "tecnologia", text: "Sistema Tricromático", img: "rgb.png", isCorrect: false },
            { id: "l5_d3", type: "tecnologia", text: "Ondas VHF/UHF", img: "antena.png", isCorrect: false },
            { id: "l5_d4", type: "hito", text: "Estándar NTSC", img: "ntsc.png", isCorrect: false },
            { id: "l5_d5", type: "hito", text: "Primera TV electrónica", img: "tv-electronica.png", isCorrect: false }
        ]
    }
];