# Projet Remolque Caballos

## Origine

Le socle technique vient du dépôt `mlcbois/mlcbois` (boutique française de bois
de chauffage), lui-même issu d'un gabarit de clonage de site. Le dépôt a été
détaché de son `origin` et le travail vit sur la branche `equivan`. Ce qui a été
conservé : l'architecture Next.js, le tunnel d'achat, l'espace client, le
back-office, le flux Merchant. Ce qui a changé : la langue, le droit applicable,
la marque, le catalogue, la charte et toutes les sections de la page d'accueil.

## Sites de référence

Fournis par le client, pour le périmètre catalogue et la structure de gamme :

- https://www.caballoexpress.com/?Categoría=Remolques
- https://remolquescuni.com/
- https://www.ehorses.es/ (annonces de remolques para caballos)
- https://www.milanuncios.com/ (remolque para caballos van)

Aucun de ces sites n'est copié : ils ont servi à établir les catégories, les
marques réellement présentes sur le marché espagnol (Cheval Liberté, Böckmann,
Ifor Williams, Humbaur, Fautras, Barbieri, Sirius) et les ordres de grandeur de
prix. Le style, les textes et les visuels sont propres au projet.

## Marque

- Nom : **Remolque Caballos** — provisoire, à arbitrer
- Domaine : remolquecaballos.com
- Contact : contacto@remolquecaballos.com

## Langues

- **Espagnol** à la racine (`/`) — langue de référence, celle qui engage la société
- **Anglais** sous `/en` — le marché de la remorque à chevaux est européen, les
  annonces circulent entre l'Espagne, la France, l'Allemagne et le Benelux

## Modèle de vente

**Vente en ligne complète** : tout passe par le panier et le paiement, remorques
comprises. Le virement et le financement sont proposés à côté de la carte, parce
qu'au-dessus de quelques milliers d'euros les plafonds de carte des banques
espagnoles bloquent.

## Charte

- Palette « sellerie » : vert de chasse `#12362b`, vert nuit `#0b211a`,
  cuir fauve `#b45f2b`, sable `#f5f1e8`, laiton `#c9a227`
- Titres en **Fraunces** (serif à axes variables), interface en **Inter**
- Catalogue illustré en SVG paramétré, sans photographie

## Paramètres métier retenus

- **IVA 21 %** — taux général espagnol (art. 90 de la Ley 37/1992)
- **Livraison** : Péninsule ; Baléares et Canaries sur devis
- **Numéro de commande** : `RC-AAAA-NNNNNN`
- **Permis** : B jusqu'à 3 500 kg, B96 jusqu'à 4 250 kg, B+E jusqu'à 7 000 kg
  (RD 818/2009) — c'est l'axe éditorial de la page d'accueil

## Charte de couleurs

Rouge, blanc, encre. Valeurs reprises telles quelles de **hausgeratepfeffer.de**
à la demande du client, relevées dans le bloc `:root` de leur feuille de style :

| Jeton | Valeur | Emploi |
|---|---|---|
| `--rojo` | `#e3000e` | boutons, prix, repères — fond comme texte |
| `--tinta` | `#001424` | hero, navigation, cartes de catégorie |
| `--grafito` | `#242424` | blocs secondaires |
| `--ambar` | `#ffca2b` | pastilles produit, troisième repère |
| `--nieve` | `#f8f8f8` | sections alternées |
| `--footer` | `#1a1a1a` | pied de page |
| `--muted-foreground` | `#6b7280` | texte secondaire |
| `--radius` | `0.625rem` | arrondis |

**Un seul rouge suffit**, et c'est ce qui rend cette charte confortable :
`#e3000e` donne 4,92:1 face au blanc **dans les deux sens**. Il porte donc du
texte blanc quand il sert de fond, et se lit lui-même sur du blanc quand il sert
d'encre. La plupart des rouges vifs échouent d'un côté ou de l'autre et obligent
à en gérer deux — c'était le défaut de la charte orange qui précédait.

La typographie ne vient pas du site de référence : Fraunces et Inter restent
l'identité propre du projet.

## Ce qui est fait

- Vitrine, catalogue, tunnel d'achat, espace client et avis en espagnol
- Dix pages légales réécrites sous droit espagnol (LSSI-CE 34/2002,
  RDL 1/2007 TRLGDCU, RGPD + LOPDGDD 3/2018, Ley 4/2022 pour la garantie)
- E-mails de commande et de compte client en espagnol
- Catalogue de 24 références réparties en 5 catégories, illustré en SVG paramétré
- IVA 21 %, `RC-AAAA-NNNNNN`, Bizum et financement, entrega 5–10 jours

## À faire avant mise en ligne

1. **Identité de la société** — `COMPANY` dans `src/content/legal/es.ts` contient
   des valeurs d'exemple : CIF, Registro Mercantil, capital, administrateur,
   téléphone, assureur. Le corpus juridique doit ensuite être relu par un
   juriste espagnol.
2. **Slugs d'URL** — les routes restent en français (`/panier`, `/commande`,
   `/compte`…). À passer en espagnol (`/cesta`, `/pedido`, `/cuenta`…). Purement
   mécanique, mais touche les dossiers de routes, les liens et les slugs des
   pages légales.
3. **E-mails restants** — `campaign.ts` (gabarit des campagnes marketing) et
   `adminOtp.ts` (code de connexion au back-office) sont encore en français.
4. **Back-office** — l'interface d'administration reste en français. Elle n'est
   vue que par l'exploitant, d'où sa position dans cette liste.
5. **Photographies** — décider si les illustrations SVG restent la ligne
   éditoriale ou si elles cèdent la place à des photos réelles des véhicules.
