// Structure de navigation mise en avant sur la page d'accueil et dans le menu
// du header (CategoryMenu). Ce module ne contient que des données : il est
// importé aussi bien côté serveur que côté client.
//
// Les libellés ne sont pas stockés ici : le slug sert de clé de traduction dans
// « common.groupNames » et « common.categoryNames », à renseigner dans
// src/messages/es.json et src/messages/en.json pour chaque entrée ajoutée.
//
// Le slug doit correspondre à celui du groupe ou de la catégorie en base : c'est
// lui qui relie la navigation au catalogue (voir data/store/categories.json).

export interface CategoryNavItem {
  slug: string;
  href: string;
  image: string;
}

export interface CategoryNavGroup {
  slug: string;
  href: string;
  items: CategoryNavItem[];
}

// Deux univers de remorques — neuf et occasion — déclinés l'un et l'autre par
// nombre de places. Le slug de catégorie se répète d'un univers à l'autre : ce
// sont les routes /[group]/[category] qui les distinguent, et la contrainte
// d'unicité en base porte sur le couple (groupId, slug).
export const categoryGroups: CategoryNavGroup[] = [
  {
    slug: "nuevos",
    href: "/nuevos",
    items: [
      {
        slug: "un-caballo",
        href: "/nuevos/un-caballo",
        image: "/images/remolques/cat-un-caballo.svg",
      },
      {
        slug: "dos-caballos",
        href: "/nuevos/dos-caballos",
        image: "/images/remolques/cat-dos-caballos.svg",
      },
      {
        slug: "tres-cuatro-caballos",
        href: "/nuevos/tres-cuatro-caballos",
        image: "/images/remolques/cat-tres-cuatro-caballos.svg",
      },
    ],
  },
  {
    slug: "ocasion",
    href: "/ocasion",
    items: [
      {
        slug: "un-caballo",
        href: "/ocasion/un-caballo",
        image: "/images/remolques/cat-ocasion.svg",
      },
      {
        slug: "dos-caballos",
        href: "/ocasion/dos-caballos",
        image: "/images/remolques/cat-ocasion.svg",
      },
      {
        slug: "tres-cuatro-caballos",
        href: "/ocasion/tres-cuatro-caballos",
        image: "/images/remolques/cat-ocasion.svg",
      },
    ],
  },
  {
    slug: "accesorios",
    href: "/accesorios",
    items: [
      {
        slug: "accesorios",
        href: "/accesorios/accesorios",
        image: "/images/remolques/cat-accesorios.svg",
      },
    ],
  },
];
