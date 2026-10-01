import { getTranslations } from "next-intl/server";
import { LayoutGrid, User } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CatalogFinder } from "@/components/CatalogFinder";
import { CategoryMenu } from "@/components/CategoryMenu";
import { IndicadoresTienda } from "@/components/IndicadoresTienda";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/brand/Logo";
import { CartIndicator } from "@/components/cart/CartIndicator";
import { WishlistIndicator } from "@/components/wishlist/WishlistIndicator";
import { categoryGroups } from "@/data/categoryNav";
import { listPopulatedCategoryKeys } from "@/server/store";

/**
 * En-tête de la boutique.
 *
 * Fond clair — aubier, pas écorce — pour que la coupure avec le hero sombre
 * soit nette au lieu de noyer trois bandeaux bruns les uns sous les autres.
 * La braise ne sert plus qu'aux accents qui doivent vraiment attirer l'œil :
 * le bouton de recherche, le prix, le nom de marque.
 *
 * L'en-tête entier reste fixé en haut de l'écran pendant tout le défilement,
 * barre de service comprise : sur ce catalogue, le délai et le numéro doivent
 * rester joignables à tout moment, pas seulement en haut de page.
 *
 * L'emplacement à droite du champ de recherche mène au catalogue. Il portait le
 * numéro de téléphone, qu'on retrouve dans le hero et le pied de page : un
 * visiteur qui arrive sur l'accueil cherche d'abord à voir des remorques, et
 * l'appel vient une fois le modèle repéré.
 */
export async function Header() {
  const t = await getTranslations("header");
  const common = await getTranslations("common");

  // La navigation ne montre que les rayons qui ont quelque chose à montrer :
  // un univers dont tous les produits ont été retirés disparaît du menu, et
  // revient de lui-même dès qu'il en retrouve un.
  const poblados = await listPopulatedCategoryKeys();
  const grupos = categoryGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => poblados.has(`${group.slug}/${item.slug}`)),
    }))
    .filter((group) => group.items.length > 0);

  // Rayons proposés par le sélecteur. Le même nombre de places se retrouve en
  // neuf comme en occasion : on ne garde que la première occurrence de chaque
  // slug, sinon « Dos caballos » apparaîtrait deux fois sans que rien ne les
  // distingue à l'écran.
  const categoriasBuscables = grupos
    .flatMap((group) => group.items)
    .filter((item, indice, todos) => todos.findIndex((o) => o.slug === item.slug) === indice);

  return (
    // `-top-8` (-2rem, soit les 32 px de la barre de service : py-1.5 + la
    // hauteur du sélecteur de langue) : l'en-tête colle en étant remonté d'un
    // cran, si bien que la barre de service sort de l'écran au scroll et que la
    // rangée du logo vient exactement se poser à top:0.
    // Le collant ne peut pas être posé sur une bande seule : `sticky` n'opère
    // que dans les limites de son parent, et un <header> haut de 150 px
    // emporterait la bande avec lui dès qu'il quitte l'écran.
    <header className="sticky -top-8 z-50 w-full">
      {/* Barre de service : défile hors de l'écran et libère sa hauteur, ce qui
          laisse plus de place au catalogue. */}
      <div className="bg-[#150e0b] text-[0.72rem] text-white/65">
        <div className="mx-auto flex max-w-screen-xl items-center gap-5 px-4 py-1.5">
          {/* Indicateurs à gauche, langue à droite : la place était libre, et
              une ligne qui change donne à la barre une raison d'être regardée.
              Masqués sous 640 px — à cette largeur, la phrase et le sélecteur
              de langue ne tiennent pas côte à côte sans se tronquer l'un
              l'autre, et c'est la langue qui doit rester lisible. */}
          <div className="hidden min-w-0 sm:block">
            <IndicadoresTienda />
          </div>

          {/* Choix de la langue : placé ici pour ne pas encombrer la rangée
              d'icônes juste en dessous. On le retrouve en haut de page et dans
              le pied de page. */}
          <LanguageSwitcher tone="light" className="ml-auto shrink-0" />
        </div>
      </div>

      {/* Pas de filet en bas : la bande des catégories est noire et le tracerait
          en clair juste sous elle. L'ombre portée suffit à détacher l'en-tête. */}
      <div className="shadow-[0_1px_12px_rgba(27,19,16,0.08)]">
        {/* Fond opaque obligatoire : l'en-tête est « sticky », sans lui le
            contenu de la page défile en transparence sous le logo et les
            icônes. `bg-background` est le blanc de la charte, pendant naturel
            de `text-foreground`. */}
        <div className="bg-background text-foreground">
          <div className="mx-auto flex max-w-screen-xl flex-wrap items-center gap-3 px-4 py-3 lg:flex-nowrap lg:gap-6">
            {/* Le menu déroulant porte désormais toute la navigation par
                rayons, à toutes les tailles : la bande noire qui les listait
                sous le logo a été retirée. */}
            <CategoryMenu groups={grupos} />

            <Link
              href="/"
              aria-label={t("homeAriaLabel")}
              className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <Logo tone="dark" priority />
            </Link>

            {/* Le sélecteur ne prend pas toute la largeur disponible : au-delà
                de 32 rem il écrase le reste sans rien gagner en utilité. */}
            <div className="hidden max-w-lg flex-1 sm:block">
              <CatalogFinder categories={categoriasBuscables} />
            </div>

            {/* Accès au catalogue, à la place du bloc d'appel qui occupait cet
                emplacement. La cible est le premier univers qui a des modèles à
                montrer, et non une adresse écrite en dur : un univers vidé de
                ses produits disparaît déjà du menu, le bouton suivrait le même
                sort plutôt que de mener à une page sans rien. */}
            {grupos.length > 0 && (
              <Link
                href={grupos[0].href}
                className="ml-auto hidden items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:flex"
              >
                <LayoutGrid className="h-4 w-4 shrink-0" />
                {t("catalogo")}
              </Link>
            )}

            <nav className="ml-auto flex items-center gap-3 text-[0.7rem] md:ml-6 md:gap-4">
              {/* Sous « md », le bouton ci-dessus n'a plus la place : le
                  catalogue reste atteignable par cette icône. */}
              {grupos.length > 0 && (
                <Link
                  href={grupos[0].href}
                  aria-label={t("catalogo")}
                  className="flex flex-col items-center gap-1 rounded-sm transition-colors hover:text-primary md:hidden"
                >
                  <LayoutGrid className="h-5 w-5" />
                </Link>
              )}
              {/* Espace client. La cible est toujours « /compte » : cette page rend
                  le tableau de bord au client connecté et renvoie les autres vers
                  « /compte/connexion » (requireCustomer). Lire le cookie de session
                  ici forcerait le rendu dynamique de tout le catalogue, qui est
                  prérendu — le lien resterait juste, mais les fiches produits
                  perdraient leur rendu statique. */}
              <Link
                href="/compte"
                prefetch={false}
                className="flex flex-col items-center gap-1 rounded-sm transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">{common("account")}</span>
              </Link>
              {/* Comme le panier, la liste de souhaits vit dans le navigateur */}
              <WishlistIndicator className="flex flex-col items-center gap-1 transition-colors hover:text-primary" />
              {/* Le compteur d'articles vit côté client : le panier est en localStorage */}
              <CartIndicator className="relative flex flex-col items-center gap-1 transition-colors hover:text-primary" />
            </nav>
          </div>

          {/* En dessous de « sm », le sélecteur passe sur sa propre ligne
              plutôt que de rétrécir jusqu'à l'illisible. */}
          <div className="mx-auto max-w-screen-xl px-4 pb-3 sm:hidden">
            <CatalogFinder categories={categoriasBuscables} />
          </div>
        </div>

      </div>
    </header>
  );
}

