import { Request, Response } from 'express';
import { prisma } from '../../config/prisma';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { env } from '../../config/env';
import type { RegistroUsuarioBody } from '../../types/request-bodies';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuración de Multer para fotos de perfil de usuario
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(__dirname, '../../../public/imagenes/usuario');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'user-' + uniqueSuffix + path.extname(file.originalname));
  },
});

export const uploadUserPhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes JPEG, JPG, PNG o WEBP'));
    }
  },
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});

// === REQ3 ===
export const registrarUsuario = async (req: Request, res: Response) => {
  console.log("🔵 LLEGÓ A registrarUsuario");
  console.log("BODY RECIBIDO EN BACKEND:", req.body);

  const { nombre, correo, pais, password } = req.body;

  if (!nombre || !correo || !pais || !password) {
    return res.status(400).json({ mensaje: "Datos incompletos" });
  }

  try {
    // 🔎 Verificar si ya existe un usuario con el mismo correo
    const existente = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (existente) {
      return res.status(409).json({ mensaje: "El correo ya está registrado", msg: "El correo ya está registrado" });
    }

    // ✅ Procesar foto si existe
    let fotoPath = null;
    if (req.file) {
      fotoPath = `/imagenes/usuario/${req.file.filename}`;
    }

    // ✅ Crear nuevo usuario
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        pais,
        password: hashedPassword,
        foto: fotoPath,
      },
    });

    // ✅ Enviar correo
    const mailOptions = {
      from: `GameStore <${env.EMAIL_USER}>`,
      to: correo,
      subject: `¡Bienvenido a GameStore, ${nombre}!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #00AEEF;">¡Hola ${nombre}!</h2>
          <p>Gracias por registrarte en <strong>GameStore</strong>.</p>
          <p>Tu cuenta ha sido creada exitosamente. Ahora puedes entrar y disfrutar de nuestra colección de juegos.</p>
          ${fotoPath ? `<p>Hemos guardado tu foto de perfil correctamente.</p>` : ''}
          <p>Si no fuiste tú quien realizó este registro, por favor ignora este mensaje.</p>
          <br>
          <p>Atentamente,<br>Equipo GameStore</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Correo enviado a:", correo);

    return res.status(200).json({
      mensaje: "Usuario registrado correctamente",
      msg: "¡Registro exitoso! Bienvenido a GameStore.",
      usuario: nuevoUsuario,
    });

  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).json({
      mensaje: "Error al registrar usuario",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
};

export const obtenerJuegosMasVendidos = (_req: Request, res: Response) => {
  const juegos = [
    {
      id: 1,
      titulo: "Resident Evil Village",
      genero: "Survival Horror, Acción",
      plataforma: ["PC", "PS5", "PS4", "Xbox Series X/S", "Xbox One", "Nintendo Switch (Cloud)"],
      imagen: "/imagenes/juegos_mas_vendidos/Resident_Evil_Village.jpg",
      descripcion: "Capcom presenta la octava entrega de su legendaria saga, donde Ethan Winters es arrastrado a un remoto pueblo europeo tras una tragedia familiar. Combinando el terror visceral con una acción más frenética que su predecesor, el juego destaca por su diseño de niveles gótico y una perspectiva en primera persona que intensifica la inmersión en un mundo lleno de criaturas folclóricas.",
      valoracion: "La comunidad alaba su atmósfera opresiva y el carisma de sus villanos, especialmente Lady Dimitrescu, quien se convirtió en un icono cultural. Los jugadores celebran el equilibrio entre exploración y combate, considerándolo una evolución necesaria que rinde homenaje a la estructura clásica de la serie. ★★★★☆ 8.5/10"
    },
    {
      id: 2,
      titulo: "Resident Evil 4 (Remake)",
      genero: "Survival Horror, Acción",
      plataforma: ["PC", "PS5", "PS4", "Xbox Series X/S"],
      imagen: "/imagenes/juegos_mas_vendidos/Resident_Evil_4_Remake.png",
      descripcion: "Se trata de la reimaginación total del clásico de 2005 por parte de Capcom. Leon S. Kennedy se adentra en una aldea rural de España para rescatar a la hija del presidente de EE. UU., enfrentándose a hordas de enemigos infectados por Las Plagas. Esta versión moderniza las mecánicas de disparo, el movimiento y la narrativa, manteniendo la esencia de terror y tensión constante del original.",
      valoracion: "Aclamado como uno de los mejores remakes de la historia, la comunidad destaca la fluidez del combate y la profundidad añadida a personajes secundarios. Los fans valoran que logra sentirse fresco y aterrador incluso para quienes jugaron la versión clásica, manteniendo un ritmo magistral de principio a fin. ★★★★★ 9.5/10"
    },
    {
      id: 3,
      titulo: "Call Of Duty: Modern Warfare 3 (Classic)",
      genero: "FPS, Acción",
      plataforma: ["PC", "PS3", "Xbox 360"],
      imagen: "/imagenes/juegos_mas_vendidos/Call_Of_Duty_Modern_Warfare_3_Classic.jpg",
      descripcion: "Lanzado en 2011, es el épico cierre de la trilogía original de Modern Warfare desarrollado por Infinity Ward y Sledgehammer Games. La narrativa concluye la caza global de Vladimir Makarov en un escenario de Tercera Guerra Mundial, ofreciendo misiones cinematográficas en ciudades como Nueva York, Londres y París, además de perfeccionar el adictivo modo multijugador y las operaciones especiales.",
      valoracion: "Para muchos veteranos, representa el pico de la era dorada de CoD debido a sus mapas icónicos y un sistema de rachas muy equilibrado. La comunidad recuerda con especial cariño su campaña explosiva y el ritmo frenético del multijugador, considerándolo un pilar fundamental en la historia de los juegos de disparos. ★★★★☆ 8.8/10"
    },
    {
      id: 4,
      titulo: "Final Fantasy XVI",
      genero: "Action RPG, Fantasía",
      plataforma: ["PS5", "PC"],
      imagen: "/imagenes/juegos_mas_vendidos/Final_Fantasy_XVI.jpg",
      descripcion: "Square Enix reinventa su franquicia más famosa con un tono más oscuro y maduro ambientado en Valisthea, un mundo que agoniza por la falta de éter. La historia sigue a Clive Rosfield en una travesía de venganza política y batallas colosales entre Eikons, utilizando un sistema de combate en tiempo real diseñado por Ryota Suzuki que prioriza la velocidad y el espectáculo visual.",
      valoracion: "Los jugadores han quedado impactados por la escala de las batallas de jefes y la madurez de su guion, comparándolo a menudo con series de fantasía política de alto nivel. Aunque el cambio de RPG por turnos a acción pura generó debate, el consenso general es que es una experiencia visual y sonora imponente. ★★★★☆ 8.5/10"
    },
    {
      id: 5,
      titulo: "Diablo IV",
      genero: "Action RPG, Hack and Slash",
      plataforma: ["PC", "PS5", "PS4", "Xbox Series X/S", "Xbox One"],
      imagen: "/imagenes/juegos_mas_vendidos/Diablo_IV.jpeg",
      descripcion: "Blizzard Entertainment regresa a las raíces sombrías de la saga con un Santuario vasto y de mundo abierto. Tras el regreso de Lilith, los jugadores deben explorar mazmorras infinitas y personalizar a sus héroes con un intrincado árbol de habilidades. El juego se enfoca en un servicio en vivo con temporadas constantes, eventos mundiales y un endgame diseñado para el saqueo constante.",
      valoracion: "La comunidad celebra el regreso a la estética gótica y oscura que se perdió en la entrega anterior. Si bien el sistema de temporadas ha tenido altibajos, los fans elogian la jugabilidad fluida y la construcción de mundo, considerándolo el lugar perfecto para perderse cientos de horas mejorando el equipo. ★★★★☆ 8.2/10"
    },
    {
      id: 6,
      titulo: "Grand Theft Auto V",
      genero: "Acción-Aventura, Mundo Abierto",
      plataforma: ["PC", "PS5", "PS4", "PS3", "Xbox Series X/S", "Xbox One", "Xbox 360"],
      imagen: "/imagenes/juegos_mas_vendidos/Grand_Theft_Auto_V.jpg",
      descripcion: "La obra maestra de Rockstar North ambientada en Los Santos presenta la innovadora mecánica de alternar entre tres criminales muy distintos: Michael, Franklin y Trevor. Con una sátira mordaz de la cultura estadounidense moderna, el juego ofrece una libertad total para explorar tierra, mar y aire, complementado por el masivo y persistente mundo de GTA Online.",
      valoracion: "Sigue siendo un fenómeno de ventas imbatible gracias a su inagotable contenido y libertad. La comunidad destaca que, a pesar de los años, su mundo se siente más vivo que muchos lanzamientos actuales. Es valorado como el sandbox definitivo donde la narrativa y el caos se mezclan de forma perfecta. ★★★★★ 10/10"
    },
    {
      id: 7,
      titulo: "Elden Ring",
      genero: "Action RPG, Mundo Abierto",
      plataforma: ["PC", "PS5", "PS4", "Xbox Series X/S", "Xbox One"],
      imagen: "/imagenes/juegos_mas_vendidos/Elden_Ring.jpg",
      descripcion: "Fruto de la colaboración entre FromSoftware y George R.R. Martin, Elden Ring lleva la fórmula 'Soulslike' a un mundo abierto de proporciones legendarias. Los jugadores recorren las Tierras Intermedias enfrentando dioses y semidioses, con una libertad total para abordar los desafíos, descubrir secretos ocultos y forjar su propio camino para convertirse en el Círculo de Elden.",
      valoracion: "Considerado por muchos como el juego de la década, la comunidad exalta la sensación de descubrimiento constante y la flexibilidad para crear builds de personajes. Es unánimemente elogiado por cómo recompensa la curiosidad del jugador y por elevar el género de mundo abierto a un nuevo estándar de calidad. ★★★★★ 10/10"
    },
    {
      id: 8,
      titulo: "Super Smash Bros Ultimate",
      genero: "Lucha, Plataformas",
      plataforma: ["Nintendo Switch"],
      imagen: "/imagenes/juegos_mas_vendidos/Super_Smash_Bros_Ultimate.jpg",
      descripcion: "Bajo el lema 'Everyone is here!', Nintendo entrega la celebración definitiva de la historia de los videojuegos. Masahiro Sakurai dirige este título que reúne a más de 80 luchadores de diversas franquicias en combates caóticos para hasta 8 jugadores. Incluye cientos de escenarios, miles de espíritus y un modo aventura extenso que rinde tributo a décadas de gaming.",
      valoracion: "Es valorado como el crossover más ambicioso jamás creado. La comunidad competitiva y casual coincide en que es un juego con contenido casi infinito, donde el amor por el detalle en cada personaje es evidente. Es el juego de lucha social por excelencia, capaz de unir a jugadores de todas las edades. ★★★★★ 9.5/10"
    },
    {
      id: 9,
      titulo: "God of War Ragnarök",
      genero: "Acción-Aventura, Hack and Slash",
      plataforma: ["PS5", "PS4", "PC"],
      imagen: "/imagenes/juegos_mas_vendidos/God_of_War_Ragnarok.jpg",
      descripcion: "Santa Monica Studio concluye el viaje nórdico de Kratos y Atreus con una narrativa épica que recorre los Nueve Reinos. Con el invierno del Fimbulwinter acechando, los protagonistas deben decidir entre su seguridad y el destino del mundo. El juego expande el sistema de combate con nuevas habilidades rúnicas y una mayor variedad de enemigos y acertijos ambientales.",
      valoracion: "La comunidad destaca la evolución de la relación padre e hijo como uno de los momentos más conmovedores del medio. Los fans elogian que es una secuela que mejora en todo al original de 2018, entregando una conclusión satisfactoria, visualmente asombrosa y con actuaciones de voz de primer nivel. ★★★★★ 9.5/10"
    }
  ];

  return res.status(200).json(juegos);
};

export const obtenerJuegosPopulares = (req: Request, res: Response) => {
  const juegos = [
    {
      titulo: "Red Dead Redemption 2",
      genero: "Acción-Aventura, Western",
      plataforma: ["PC", "PS4", "Xbox One"],
      imagen: "/imagenes/juegos_mas_populares/Red_Dead_Redemption_2.jpg",
      descripcion: "Desarrollado por Rockstar Games, es una epopeya de mundo abierto que narra el ocaso del Salvaje Oeste a través de Arthur Morgan y la banda de Van der Linde. Destaca por un nivel de detalle técnico sin precedentes, una narrativa profunda y un ecosistema vivo que redefine la inmersión en los videojuegos.",
      valoracion: "La comunidad lo considera unánimemente una obra maestra absoluta, destacando su peso emocional y el realismo extremo de sus mecánicas. Es citado frecuentemente como el estándar de oro en narrativa y construcción de mundos. ★★★★★ 10/10"
    },
    {
      titulo: "Cyberpunk 2077",
      genero: "Action RPG, FPS",
      plataforma: ["PC", "PS5", "Xbox Series X/S", "PS4", "Xbox One"],
      imagen: "/imagenes/juegos_mas_populares/Cyberpunk_2077.jpg",
      descripcion: "CD Projekt RED presenta un RPG de acción en mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder y las mejoras corporales. El jugador encarna a V, un mercenario que busca un implante único que es la clave de la inmortalidad.",
      valoracion: "Tras su accidentado lanzamiento, la comunidad celebra su 'redención histórica' gracias a la actualización 2.0 y la expansión Phantom Liberty. Los jugadores elogian ahora su atmósfera inigualable y su profunda narrativa de ciencia ficción. ★★★★☆ 9/10"
    },
    {
      titulo: "The Witcher 3: Wild Hunt",
      genero: "Action RPG, Fantasía",
      plataforma: ["PC", "PS5", "Xbox Series X/S", "PS4", "Xbox One", "Nintendo Switch"],
      imagen: "/imagenes/juegos_mas_populares/The_Witcher_3_Wild_Hunt.png",
      descripcion: "En esta conclusión de la saga de Geralt de Rivia, los jugadores exploran un mundo de fantasía oscura devastado por la guerra mientras buscan a Ciri, la niña de la profecía. Un juego donde cada elección tiene consecuencias reales en un mapa vasto y lleno de folclore.",
      valoracion: "Es ampliamente aclamado por sus misiones secundarias, que tienen tanta calidad como la trama principal. Los fans lo consideran el RPG definitivo por su excelente escritura, carisma de personajes y un diseño de mundo impecable. ★★★★★ 10/10"
    },
    {
      titulo: "Assassin's Creed: Shadows",
      genero: "Acción-Aventura, Sigilo",
      plataforma: ["PC", "PS5", "Xbox Series X/S"],
      imagen: "/imagenes/juegos_mas_populares/Assassins_Creed_Shadows.jpg",
      descripcion: "Ambientado en el Japón del siglo XVI, Ubisoft presenta una historia dual con Naoe, una hábil shinobi, y Yasuke, el legendario samurái. El juego introduce un sistema de estaciones dinámico y entornos destructibles, enfocándose en el contraste entre el sigilo y el combate frontal.",
      valoracion: "Existe una gran expectativa en la comunidad; mientras muchos celebran la llegada de la saga a Japón, el debate sobre la precisión histórica es intenso. Sin embargo, el consenso apunta a un gran interés por la innovación en el parkour y la dualidad de estilos. ★★★★☆ 8/10"
    },
    {
      titulo: "Ghost of Yōtei",
      genero: "Acción-Aventura, Mundo Abierto",
      plataforma: ["PS5"],
      imagen: "/imagenes/juegos_mas_populares/Ghost_of_Yotei.jpg",
      descripcion: "Sucker Punch nos traslada al año 1603 para seguir a una nueva protagonista, Atsu, en las tierras que rodean el monte Yōtei. Esta secuela promete una dirección artística impactante, aprovechando al máximo el hardware de nueva generación para mostrar la belleza salvaje del norte de Japón.",
      valoracion: "El hype es masivo entre los fans de Tsushima. La comunidad destaca el cambio de protagonista como un soplo de aire fresco que permite explorar nuevas leyendas dentro de una estética visualmente impecable y un combate refinado. ★★★★☆ 9/10"
    },
    {
      titulo: "Silent Hill f",
      genero: "Terror psicológico, Survival Horror",
      plataforma: ["PC", "PS5", "Xbox Series X/S"],
      imagen: "/imagenes/juegos_mas_populares/Silent_Hill_f.jpg",
      descripcion: "Escrito por Ryukishi07, esta entrega traslada el horror de Konami al Japón de los años 60. Se enfoca en un terror floral y decadente, donde la belleza y lo perturbador se mezclan en una narrativa que promete ser la más extraña y profunda de la franquicia.",
      valoracion: "Los seguidores del terror están cautivados por su estética de 'horror estético'. La comunidad mantiene un optimismo cauteloso, esperando que este giro hacia el folclore japonés recupere la identidad psicológica que hizo grande a la saga. ★★★★☆ 8/10"
    },
    {
      titulo: "DOOM: The Dark Ages",
      genero: "FPS, Acción",
      plataforma: ["PC", "PS5", "Xbox Series X/S"],
      imagen: "/imagenes/juegos_mas_populares/DOOM_The_Dark_Ages.jpg",
      descripcion: "Id Software presenta una precuela inspirada en la era medieval, narrando los orígenes de la furia del Doom Slayer. Con un combate que incluye un escudo-sierra y armas brutales, el juego ofrece una experiencia de acción frenética en una guerra entre dioses y demonios.",
      valoracion: "La comunidad ha reaccionado con euforia, destacando el diseño visual que recuerda al metal clásico. Los fans lo describen como un 'regreso a las raíces de la carnicería' con una ambientación gótica sombría y satisfactoria. ★★★★☆ 9/10"
    },
    {
      titulo: "Monster Hunter Wilds",
      genero: "Action RPG, Caza",
      plataforma: ["PC", "PS5", "Xbox Series X/S"],
      imagen: "/imagenes/juegos_mas_populares/Monster_Hunter_Wilds.jpg",
      descripcion: "Capcom lleva la caza a un nuevo nivel con ecosistemas dinámicos donde el clima y la fauna cambian en tiempo real. Con monturas más ágiles y un mundo sin costuras, los jugadores deben adaptarse a las Tierras Prohibidas para sobrevivir a manadas de monstruos inteligentes.",
      valoracion: "La comunidad está entusiasmada por la sensación de 'mundo vivo'. Los veteranos de la saga alaban la fluidez del combate y la escala épica de los enfrentamientos, posicionándolo como el título más ambicioso de la franquicia hasta ahora. ★★★★☆ 9/10"
    },
    {
      titulo: "God of War Ragnarök",
      genero: "Acción-Aventura, Hack and Slash",
      plataforma: ["PS5", "PS4", "PC"],
      imagen: "/imagenes/juegos_mas_populares/God_of_War_Ragnarok.jpg",
      descripcion: "Kratos y Atreus deben recorrer los Nueve Reinos en busca de respuestas mientras las fuerzas de Asgard se preparan para el Ragnarök. Es una conclusión emocional y violenta a la saga nórdica, centrada en el crecimiento, el destino y el sacrificio entre padre e hijo.",
      valoracion: "Los jugadores lo describen como una montaña rusa emocional, elogiando especialmente las actuaciones y el refinamiento del combate. La comunidad lo valora como una de las mejores secuelas de la historia por cerrar magistralmente sus arcos narrativos. ★★★★★ 9.5/10"
    }
  ];

  return res.status(200).json(juegos);
};