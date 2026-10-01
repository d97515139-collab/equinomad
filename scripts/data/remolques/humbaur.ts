import type { FichaRemolque } from "./tipos";

/**
 * Gamme Humbaur, constructeur allemand.
 *
 * Masses et dimensions relevées sur humbaur.com en août 2026. Le constructeur
 * publie le poids total et la charge utile, pas le poids à vide : celui-ci est
 * la soustraction des deux, opération exacte et non estimée. Chaque fiche a été
 * vérifiée — MMA moins tare égale charge utile.
 *
 * Le Balios manque : sa page constructeur renvoie une erreur et ses chiffres ne
 * sont publiés nulle part ailleurs de façon fiable. La fiche déjà présente au
 * catalogue reste donc en l'état, avec son prix, en attendant les données.
 *
 * Les textes sont rédigés ici, aucune phrase n'est reprise du constructeur.
 */

const HUMBAUR = "https://www.humbaur.com/de/anhaenger/pferdeanhaenger";

export const HUMBAUR_LOTE: readonly FichaRemolque[] = [
  {
    slug: "hb-xanthos-aero-2400",
    slugExistente: "humbaur-xanthos-aero",
    brand: "Humbaur",
    name: "Xanthos Aero 2400",
    nameEn: "Xanthos Aero 2400",
    sku: "HB-XA24",
    shortDescription:
      "Van de dos caballos con suelo AluBiComp y 1.545 kg de carga útil sobre solo 855 kg de tara. MMA de 2.400 kg.",
    shortDescriptionEn:
      "Two-horse trailer with an AluBiComp floor and 1,545 kg payload on just 855 kg unladen. 2,400 kg gross weight.",
    bullets: [
      "Dos caballos",
      "MMA 2.400 kg, tara 855 kg, carga útil 1.545 kg",
      "Interior de 3,45 × 1,71 × 2,36 m",
      "Suelo AluBiComp de 21 mm, con quince años de garantía contra la podredumbre",
      "Permiso B96 con vehículo de hasta 1.850 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,400 kg gross weight, 855 kg unladen, 1,545 kg payload",
      "Inner space of 3.45 × 1.71 × 2.36 m",
      "21 mm AluBiComp floor, with a fifteen-year anti-rot warranty",
      "B96 licence with a vehicle up to 1,850 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Con 855 kg de tara sobre 2.400 de MMA, este van deja 1.545 kg de carga útil: una de las mejores relaciones de su categoría. Los 3,45 m de largo y 1,71 de ancho reparten dos plazas de 85 cm, y los 2,36 m de altura convienen a caballos de alzada alta. Es el modelo de quien quiere volumen y carga útil sin pasar a un chasis de 2.700 kg.",
        bodyEn: "With 855 kg unladen on 2,400 kg gross, this trailer leaves 1,545 kg of payload: one of the best ratios in its class. The 3.45 m length and 1.71 m width give two 85 cm places, and the 2.36 m height suits tall horses. It is the model for anyone wanting volume and payload without moving to a 2,700 kg chassis.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo AluBiComp de 21 mm, un compuesto de aluminio y material sintético que Humbaur garantiza quince años contra la podredumbre. Esa garantía es el argumento del modelo: un suelo de madera protegida se sustituye al cabo de unos años, con un coste que supera con creces la diferencia inicial. La ligereza del conjunto explica los 855 kg de tara.",
        bodyEn: "A 21 mm AluBiComp floor, an aluminium-and-composite material Humbaur warrants for fifteen years against rot. That warranty is the model's argument: a protected timber floor gets replaced after a few years, at a cost far exceeding the initial difference. The lightness of the whole explains the 855 kg unladen weight.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.400 kg de MMA, el permiso B exigiría un vehículo tractor de 1.100 kg, cifra que casi ningún coche actual respeta. Con B96 el conjunto llega a 4.250 kg y admite un vehículo de hasta 1.850 kg de masa máxima autorizada; con B+E, hasta 3.500 kg. El B96 se obtiene con un curso y una prueba de circulación, sin examen teórico.",
        bodyEn: "At 2,400 kg gross, a category B licence would require a 1,100 kg towing vehicle, a figure almost no current car meets. With B96 the combination reaches 4,250 kg and takes a vehicle up to 1,850 kg gross; with B+E, up to 3,500 kg. B96 is obtained with a course and a driving test, with no theory exam.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Suelo AluBiComp de 21 mm y separador central, de serie. La versión de 2.700 kg de MMA comparte carrocería y medidas, y sube la carga útil a 1.841 kg por cuatro kilos más de tara: si transportas dos caballos pesados, la comparación merece un minuto. Arcón, ventilación adicional y acabado se concretan en el pedido con el plazo del fabricante.",
        bodyEn: "A 21 mm AluBiComp floor and central partition, as standard. The 2,700 kg version shares the body and dimensions, and raises the payload to 1,841 kg for four kilos more unladen: if you carry two heavy horses, that comparison is worth a minute. Chest, extra ventilation and finish are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2400,
      taraKg: 855,
      cargaUtilKg: 1545,
      largoInteriorCm: 345,
      anchoInteriorCm: 171,
      altoInteriorCm: 236,
      suelo: "AluBiComp de 21 mm",
    },
    sourceRef: `${HUMBAUR}/xanthos/xanthos-aero`,
  },

  {
    slug: "hb-xanthos-aero-2700",
    brand: "Humbaur",
    name: "Xanthos Aero 2700",
    nameEn: "Xanthos Aero 2700",
    sku: "HB-XA27",
    shortDescription:
      "Xanthos Aero homologado a 2.700 kg: 1.841 kg de carga útil por solo cuatro kilos más de tara que la versión de 2.400.",
    shortDescriptionEn:
      "Xanthos Aero rated at 2,700 kg: 1,841 kg of payload for just four kilos more unladen than the 2,400 version.",
    bullets: [
      "Dos caballos",
      "MMA 2.700 kg, tara 859 kg, carga útil 1.841 kg",
      "Interior de 3,45 × 1,71 × 2,36 m",
      "Suelo AluBiComp de 21 mm, con quince años de garantía contra la podredumbre",
      "Permiso B96 con vehículo de hasta 1.550 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,700 kg gross weight, 859 kg unladen, 1,841 kg payload",
      "Inner space of 3.45 × 1.71 × 2.36 m",
      "21 mm AluBiComp floor, with a fifteen-year anti-rot warranty",
      "B96 licence with a vehicle up to 1,550 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Misma carrocería y mismas medidas que el Xanthos Aero de 2.400 kg, con la homologación elevada a 2.700. La tara solo sube cuatro kilos, así que los trescientos de MMA suplementaria pasan íntegros a la carga útil: 1.841 kg, una de las cifras más altas del mercado en dos plazas. Es la elección evidente si transportas dos caballos pesados con equipo completo.",
        bodyEn: "Same body and same dimensions as the 2,400 kg Xanthos Aero, with the rating raised to 2,700. The unladen weight rises by only four kilos, so the extra three hundred of gross weight pass entirely into payload: 1,841 kg, one of the highest figures on the two-place market. It is the obvious choice if you carry two heavy horses with full equipment.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo AluBiComp de 21 mm, garantizado quince años contra la podredumbre, y estructura idéntica a la versión de 2.400 kg salvo el dimensionado del chasis. Los 859 kg de tara son notables para un van homologado a 2.700: la mayoría de sus competidores en esa MMA pasan de los 1.100 kg, y esos kilos salen directamente de lo que puedes cargar.",
        bodyEn: "A 21 mm AluBiComp floor, warranted fifteen years against rot, and a structure identical to the 2,400 kg version apart from the chassis rating. The 859 kg unladen weight is notable for a trailer rated at 2,700: most of its competitors at that gross weight exceed 1,100 kg, and those kilos come straight out of what you can load.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Los 2.700 kg de MMA descartan el permiso B y limitan el B96 a un vehículo tractor de 1.550 kg, cifra que deja fuera a casi todos los SUV. El B+E, que admite hasta 3.500 kg de vehículo, es la opción realista. Si tu permiso es B96, la versión de 2.400 kg de este mismo van te deja 1.850 kg de vehículo y sigue ofreciendo 1.545 kg de carga útil.",
        bodyEn: "The 2,700 kg gross weight rules out a category B licence and limits B96 to a 1,550 kg towing vehicle, a figure that rules out almost every SUV. B+E, taking up to 3,500 kg of vehicle, is the realistic option. If your licence is B96, the 2,400 kg version of this same trailer leaves you 1,850 kg of vehicle and still offers 1,545 kg of payload.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Suelo AluBiComp de 21 mm y separador central, de serie. La diferencia con la versión de 2.400 kg está en la homologación del chasis, no en el habitáculo: mismas medidas, mismo suelo, mismo acceso. Arcón delantero, ventilación adicional, rueda de repuesto y acabado exterior se definen en el pedido con el plazo del fabricante.",
        bodyEn: "A 21 mm AluBiComp floor and central partition, as standard. The difference from the 2,400 kg version lies in the chassis rating, not the compartment: same dimensions, same floor, same access. Front chest, extra ventilation, spare wheel and exterior finish are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2700,
      taraKg: 859,
      cargaUtilKg: 1841,
      largoInteriorCm: 345,
      anchoInteriorCm: 171,
      altoInteriorCm: 236,
      suelo: "AluBiComp de 21 mm",
    },
    sourceRef: `${HUMBAUR}/xanthos/xanthos-aero`,
  },

  {
    slug: "hb-notos-xtra-pro",
    slugExistente: "humbaur-notos",
    brand: "Humbaur",
    name: "Notos Xtra Pro",
    nameEn: "Notos Xtra Pro",
    sku: "HB-NTP",
    shortDescription:
      "Van de dos caballos con 4,13 m de largo y 2,40 m de altura interior. MMA de 2.700 kg y 1.469 kg de carga útil.",
    shortDescriptionEn:
      "Two-horse trailer 4.13 m long and 2.40 m high inside. 2,700 kg gross weight and 1,469 kg payload.",
    bullets: [
      "Dos caballos",
      "MMA 2.700 kg, tara 1.231 kg, carga útil 1.469 kg",
      "Interior de 4,13 × 1,71 × 2,40 m",
      "Suelo AluBiComp de 21 mm",
      "Permiso B96 con vehículo de hasta 1.550 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,700 kg gross weight, 1,231 kg unladen, 1,469 kg payload",
      "Inner space of 4.13 × 1.71 × 2.40 m",
      "21 mm AluBiComp floor",
      "B96 licence with a vehicle up to 1,550 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Sesenta y ocho centímetros más largo que un Xanthos Aero y cuatro más alto, el Notos es el van de gran volumen de Humbaur en dos plazas. Los 4,13 m de habitáculo y los 2,40 m de altura convienen a caballos de gran alzada y cuerpo largo, que en un van de 3,45 m viajan sin margen. La carga útil de 1.469 kg cubre dos animales adultos con su equipo.",
        bodyEn: "Sixty-eight centimetres longer than a Xanthos Aero and four taller, the Notos is Humbaur's large-volume two-place trailer. The 4.13 m compartment and 2.40 m height suit tall, long-bodied horses that travel without margin in a 3.45 m trailer. The 1,469 kg payload covers two adult animals with their equipment.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo AluBiComp de 21 mm, el mismo compuesto que el resto de la gama, garantizado contra la podredumbre. Los 1.231 kg de tara son la consecuencia directa del volumen: cada centímetro de largo y de alto añade material a las paredes, al techo y al bastidor. Es el precio del espacio, y se descuenta de lo que puedes cargar.",
        bodyEn: "A 21 mm AluBiComp floor, the same composite as the rest of the range, warranted against rot. The 1,231 kg unladen weight is a direct consequence of the volume: every centimetre of length and height adds material to the walls, the roof and the frame. That is the price of space, and it comes off what you can load.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.700 kg de MMA, el permiso B queda descartado y el B96 solo admite un vehículo tractor de 1.550 kg como máximo. El B+E, con vehículo de hasta 3.500 kg, es la vía realista. Con 4,13 m de habitáculo, conviene además un tractor de distancia entre ejes generosa: la estabilidad de un remolque largo depende tanto de eso como de la masa remolcable.",
        bodyEn: "At 2,700 kg gross, a category B licence is ruled out and B96 only allows a towing vehicle of 1,550 kg at most. B+E, with a vehicle up to 3,500 kg, is the realistic route. With a 4.13 m compartment, a tow car with a generous wheelbase is also advisable: a long trailer's stability depends on that as much as on the towable mass.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Suelo AluBiComp de 21 mm y separador central, de serie. La variante Notos Xtra Up comparte medidas y masas, con una cámara de sillas ampliada que le cuesta tres kilos de carga útil. Arcón delantero, ventilación adicional, rueda de repuesto y acabado exterior se concretan en el pedido con el plazo del fabricante.",
        bodyEn: "A 21 mm AluBiComp floor and central partition, as standard. The Notos Xtra Up variant shares dimensions and weights, with an enlarged tack room that costs it three kilos of payload. Front chest, extra ventilation, spare wheel and exterior finish are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2700,
      taraKg: 1231,
      cargaUtilKg: 1469,
      largoInteriorCm: 413,
      anchoInteriorCm: 171,
      altoInteriorCm: 240,
      suelo: "AluBiComp de 21 mm",
    },
    sourceRef: `${HUMBAUR}/notos/notos-xtra`,
  },

  {
    slug: "hb-notos-xtra-up",
    brand: "Humbaur",
    name: "Notos Xtra Up",
    nameEn: "Notos Xtra Up",
    sku: "HB-NTU",
    shortDescription:
      "Notos con cámara de sillas ampliada. MMA de 2.700 kg, 1.466 kg de carga útil y 4,13 m de largo interior.",
    shortDescriptionEn:
      "Notos with an enlarged tack room. 2,700 kg gross weight, 1,466 kg payload and 4.13 m inner length.",
    bullets: [
      "Dos caballos",
      "MMA 2.700 kg, tara 1.234 kg, carga útil 1.466 kg",
      "Interior de 4,13 × 1,71 × 2,40 m",
      "Cámara de sillas ampliada, suelo AluBiComp de 21 mm",
      "Permiso B96 con vehículo de hasta 1.550 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,700 kg gross weight, 1,234 kg unladen, 1,466 kg payload",
      "Inner space of 4.13 × 1.71 × 2.40 m",
      "Enlarged tack room, 21 mm AluBiComp floor",
      "B96 licence with a vehicle up to 1,550 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Mismas medidas y misma altura que el Notos Xtra Pro, con la cámara de sillas ampliada. Esa diferencia interesa a quien compite varios días seguidos: sillas, mantas, cabezadas y botiquín viajan con los caballos en lugar de ocupar el maletero del coche. Cuesta tres kilos de carga útil, que quedan en 1.466 kg.",
        bodyEn: "Same dimensions and same height as the Notos Xtra Pro, with an enlarged tack room. That difference appeals to anyone competing several days in a row: saddles, rugs, headcollars and first-aid kit travel with the horses instead of filling the car boot. It costs three kilos of payload, leaving 1,466 kg.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo AluBiComp de 21 mm y cámara de sillas integrada en la estructura, no añadida después. Los 1.234 kg de tara son tres más que el Notos Xtra Pro: la diferencia es mínima porque la cámara aprovecha volumen ya existente en lugar de alargar el remolque. La altura interior de 2,40 m se mantiene en toda la zona de los animales.",
        bodyEn: "A 21 mm AluBiComp floor and a tack room built into the structure, not added afterwards. The 1,234 kg unladen weight is three more than the Notos Xtra Pro: the difference is minimal because the room uses existing volume rather than lengthening the trailer. The 2.40 m inner height is maintained throughout the animal area.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "La MMA de 2.700 kg descarta el permiso B y limita el B96 a un vehículo de 1.550 kg de masa máxima autorizada. El B+E, con vehículo de hasta 3.500 kg, es la opción practicable. Comprueba además la masa remolcable con freno que autoriza tu coche, en el apartado O.1 de su ficha técnica: a veces es más restrictiva que el propio permiso.",
        bodyEn: "The 2,700 kg gross weight rules out a category B licence and limits B96 to a 1,550 kg vehicle. B+E, with a vehicle up to 3,500 kg, is the workable option. Also check the braked towable mass your car allows, in section O.1 of its registration document: it is sometimes stricter than the licence itself.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Cámara de sillas ampliada, suelo AluBiComp de 21 mm y separador central, de serie. Si no necesitas ese espacio, el Notos Xtra Pro ofrece las mismas medidas con tres kilos más de carga útil. Arcón delantero, ventilación adicional, rueda de repuesto y acabado exterior se definen en el pedido con el plazo del fabricante.",
        bodyEn: "Enlarged tack room, 21 mm AluBiComp floor and central partition, as standard. If you do not need that space, the Notos Xtra Pro offers the same dimensions with three kilos more payload. Front chest, extra ventilation, spare wheel and exterior finish are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2700,
      taraKg: 1234,
      cargaUtilKg: 1466,
      largoInteriorCm: 413,
      anchoInteriorCm: 171,
      altoInteriorCm: 240,
      suelo: "AluBiComp de 21 mm",
    },
    sourceRef: `${HUMBAUR}/notos/notos-xtra`,
  },
];
