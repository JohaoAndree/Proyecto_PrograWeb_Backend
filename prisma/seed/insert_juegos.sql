-- Script para insertar los juegos en la base de datos
-- Asegúrese de que la tabla 'Categoria' ya contenga los 14 géneros estándares con los IDs correspondientes.

INSERT INTO "Juego" ("nombre", "precio", "descuento", "estaOferta", "imagen", "descripcion", "masVendido", "categoriaId") VALUES 
('Resident Evil 4 (Remake)', 199.90, 30.00, true, '/imagenes/juegos/Resident_Evil_4_Remake.png', 'Se trata de la reimaginación total del clásico de 2005 por parte de Capcom. Leon S. Kennedy se adentra en una aldea rural de España para rescatar a la hija del presidente de EE. UU., enfrentándose a hordas de enemigos infectados por Las Plagas.', false, 12),
('Call of Duty: Modern Warfare II', 249.90, NULL, false, '/imagenes/juegos/Call_of_Duty_Modern_Warfare_II.jpg', 'La secuela directa que trae de vuelta a la icónica Fuerza Operativa 141. Esta entrega ofrece una campaña frenética y realista que recorre el mundo intentando frustrar una amenaza global imparable.', true, 6),
('Final Fantasy XVI', 229.90, 15.50, true, '/imagenes/juegos/Final_Fantasy_XVI.jpg', 'Square Enix reinventa su franquicia más famosa con un tono más oscuro y maduro ambientado en Valisthea, un mundo que agoniza por la falta de éter. La historia sigue a Clive Rosfield en una travesía de venganza política y batallas colosales entre Eikons.', true, 3),
('Diablo IV', 259.90, NULL, false, '/imagenes/juegos/Diablo_IV.jpg', 'Blizzard Entertainment regresa a las raíces sombrías de la saga con un Santuario vasto y de mundo abierto. Tras el retorno de Lilith, hija de Mefisto, los jugadores deben dominar cinco clases distintas para combatir a legiones de demonios.', false, 7),
('Grand Theft Auto V', 129.90, 50.00, true, '/imagenes/juegos/Grand_Theft_Auto_V.jpg', 'La obra maestra de Rockstar North ambientada en Los Santos presenta la innovadora mecánica de controlar a tres protagonistas muy distintos: el joven estafador Franklin, el ex ladrón de bancos Michael, y el psicópata Trevor.', true, 2),
('Elden Ring', 239.90, NULL, false, '/imagenes/juegos/Elden_Ring.jpg', 'Fruto de la colaboración entre FromSoftware y George R.R. Martin, Elden Ring lleva la fórmula Soulslike a un mundo abierto de proporciones legendarias. Los jugadores recorren las Tierras Intermedias enfrentando dioses y semidioses.', true, 3),
('Super Smash Bros Ultimate', 219.90, NULL, false, '/imagenes/juegos/Super_Smash_Bros_Ultimate.png', 'Bajo el lema Everyone is here!, Nintendo entrega la celebración definitiva de la historia de los videojuegos. El título reúne a todos los luchadores de entregas pasadas y añade superestrellas.', false, 8),
('God of War Ragnarök', 249.90, 20.00, true, '/imagenes/juegos/God_of_War_Ragnarok.jpg', 'Santa Monica Studio concluye el viaje nórdico de Kratos y Atreus con una narrativa épica que recorre los Nueve Reinos. Con el Fimbulvetr asolando la tierra, padre e hijo deben decidir su papel en la inminente batalla.', true, 2),

-- Juegos Populares
('Red Dead Redemption 2', 159.90, 40.00, true, '/imagenes/juegos/Red_Dead_Redemption_2.png', 'Rockstar Games presenta una epopeya majestuosa sobre el fin de la era del Salvaje Oeste. Como Arthur Morgan, lugarteniente de la banda de Van der Linde, los jugadores deben elegir entre sus propios ideales y la lealtad a la banda.', true, 14),
('Cyberpunk 2077', 179.90, NULL, false, '/imagenes/juegos/Cyberpunk_2077.jpg', 'CD Projekt RED presenta un RPG de acción en mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder y las mejoras corporales. El jugador encarna a V, un mercenario que busca un implante único.', true, 3),
('The Witcher 3: Wild Hunt', 99.90, 55.00, true, '/imagenes/juegos/The_Witcher_3_Wild_Hunt.png', 'En esta conclusión de la saga de Geralt de Rivia, los jugadores exploran un mundo de fantasía oscura devastado por la guerra mientras buscan a Ciri, la niña de la profecía.', true, 3),
('Assassin''s Creed: Shadows', 269.90, NULL, false, '/imagenes/juegos/Assassins_Creed_Shadows.jpg', 'Ambientado en el Japón del siglo XVI, Ubisoft presenta una historia dual con Naoe, una shinobi ágil experta en el asesinato silencioso, y Yasuke, el legendario samurái africano.', false, 2),
('Ghost of Yōtei', 279.90, NULL, false, '/imagenes/juegos/Ghost_of_Yotei.png', 'Sucker Punch nos traslada al año 1603 para seguir a una nueva protagonista, Atsu, en las tierras que rodean el monte Yōtei.', false, 2),
('Silent Hill f', 259.90, 10.00, true, '/imagenes/juegos/Silent_Hill_f.jpg', 'Escrito por Ryukishi07, esta entrega traslada el horror de Konami al Japón de los años 60. Se enfoca en un terror floral y decadente.', false, 13),
('DOOM: The Dark Ages', 249.90, NULL, false, '/imagenes/juegos/DOOM_The_Dark_Ages.jpg', 'La precuela que narra el origen crudo y medieval del Doom Slayer. id Software sustituye la velocidad vertical de Eternal por un combate terrestre opresivo y brutal.', false, 6),
('Monster Hunter Wilds', 269.90, NULL, false, '/imagenes/juegos/Monster_Hunter_Wilds.jpg', 'Capcom lleva la caza a un nuevo nivel con ecosistemas dinámicos donde el clima y la fauna cambian en tiempo real.', false, 4),
('Stellar Blade', 259.90, 25.00, true, '/imagenes/juegos/Stellar_Blade.png', 'Un espectacular título de acción surcoreano exclusivo de PlayStation. Controlas a Eve, una guerrera que desciende a una Tierra en ruinas para enfrentar a los Naytibas.', false, 7);

-- 2. Insertar Plataformas Únicas
INSERT INTO "Plataforma" ("nombre") VALUES
('PC'), ('PS5'), ('PS4'), ('PS3'), ('Xbox Series X/S'), ('Xbox One'), ('Xbox 360'), ('Nintendo Switch');

-- 3. Intersección JuegoPlataforma
-- Mapeo basado en el identificador del juego y el identificador de la nueva tabla Plataforma
INSERT INTO "JuegoPlataforma" ("juegoId", "plataformaId") VALUES
(1, 1), (1, 2), (1, 3), (1, 5),
(2, 1), (2, 2), (2, 3), (2, 5), (2, 6),
(3, 1), (3, 2),
(4, 1), (4, 2), (4, 3), (4, 5), (4, 6),
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6), (5, 7),
(6, 1), (6, 2), (6, 3), (6, 5), (6, 6),
(7, 8),
(8, 1), (8, 2), (8, 3),
(9, 1), (9, 3), (9, 6),
(10, 1), (10, 2), (10, 3), (10, 5), (10, 6),
(11, 1), (11, 2), (11, 3), (11, 5), (11, 6), (11, 8),
(12, 1), (12, 2), (12, 5),
(13, 2),
(14, 1), (14, 2), (14, 5),
(15, 1), (15, 2), (15, 5),
(16, 1), (16, 2), (16, 5),
(17, 2);

-- 4. Inserción de Calificaciones
-- Extracción del texto omitiendo las estrellas y aislando el puntaje como decimal referenciando usarioID 1
INSERT INTO "Calificacion" ("valoracion", "comentario", "juegoId", "usuarioId") VALUES
(9.5, 'Aclamado como uno de los mejores remakes de la historia, la comunidad destaca la fluidez del combate y la profundidad añadida a personajes secundarios. Los fans valoran que logra sentirse fresco y aterrador incluso para quienes jugaron la versión clásica, manteniendo un ritmo magistral de principio a fin.', 1, 1),
(8.8, 'Representa el pico de la era dorada debido a sus mapas icónicos y un sistema de rachas muy equilibrado. La comunidad recuerda con especial cariño su campaña explosiva y el ritmo frenético del multijugador.', 2, 1),
(8.5, 'Los jugadores han quedado impactados por la escala de las batallas de jefes y la madurez de su guion, comparándolo a menudo con series de fantasía política de alto nivel. Aunque el cambio de RPG por turnos a acción pura generó debate, el consenso general es que es una experiencia visual y sonora imponente.', 3, 1),
(8.2, 'La comunidad celebra el regreso a la estética gótica y oscura que se perdió en la entrega anterior. Si bien el sistema de temporadas ha tenido altibajos, los fans elogian la jugabilidad fluida y la construcción de mundo.', 4, 1),
(10, 'Sigue siendo un fenómeno de ventas imbatible gracias a su inagotable contenido y libertad. La comunidad destaca que, a pesar de los años, su mundo se siente más vivo que muchos lanzamientos actuales. Es valorado como el sandbox definitivo donde la narrativa y el caos se mezclan de forma perfecta.', 5, 1),
(10, 'Considerado por muchos como el juego de la década, la comunidad exalta la sensación de descubrimiento constante y la flexibilidad para crear builds de personajes. Es unánimemente elogiado por cómo recompensa la curiosidad del jugador y por elevar el género de mundo abierto a un nuevo estándar de calidad.', 6, 1),
(9.5, 'Es valorado como el crossover más ambicioso jamás creado. La comunidad competitiva y casual coincide en que es un juego con contenido casi infinito, donde el amor por el detalle en cada personaje es evidente. Es el juego de lucha social por excelencia, capaz de unir a jugadores de todas las edades.', 7, 1),
(9.5, 'La comunidad destaca la evolución de la relación padre e hijo como uno de los momentos más conmovedores del medio. Los fans elogian que es una secuela que mejora en todo al original de 2018, entregando una conclusión satisfactoria, visualmente asombrosa y con actuaciones de voz de primer nivel.', 8, 1),
(10, 'La comunidad lo considera unánimemente una obra maestra absoluta, destacando su peso emocional y el realismo extremo de sus mecánicas. Es citado frecuentemente como el estándar de oro en narrativa y construcción de mundos.', 9, 1),
(9, 'Tras su accidentado lanzamiento, la comunidad celebra su redención histórica gracias a la actualización 2.0 y la expansión Phantom Liberty. Los jugadores elogian ahora su atmósfera inigualable y su profunda narrativa de ciencia ficción.', 10, 1),
(10, 'Es ampliamente aclamado por sus misiones secundarias, que tienen tanta calidad como la trama principal. Los fans lo consideran el RPG definitivo por su excelente escritura, carisma de personajes y un diseño de mundo impecable.', 11, 1),
(8, 'Existe una gran expectativa en la comunidad; mientras muchos celebran la llegada de la saga a Japón, el debate sobre la precisión histórica es intenso. Sin embargo, el consenso apunta a un gran interés por la innovación en el parkour y la dualidad de estilos.', 12, 1),
(9, 'El hype es masivo. La comunidad destaca el cambio de protagonista como un soplo de aire fresco que permite explorar nuevas leyendas dentro de una estética visualmente impecable y un combate refinado.', 13, 1),
(8, 'Los seguidores del terror están cautivados por su estética de horror estético. La comunidad mantiene un optimismo cauteloso, esperando que este giro hacia el folclore japonés recupere la identidad psicológica que hizo grande a la saga.', 14, 1),
(9, 'La comunidad ha reaccionado con euforia, destacando el diseño visual que recuerda al metal clásico. Los fans lo describen como un regreso a las raíces de la carnicería con una ambientación gótica sombría y satisfactoria.', 15, 1),
(9, 'La comunidad está entusiasmada por la sensación de mundo vivo. Los veteranos de la saga alaban la fluidez del combate y la escala épica de los enfrentamientos, posicionándolo como el título más ambicioso de la franquicia hasta ahora.', 16, 1),
(8.5, 'Un título de acción trepidante que brilla por su jugabilidad fluida y combate exigente. La comunidad celebra sus espectaculares batallas contra jefes y asombrosa dirección de arte.', 17, 1);
