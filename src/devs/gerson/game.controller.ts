import { PrismaClient } from '@prisma/client'; // ✅ correcta
import { Request, Response } from 'express';

import nodemailer from 'nodemailer';
const prisma = new PrismaClient();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gerandreleon@gmail.com', // <-- cambia esto por tu correo real
    pass: 'rura bczp ojzn uqvh', // <-- NO es tu clave normal, es la de aplicación
  },
});

// === REQ3 ===
export const registrarUsuario = async (req: Request, res: Response) => {
  console.log("🎯 Entró al endpoint /registro");
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
      return res.status(409).json({ mensaje: "El correo ya está registrado" });
    }

    // ✅ Crear nuevo usuario
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        pais,
        password,
      },
    });

    // ✅ Enviar correo
    const mailOptions = {
      from: 'GameStore <gerandreleon@gmail.com>',
      to: correo,
      subject: `Hola ${nombre}`,
      html: `
        <p>Hola ${nombre},</p>
        <p>Gracias por registrarte en <strong>GameStore</strong>.</p>
        <p>Tu registro fue exitoso.</p>
        <p>Si no fuiste tú, ignora este mensaje.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Correo enviado a:", correo);

    return res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: nuevoUsuario,
    });

  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).json({
      mensaje: "Error al registrar usuario",
    });
  }
};




// === REQ7 ===

export const obtenerJuegosMasVendidos = (req: Request, res: Response) => {
  const juegos = [
    {
      titulo: "Resident Evil Village",
      imagen: "/imagenes/v.jpg",
      descripcion: "Lanzado en 2021, Resident Evil Village es la octava entrega principal de la serie Resident Evil, desarrollada y publicada por Capcom. Es la secuela de Resident Evil 7: Biohazard (2017) y continúa la historia de Ethan Winters, quien busca a su hija secuestrada en un misterioso pueblo europeo. El juego combina elementos de terror y acción en primera persona, presentando enemigos como hombres lobo y vampiros, y ha sido elogiado por su atmósfera envolvente y gráficos impresionantes ."
    },
    {
      titulo: "Resident Evil 4",
      imagen: "/imagenes/resident.jpg",
      descripcion: "Resident Evil 4, originalmente lanzado en 2005 y rehecho en 2023 por Capcom, sigue al agente Leon S. Kennedy en su misión de rescatar a la hija del presidente de EE. UU. en una aldea española infestada por una secta. Este remake moderniza la jugabilidad con gráficos actualizados y controles mejorados, manteniendo la tensión y el ritmo del original. Es considerado un hito en los juegos de acción y terror ."
    },
    {
      titulo: "Call Of Duty: Modern Warfare 3",
      imagen: "/imagenes/cod.jpg",
      descripcion: "Call of Duty: Modern Warfare 3, desarrollado por Infinity Ward y Sledgehammer Games, fue lanzado en 2011 como la conclusión de la trilogía Modern Warfare. El juego ofrece una campaña intensa que sigue la lucha contra la organización terrorista ultranacionalista rusa. Con un multijugador robusto y modos cooperativos, MW3 es conocido por su acción rápida y mapas bien diseñados."
    },
    {
      titulo: "Final Fantasy XVI",
      imagen: "/imagenes/f.jpg",
      descripcion: "Final Fantasy XVI, lanzado en 2023 por Square Enix, es la decimosexta entrega principal de la serie. Ambientado en el mundo de Valisthea, el juego sigue a Clive Rosfield en una historia de venganza y destino. Con un sistema de combate en tiempo real y una narrativa madura, FF XVI marca un cambio hacia un tono más oscuro y político en la franquicia."
    },
    {
      titulo: "Diablo IV",
      imagen: "/imagenes/diablo.jpg",
      descripcion: "Diablo IV, desarrollado por Blizzard Entertainment, es la cuarta entrega principal de la serie y fue lanzado en 2023. Ambientado en el mundo de Santuario, el juego presenta un estilo más oscuro y gótico, con un mundo abierto y cinco clases jugables. Ofrece una experiencia de acción y rol con énfasis en la personalización y el juego en línea."
    },
    {
      titulo: "Grand Theft Auto V",
      imagen: "/imagenes/gta.jpg",
      descripcion: "Grand Theft Auto V, desarrollado por Rockstar North y lanzado en 2013, es un juego de acción y aventura en mundo abierto. Ambientado en la ciudad ficticia de Los Santos, sigue las historias entrelazadas de tres protagonistas: Michael, Franklin y Trevor. Con una narrativa envolvente y un vasto mundo para explorar, GTA V ha sido aclamado por su profundidad y atención al detalle."
    },
    {
      titulo: "Elden Ring",
      imagen: "/imagenes/e.jpg",
      descripcion: "Elden Ring, desarrollado por FromSoftware y publicado por Bandai Namco en 2022, es un juego de rol de acción en un mundo abierto. Creado en colaboración con George R. R. Martin, el juego ofrece una experiencia desafiante con un extenso lore y libertad de exploración. Su jugabilidad combina elementos de la serie Souls con nuevas mecánicas y un vasto entorno."
    },
    {
      titulo: "Super Smash Bros Ultimate",
      imagen: "/imagenes/m.jpg",
      descripcion: "Super Smash Bros. Ultimate, lanzado en 2018 para Nintendo Switch, es un juego de lucha que reúne a personajes de diversas franquicias de videojuegos. Con más de 70 luchadores y numerosos escenarios, ofrece combates dinámicos y accesibles para jugadores de todos los niveles. Es celebrado por su contenido extenso y su homenaje a la historia de los videojuegos."
    },
    {
      titulo: "God of War Ragnarök",
      imagen: "/imagenes/god.jpg",
      descripcion: "God of War Ragnarök, desarrollado por Santa Monica Studio y lanzado en 2022, continúa la saga de Kratos y su hijo Atreus en la mitología nórdica. El juego combina combates intensos con una narrativa emocional, explorando temas de paternidad y destino. Con gráficos impresionantes y una jugabilidad refinada, es una culminación épica de la historia iniciada en el reinicio de 2018."
    }
  ];

  return res.status(200).json(juegos);
};

// === REQ8 ===


export const obtenerJuegosPopulares = (req: Request, res: Response) => {
  const juegos = [
    {
      titulo: "Red Dead Redemption 2",
      imagen: "/imagenes/read.jpg",
      descripcion: `Lanzado el 26 de octubre de 2018 por Rockstar Games, Red Dead Redemption 2 es un juego de acción-aventura de mundo abierto ambientado en 1899. Sigue la historia de Arthur Morgan, un forajido de la banda de Dutch van der Linde, mientras enfrenta dilemas morales, persecuciones y el ocaso del Viejo Oeste.

La narrativa envolvente, la atención al detalle en cada entorno y las mecánicas de simulación realista lo convierten en una obra maestra moderna. Es uno de los títulos más aclamados de la historia de los videojuegos.
★★★★★ 10/10`,
    },
    {
      titulo: "Cyberpunk 2077",
      imagen: "/imagenes/ci.jpg",
      descripcion: `Desarrollado por CD Projekt RED y lanzado el 10 de diciembre de 2020, Cyberpunk 2077 es un RPG de acción ambientado en Night City, una metrópolis futurista repleta de crimen, corporaciones y mejoras cibernéticas. El jugador encarna a V, un mercenario que busca un implante que podría otorgarle la inmortalidad.

A pesar de un inicio accidentado, múltiples actualizaciones han elevado el juego a una experiencia digna de su ambición. Su historia profunda, ambientación distópica y opciones de personalización son de alto nivel.
★★★★☆ 8/10`,
    },
    {
      titulo: "The Witcher 3: Wild Hunt",
      imagen: "/imagenes/wi.jpg",
      descripcion: `Lanzado en 2015 por CD Projekt RED, The Witcher 3 es un RPG de acción que sigue las aventuras de Geralt de Rivia, un cazador de monstruos profesional, en su búsqueda de su hija adoptiva Ciri, mientras se enfrenta a la amenaza de la Cacería Salvaje.

Su historia no lineal, misiones secundarias bien escritas y un mundo abierto increíblemente rico lo convierten en uno de los mejores videojuegos jamás creados. Un clásico imprescindible para todo gamer.
★★★★★ 10/10`,
    },
    {
      titulo: "Assassin's Creed: Shadows",
      imagen: "/imagenes/sh.jpg",
      descripcion: `Lanzado en 2015 por CD Projekt RED, The Witcher 3 es un RPG de acción que sigue las aventuras de Geralt de Rivia, un cazador de monstruos profesional, en su búsqueda de su hija adoptiva Ciri, mientras se enfrenta a la amenaza de la Cacería Salvaje.

Su historia no lineal, misiones secundarias bien escritas y un mundo abierto increíblemente rico lo convierten en uno de los mejores videojuegos jamás creados. Un clásico imprescindible para todo gamer.
★★★★★ 10/10`,
    },
    {
      titulo: "Ghost of Yōtei",
      imagen: "/imagenes/x.jpg",
      descripcion: `Ghost of Yōtei, la secuela espiritual de Ghost of Tsushima, está programado para 2025 y es desarrollado por Sucker Punch Productions. La historia sigue a Atsu, una guerrera de origen ainu, mientras combate invasores y fuerzas internas en las tierras nevadas del norte de Japón.

Con una dirección artística refinada, combates mejorados y una narrativa emocional, es uno de los títulos más esperados de la generación.
★★★★☆ 8.5/10`,
    },
    {
      titulo: "Silent Hill f",
      imagen: "/imagenes/h.jpg",
      descripcion: `Desarrollado por Ubisoft Quebec, Assassin’s Creed: Shadows se lanzará en 2025 y transporta la saga al Japón feudal. El jugador alterna entre Naoe, una hábil kunoichi, y Yasuke, un poderoso samurái, cada uno con su propio estilo de juego y narrativa.

Este título introduce paisajes impresionantes, ciclos de estaciones, combate táctico y sigilo renovado, marcando una evolución en la franquicia.
★★★★☆ 8.5/10`,
    },
    {
      titulo: "DOOM: The Dark Ages",
      imagen: "/imagenes/doom.jpg",
      descripcion: `DOOM: The Dark Ages, desarrollado por id Software, se lanzará en 2025 como una precuela de DOOM (2016) y DOOM Eternal. En esta versión, el jugador asume el rol del DOOM Slayer en un universo medieval repleto de enemigos demoníacos, mazmorras oscuras y armas brutales.

Conserva la esencia rápida y visceral de la saga, pero con una ambientación gótica más sombría y narrativa más estructurada.
★★★★☆ 8.5/10`,
    },
    {
      titulo: "Monster Hunter Wilds",
      imagen: "/imagenes/mo.jpg",
      descripcion: `Ghost of Yōtei, la secuela espiritual de Ghost of Tsushima, está programado para 2025 y es desarrollado por Sucker Punch Productions. La historia sigue a Atsu, una guerrera de origen ainu, mientras combate invasores y fuerzas internas en las tierras nevadas del norte de Japón.

Con una dirección artística refinada, combates mejorados y una narrativa emocional, es uno de los títulos más esperados de la generación.
★★★★☆ 8.5/10`,
    },
    {
      titulo: "God of War Ragnarök",
      imagen: "/imagenes/god.jpg",
      descripcion: `Desarrollado por NeoBards Entertainment, Silent Hill f es una nueva entrega en la franquicia de terror psicológico de Konami. Ambientado en Japón en los años 60, presenta una historia completamente independiente, con nuevos personajes y una estética influenciada por el horror folclórico oriental.

El juego promete una experiencia inquietante y perturbadora, manteniendo la esencia clásica de Silent Hill pero con un enfoque fresco.
★★★★☆ 8/10`,
    }
  ];

  return res.status(200).json(juegos);
};