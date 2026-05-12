import "../index.css"

export function Rules() {
  return (
    <div className="page-content mt-10">
      <h1>Rules</h1>
      <div className="mt-10">
        <p>La misère est une variante du Jass. Il s'agit d'un jeu à pli, qui se joue avec un jeu de 36 cartes.</p>
        <h2 className="mt-4">Mise en place</h2>
        <p>Un joueur distribue les cartes en sens trigonométrique jusqu'à ce qu'il ne reste plus de cartes ou qu'il en reste un, qu'il va garder face cachée.</p>
        <div>
          <h2 className="mt-4">Déroulement du jeu</h2>
          <p>
            Le joueur qui possède le 7 de carreau va pouvoir commencer à jouer avec n'importe quelle carte, puis le joueur à sa droite continue.
            Lorsqu'un joueur joue la première carte de sa main, il peut annoncer à haute voix une annonce qu'il a dans sa main sauf le Stöck. Ces points seront déduis de son score et il devra montrer son annonce aux autres joueurs.
            Une fois que chaque joueur a déposé une carte au centre, la carte la plus forte emporte le pli. Si une annonce se trouve sur la table, les points sont ajoutés au score du joueur qui remporte le pli.
            Le joueur qui a posé cette carte récupère donc le pli et le conserve pour pouvoir compter les points à la fin de la manche.
            Une fois que tous les joueurs ont joué toutes leurs cartes, il suffit de compter les points des plis. 
          </p>
          <h2 className="mt-4">Les annonces</h2>
        </div>
        <p>Il existe plusieurs annonces différentes qui rapportent un nombre de points différents : </p>
        <table className="border-2 border-(--accent-color) table mt-3">
          <thead className="text-lg text-(--font-color)">
            <tr>
              <th>Annonce</th>
              <th>Point</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Stöck (roi et dame d'atout)</td>
              <td>20</td>
            </tr>
            <tr>
              <td>3 cartes qui se suivent dans la même couleur</td>
              <td>20</td>
            </tr>
            <tr>
              <td>4 cartes qui se suivent dans la même couleur</td>
              <td>50</td>
            </tr>
            <tr>
              <td>5 cartes qui se suivent dans la même couleur</td>
              <td>150</td>
            </tr>
            <tr>
              <td>carré (4 cartes de même valeur)</td>
              <td>100</td>
            </tr>
            <tr>
              <td>carré de Nell (tous les 9)</td>
              <td>150</td>
            </tr>
            <tr>
              <td>carré de Buur (tous les valets)</td>
              <td>200</td>
            </tr>
          </tbody>
        </table>
        <h2 className="mt-7">Décompte des points</h2>
        <p>Les points se comptent de la manière suivante : </p>
        <table className="border-2 border-(--accent-color) table mt-3">
          <thead className="text-lg text-(--font-color)">
            <tr >
              <th>Carte</th>
              <th>Point</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>6 au 9</td>
              <td>0</td>
            </tr>
            <tr>
              <td>10</td>
              <td>10</td>
            </tr>
            <tr>
              <td>Valet</td>
              <td>2</td>
            </tr>
            <tr>
              <td>Dame</td>
              <td>3</td>
            </tr>
            <tr>
              <td>Roi</td>
              <td>4</td>
            </tr>
            <tr>
              <td>As</td>
              <td>11</td>
            </tr>
            <tr>
              <td>Nell (9 d'atout)</td>
              <td>14</td>
            </tr>
            <tr>
              <td>Buur (valet d'atout)</td>
              <td>20</td>
            </tr>
            <tr>
              <td>La dernière pli</td>
              <td>5</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
