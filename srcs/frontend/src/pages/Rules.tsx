import "../index.css"

export function Rules() {
  return (
    <div className="page-content">
      <h1>Rules</h1>
      <p>La misère est une variante du Jass. Il s'agit d'un jeu à pli, qui se joue avec un jeu de 36 cartes.</p>
      <h3>Mise en place</h3>
      <p>Un joueur distribue les cartes en sens trigonométrique jusqu'à ce qu'il ne reste plus de cartes ou qu'il en reste un, qu'il va garder face cachée.</p>
      <h3>Déroulement du jeu</h3>
      <p>
        Le joueur qui possède le 7 de carreau va pouvoir commencer à jouer avec n'importe quelle carte, puis le joueur à sa droite continue.
        Lorsqu'un joueur joue la première carte de sa main, il peut annoncer à haute voix une annonce qu'il a dans sa main sauf le Stöck. Ces points seront déduis de son score et il devra montrer son annonce aux autres joueurs.
        Une fois que chaque joueur a déposé une carte au centre, la carte la plus forte emporte le pli. Si une annonce se trouve sur la table, les points sont ajoutés au score du joueur qui remporte le pli.
        Le joueur qui a posé cette carte récupère donc le pli et le conserve pour pouvoir compter les points à la fin de la manche.
        Une fois que tous les joueurs ont joué toutes leurs cartes, il suffit de compter les points des plis. 
      </p>
      <h3>Les annonces</h3>
      <p>Il existe plusieurs annonces différentes qui rapportent un nombre de points différents : </p>
      <table className="border border-collapse border-[#6F7DDA]">
        <tr>
          <th className="border border-collapse border-[#6F7DDA] w-sm p-px">Annonce</th>
          <th className="border border-collapse border-[#6F7DDA] w-1/6">Point</th>
        </tr>
        <tr>
          <td className="border border-collapse border-[#6F7DDA] p-1">Stöck (roi et dame d'atout)</td>
          <td className="border border-collapse border-[#6F7DDA] p-1">20</td>
        </tr>
        <tr>
          <td className="border border-collapse border-[#6F7DDA] p-1">3 cartes qui se suivent dans la même couleur</td>
          <td className="border border-collapse border-[#6F7DDA] p-1">20</td>
        </tr>
        <tr>
          <td className="border border-collapse border-[#6F7DDA] p-1">4 cartes qui se suivent dans la même couleur</td>
          <td className="border border-collapse border-[#6F7DDA] p-1">50</td>
        </tr>
        <tr>
          <td className="border border-collapse border-[#6F7DDA] p-1">5 cartes qui se suivent dans la même couleur</td>
          <td className="border border-collapse border-[#6F7DDA] p-1">150</td>
        </tr>
        <tr>
          <td className="border border-collapse border-[#6F7DDA] p-1">carré (4 cartes de même valeur)</td>
          <td className="border border-collapse border-[#6F7DDA] p-1">100</td>
        </tr>
        <tr>
          <td className="border border-collapse border-[#6F7DDA] p-1">carré de Nell (tous les 9)</td>
          <td className="border border-collapse border-[#6F7DDA] p-1">150</td>
        </tr>
        <tr>
          <td className="border border-collapse border-[#6F7DDA] p-1">carré de Buur (tous les valets)</td>
          <td className="border border-collapse border-[#6F7DDA] p-1">200</td>
        </tr>
      </table>
    </div>
  );
}
